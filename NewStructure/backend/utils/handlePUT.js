import * as userService from '../services/userService.js';
import * as journalService from '../services/publicationService.js';
import * as posterService from '../services/posterService.js';
import * as eventService from '../services/eventService.js';

export const handlePutRequest = async (req, res) => {
    // User routes
    const passwordMatch = req.path.match(/^\/users\/([^\/]+)\/password$/);
    if (passwordMatch) {
        req.params = { id: passwordMatch[1] };
        await userService.handleUpdatePassword(req, res);
        return;
    }

    const userMatch = req.path.match(/^\/users\/([^\/]+)$/);    
    if (userMatch) {
        req.params = { id: userMatch[1] };
        await userService.handleUpdateUser(req, res);
        return;
    }

    const roleMatch = req.path.match(/^\/role\/([^\/]+)$/);
    if (roleMatch) {
        req.params = { id: roleMatch[1] };
        await userService.handleUpdateRole(req, res);
        return;
    }

    // Journal routes
    const decisionMatch = req.path.match(/^\/([^\/]+)\/decision$/);
    if (decisionMatch) {
        req.params = { id: decisionMatch[1] };
        await journalService.handleDecision(req, res);
        return;
    }

    // Poster routes
    const approveMatch = req.path.match(/^\/posters\/([^\/]+)\/approve$/);
    if (approveMatch) {
        req.params = { id: approveMatch[1] };
        await posterService.handleApprove(req, res);
        return;
    }

    // Event routes
    const updateMatch = req.path.match(/^\/events\/([^\/]+)$/);
    if (updateMatch) {
        req.params = { id: updateMatch[1] };
        await eventService.handleUpdate(req, res);
        return;
    }
    console.log("Incoming PUT request to:", req.path);

    return res.status(404).json({ error: 'Route not found' });
};