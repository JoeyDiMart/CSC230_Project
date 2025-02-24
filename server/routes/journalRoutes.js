import express from 'express';
import multer from 'multer';
import { client } from '../utils/Mongodb.js';
import { ObjectId } from 'mongodb';


/**
 * Initialize the Express router for journal routes.
 */
const router = express.Router();

/**
 * Configure multer for manuscript uploads.
 * This storage configuration specifies where to store uploaded files and how to name them.
 */
const storage = multer.diskStorage({
    /**
     * Directory to save manuscripts.
     */
    destination: './uploads/manuscripts',
    /**
     * Name format: timestamp-originalname.
     */
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

/**
 * Initialize multer with storage and file filter settings.
 */
const upload = multer({
    storage,
    /**
     * File filter to check if the uploaded file type is allowed.
     */
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false); // Reject the file
        }
    },
    /**
     * 20MB limit for uploads.
     */
    limits: { fileSize: 20 * 1024 * 1024 }
});

/**
 * Authentication middleware.
 * This middleware checks if the user is logged in by verifying the session.
 */
const authenticate = (req, res, next) => {
    if (req.session.user) {
        next(); // Proceed to the next middleware/route
    } else {
        res.status(401).json({ error: 'Please log in' }); // Unauthorized response
    }
};

/**
 * Authorization middleware.
 * This middleware checks if the user has the required role to access a route.
 * @param {Array} roles - Array of allowed roles.
 * @returns {Function} - Middleware function.
 */
const authorize = (roles) => {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next(); // Proceed if authorized
        } else {
            res.status(403).json({ error: 'Forbidden' }); // Forbidden response
        }
    };
};

/**
 * Route to handle manuscript submission.
 * Requires authentication and file upload.
 */
router.post('/submit', authenticate, upload.single('manuscript'), async (req, res) => {
    try {
        const result = await submitManuscript(req.body, req.file, req.session.user.userId);
        res.status(201).json({ message: 'Manuscript submitted successfully', ...result }); // Success response
    } catch (err) {
        res.status(400).json({ error: err.message }); // Error response
    }
});

/**
 * Route to retrieve submissions for review.
 * Accessible only by authorized users (reviewers and editors).
 */
router.get('/review', authenticate, authorize(['reviewer', 'editor']), async (req, res) => {
    try {
        const submissions = await getSubmissionsForReview();
        res.json(submissions); // Return submissions
    } catch (err) {
        res.status(500).json({ error: err.message }); // Server error response
    }
});

/**
 * Route to submit a review for a manuscript.
 * Requires authentication and authorization (reviewer role).
 */
router.post('/:id/review', authenticate, authorize(['reviewer']), upload.single('annotatedFile'), async (req, res) => {
    try {
        const manuscriptId = req.params.id;
        const result = await submitReview(new ObjectId(manuscriptId), req.body, req.file, req.session.user.userId);
        res.json(result); // Return review submission result
    } catch (err) {
        res.status(400).json({ error: err.message }); // Error response
    }
});

/**
 * Route for editors to make decisions on manuscript submissions.
 */
router.put('/:id/decision', authenticate, authorize(['editor']), async (req, res) => {
    try {
        const manuscriptId = req.params.id;
        const result = await makeDecision(new ObjectId(manuscriptId), req.body);
        res.json(result); // Return decision result
    } catch (err) {
        res.status(400).json({ error: err.message }); // Error response
    }
});

/**
 * Route to create a new issue.
 * Accessible only by editors.
 */
router.post('/issues', authenticate, authorize(['editor']), async (req, res) => {
    try {
        const result = await createIssue(req.body);
        res.status(201).json({ message: 'Issue created successfully', ...result }); // Success response
    } catch (err) {
        res.status(400).json({ error: err.message }); // Error response
    }
});

/**
 * Route to retrieve all published issues.
 */
router.get('/issues', async (req, res) => {
    try {
        const issues = await getPublishedIssues();
        res.json(issues); // Return published issues
    } catch (err) {
        res.status(500).json({ error: err.message }); // Server error response
    }
});

/**
 * Route to retrieve a manuscript by ID.
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const manuscriptId = req.params.id;
        const manuscript = await getManuscriptById(new ObjectId(manuscriptId)); // Use new ObjectId
        if (!manuscript) {
            return res.status(404).json({ error: 'Manuscript not found' });
        }
        res.json(manuscript);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
