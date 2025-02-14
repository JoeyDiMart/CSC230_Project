/**
 * @fileoverview API Router and Controller implementation for the File Management System.
 * This file contains all the API endpoints for user management and file operations.
 * It includes authentication middleware, file upload configuration, and database operations.
 * 
 * @author CSC230 Team
 * @version 1.0.0
 */

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

// Load environment variables
dotenv.config();

/**
 * MongoDB Connection URI
 * Defaults to local MongoDB instance if not provided in environment
 */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devtest';

/**
 * Establishes connection to MongoDB with retry mechanism
 * Attempts to connect and retries every 5 seconds on failure
 * 
 * @async
 * @function connectWithRetry
 * @throws {Error} If connection fails after multiple attempts
 */
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

// Initialize MongoDB connection
connectWithRetry();

/**
 * Express Router instance for handling API routes
 */
const router = express.Router();

/**
 * Rate limiting middleware configuration
 * Limits each IP to 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all routes
router.use(apiLimiter);

/**
 * Enum for User Roles
 * Defines possible access levels for users in the system
 * @enum {string}
 */
enum UserRole {
    ADMIN = 'admin',    // Full system access
    USER = 'user',      // Standard user access
    GUEST = 'guest'     // Limited access
}

/**
 * Mongoose Schema for User
 * Defines the structure and validation rules for user documents
 * @typedef {Object} UserSchema
 */
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

/**
 * Mongoose Schema for Uploaded File
 * Defines the structure and validation rules for uploaded file documents
 * @typedef {Object} FileSchema
 */
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

/**
 * Middleware to validate file types before upload
 * Checks if the uploaded file matches allowed MIME types
 * 
 * @param {Express.Request} _req - Express request object
 * @param {Express.Multer.File} file - Uploaded file object
 * @param {multer.FileFilterCallback} cb - Callback function
 */
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // List of allowed MIME types
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'));
    }
};

/**
 * Multer S3 configuration for file uploads
 * Sets up storage, file filtering, and size limits
 */
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET!,
        metadata: (_, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (_, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    }),
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

/**
 * Middleware to verify admin role
 * Checks if the current user has admin privileges
 * 
 * @param {SessionRequest} req - Express request object with session
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const isAdmin = async (req: SessionRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.session!.getUserId();
        const user = await User.findOne({ externalUserId: userId });
        
        if (user?.role === UserRole.ADMIN) {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error verifying admin role' });
    }
};

/**
 * Create or update user endpoint
 * @route POST /users
 * @param {SessionRequest} req - Express request object with session
 * @param {Response} res - Express response object
 */
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

/**
 * Get users with pagination endpoint
 * @route GET /users
 * @query {number} page - Page number for pagination
 * @query {number} limit - Number of users per page
 */
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

/**
 * File upload endpoint
 * @route POST /upload
 * @param {File} file - The file to upload (multipart/form-data)
 * @param {string} keywords - Comma-separated keywords for the file
 */
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

/**
 * Soft delete file endpoint
 * @route DELETE /files/:id
 * @param {string} id - File ID to delete
 */
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

/**
 * Search files endpoint with pagination
 * @route GET /files
 * @query {string} filename - Optional filename to search
 * @query {string} keywords - Optional comma-separated keywords to search
 * @query {number} page - Page number for pagination
 * @query {number} limit - Number of files per page
 */
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

/**
 * File download endpoint
 * @route GET /download/:id
 * @param {string} id - File ID to download
 * @security Requires authentication and proper file access permissions
 */
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

/**
 * API Router
 * Handles all file and user management endpoints
 * @module FileManagementAPI
 */
export default router;
