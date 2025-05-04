import { client } from '../Database/Mongodb.js';
import { ObjectId } from 'mongodb';
import { sendEmail, getForgotPasswordEmail } from './emailService.js';
import * as crypto from 'crypto';

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
            role: user.role || 'author', // default role if not set
            notificationPreferences: user.notificationPreferences
        });
    } catch (err) {
        console.error('Error in handleProfile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleUpdateRole = async (req, res) => {
    //if (!req.session.user) {
    //    return res.status(403).json({ error: 'Forbidden' });
    //}

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
        if (!req.session.user) {
            return res.status(401).json({ error: 'Please log in' });
        }

        // Check if user is admin
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const currentUser = await collection.findOne({ _id: new ObjectId(req.session.user.id) });
        
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        const users = await collection.find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const handleUpdateUser = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        
        // Update user with notification preferences
        const result = await collection.updateOne(
            { _id: new ObjectId(req.session.user.id) },
            { $set: {
                ...req.body,
                notificationPreferences: {
                    ...(req.body.notificationPreferences || {}),
                    email: {
                        ...req.body.notificationPreferences?.email,
                        newPublications: req.body.notificationPreferences?.email?.newPublications || false,
                        newPosters: req.body.notificationPreferences?.email?.newPosters || false
                    }
                }
            } }
        );

        if (result.modifiedCount > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error in handleUpdateUser:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleUpdatePassword = async (req, res) => {
    try {
        // if (!req.session.user || req.session.user.role !== 'admin') {
        //     return res.status(403).json({ error: 'Forbidden' });
        // }

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        
       
        const enc_password = crypto.createHash('md5').update(password).digest('hex')
        
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { password: enc_password } }
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

export const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const db = client.db('CIRT');
        const collection = db.collection('USERS');
        const user = await collection.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).substring(2, 15);

        // Update user with temporary password
        const hashedTempPassword = crypto.createHash('md5').update(tempPassword).digest('hex')
        
        await collection.updateOne(
            { _id: user._id },
            { $set: { password: hashedTempPassword } }
        );

        // Send email with temporary password
        const emailData = getForgotPasswordEmail(email, tempPassword);
        await sendEmail(email, emailData.subject, emailData.text, emailData.html);

        res.json({ message: 'Password reset email sent successfully' });
    } catch (err) {
        console.error('Error in handleForgotPassword:', err);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
};
