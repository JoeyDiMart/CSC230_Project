/**
 * Main Server File - CIRT Publishing System
 * 
 * This file sets up our Express server and all its core functionality.
 * Think of this as the brain of our application - it coordinates everything!
 */

import express from 'express';
import bcrypt from "bcryptjs";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import {client, connectToDatabase} from "./utils/Mongodb.js";
import { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest } from "./utils/parseRequests.js";

import userRoutes from './routes/userRoutes.js';
import posterRoutes from './routes/posterRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
// These lines help us use proper file paths in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// === Middleware Setup ===
// Allow cross-origin requests (helpful for development)
app.use(cors());
// Parse JSON in request bodies
app.use(express.json());
// Serve static files from 'public' directory
app.use(express.static('public'));

/**
 * Session Configuration
 * This replaces our old JWT system with a simpler, more secure session-based auth
 * - secret: Used to sign the session ID cookie
 * - resave: Don't save session if unmodified
 * - saveUninitialized: Don't create session until something stored
 * - cookie: Settings for the session cookie
 */
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // set to true if using https
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve uploaded files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB when server starts
(async () => {
    await connectToDatabase();
})();

app.post("/signup", async(req,res)=>{
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({error: "email and password are required"});
    }
    try{
        const db = client.db('CIRT');
        console.log("Connected to CIRT database");

        const collection = db.collection('USERS');
        console.log("Using USERS collection");

        // now check if the user already exists
        const existingUser  = await collection.findOne({email: email});
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }
        // hashes password
        const hashPassword = await bcrypt.hash(password,10);

        // insert user into the database
        const result = await collection.insertOne({ email, password: hashPassword });
        console.log("Insert result:", result);
        if (result.insertedId) {
            res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
        } else {
            res.status(400).json({ error: "Failed to register user" });
        }


    } catch(err) {
        console.log(err);
        res.status(400).json({error: 'Internal server error'});
    }

});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');

        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Store user info in session (but not the password!)
        req.session.user = { id: user._id, email: user.email };
        res.json({ message: 'Logged in successfully', user: { id: user._id, email: user.email } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

/**
 * Authentication Middleware
 * Checks if user is logged in before allowing access to protected routes
 * Used by poster and journal routes
 */
const authenticate = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Please log in' });
    }
};

// === Route Setup ===
// User routes (login, register, etc.)
app.use('/api/users', userRoutes);
// Poster routes (protected by authentication)
app.use('/api/posters', authenticate, posterRoutes);
// Journal routes (protected by authentication)
app.use('/api/journals', authenticate, journalRoutes);

// Error handling middleware - catches any errors in our routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.get("*", handleGetRequest);
app.post("*", handlePostRequest);
app.delete("*", handleDeleteRequest);
app.put("*", handlePutRequest);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is Successfully Running, and App is listening on port http://localhost:${PORT}`);
});
