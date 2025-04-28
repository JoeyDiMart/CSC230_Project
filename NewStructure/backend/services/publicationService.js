import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for manuscript uploads
const storage = multer.diskStorage({
    destination: './uploads/manuscripts',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false);
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 }
});


export const handleGetReviews = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }
    if (!['reviewer', 'editor'].includes(req.session.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const manuscriptCollection = client.db().collection('manuscripts');
        const submissions = await manuscriptCollection.find({ status: 'submitted' }).toArray();
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const handleGetIssues = async (req, res) => {
    try {
        const issueCollection = client.db().collection('issues');
        const issues = await issueCollection.find({ status: 'published' }).toArray();
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const handleDecision = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }
    if (req.session.user.role !== 'editor') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const manuscriptCollection = client.db().collection('manuscripts');
        const result = await manuscriptCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { 
                status: req.body.status, 
                decisionDate: new Date(),
                decisionBy: req.session.user.id,
                comments: req.body.comments
            } }
        );

        if (result.modifiedCount > 0) {
            res.json({ message: 'Decision updated successfully' });
        } else {
            res.status(404).json({ error: 'Manuscript not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
