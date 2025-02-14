/**
 * @fileoverview Main entry point for the File Management System server.
 * This file sets up the Express server with SuperTokens authentication,
 * CORS configuration, and API routes.
 * 
 * @author CSC230 Team
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supertokens from 'supertokens-node';
import { middleware, errorHandler } from 'supertokens-node/framework/express';
import { SuperTokensConfig } from './config';  // SuperTokens configuration
import apiRouter from './api';  // API routes

// Load environment variables from .env file
dotenv.config();

/**
 * Initialize SuperTokens with the configuration from config.ts
 * This sets up all authentication recipes and connection details
 */
supertokens.init(SuperTokensConfig);

/**
 * Create Express application instance
 * @type {express.Application}
 */
const app = express();

/**
 * Middleware Setup
 * 1. JSON parser for request bodies
 * 2. Request logger for debugging
 * 3. CORS for cross-origin requests
 * 4. SuperTokens middleware for authentication
 */
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log(`Headers:`, req.headers);
    console.log(`Body:`, req.body);
    next();
});

// Enable CORS for all routes
app.use(cors());

// SuperTokens authentication middleware
app.use(middleware());

/**
 * Mount API Routes
 * All routes under /api will be handled by the apiRouter
 */
app.use('/api', apiRouter);

/**
 * Error Handling
 * SuperTokens error handler must be the last middleware
 */
app.use(errorHandler());

/**
 * Server Initialization
 * Start the Express server on the specified port
 * Default to port 3000 if not specified in environment
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
