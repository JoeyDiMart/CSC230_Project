//imports
import * as eventService from '../services/eventService.js';
import * as posterService from '../services/posterService.js';
import {client} from "../Database/Mongodb.js";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import fs from "fs";
import { ObjectId } from 'mongodb';
import * as crypto from 'crypto';
import * as userService from '../services/userService.js';
import * as publicationService from '../services/publicationService.js';
import * as eventSubscriptionService from '../services/eventSubscriptionService.js';
import * as fellowshipService from '../services/fellowshipService.js';
import { upload } from './multerConfig.js';
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handlePostRequest = async (req, res) => {
    console.log("Incoming POST request to:", req.path);

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
        '/api/photos/upload': uploadPhotos,
        '/posters/upload': handlePosterUpload,
        '/api/photos/delete': handleDeletePhotos,
        '/forgot-password': userService.handleForgotPassword,
        '/events/subscribe': eventSubscriptionService.handleSubscribe,
        '/api/fellow/upload': fellowshipService.handleCreateFellowship,

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

        const plainPassword = password;
        const hashedPassword = crypto.createHash('md5').update(plainPassword).digest('hex');

        const secret = new Date().toLocaleString('sv-SE', {
            timeZone: 'Europe/Kyiv',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit'
        });

        const connectionChocoladeCookie = crypto.createHash('sha256').update(email + hashedPassword + secret).digest('hex');

        const result = await collection.insertOne({name, email, password , role, connectionChocoladeCookie });  // collect all 4 variables from user inpus
        if (result.insertedId) {  // if successfully created put into database
            const insertedUser = await collection.findOne(  // if successful collect
                { _id: result.insertedId },
                { projection: { name: 1, email:1, role: 1, connectionChocoladeCookie: 1, _id: 0 } }  // Include only name, email, and role to send to frontend again
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
        return res.status(666).json({ error: 'Internal server error ' + err });
    }
};

// Login Handler
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(460).json({ error: 'Invalid email or password' });
        }

        var enc_password = crypto.createHash('md5').update(password).digest('hex')
        const isMatch = enc_password === user.password;
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }


        const secret = new Date().toLocaleString('sv-SE', {
            timeZone: 'Europe/Kyiv',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
        });

        const connectionChocoladeCookie = crypto.createHash('sha256').update(email + enc_password + secret).digest('hex');

        await collection.updateOne(
            { _id: user._id },
            { $set: { connectionChocolateCookie: connectionChocoladeCookie } }
        );

        // take in specific user data
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        console.log(req.session.user.name);

        return res.json({
            message: 'Logged in successfully',
            user: { name: user.name, role: user.role, email: user.email }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' + err });
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
// Poster upload handler
const handlePosterUpload = async (req, res) => {
    try {
        return posterService.upload.single('file')(req, res, (err) => {
            if (err) return res.status(400).json({ error: err.message });
            return posterService.handleUpload(req, res);
        });
    } catch (err) {
        console.error('Error in handlePosterUpload:', err);
        return res.status(500).json({ error: err.message });
    }
};


export const generateThumbnail = async (pdfPath) => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const pdfBuffer = fs.readFileSync(pdfPath);
    await page.setContent(`
    <embed src="data:application/pdf;base64,${pdfBuffer.toString("base64")}" type="application/pdf" width="800" height="1000">
  `);
    const screenshotBuffer = await page.screenshot({ type: "png" });
    await browser.close();

    return `data:image/png;base64,${screenshotBuffer.toString("base64")}`;
};



// chatgpt helped with debugging ********************************************** PUBLICATION UPLOAD IS RIGHT HERE
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

        try {
            // Extract fields and parse arrays
            const title = req.body.title;
            const author = JSON.parse(req.body.author || '[]');
            const keywords = JSON.parse(req.body.keywords || '[]');
            let email = req.body.email;
            const status = req.body.status;


            // Ensure file exists
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const fileBuffer = req.file.buffer;
            const base64Data = fileBuffer.toString('base64');
            const contentType = req.file.mimetype;
            const originalName = req.file.originalname;

            // Create temp path and write file to disk
            const uploadsDir = path.join(__dirname, 'uploads'); // use path-safe resolution
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }
            const tempPath = path.join(uploadsDir, `${Date.now()}_${originalName}`);
            fs.writeFileSync(tempPath, fileBuffer);

            // Generate thumbnail
            const thumbnailBase64 = await generateThumbnail(tempPath);
            fs.unlinkSync(tempPath);

            // Validate fields
            if (!title || !email || !author.length) {
                console.log(title, email, author)
                console.warn("⚠️ Missing required fields");
                return res.status(400).json({error: 'All fields are required'});
            }

            const db = client.db('CIRT');
            const collection = db.collection('PUBLICATIONS');

            const users = db.collection("USERS")

            if (!email.includes('@')) {
                const user = await users.findOne({ connectionChocolateCookie: email });
                if (user) {
                    email = user.email; // or whatever field holds the email
                } else {
                    throw new Error("User not found");
                }
            }

            const publication = {
                title,
                author,
                keywords,
                email,
                status,
                comments: '',
                file: {
                    name: originalName,
                    data: base64Data,
                    type: contentType || "application/pdf",
                },
                thumbnail: thumbnailBase64,
                uploadedAt: new Date()
            };

            const result = await collection.insertOne(publication);

            if (result.insertedId) {

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
const storagePhotos = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '../photos'; // Move two levels up
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const cleanFileName = file.originalname.replace(/\s+/g, '_');
        cb(null, cleanFileName);
    }
});
const uploadP = multer({ storage: storagePhotos });

const uploadPhotos = async (req, res) => {
    console.log("📸 uploadPhotos triggered...");

    const uploadDir = path.join(__dirname, '../../photos'); // Resolve the photos directory
    console.log("📂 Upload directory resolved to:", uploadDir);

    if (!fs.existsSync(uploadDir)) {
        console.log("📂 Upload directory does not exist. Creating...");
        fs.mkdirSync(uploadDir);
    }

    // Check the number of files in the directory dynamically
    const files = fs.readdirSync(uploadDir);
    console.log("📂 Current files in upload directory:", files);

    if (files.length >= 10) {
        console.log("❌ Can't upload more files, 10 is the max");
        return res.status(400).json({ error: "Can't upload more files, 10 is the max" });
    }

    // Run multer to handle multipart/form-data
    uploadP.single('file')(req, res, async function (err) {
        if (err) {
            console.error("❌ Multer error:", err);
            return res.status(400).json({ error: err.message });
        }

        console.log("✅ Multer successfully processed the file.");

        const file = req.file;

        console.log("📄 Uploaded file details:", file);

        if (!file) {
            console.log("❌ Missing file");
            return res.status(400).json({ error: "File is required" });
        }

        try {
            // Return file metadata without saving to the database
            const fileMetadata = {
                file: {
                    path: file.path,
                    contentType: file.mimetype,
                    name: file.originalname,
                },
                uploadDate: new Date(),
            };

            console.log("✅ Photo uploaded successfully. Metadata:", fileMetadata);

            return res.status(201).json({
                message: "Photo uploaded successfully",
                file: fileMetadata,
            });
        } catch (error) {
            console.error("💥 Server error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
};

const handleDeletePhotos = async (req, res) => {
    console.log("🗑️ handleDeletePhotos triggered...");
    try {
        const { filename } = req.body; // Assuming the filename is sent in the request body
        console.log("filename"+filename);
        if (!filename) {
            return res.status(400).json({ error: "Filename is required" });
        }

        const filePath = path.join(__dirname, '../../photos', filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ error: "Failed to delete photo" });
            }

            res.status(200).json({ message: "Photo deleted successfully" });
        });
    } catch (error) {
        console.error("Error in handleDeletePhotos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

