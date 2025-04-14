import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';

export const handleProfile = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const user = await collection.findOne({ _id: new ObjectId(req.session.user.id) });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ 
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'author' // default role if not set
        });
    } catch (err) {
        console.error('Error in handleProfile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleUpdateRole = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { role } = req.body;
    if (!['author', 'reviewer', 'publisher', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { role } }
        );

        if (result.modifiedCount > 0) {
            res.json({ message: 'Role updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleGetAll = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const users = await collection.find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const handleUpdateUser = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { name: req.body.name, email: req.body.email, role: req.body.role } }
        );
        if (result.modifiedCount > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleUpdatePassword = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        
       

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { password: password } }
        );

        if (result.modifiedCount > 0) {
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error in handleUpdatePassword:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

