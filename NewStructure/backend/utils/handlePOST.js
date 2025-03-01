//imports
import {client} from "../Database/Mongodb.js";
import bcrypt from "bcryptjs";

export const handlePostRequest = async (req, res) => {
    console.log("Incoming POST request to:", req.path);
    console.log("Request body:", req.body);
    // extracts the request from the body
    const {body} = req;
    console.log(body);
    // Switch-like handler for different POST request types
    const requestHandlers = {
        '/signup': handleSignup,
        '/login': handleLogin,
        // Add more handlers here as needed for other routes
    };

    // Check if the handler exists for this route
    const handler = requestHandlers[req.originalUrl];

    if (handler) {
        // Call the specific handler
        await handler(req, res, body);
    } else {
        return res.status(404).json({ error: 'Route not found' });
    }
};

// Signup Handler
const handleSignup = async (req, res, body) => {
    const {name, email, password } = body;
    if (!name|| !email || !password) {
        return res.status(400).json({ error: "name and email and password are required" });
    }
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const result = await collection.insertOne({name, email, password });
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
const handleLogin = async (req, res, body) => {
    const { email, password } = body;
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
        req.session.user = { id: user._id, email: user.email };
        return res.json({ message: 'Logged in successfully', user: { id: user._id, email: user.email } });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const handLogout = async (req, res, next) => {

}
// Logout Handler
const handleLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};
