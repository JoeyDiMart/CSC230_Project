/////////////////////
// GET HANDLER CODE//
/////////////////////

// Imports
import * as userService from '../services/userService.js';
import * as publicationService from '../services/publicationService.js';
import * as posterService from '../services/posterService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {client} from "../Database/Mongodb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleGetRequest = async (req, res) => {
    try {
        console.log('GET Request Path:', req.path, 'Original URL:', req.originalUrl); // Debug log

        const requestHandlers = {
            '/posters/pending': posterService.handleGetPending,
            '/posters': posterService.handleGetAll,
            '/users': userService.handleGetAll,
            '/profile': userService.handleProfile,  // Fixed function name
            '/issues': publicationService.handleGetIssues,  // Fixed function name
            '/review': publicationService.handleGetReviews,
            '/api/photos': handleGetPhotos,
            '/check-session': handleCheckSession
        };
    
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

            const manuscriptMatch = req.path.match(/^\/([^\/]+)$/);
            if (manuscriptMatch && manuscriptMatch[1] !== 'favicon.ico') {
                req.params = { id: manuscriptMatch[1] };
                await publicationService.handleGetManuscript(req, res);
                return;
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
        
        const photo1 = await collection.findOne({ name : 'photo1' });  
        const photo2 = await collection.findOne({ name : 'photo2' });  
        const photo3 = await collection.findOne({ name : 'photo3' });  
        const images = [photo1, photo2, photo3];

        const imageData = await Promise.all(
            images.map(async (image) => {
                let imag = (image.img.data) 
                imag = (JSON.stringify(imag)).replace('Binary.createFromBase64("', "").replace('", 0)',"")
                imag = imag.replace(/^"|"$/g, "");
                return `data:image/png;base64,${imag}`; // Correct Base64 format
            })
        );

        
        res.json(imageData); // Send Base64-encoded images as JSON
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

const handleCheckSession = async (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({
            user: {
                name: req.session.user.name,
                role: req.session.user.role
            }
        });
    }
    return res.status(401).json({ message: 'No active session' });
};

