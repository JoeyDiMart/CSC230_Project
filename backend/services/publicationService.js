import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail, getDecisionChangeEmail } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for manuscript uploads
const storage = multer.memoryStorage();


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
        
        // First get the current document to check the old status
        const currentDoc = await manuscriptCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!currentDoc) {
            return res.status(404).json({ error: 'Manuscript not found' });
        }

        // Update the document
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
            // Send email notification if status has changed
            if (currentDoc.status !== req.body.status) {
                const emailContent = getDecisionChangeEmail(
                    currentDoc.title,
                    currentDoc.type || 'journal',
                    currentDoc.status,
                    req.body.status
                );
                
                // Get the submitter's email
                const userCollection = client.db().collection('users');
                const submitter = await userCollection.findOne({ _id: currentDoc.submitterId });
                
                if (submitter && submitter.email) {
                    await sendEmail(
                        submitter.email,
                        emailContent.subject,
                        emailContent.text,
                        emailContent.html
                    );
                }
            }
            
            res.json({ message: 'Decision updated successfully' });
        } else {
            res.status(404).json({ error: 'Manuscript not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const handleUpdateStatus = async (req, res) => {
    try {
        console.log("🔧 Received request to update status");
        const { id } = req.params;
        const { status } = req.body;

        console.log("📋 Request parameters:", { id, status });

        const cirtdb = client.db('CIRT'); // Connect to the 'cirt' database
        console.log("📂 Connected to 'CIRT' database");

        const publicationCollection = cirtdb.collection('PUBLICATIONS');
        console.log("📂 Accessed 'PUBLICATIONS' collection");

        if (!ObjectId.isValid(id)) {
            console.error("❌ Invalid ObjectId format:", id);
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const result = await publicationCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        console.log("🔍 Update result:", result);

        if (result.modifiedCount > 0) {
            console.log("✅ Status updated successfully for ID:", id);
            res.json({ message: 'Status updated successfully' });
        } else {
            console.warn("⚠️ No publication found with ID:", id);
            res.status(404).json({ error: 'Publication not found' });
        }
    } catch (err) {
        console.error("💥 Error in handleUpdateStatus:", err);
        res.status(500).json({ error: err.message });
    }
};

export const handleReplaceFile = async (req, res) => {
    console.log("Incoming PUT request to:", req.path);
    try {
        const { id } = req.params;
        console.log("🔧 Extracted ID from params:", id);

        const file = req.file;
        console.log("📄 Uploaded file details:", file);

        if (!file) {
            console.error("❌ No file uploaded in the request.");
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!ObjectId.isValid(id)) {
            console.error("❌ Invalid ObjectId format:", id);
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const cirtDb = client.db('CIRT'); // Connect to the 'cirt' database

        const publicationCollection = cirtDb.collection('PUBLICATIONS');
        console.log("📂 Connected to PUBLICATIONS collection.");

        const objectId = new ObjectId(id);
        const doc = await publicationCollection.findOne({ _id: objectId });
        if (!doc) {
            console.warn("⚠️ No document found with ID:", id);
        } else {
            console.log("📄 Document before update:", doc);
        }

        const result = await publicationCollection.updateOne(
            { _id:  new ObjectId(id) },
            { $set: { file: file.buffer.toString('base64') } }
        );

        console.log("🔍 Update result:", result);

        if (result.modifiedCount > 0) {
            console.log("✅ File replaced successfully for publication ID:", id);
            res.json({ message: 'File replaced successfully' });
        } else {
            console.warn("⚠️ No publication found with ID:", id);
            res.status(404).json({ error: 'Publication not found' });
        }
    } catch (err) {
        console.error("💥 Error in handleReplaceFile:", err);
        res.status(500).json({ error: err.message });
    }
};

export const handleUpdateComments = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;

        const cirtdb= client.db('CIRT'); // Connect to the 'cirt' database
        const publicationCollection = cirtdb.collection('PUBLICATIONS');
        const result = await publicationCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { comments } }
        );

        if (result.modifiedCount > 0) {
            res.json({ message: 'Comments updated successfully' });
        } else {
            res.status(404).json({ error: 'Publication not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};