/////////////////////
// GET HANDLER CODE//
/////////////////////
// Imports
import * as userService from '../services/userService.js';
import * as publicationService from '../services/publicationService.js';
import * as posterService from '../services/posterService.js';
import * as eventService from '../services/eventService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {client} from "../Database/Mongodb.js";
import { ObjectId } from 'mongodb';
import fs from "fs"

export {handleGetMyPublications}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleGetRequest = async (req, res) => {
    try {
        console.log('GET Request Path:', req.path, 'Original URL:', req.originalUrl); // Debug log

        const requestHandlers = {
            '/posters/pending': posterService.handleGetPending,
            '/posters/user': posterService.handleGetByUser,
            '/posters/search': posterService.handleSearch,
            '/posters': posterService.handleGetAll,
            '/profile': userService.handleProfile,
            '/issues': publicationService.handleGetIssues,
            '/review': publicationService.handleGetReviews,
           '/api/photos': handleGetPhotos,
            '/api/publications1': handleGetPublications1,
            '/api/publications2': handleGetPublications2,
            '/api/publications3': handleGetPublications3,
            '/check-session': handleCheckSession,
            '/events': eventService.handleGetAll,
            '/events/range': eventService.handleGetByDateRange,
            '/events/subscribe': handleCheckSubscriptionStatus,
            '/api/publications/search': handleSearchPublications,
            '/users': userService.handleGetAll,
            '/api/users/count': handleGetTotalUsers,
            '/api/publications/count': handleGetTotalPublications,
            '/api/views/count': handleGetTotalViews,
            '/api/reviewers/active': handleGetActiveReviewers,
            '/api/fellows': handleGetFellowships,

        };
        //  '/users': userService.handleGetAll, this caused an error
        // Check if the handler exists for this route
        const handler = requestHandlers[req.path];  // Use req.path instead of req.originalUrl
    
        if (handler) {
            console.log('Found handler for route:', req.path); // Debug log
            await handler(req, res);
        } else {
            console.log('No direct handler, checking patterns'); // Debug log

            const posterFileMatch = req.path.match(/^\/posters\/([^/]+)\/file$/);            
            if (posterFileMatch) {
                console.log('Found file handler for poster:', posterFileMatch[1]);
                req.params = { id: posterFileMatch[1] };
                await posterService.handleGetFile(req, res);
                return;
            }

            const posterMatch = req.path.match(/^\/posters\/([^/]+)$/);
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

const handleCheckSubscriptionStatus = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const subscriptionCollection = client.db('CIRT').collection('EVENT_SUBSCRIPTIONS');
        const existingSubscription = await subscriptionCollection.findOne({
            userId: new ObjectId(req.session.user.id)
        });

        if (existingSubscription) {
            res.json({ subscribed: true });
        } else {
            res.json({ subscribed: false });
        }
    } catch (err) {
        console.error('Error checking subscription status:', err);
        res.status(500).json({ error: 'Error checking subscription status' });
    }
};

// photo
const handleGetPhotos = async (req, res) => {
    console.log("✅ handleGetPhotos triggered");
    // Define the path to the photos directory
    const photosDir = path.join(__dirname, '../../photos');
    console.log("Photos directory:", photosDir);
    try {
        // Check if directory exists
        if (!fs.existsSync(photosDir)) {
            console.error("Photos directory does not exist:", photosDir);
            return res.status(500).json({error: "Photos directory not found"});
        }
        
        // Read the photos directory
        fs.readdir(photosDir, (err, files) => {
            if (err) {
                console.error("Error reading photos directory:", err);
                return res.status(500).json({error: "Failed to fetch photos"});
            }
            
            if (!Array.isArray(files)) {
                console.error("Files is not an array:", files);
                return res.status(500).json({error: "Failed to read photos"});
            }
            
            // Filter out non-image files
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
            });
            
            // Map file names to URLs and generate titles
            const photos = imageFiles.map((file) => {
                const title = file.replace(/\.[^/.]+$/, '') // Remove file extension
                    .replace(/[_-]/g, ' '); // Replace underscores/dashes with spaces
                return {
                    name: file,
                    url: `/photos/${file}`, // Assuming static files are served from this path
                    title: title
                };
            });
            
            console.log(`Found ${photos.length} photos`);
            res.status(200).json(photos);
        });
    }
    catch (error) {
        console.error("Error in handleGetPhotos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// only accepted
let handleGetPublications1 = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('PUBLICATIONS');

        const publications = await collection.find({ status: "accepted" })
            .sort({ _id: -1 }) // Sort newest first
            .limit(10)         // Only 10
            .toArray();

        if (publications.length === 0) {
            return res.status(404).json({ message: "No accepted publications found" });
        }

        // Convert thumbnail Buffer to base64 string for rendering
        publications.forEach(pub => {
            if (pub.thumbnail && Buffer.isBuffer(pub.thumbnail)) {
                pub.thumbnail = `data:image/png;base64,${pub.thumbnail.toString('base64')}`;
            }
        });

        res.json(publications);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};


// all ?
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

        // Convert Buffer thumbnail to base64 string
        publications.forEach(pub => {
            if (pub.thumbnail && Buffer.isBuffer(pub.thumbnail)) {
                pub.thumbnail = `data:image/png;base64,${pub.thumbnail.toString('base64')}`;
            }
        });

        res.json(publications);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};



// under review publications
let handleGetPublications3 = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('PUBLICATIONS');

        const publications = await collection.aggregate([
            { $match: { status: "under review" } },
            { $sample: { size: 10 } }
        ]).toArray();

        if (publications.length === 0) {
            return res.status(404).json({ message: "No under review publications found" });
        }

        // Convert thumbnail buffer to base64 string
        publications.forEach(pub => {
            if (pub.thumbnail && Buffer.isBuffer(pub.thumbnail)) {
                pub.thumbnail = `data:image/png;base64,${pub.thumbnail.toString('base64')}`;
            }
        });

        res.json(publications);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};


const handleGetMyPublications = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const userCollection = db.collection("USERS");
        const publicationCollection = db.collection('PUBLICATIONS');

        const cookie = req.params.chocolate;
        
        if (!cookie) {
            return res.status(400).json({ message: "cookie is required" });
        }

        const users = await userCollection.find({ connectionChocolateCookie: req.params.chocolate }).limit(2).toArray();

      
        if (users.length === 0) {
            return res.status(404).json({ message: "No user found with this cookie" });
        }

        const email = users[0].email;

        const publications = await publicationCollection.find({ email }).toArray();

        publications.forEach(pub => {
            if (pub.thumbnail && Buffer.isBuffer(pub.thumbnail)) {
                pub.thumbnail = `data:image/png;base64,${pub.thumbnail.toString('base64')}`;
            }
        });

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

const handleGetActiveReviewers = async (req, res) => {
    console.log("Fetching active reviewers...");
    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');

        // Count the total number of users with the role "reviewer"
        const total = await collection.countDocuments({ role: "reviewer" });
        console.log(total)
        res.status(200).json({ total });
    } catch (err) {
        console.error("Error fetching active reviewers:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET handler
export const handleGetFellowships = async (req, res) => {
    console.log("📸 handleGetFellowships triggered...");
    try {
        const db = client.db("CIRT");
        const collection = db.collection("FELLOWS");
        // Check if the collection has any documents
        const count = await collection.countDocuments();
        if (count === 0) {
            console.log("No fellowships found in the database.");
            return; // Exit early without doing anything
        }
        // Fetch fellowships with their photos
        const fellowships = await collection.find({}).toArray();

        if (!fellowships.length) {
            return res.status(404).json({ error: "No fellowships found" });
        }

        // Directory to save decoded images
        const outputDir = path.join(__dirname, "../FellowImages");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Map the data to include all fields and decode photos
        const formattedFellowships = fellowships.map(fellowship => {
            let photoPath = null;

            if (fellowship.photo) {
                const buffer = Buffer.from(fellowship.photo, "base64");
                photoPath = path.join(outputDir, `${fellowship.name.replace(/\s+/g, "_")}.png`);
                fs.writeFileSync(photoPath, buffer);

                // 🔥 Delete after 60 seconds
                setTimeout(() => {
                    fs.unlink(photoPath, (err) => {
                        if (err) {
                            console.error("Failed to delete temp photo:", photoPath, err);
                        } else {
                            console.log("✅ Temp photo deleted:", photoPath);
                        }
                    });
                }, 60000); // 60 seconds
            }

            return {
                name: fellowship.name,
                year: fellowship.year,
                bio: fellowship.bio,
                photo: photoPath ? `/FellowImages/${path.basename(photoPath)}` : null,
                publicationLink: fellowship.publicationLink,
                topic: fellowship.topic,
                collaborators: fellowship.collaborators,
                isMyFellowship: fellowship.isMyFellowship || false,
            };
        });

        console.log("✅ Photos decoded and saved successfully:", formattedFellowships);

        res.status(200).json(formattedFellowships);
    } catch (error) {
        console.error("💥 Error fetching fellowship photos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};