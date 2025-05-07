import { client } from '../Database/Mongodb.js';



// GET handler
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

