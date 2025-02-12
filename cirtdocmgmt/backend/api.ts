import express, { Response, NextFunction } from 'express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import rateLimit from 'express-rate-limit';
import sanitize from 'mongo-sanitize';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { SessionRequest } from 'supertokens-node/framework/express';
import { Readable } from 'stream';

dotenv.config();

// Add MongoDB connection with retry logic
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devtest';

const connectWithRetry = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

const router = express.Router();

// Rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

router.use(apiLimiter);

// Role enumeration
enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

// Enhanced User Schema with validation
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    first: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    last: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    externalUserId: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for frequently queried fields
UserSchema.index({ email: 1, externalUserId: 1 });

// Enhanced File Schema with validation
const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    uploadeduser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploaddate: {
        type: Date,
        default: Date.now
    },
    filetype: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'] // Add more allowed types as needed
    },
    filesize: {
        type: Number,
        required: true,
        max: 10 * 1024 * 1024 // 10MB max file size
    },
    keywords: {
        type: [String],
        validate: {
            validator: function(v: string[]) {
                return v.length > 0 && v.every(keyword => keyword.length >= 2);
            },
            message: 'At least one keyword with minimum 2 characters is required'
        }
    },
    s3_url: {
        type: String,
        required: true
    },
    thumbnail_url: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

FileSchema.index({ keywords: 1, uploadeduser: 1 });

const User = mongoose.model('User', UserSchema);
const UploadedFile = mongoose.model('UploadedFile', FileSchema);

// AWS S3 Configuration
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION,
});

// File type validation middleware
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET!,
        metadata: (_, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (_, file, cb) => {
            const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            cb(null, `uploads/${Date.now()}_${sanitizedFilename}`);
        },
    }),
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Middleware to check admin role
const isAdmin = async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ externalUserId: req.session!.getUserId() });
        if (user?.role === UserRole.ADMIN) {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Authorization check failed' });
    }
};

// Enhanced user endpoints
router.post('/users', verifySession(), async (req: SessionRequest, res) => {
    try {
        const externalUserId = req.session!.getUserId();
        const sanitizedData = sanitize(req.body);
        
        // Check if user exists
        let user = await User.findOne({ externalUserId });
        
        if (user) {
            // Update existing user
            user = await User.findByIdAndUpdate(
                user._id,
                { 
                    ...sanitizedData,
                    externalUserId,
                    lastLogin: new Date()
                },
                { new: true, runValidators: true }
            );
        } else {
            // Create new user
            user = new User({
                ...sanitizedData,
                externalUserId
            });
            await user.save();
        }
        
        res.status(201).json(user);
    } catch (error: any) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Email already exists' });
        } else {
            console.error('Error creating/updating user:', error);
            res.status(500).json({ error: 'Failed to create/update user' });
        }
    }
});

// Get users with pagination
router.get('/users', verifySession(), async (req: SessionRequest, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({ isActive: true })
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments({ isActive: true });

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Enhanced file upload endpoint
router.post('/upload', verifySession(), upload.single('file'), async (req: SessionRequest, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const externalUserId = req.session!.getUserId();
        const user = await User.findOne({ externalUserId });
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const file = req.file as Express.MulterS3.File;
        const sanitizedKeywords = sanitize(req.body.keywords)
            .split(',')
            .map((k: string) => k.trim())
            .filter((k: string) => k.length >= 2);

        if (sanitizedKeywords.length === 0) {
            return res.status(400).json({ error: 'At least one valid keyword is required' });
        }

        const uploadedFile = new UploadedFile({
            filename: file.originalname,
            uploadeduser: user._id,
            filetype: file.mimetype,
            filesize: file.size,
            keywords: sanitizedKeywords,
            s3_url: file.location
        });

        await uploadedFile.save();
        return res.status(201).json(uploadedFile);
    } catch (error: any) {
        console.error('Upload Failed:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Soft delete for files
router.delete('/files/:id', verifySession(), async (req: SessionRequest, res) => {
    try {
        const file = await UploadedFile.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Soft delete in database
        file.isDeleted = true;
        await file.save();

        res.json({ message: 'File marked as deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Enhanced file search with pagination
router.get('/files', verifySession(), async (req: SessionRequest, res) => {
    try {
        const { filename, keywords, page = '1', limit = '10' } = req.query;
        const externalUserId = req.session!.getUserId();
        
        const user = await User.findOne({ externalUserId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const query: any = { 
            uploadeduser: user._id,
            isDeleted: false
        };

        if (filename) query.filename = { $regex: sanitize(filename as string), $options: 'i' };
        if (keywords) {
            const sanitizedKeywords = (keywords as string).split(',').map(k => sanitize(k.trim()));
            query.keywords = { $in: sanitizedKeywords };
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const files = await UploadedFile.find(query)
            .skip(skip)
            .limit(parseInt(limit as string))
            .sort({ createdAt: -1 });

        const total = await UploadedFile.countDocuments(query);

        return res.json({
            files,
            currentPage: parseInt(page as string),
            totalPages: Math.ceil(total / parseInt(limit as string)),
            totalFiles: total
        });
    } catch (error) {
        console.error('Error fetching files:', error);
        return res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Enhanced file download with additional security checks
router.get('/download/:id', verifySession(), async (req: SessionRequest, res) => {
    try {
        const externalUserId = req.session!.getUserId();
        const user = await User.findOne({ externalUserId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const file = await UploadedFile.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (file.uploadeduser.toString() !== user._id.toString() && user.role !== UserRole.ADMIN) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: file.s3_url.split('/').pop()!,
        });

        const { Body } = await s3Client.send(command);
        if (!Body) return res.status(404).send('File not found');

        res.attachment(file.filename);
        return (Body as unknown as Readable).pipe(res);
    } catch (error) {
        console.error('Error fetching file:', error);
        return res.status(500).json({ error: 'Failed to fetch file' });
    }
});

export default router;
