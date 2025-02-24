import express from 'express';
import multer from 'multer';
import path from 'path';
import { client } from '../utils/Mongodb.js';
import { ObjectId } from 'mongodb';


/**
 * Initialize the Express router for poster routes.
 * This router handles all incoming requests related to posters.
 */
const router = express.Router();

/**
 * Authentication middleware.
 * This middleware checks if the user is logged in by verifying the session.
 * If the user is not logged in, it returns a 401 Unauthorized response.
 */
const authenticate = (req, res, next) => {
    // Check if the user is logged in
    if (req.session.user) {
        // Proceed to the next middleware/route
        next(); 
    } else {
        // Return a 401 Unauthorized response
        res.status(401).json({ error: 'Please log in' }); 
    }
};

/**
 * Configure multer for poster uploads.
 * This storage configuration specifies where to store uploaded files and how to name them.
 * The files are stored in the './uploads/posters' directory and named with a timestamp and the original file name.
 */
const storage = multer.diskStorage({
    // Directory to save posters
    destination: './uploads/posters', 
    // Name format: timestamp-originalname
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});

/**
 * Initialize multer with storage and file filter settings.
 * This configuration allows only PDF files to be uploaded and sets a 5MB limit for uploads.
 */
const upload = multer({
    // Storage configuration
    storage: storage,
    // File filter configuration
    fileFilter: (req, file, cb) => {
        // Check if the file is a PDF
        if (file.mimetype === 'application/pdf') {
            // Accept PDF files
            cb(null, true); 
        } else {
            // Reject non-PDF files
            cb(new Error('Only PDF files are allowed')); 
        }
    },
    // Set a 5MB limit for uploads
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});

/**
 * Upload a new poster.
 * Route to handle poster uploads. Requires authentication and file upload.
 * This route creates a new poster document in the database with the uploaded file and metadata.
 */
router.post('/upload', authenticate, upload.single('poster'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            // Return a 400 Bad Request response if no file was uploaded
            return res.status(400).json({ error: 'No file uploaded' }); 
        }

        // Extract metadata from the request body
        const { title, authors, abstract } = req.body;
        // Get a reference to the database
        const db = client.db('CIRT');
        // Create a new poster document
        const poster = {
            title,
            authors,
            abstract,
            // Use the uploaded file name
            filename: req.file.filename,
            // Set the uploadedBy field to the current user's ID
            uploadedBy: req.session.user._id,
            // Set the uploadDate field to the current date
            uploadDate: new Date()
        };

        // Insert the new poster document into the database
        const result = await db.collection('posters').insertOne(poster);
        // Return a 201 Created response with the result
        res.status(201).json(result); 
    } catch (error) {
        // Return a 500 Internal Server Error response with the error message
        res.status(500).json({ error: error.message }); 
    }
});

/**
 * Get all public posters with filtering.
 * Route to retrieve all posters from the database.
 * This route returns a list of all posters in the database.
 */
router.get('/search', async (req, res) => {
    try {
        // Get a reference to the database
        const db = client.db('CIRT');
        // Find all posters in the database
        const posters = await db.collection('posters').find().toArray();
        // Return the list of posters
        res.json(posters); 
    } catch (error) {
        // Return a 500 Internal Server Error response with the error message
        res.status(500).json({ error: error.message }); 
    }
});

/**
 * Get a specific poster.
 * Route to retrieve a poster by its ID. Requires authentication.
 * This route returns a single poster document from the database.
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const posterId = req.params.id;
        const db = client.db('CIRT');
        const poster = await db.collection('posters').findOne({ _id: new ObjectId(posterId) });
        if (!poster) {
            return res.status(404).json({ error: 'Poster not found' });
        }
        res.json(poster);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update poster metadata.
 * Route to update the metadata of a poster by its ID. Requires authentication.
 * This route updates the title, authors, and abstract fields of a poster document in the database.
 */
router.put('/:id', authenticate, async (req, res) => {
    try {
        const posterId = req.params.id;
        const { title, authors, abstract } = req.body;
        const db = client.db('CIRT');
        const result = await db.collection('posters').updateOne(
            { _id: new ObjectId(posterId) },
            { $set: { title, authors, abstract, updatedDate: new Date() } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Poster not found' });
        }
        res.json({ message: 'Poster updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
export default router;
