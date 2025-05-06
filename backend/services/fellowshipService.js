// `backend/services/fellowshipService.js`
import { client } from '../Database/Mongodb.js';

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

// `backend/services/fellowshipService.js`
export const handleCreateFellowship = async (req, res) => {
    try {
        const db = client.db('CIRT');
        const collection = db.collection('FELLOWS');
        console.log("Creating fellowship with data:", req.body);
        const { title, description, startDate, endDate, participants, createdBy } = req.body;

        const newFellowship = {
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            participants,
            createdBy,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newFellowship);
        res.status(201).json({ message: "Fellowship created successfully", id: result.insertedId });
    } catch (err) {
        console.error("Error creating fellowship:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};