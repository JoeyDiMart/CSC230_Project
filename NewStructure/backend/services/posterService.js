import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for poster uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads/posters';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, GIF images and PDF files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const handleUpload = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const fileData = fs.readFileSync(req.file.path);
        const base64Data = fileData.toString('base64');

        const poster = {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            keywords: JSON.parse(req.body.keywords || '[]'),
            file: {
                data: base64Data,
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size
            },
            userId: new ObjectId(req.session.user.id),
            email: req.session.user.email,
            uploadDate: new Date(),
            status: 'pending',
            views: 0
        };

        // Delete the temporary file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
        });

        const result = await posterCollection.insertOne(poster);
        res.status(201).json({ 
            message: 'Poster uploaded successfully', 
            id: result.insertedId 
        });
    } catch (err) {
        console.error('Error in handleUpload:', err);
        res.status(400).json({ error: err.message });
    }
};

export const handleGetAll = async (req, res) => {
    try {
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const posters = await posterCollection
            .find({ status: 'approved' })
            .sort({ uploadDate: -1 })
            .toArray();
            
        // Convert ObjectIds to strings for response
        const formattedPosters = posters.map(poster => ({
            ...poster,
            _id: poster._id.toString(),
            userId: poster.userId ? poster.userId.toString() : null
        }));
        
        res.json(formattedPosters);
    } catch (err) {
        console.error('Error in handleGetAll:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleGetPending = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const posterCollection = client.db('CIRT').collection('POSTERS');
        let query = { status: 'pending' };

        // If not admin, only show user's own pending posters
        if (req.session.user.role !== 'admin') {
            query.userId = new ObjectId(req.session.user.id);
        }

        const posters = await posterCollection
            .find(query)
            .sort({ uploadDate: -1 })
            .toArray();
            
        // Convert ObjectIds to strings for response
        const formattedPosters = posters.map(poster => ({
            ...poster,
            _id: poster._id.toString(),
            userId: poster.userId ? poster.userId.toString() : null
        }));
        
        res.json(formattedPosters);
    } catch (err) {
        console.error('Error in handleGetPending:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleGetById = async (req, res) => {
    try {
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const poster = await posterCollection.findOne({ 
            _id: new ObjectId(req.params.id)
        });
        
        if (!poster) {
            return res.status(404).json({ error: 'Poster not found' });
        }

        // Check permissions:
        // 1. Poster is approved - anyone can see
        // 2. User is admin - can see all
        // 3. User is owner - can see their own
        const isApproved = poster.status === 'approved';
        const isAdmin = req.session.user && req.session.user.role === 'admin';
        const isOwner = req.session.user && poster.userId.toString() === req.session.user.id;

        if (!isApproved && !isAdmin && !isOwner) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Increment views if the poster is approved
        if (isApproved) {
            await posterCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $inc: { views: 1 } }
            );
        }

        // Convert ObjectIds to strings for response
        const formattedPoster = {
            ...poster,
            _id: poster._id.toString(),
            userId: poster.userId.toString(),
            isOwner: isOwner,
            file: {
                ...poster.file,
                data: undefined // Don't send file data in the metadata
            }
        };
        
        res.json(formattedPoster);
    } catch (err) {
        console.error('Error in handleGetById:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleGetByUser = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Please log in' });
        }

        const posterCollection = client.db('CIRT').collection('POSTERS');
        const posters = await posterCollection.find({
            userId: new ObjectId(req.session.user.id)
        }).toArray();

        // Remove file data to reduce response size
        const postersWithoutFiles = posters.map(poster => {
            const { file, ...posterWithoutFile } = poster;
            return {
                ...posterWithoutFile,
                file: file ? {
                    name: file.name,
                    type: file.type,
                    size: file.size
                } : null
            };
        });

        res.json(postersWithoutFiles);
    } catch (err) {
        console.error('Error in handleGetByUser:', err);
        res.status(500).json({ error: err.message });
    }
};

// New function to get posters by email
export const handleGetByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }
        
        console.log('Fetching posters for email:', email);
        
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const posters = await posterCollection.find({
            email: email
        }).toArray();
        
        console.log(`Found ${posters.length} posters for email ${email}`);
        
        // Remove file data to reduce response size
        const postersWithoutFiles = posters.map(poster => {
            const { file, ...posterWithoutFile } = poster;
            return {
                ...posterWithoutFile,
                file: file ? {
                    name: file.name,
                    type: file.type,
                    size: file.size
                } : null
            };
        });

        res.json(postersWithoutFiles);
    } catch (err) {
        console.error('Error in handleGetByEmail:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleSearch = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: 'Keyword is required' });
        }

        const posterCollection = client.db('CIRT').collection('POSTERS');
        const posters = await posterCollection.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { author: { $regex: keyword, $options: 'i' } },
                { keywords: { $regex: keyword, $options: 'i' } }
            ],
            status: 'approved'
        }).toArray();

        // Remove file data to reduce response size
        const postersWithoutFiles = posters.map(poster => {
            const { file, ...posterWithoutFile } = poster;
            return {
                ...posterWithoutFile,
                file: file ? {
                    name: file.name,
                    type: file.type,
                    size: file.size
                } : null
            };
        });

        res.json(postersWithoutFiles);
    } catch (err) {
        console.error('Error in handleSearch:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleGetFile = async (req, res) => {
    try {
        console.log('Fetching file for ID:', req.params.id);
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const poster = await posterCollection.findOne({ 
            _id: new ObjectId(req.params.id)
        });
        
        if (!poster) {
            console.log('Poster not found');
            return res.status(404).json({ error: 'Poster not found' });
        }
        console.log('Poster found:', { 
            title: poster.title,
            hasFile: !!poster.file,
            hasData: !!(poster.file && poster.file.data),
            fileType: poster.file?.type,
            dataType: poster.file?.data ? typeof poster.file.data : 'none'
        });

        // Check permissions
        const isApproved = poster.status === 'approved';
        const isAdmin = req.session.user && req.session.user.role === 'admin';
        const isOwner = req.session.user && poster.userId.toString() === req.session.user.id;

        console.log('Permission check:', { isApproved, isAdmin, isOwner });

        if (!isApproved && !isAdmin && !isOwner) {
            console.log('Permission denied');
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!poster.file || !poster.file.data) {
            console.log('File or file data missing');
            return res.status(404).json({ error: 'File not found' });
        }

        try {
            let fileData;
            console.log('File data type:', typeof poster.file.data);
            
            // Check if the data is already a Buffer
            if (Buffer.isBuffer(poster.file.data)) {
                console.log('Data is already a Buffer');
                fileData = poster.file.data;
            } else if (typeof poster.file.data === 'string') {
                console.log('Converting base64 to Buffer');
                // Convert base64 to buffer
                fileData = Buffer.from(poster.file.data, 'base64');
            } else {
                console.log('Invalid data format:', typeof poster.file.data);
                throw new Error('Invalid file data format');
            }

            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            
            // Set the appropriate content type and disposition
            res.setHeader('Content-Type', poster.file.type);
            res.setHeader('Content-Disposition', `attachment; filename="${poster.file.name}"`);
            res.setHeader('Cache-Control', 'no-cache');

            console.log('Sending file:', {
                type: poster.file.type,
                name: poster.file.name,
                size: fileData.length
            });

            // Send the file data
            res.end(fileData);
        } catch (conversionError) {
            console.error('Error converting file data:', conversionError);
            return res.status(500).json({ error: 'Error processing file data' });
        }
    } catch (err) {
        console.error('Error in handleGetFile:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleApprove = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    try {
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const result = await posterCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { 
                status: 'approved',
                approvedBy: new ObjectId(req.session.user.id),
                approvalDate: new Date()
            } }
        );

        if (result.modifiedCount > 0) {
            res.json({ message: 'Poster approved successfully' });
        } else {
            res.status(404).json({ error: 'Poster not found' });
        }
    } catch (err) {
        console.error('Error in handleApprove:', err);
        res.status(400).json({ error: err.message });
    }
};

export const handleDelete = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const posterCollection = client.db('CIRT').collection('POSTERS');
        const poster = await posterCollection.findOne({ 
            _id: new ObjectId(req.params.id)
        });

        if (!poster) {
            return res.status(404).json({ error: 'Poster not found' });
        }

        // Only allow admin or owner to delete
        const isAdmin = req.session.user.role === 'admin';
        const isOwner = poster.userId.toString() === req.session.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Delete from database
        const result = await posterCollection.deleteOne({ 
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount > 0) {
            res.json({ message: 'Poster deleted successfully' });
        } else {
            res.status(404).json({ error: 'Poster not found' });
        }
    } catch (err) {
        console.error('Error in handleDelete:', err);
        res.status(400).json({ error: err.message });
    }
};
