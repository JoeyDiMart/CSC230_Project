//imports
import * as journalService from '../services/journalService.js';
import * as posterService from '../services/posterService.js';
import {client} from "../Database/Mongodb.js";
import bcrypt from "bcryptjs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handlePostRequest = async (req, res) => {
    console.log("Incoming POST request to:", req.path);
    console.log("Request body:", req.body);
    // extracts the request from the body
    //const {body} = req; this is redundant
    //console.log(body); use req.body it's the same thing
    // Switch-like handler for different POST request types
    const requestHandlers = {
        '/signup': handleSignup,
        '/login': handleLogin,
        '/logout': handleLogout,
        '/submit': handleSubmit,
        '/issues': journalService.handleCreateIssue,
        '/posters/upload': handleUpload,
    };

    // Check if the handler exists for this route
    const handler = requestHandlers[req.originalUrl];

    if (handler) {
        // Call the specific handler
        await handler(req, res);
    } else {
        const reviewMatch = req.path.match(/^\/([^\/]+)\/review$/);
        if (reviewMatch) {
            req.params = { id: reviewMatch[1] };
            return journalService.upload.single('annotated')(req, res, (err) => {
                if (err) return res.status(400).json({ error: err.message });
                return journalService.handleReview(req, res);
            });
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
            user: { name: user.name, role: user.role }  // return only name and role
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
    return journalService.upload.single('manuscript')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        return journalService.handleSubmit(req, res);
    });
};

// Poster upload handler
const handleUpload = async (req, res) => {
    return posterService.upload.single('poster')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        return posterService.handleUpload(req, res);
    });
};
