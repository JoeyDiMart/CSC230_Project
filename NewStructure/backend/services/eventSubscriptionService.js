import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';

export const handleSubscribe = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const subscriptionCollection = client.db('CIRT').collection('EVENT_SUBSCRIPTIONS');
        const existingSubscription = await subscriptionCollection.findOne({
            userId: new ObjectId(req.session.user.id)
        });

        if (existingSubscription) {
            return res.status(400).json({ error: 'Already subscribed to events' });
        }

        const subscription = {
            userId: new ObjectId(req.session.user.id),
            subscribedAt: new Date()
        };

        await subscriptionCollection.insertOne(subscription);
        res.json({ message: 'Successfully subscribed to events' });
    } catch (err) {
        console.error('Error subscribing to events:', err);
        res.status(500).json({ error: 'Error subscribing to events' });
    }
};

export const handleUnsubscribe = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const subscriptionCollection = client.db('CIRT').collection('EVENT_SUBSCRIPTIONS');
        const result = await subscriptionCollection.deleteOne({
            userId: new ObjectId(req.session.user.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Not subscribed to events' });
        }

        res.json({ message: 'Successfully unsubscribed from events' });
    } catch (err) {
        console.error('Error unsubscribing from events:', err);
        res.status(500).json({ error: 'Error unsubscribing from events' });
    }
};

export const getSubscribedUsers = async () => {
    try {
        const subscriptionCollection = client.db('CIRT').collection('EVENT_SUBSCRIPTIONS');
        const subscriptions = await subscriptionCollection.find().toArray();
        return subscriptions;
    } catch (err) {
        console.error('Error getting subscribed users:', err);
        throw err;
    }
};
