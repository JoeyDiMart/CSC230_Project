/**
 * User Service - Business Logic for User Management
 * 
 * This file contains all the core functionality for user operations:
 * - Profile management
 */

import { client } from './Mongodb.js';

/**
 * Get user profile by ID
 * @param {string} userId - User's ID
 * @returns {Object} User profile data
 */
export const getUserProfile = async (userId) => {
    const db = client.db('CIRT');
    const user = await db.collection('USERS').findOne(
        { _id: userId },
        { projection: { password: 0 } } // Exclude password from results
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

/**
 * Update user profile
 * @param {string} userId - User's ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Update result
 */
export const updateUserProfile = async (userId, updateData) => {
    const db = client.db('CIRT');
    
    // Only allow certain fields to be updated
    const allowedUpdates = ['email', 'role'];
    const updates = {};

    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = updateData[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        throw new Error("No valid updates provided");
    }

    const result = await db.collection('USERS').updateOne(
        { _id: userId },
        { $set: updates }
    );

    if (result.matchedCount === 0) {
        throw new Error("User not found");
    }

    return { message: "Profile updated successfully" };
};

/**
 * Delete user by ID
 * @param {string} userId - User's ID
 * @returns {Object} Deletion result
 */
export const deleteUser = async (userId) => {
    const db = client.db('CIRT');
    const result = await db.collection('USERS').deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
        throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
};
