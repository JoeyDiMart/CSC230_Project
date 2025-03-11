import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for poster uploads
const storage = multer.diskStorage({
    destination: './uploads/posters',
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
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for PDFs
});

export const handleUpload = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const posterCollection = client.db('CIRT').collection('posters');
        const poster = {
            title: req.body.title,
            description: req.body.description,
            filePath: req.file.path,
            userId: new ObjectId(req.session.user.id),
            uploadDate: new Date(),
            status: 'pending'
        };
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
    console.log('Starting handleGetAll...'); // Debug log
    try {
        const posterCollection = client.db('CIRT').collection('posters');
        console.log('Got poster collection'); // Debug log
        
        // Just get all posters for now
        const posters = await posterCollection.find({}).toArray();
        console.log('Found posters:', JSON.stringify(posters)); // Debug log
            
        // Convert ObjectIds to strings for response
        const formattedPosters = posters.map(poster => ({
            ...poster,
            _id: poster._id.toString(),
            userId: poster.userId ? poster.userId.toString() : null // Handle case where userId might be missing
        }));
        
        console.log('Sending response:', JSON.stringify(formattedPosters)); // Debug log
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
        console.log('Starting handleGetPending...'); // Debug log
        const posterCollection = client.db('CIRT').collection('posters');
        let query = { status: 'pending' };

        // If not admin, only show user's own pending posters
        if (req.session.user.role !== 'admin') {
            query.userId = req.session.user.id;
        }

        console.log('Query:', query); // Debug log
        const posters = await posterCollection
            .find(query)
            .sort({ uploadDate: -1 })
            .toArray();
            
        console.log('Found posters:', posters); // Debug log
            
        // Convert ObjectIds to strings for response
        const formattedPosters = posters.map(poster => ({
            ...poster,
            _id: poster._id.toString(),
            userId: poster.userId ? poster.userId.toString() : null // Handle case where userId might be missing
        }));
        
        console.log('Sending response:', JSON.stringify(formattedPosters)); // Debug log
        res.json(formattedPosters);
    } catch (err) {
        console.error('Error in handleGetPending:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleGetById = async (req, res) => {
    try {
        console.log('Starting handleGetById...'); // Debug log
        console.log('Session user:', req.session.user); // Debug log
        
        const posterCollection = client.db('CIRT').collection('posters');
        const poster = await posterCollection.findOne({ 
            _id: new ObjectId(req.params.id)
        });
        
        console.log('Found poster:', poster); // Debug log
        
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

        console.log('Access checks:', { isApproved, isAdmin, isOwner }); // Debug log

        if (!isApproved && !isAdmin && !isOwner) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Convert ObjectIds to strings for response
        const formattedPoster = {
            ...poster,
            _id: poster._id.toString(),
            userId: poster.userId.toString(),
            isOwner: isOwner
        };
        
        res.json(formattedPoster);
    } catch (err) {
        console.error('Error in handleGetById:', err);
        res.status(500).json({ error: err.message });
    }
};

export const handleApprove = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    try {
        const posterCollection = client.db('CIRT').collection('posters');
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
        const posterCollection = client.db('CIRT').collection('posters');
        const poster = await posterCollection.findOne({ 
            _id: new ObjectId(req.params.id)
        });
        
        if (!poster) {
            return res.status(404).json({ error: 'Poster not found' });
        }
        
        // Only allow deletion by admin or the poster's owner
        if (req.session.user.role !== 'admin' && 
            poster.userId.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
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
        res.status(500).json({ error: err.message });
    }
};
