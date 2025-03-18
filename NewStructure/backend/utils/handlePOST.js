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
    console.log("Original Request body:", req.body);
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

const setRole = (role) => {
    // If the user is a guest, set the role to publisher
    return role === 'guest' ? 'publisher' : role;
};

// Signup Handler
const handleSignup = async (req, res) => {
    let {name, email, password, role} = req.body;
    role = setRole();
    console.log("role: ", role);
    //const {name, email, password} = req.body;
    if (!name|| !email || !password) {
        return res.status(400).json({ error: "name and email and password are required" });
    }
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });  // tested by changing message, works
        }
        const result = await collection.insertOne({name, email, password, role });
        console.log("Result stuff: ", result);
        console.log("After-Processing Request body:", req.body);
        if (result.insertedId) {
            return res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
        } else {
            return res.status(400).json({ error: "Failed to register user" });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Login Handler
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });  // changed login error to 400
    }
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(460).json({ error: 'Invalid email or password' });
        }
        // CORRECT IMPLEMENTATION
        //const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password;
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        console.log("TESTing      ", req.session.user.role);
        return res.json({ message: 'Logged in successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
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
