/////////////////////
// GET HANDLER CODE//
/////////////////////
// http://localhost:8081/api/publications
// Imports
import * as userService from '../services/userService.js';
import * as publicationService from '../services/publicationService.js';
import * as posterService from '../services/posterService.js';
import * as eventService from '../services/eventService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {client} from "../Database/Mongodb.js";
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleGetRequest = async (req, res) => {
    try {
        console.log('GET Request Path:', req.path, 'Original URL:', req.originalUrl); // Debug log

        const requestHandlers = {
            '/posters/pending': posterService.handleGetPending,
            '/posters': posterService.handleGetAll,
            '/profile': userService.handleProfile,
            '/issues': publicationService.handleGetIssues,
            '/review': publicationService.handleGetReviews,
            '/api/photos': handleGetPhotos,
            '/api/publications1': handleGetPublications1,
            '/api/publications2': handleGetPublications2,
            '/api/publications/byEmail': handleGetMyPublications,
            '/check-session': handleCheckSession,
            '/events': eventService.handleGetAll,
            '/events/range': eventService.handleGetByDateRange,
            '/api/publications/search': handleSearchPublications,
            '/users': userService.handleGetAll,
            '/api/users/count': handleGetTotalUsers,
            '/api/publications/count': handleGetTotalPublications,
            '/api/views/count': handleGetTotalViews,


        };
        //  '/users': userService.handleGetAll, this caused an error

        // Check if the handler exists for this route
        const handler = requestHandlers[req.path];  // Use req.path instead of req.originalUrl
    
        if (handler) {
            console.log('Found handler for route:', req.path); // Debug log
            await handler(req, res);
        } else {
            console.log('No direct handler, checking patterns'); // Debug log

            const posterMatch = req.path.match(/^\/posters\/([^\/]+)$/);
            if (posterMatch) {
                console.log('Found handler for route:', req.path); // Debug log
                req.params = { id: posterMatch[1] };
                await posterService.handleGetById(req, res);
                return;
            }

            const emailMatch = req.path.match(/^\/api\/publications\/byEmail\/([^\/]+)$/);
            if (emailMatch) {
                req.params = { email: decodeURIComponent(emailMatch[1]) };
                await handleGetMyPublications(req, res);
                return;
            }


            // CHATGPT SUGGESTION
            const knownApiRoutes = Object.keys(requestHandlers);
            const isApiRoute = knownApiRoutes.includes(req.path);
            const isStaticAsset =
                req.path.startsWith('/static') ||
                req.path.endsWith('.js') ||
                req.path.endsWith('.css') ||
                req.path.endsWith('.ico');

            if (!isApiRoute && !isStaticAsset) {
                console.log("Serving frontend for unmatched route:", req.path);
                return res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'), err => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).json({ error: 'Error serving frontend' });
                    }
                });
            }


            // Default route - serve frontend
            res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'), err => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ error: 'Error serving frontend' });
                }
            });
        }
    } catch (error) {
        console.error('Error handling GET request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


let handleGetPhotos = async (req, res) => {
    try {
        const db = client.db('CIRT');  // connect to database
        const collection = db.collection('PHOTOS');  // link to PHOTOS section of database


        // Fetch three random photos instead of fixed names
        const photos = await collection.aggregate([{ $sample: { size: 3 } }]).toArray();

        if (photos.length === 0) {
            return res.status(404).json({ message: "No photos found" });
        }

        // Convert binary data to Base64
        const imageData = photos
            .filter(photo => photo?.img?.data) // Ensure valid data exists
            .map(photo => {
                return `data:image/png;base64,${photo.img.data.toString('base64')}`;
            });

        res.json(imageData); // Send Base64-encoded images as JSON
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

let handleGetPublications1 = async (req, res) => {
    try {
        const db = client.db('CIRT'); 
        const collection = db.collection('PUBLICATIONS'); 

        const publications = await collection.aggregate([
            { $match: { status: "accepted" } },      
            { $sample: { size: 10 } }                  
        ]).toArray();

        if (publications.length === 0) {
            return res.status(404).json({ message: "No accepted publications found" });
        }
        res.json(publications);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

let handleGetPublications2 = async (req, res) => {
    try {
        const db = client.db('CIRT');  
        const collection = db.collection('PUBLICATIONS');  

        const publications = await collection.aggregate([     
            { $sample: { size: 10 } }                  
        ]).toArray();

        if (publications.length === 0) {
            return res.status(404).json({ message: "No accepted publications found" });
        }

        res.json(publications);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};


const handleGetMyPublications = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('PUBLICATIONS');
        const email = req.params.email;
        console.log("The myPub body: ", req.body);

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const publications = await collection.find({ email }).toArray();

        if (!publications.length) {
            return res.status(404).json({ message: "No publications found for this user" });
        }
        res.json(publications);
    } catch (err) {
        console.error("Error in handleGetMyPublications:", err);
        res.sendStatus(500);
    }
};

const handleCheckSession = async (req, res) => {
    if (req.session && req.session.user ) {
        return res.status(200).json({
            user: {
                name: req.session.user.name,
                email: req.session.user.email,
                role: req.session.user.role
                
            }
        });
    }
    return res.status(401).json({ message: 'No active session' });
};


// search for the filter in the database and send it to frontend
const handleSearchPublications = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('PUBLICATIONS');

        const { title, author, keyword } = req.query;

        let query = {};

        if (title) query.title = { $regex: title, $options: "i" };
        if (author) query.author = { $regex: author, $options: "i" };
        if (keyword) query.keywords = { $regex: keyword, $options: "i" };

        const publications = await collection.find(query).toArray();

        if (publications.length === 0) {
            return res.status(404).json({ message: "No matching publications found." });
        }

        res.status(200).json(publications);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Error searching publications." });
    }
};

// gets total publications
const handleGetTotalPublications = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('PUBLICATIONS');

        // Count the total number of documents in the PUBLICATIONS collection
        const total = await collection.countDocuments();

        res.status(200).json({ total });
    } catch (err) {
        console.error("Error fetching total publications:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// gets total views
const handleGetTotalViews = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('VIEWS');

        // Aggregate the total views (assuming a `count` field exists)
        const totalViews = await collection.aggregate([
            { $group: { _id: null, total: { $sum: "$count" } } }
        ]).toArray();

        const total = totalViews.length > 0 ? totalViews[0].total : 0;

        res.status(200).json({ total });
    } catch (err) {
        console.error("Error fetching total views:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleGetTotalUsers = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');

        // Count the total number of documents in the USERS collection
        const totalUsers = await collection.countDocuments();

        res.status(200).json({ total: totalUsers });
    } catch (err) {
        console.error("Error fetching total users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
