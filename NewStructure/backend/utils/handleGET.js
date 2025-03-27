/////////////////////
// GET HANDLER CODE//
/////////////////////

// Imports
import * as userService from '../services/userService.js';
import * as journalService from '../services/journalService.js';
import * as posterService from '../services/posterService.js';
import path from 'path';
import { fileURLToPath } from 'url';

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
            '/issues': journalService.handleGetIssues,  // Fixed function name
            '/review': journalService.handleGetReviews,
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
                await journalService.handleGetManuscript(req, res);
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


import fs from "fs"


let handleGetPhotos = async (req, res) => {
    try {
        const imagePaths = ["/photos/photo1.png", "/photos/photo2.png", "/photos/photo3.png"];
        const imageData = await Promise.all(
            imagePaths.map(async (imgPath) => {
                const filePath = path.join(__dirname, imgPath);
                const imageBuffer = await fs.promises.readFile(filePath);
                return `data:image/png;base64,${imageBuffer.toString("base64")}`; // Correct Base64 format
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
