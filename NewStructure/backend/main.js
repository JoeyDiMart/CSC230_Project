/////////////////////
// MAIN SERVER CODE//
/////////////////////


// Modules Imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {client, connectToDatabase} from "./Database/Mongodb.js";
import cors from 'cors';
import session from 'express-session';
import favicon from 'serve-favicon';

// Utils Imports
import { handlePostRequest } from "./utils/handlePOST.js";
import { handleGetRequest } from "./utils/handleGET.js";
import { handlePutRequest } from "./utils/handlePUT.js";
import { handleDeleteRequest } from "./utils/handleDEL.js";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a web server
const app = express();

// Serve favicon
app.use(favicon(path.join(__dirname, '..','frontend', 'public', 'UTampa_mark.png')));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Specify the exact frontend origin
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(session({
    secret: 'CIRT-secret-key',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to false for non-HTTPS needs to go to true when we launch
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Ensure database connection before handling requests
(async () => {
    await connectToDatabase();
})();

// Send all requests to respective functions
app.post("*", handlePostRequest);
app.get("*", handleGetRequest);
app.delete("*", handleDeleteRequest);
app.put("*", handlePutRequest);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start listening on the PORT 8081
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});
