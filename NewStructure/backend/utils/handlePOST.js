//imports

import * as eventService from '../services/eventService.js';
import {client} from "../Database/Mongodb.js";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import fs from "fs";
import {ReviewStatus} from "../Database/schemas.js";
import { ObjectId } from 'mongodb';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handlePostRequest = async (req, res) => {
    console.log("Incoming POST request to:", req.path);
    console.log("Request body:", req.body);

    // Handle event updates first since they have dynamic routes
    const eventUpdateMatch = req.path.match(/^\/events\/([^\/]+)$/);
    if (eventUpdateMatch) {
        req.params = { id: eventUpdateMatch[1] };
        return eventService.handleUpdate(req, res);
    }

    // Static route handlers
    const requestHandlers = {
        '/signup': handleSignup,
        '/login': handleLogin,
        '/logout': handleLogout,
        '/submit': handleSubmit,
        '/events': eventService.handleCreate,
        '/api/publications': handlePublication,
        '/publications/update': handleUpdateStatus,
        '/api/views/increment': handleIncrementViews,

    };
    /*
     '/posters/upload': handleUpload,
     '/issues': publicationService.handleCreateIssue,
     */

    // Check if the handler exists for this route
    const handler = requestHandlers[req.path];

    if (handler) {
        // Call the specific handler
        await handler(req, res);
    } else {
        const reviewMatch = req.path.match(/^\/([^\/]+)\/review$/);
        if (reviewMatch) {
            req.params = { id: reviewMatch[1] };
            return publicationService.upload.single('annotated')(req, res, (err) => {
                if (err) return res.status(400).json({ error: err.message });
                return publicationService.handleReview(req, res);
            });
        }

        const updateUserMatch = req.path.match(/^\/users\/([^\/]+)$/);
        if (updateUserMatch) {
            req.params = { id: updateUserMatch[1] };
            return userService.handleUpdateUser(req, res);
        }
    
        return res.status(404).json({ error: 'Route not found' });
    }
};

// setRole will update the roll that gets sent to the frontend, initially guest, will change to publisher after singup
const setRole = (role) => {
    // If the role is null, undefined, empty, or 'guest', set it to 'publisher'
    return !role || role === 'guest' ? 'publisher' : role;
};

// Signup Handler
const handleSignup = async (req, res) => {
    let {name, email, password, role} = req.body;
    role = setRole(role);  // update role
    if (!name|| !email || !password) {
        return res.status(400).json({ error: "name and email and password are required" });
    }
    try {
        const db = client.db('CIRT');  // access database
        const collection = db.collection('USERS');  // access USERS section of database
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {  // test if email is already stored in database
            return res.status(400).json({ error: "User already exists" });  // tested by changing message, works
        }

        const result = await collection.insertOne({name, email, password, role });  // collect all 4 variables from user inpus
        if (result.insertedId) {  // if successfully created put into database
            const insertedUser = await collection.findOne(  // if successful collect
                { _id: result.insertedId },
                { projection: { name: 1, email:1, role: 1, _id: 0 } }  // Include only name, email, and role to send to frontend again
            );
            return res.status(201).json({   // return as json to frontend
                message: "User registered successfully",
                user: insertedUser   // return the name, email and the role only
            });

            // error handling stuff
        } else {
            return res.status(400).json({ error: "Failed to register user" });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Login Handler
const handleLogin = async (req, res) => {
    const { email, password } = req.body;  // take in only email and password from frontend
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' }); // if empty fields
    }
    try {
        const db = client.db('CIRT');  // connect to database
        const collection = db.collection('USERS');  // link to USERS section of database
        const user = await collection.findOne({ email });  // find user by searching for email
        if (!user) {
            return res.status(460).json({ error: 'Invalid email or password' });
        }

        const isMatch = password === user.password;  // check if correct password NOT ENCRYPTED
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // take in specific user data
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        return res.json({ message: 'Logged in successfully',
            user: { name: user.name, role: user.role, email: user.email }  // return only name, email and role
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Logout Handler
const handleLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};


// Manuscript submission handler
const handleSubmit = async (req, res) => {
    return publicationService.upload.single('manuscript')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        return publicationService.handleSubmit(req, res);
    });
};
/*
// Poster upload handler
const handleUpload = async (req, res) => {
    return posterService.upload.single('poster')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        return posterService.handleUpload(req, res);
    });
};
*/


// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Use the original file name, replacing spaces with underscores
        const cleanFileName = file.originalname.replace(/\s+/g, '_');
        cb(null, cleanFileName);
    }
});

const upload = multer({ storage: storage });

// chatgpt helped with debugging
// Wrap in middleware to use in the main handler
export const handlePublication = async (req, res) => {
    console.log("📥 handlePublication triggered...");

    // Run multer first to parse the multipart/form-data
    upload.single('file')(req, res, async function (err) {
        if (err) {
            console.error("❌ Multer error:", err);
            return res.status(400).json({error: err.message});
        }

        console.log("✅ Multer finished parsing request");
        console.log("📝 Fields:", req.body);
        console.log("📎 File info:", req.file);

        try {
            // Extract fields and parse arrays
            const title = req.body.title;
            const author = JSON.parse(req.body.author || '[]');
            const keywords = JSON.parse(req.body.keywords || '[]');
            const email = req.body.email;
            const status = req.body.status;
            const comments = JSON.parse(req.body.comments || '[]');

            // Ensure file exists
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const fileData = fs.readFileSync(req.file.path);
            const contentType = req.file.mimetype;
            const originalName = req.file.originalname;
            // Validate fields
            if (!title || !email || !author.length || !keywords.length) {
                console.warn("⚠️ Missing required fields");
                return res.status(400).json({error: 'All fields are required'});
            }

            const db = client.db('CIRT');
            const collection = db.collection('PUBLICATIONS');

            const publication = {
                title,
                author,
                keywords,
                email,
                status,
                comments,
                file: {
                    name: originalName,
                    data: fileData,
                    contentType: contentType,
                },
                uploadedAt: new Date()
            };

            console.log("💾 Inserting publication:", publication);
            const result = await collection.insertOne(publication);

            if (result.insertedId) {
                console.log("✅ Publication inserted:", result.insertedId);
                return res.status(201).json({message: "Upload successful", publicationId: result.insertedId});
            } else {
                console.error("❌ Insertion failed");
                return res.status(500).json({error: "Could not save publication"});
            }
        } catch (error) {
            console.error("💥 Server error:", error);
            return res.status(500).json({error: "Internal server error"});
        }
    });
}

const handleUpdateStatus = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('PUBLICATIONS');

        let docId = req.body.id
        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(docId) },
            { $set: { status: req.body.status } },
          );
        return res.status(200).json({ message: "Status Successfuly Updated" });

    } catch (error) {
        console.log("Internal revenue Error", error);
        return res.status(500).json({ error: "Service temporarily unavailable" });
    }
};

const handleIncrementViews = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('VIEWS');

        // Increment the view count (assuming a single document in the collection)
        const result = await collection.updateOne(
            { _id: "websiteViews" }, // Use a specific identifier for the document
            { $inc: { count: 1 } },
            { upsert: true } // Create the document if it doesn't exist
        );

        res.status(200).json({ message: "View count incremented", result });
    } catch (err) {
        console.error("Error incrementing views:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
