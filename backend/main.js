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
import { handleGetRequest, handleGetMyPublications } from "./utils/handleGET.js";
import { handlePutRequest } from "./utils/handlePUT.js";
import { handleDeleteRequest } from "./utils/handleDEL.js";


// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a web server
const app = express();

// Serve favicon
app.use(favicon(path.join(__dirname, '..','frontend', 'public', 'UTampa_mark.png')));
app.use('/NewStructure/photos', express.static(path.join(__dirname, '../Photos')));
app.use("/uploads", express.static("uploads"));
app.use('/FellowImages', express.static(path.join(__dirname, 'FellowImages')));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8081',
    'https://cirtutampa-b47a791bfcb6.herokuapp.com'
];

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('❌ Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
    ,
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
        secure: process.env.NODE_ENV === 'production', // Secure in production, insecure in development
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // 'none' for cross-site requests in production
    }
}));

// Trust the first proxy in production (required for secure cookies to work with proxies)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Ensure database connection before handling requests
(async () => {
    await connectToDatabase();
})();
app.get('/api/publications/byCookie/:chocolate', handleGetMyPublications); // DO NOT TOUCH, IT MUST BE HERE, DON'T ASK QUESTIONS
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
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
