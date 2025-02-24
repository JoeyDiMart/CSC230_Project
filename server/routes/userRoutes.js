/**
 * User Routes - Handles all user-related endpoints
 * 
 * This file manages all the routes for user operations like:
 * - Profile management
 */

import express from 'express';
import { getUserProfile, updateUserProfile, deleteUser } from '../utils/userService.js';
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb

const router = express.Router();

/**
 * Authentication Middleware
 * Makes sure user is logged in before accessing protected routes
 * Uses sessions instead of JWT tokens for simplicity and security
 */
const authenticate = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Please log in' });
    }
};



/**
 * Get User Profile
 * GET /api/users/profile
 * Returns the current user's profile info
 * Protected route - requires authentication
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const profile = await getUserProfile(ObjectId(req.session.user.id)); // Update to use ObjectId
        res.json(profile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Update User Profile
 * PUT /api/users/profile
 * Body: { email, ... other profile fields }
 * Protected route - requires authentication
 */
router.put('/profile', authenticate, async (req, res) => {
    try {
        const result = await updateUserProfile(ObjectId(req.session.user.id), req.body); // Update to use ObjectId
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete user (admin only)
router.delete('/:userId', authenticate, async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await deleteUser(ObjectId(userId)); // Update to use ObjectId
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router;
