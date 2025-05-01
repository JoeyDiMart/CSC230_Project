import * as userService from '../services/userService.js';
import * as posterService from '../services/posterService.js';
import * as eventService from '../services/eventService.js';
import * as journalService from "../services/publicationService.js";

export const handlePutRequest = async (req, res) => {
    const path = req.path.replace(/^\/api/, '');
    console.log("🟡 PUT Request received on path:", req.path);
    console.log("🔧 Stripped API prefix path:", path);

    // User routes
    const passwordMatch = path.match(/^\/users\/([^\/]+)\/password$/);
    if (passwordMatch) {
        req.params = { id: passwordMatch[1] };
        await userService.handleUpdatePassword(req, res);
        return;
    }

    const userMatch = path.match(/^\/users\/([^\/]+)$/);
    if (userMatch) {
        req.params = { id: userMatch[1] };
        await userService.handleUpdateUser(req, res);
        return;
    }

    const roleMatch = path.match(/^\/role\/([^\/]+)$/);
    if (roleMatch) {
        req.params = { id: roleMatch[1] };
        await userService.handleUpdateRole(req, res);
        return;
    }

    // Journal routes
    const decisionMatch = path.match(/^\/([^\/]+)\/decision$/);
    if (decisionMatch) {
        req.params = { id: decisionMatch[1] };
        await journalService.handleDecision(req, res);
        return;
    }

    const statusMatch = path.match(/^\/publications\/([^\/]+)\/status$/);
    if (statusMatch) {
        req.params = { id: statusMatch[1] };
        await journalService.handleUpdateStatus(req, res);
        return;
    }

    const replaceFileMatch = path.match(/^\/publications\/([^\/]+)\/replace-file$/);
    if (replaceFileMatch) {
        console.log('Matched /replace-file route:', replaceFileMatch); // Debug statement
        req.params = { id: replaceFileMatch[1] };
        // Run multer middleware manually
        journalService.upload.single('file')(req, res, function (err) {
            if (err) {
                return res.status(400).json({error: err.message});
            }
            journalService.handleReplaceFile(req, res);
        });
        return;
    }

    const commentsMatch = path.match(/^\/publications\/([^\/]+)\/comments$/);
    if (commentsMatch) {
        req.params = { id: commentsMatch[1] };
        await journalService.handleUpdateComments(req, res);
        return;
    }
    // Poster routes
    const approveMatch = path.match(/^\/posters\/([^\/]+)\/approve$/);
    if (approveMatch) {
        req.params = { id: approveMatch[1] };
        await posterService.handleApprove(req, res);
        return;
    }


    // Event routes
    const updateMatch = path.match(/^\/events\/([^\/]+)$/);
    if (updateMatch) {
        req.params = { id: updateMatch[1] };
        await eventService.handleUpdate(req, res);
        return;
    }
    console.log("Incoming PUT request to:", req.path);

    return res.status(404).json({ error: 'Route not found' });
};