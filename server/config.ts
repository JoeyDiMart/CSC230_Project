/**
 * @fileoverview Configuration file for SuperTokens authentication and application settings.
 * This file contains all the configuration needed for SuperTokens to work, including
 * API domains, connection URIs, and authentication recipes.
 * 
 * @author CSC230 Team
 * @version 1.0.0
 */

import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { TypeInput } from "supertokens-node/types";

/**
 * Gets the API domain from environment variables
 * This is used to configure where the API server is hosted
 * 
 * @returns {string} The complete API URL including protocol and port
 */
export function getApiDomain() {
    const apiPort = process.env.VITE_APP_API_PORT || 3001;
    const apiUrl = process.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

/**
 * Gets the website domain from environment variables
 * This is used to configure where the frontend application is hosted
 * 
 * @returns {string} The complete website URL including protocol and port
 */
export function getWebsiteDomain() {
    const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

/**
 * SuperTokens Configuration Object
 * This contains all the necessary settings for SuperTokens to function:
 * - Connection details to SuperTokens core
 * - Application information
 * - Authentication recipes (Email/Password, Session, Dashboard, User Roles)
 * 
 * @type {TypeInput}
 */
export const SuperTokensConfig: TypeInput = {
    // Connection to SuperTokens core
    supertokens: {
        connectionURI: "https://try.supertokens.com",
    },
    
    // Application information
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    
    // Authentication recipes
    recipeList: [
        EmailPassword.init(), // Email & password authentication
        Session.init(),       // Session management
        Dashboard.init(),     // Admin dashboard
        UserRoles.init(),     // Role-based access control
    ],
};

// Ensure this is correctly imported in your backend entry file
export default SuperTokensConfig;
