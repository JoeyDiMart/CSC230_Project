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
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false);
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 }
});

export const handleHome = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
};

export const handleGetReviews = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }cd
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

export const handleGetManuscript = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const manuscriptCollection = client.db().collection('manuscripts');
        const manuscript = await manuscriptCollection.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!manuscript) {
            return res.status(404).json({ error: 'Manuscript not found' });
        }
        res.json(manuscript);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const handleSubmit = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const manuscriptCollection = client.db().collection('manuscripts');
        const manuscript = {
            ...req.body,
            filePath: req.file.path,
            userId: req.session.user.id,
            status: 'submitted',
            submissionDate: new Date()
        };
        const result = await manuscriptCollection.insertOne(manuscript);
        res.status(201).json({ 
            message: 'Manuscript submitted successfully', 
            id: result.insertedId 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const handleReview = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }
    
    // Allow both reviewers and editors to submit reviews
    if (!['reviewer', 'editor'].includes(req.session.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        console.log('Submitting review for manuscript:', req.params.id); // Debug log
        console.log('Review data:', req.body); // Debug log
        
        const reviewCollection = client.db('CIRT').collection('reviews');
        const review = {
            manuscriptId: new ObjectId(req.params.id),
            ...req.body,
            annotatedFilePath: req.file?.path,
            reviewerId: req.session.user.id,
            reviewDate: new Date()
        };
        
        console.log('Saving review:', review); // Debug log
        const result = await reviewCollection.insertOne(review);
        res.json({ 
            message: 'Review submitted successfully',
            id: result.insertedId 
        });
    } catch (err) {
        console.error('Error in handleReview:', err); // Debug log
        res.status(400).json({ error: err.message });
    }
};

export const handleCreateIssue = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }
    if (req.session.user.role !== 'editor') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const issueCollection = client.db().collection('issues');
        const issue = {
            ...req.body,
            creationDate: new Date(),
            status: 'draft'
        };
        const result = await issueCollection.insertOne(issue);
        res.status(201).json({ 
            message: 'Issue created successfully', 
            id: result.insertedId 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
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
