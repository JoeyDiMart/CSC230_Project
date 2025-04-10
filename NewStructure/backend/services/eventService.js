import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';

export const handleCreate = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    if (!['admin', 'publisher'].includes(req.session.user.role)) {
        return res.status(403).json({ error: 'Only administrators and publishers can create events' });
    }

    try {
        const eventCollection = client.db('CIRT').collection('EVENTS');
        const event = {
            eventName: req.body.eventName,
            eventDetails: req.body.eventDetails,
            location: req.body.location,
            isOnline: req.body.isOnline || false,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
            userId: new ObjectId(req.session.user.id),
            createdAt: new Date(),
            status: 'approved' // Events don't need approval like posters
        };
        const result = await eventCollection.insertOne(event);
        res.status(201).json({ 
            message: 'Event created successfully', 
            id: result.insertedId 
        });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Error creating event' });
    }
};

export const handleGetAll = async (req, res) => {
    try {
        const eventCollection = client.db('CIRT').collection('events');
        const events = await eventCollection.find().toArray();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Error fetching events' });
    }
};

export const handleGetByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const eventCollection = client.db('CIRT').collection('events');
        const events = await eventCollection.find({
            startDate: { $gte: new Date(startDate) },
            endDate: { $lte: new Date(endDate) }
        }).toArray();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events by date range:', err);
        res.status(500).json({ error: 'Error fetching events by date range' });
    }
};

export const handleGetById = async (req, res) => {
    try {
        const eventCollection = client.db('CIRT').collection('events');
        const event = await eventCollection.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ error: 'Error fetching event' });
    }
};

export const handleUpdate = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const eventCollection = client.db('CIRT').collection('events');
        const event = await eventCollection.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.userId.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this event' });
        }

        const updateData = {
            eventName: req.body.eventName,
            eventDetails: req.body.eventDetails,
            location: req.body.location,
            isOnline: req.body.isOnline || false,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate)
        };

        await eventCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        res.json({ message: 'Event updated successfully' });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Error updating event' });
    }
};

export const handleDelete = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const eventCollection = client.db('CIRT').collection('events');
        const event = await eventCollection.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.userId.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this event' });
        }

        await eventCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Error deleting event' });
    }
};
