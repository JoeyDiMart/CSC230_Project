import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';

export const handleSubscribe = async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        // Safely handle potential missing user ID
        const userId = req.session.user.id;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid user session' });
        }
        
        // Get the subscription collection
        const subscriptionCollection = client.db('CIRT').collection('EVENT_SUBSCRIPTIONS');
        
        // Check if user is already subscribed
        try {
            const existingSubscription = await subscriptionCollection.findOne({
                userId: new ObjectId(userId)
            });

            if (existingSubscription) {
                return res.status(200).json({ 
                    message: 'Already subscribed to events',
                    subscribed: true
                });
            }
        } catch (findError) {
            // If there's an error checking for existing subscription, log it but continue
            console.error('Error checking existing subscription:', findError);
        }

        // Create new subscription
        const subscription = {
            userId: new ObjectId(userId),
            subscribedAt: new Date()
        };

        // Insert the subscription
        await subscriptionCollection.insertOne(subscription);
        
        // Return success response
        return res.status(200).json({ 
            message: 'Successfully subscribed to events',
            subscribed: true
        });
    } catch (err) {
        console.error('Error subscribing to events:', err);
        return res.status(500).json({ error: 'Error subscribing to events' });
    }
}

export const handleUnsubscribe = async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        // Safely handle potential missing user ID
        const userId = req.session.user.id;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid user session' });
        }
        
        // Get the subscription collection
        const subscriptionCollection = client.db('CIRT').collection('EVENT_SUBSCRIPTIONS');
        
        // Delete the subscription
        try {
            const result = await subscriptionCollection.deleteOne({
                userId: new ObjectId(userId)
            });

            if (result.deletedCount === 0) {
                return res.status(200).json({ 
                    message: 'Not subscribed to events',
                    subscribed: false
                });
            }
            
            return res.status(200).json({ 
                message: 'Successfully unsubscribed from events',
                subscribed: false
            });
        } catch (deleteError) {
            console.error('Error deleting subscription:', deleteError);
            return res.status(500).json({ error: 'Error unsubscribing from events' });
        }
    } catch (err) {
        console.error('Error unsubscribing from events:', err);
        return res.status(500).json({ error: 'Error unsubscribing from events' });
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
