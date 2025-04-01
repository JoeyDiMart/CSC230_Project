import * as userService from '../services/userService.js';
import * as journalService from '../services/publicationService.js';
import * as posterService from '../services/posterService.js';

export const handlePutRequest = async (req, res) => {
    // User routes
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

    return res.status(404).json({ error: 'Route not found' });
};