// `backend/services/fellowshipService.js`
import { client } from '../Database/Mongodb.js';
import multer from 'multer';


export const handleGetFellowships = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('FELLOWS');
        const { userId } = req.query;

        const query = userId ? { createdBy: userId } : {};
        const fellowships = await collection.find(query).toArray();

        res.status(200).json(fellowships);
    } catch (err) {
        console.error("Error fetching fellowships:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const handleCreateFellowship = async (req, res) => {
    try {
        console.log("🔍 Starting handleCreateFellowship...");

        const db = client.db("CIRT");
        const collection = db.collection("FELLOWS");
        console.log("✅ Connected to database and collection");

        const { name, year, bio, publicationLink, topic, collaborators, isMyFellowship } = req.body;
        console.log("📥 Request body:", req.session.user.name);

        if (!name || !year || !bio || !publicationLink) {
            console.log("❌ Validation failed. Missing required fields:");
            console.log("name:", req);
            console.log("year:", year);
            console.log("bio:", bio);
            console.log("publicationLink:", publicationLink);

            return res.status(400).json({ error: "All fields are required" });
        }

        const newFellowship = {
            name,
            year,
            bio,
            publicationLink,
            topic,
            collaborators,
            isMyFellowship: isMyFellowship === "true",
            createdAt: new Date(),
        };

        console.log("🆕 New fellowship object:", newFellowship);

        const result = await collection.insertOne(newFellowship);
        console.log("✅ Inserted into database. Result:", result);

        res.status(201).json({ message: "Fellowship created successfully", id: result.insertedId });
        console.log("🎉 Fellowship creation successful!");
    } catch (err) {
        console.error("❌ Error creating fellowship:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};