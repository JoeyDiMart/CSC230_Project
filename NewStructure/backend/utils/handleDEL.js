import * as posterService from '../services/posterService.js';

export const handleDeleteRequest = async (req, res) => {
    // Poster routes
    const posterMatch = req.path.match(/^\/posters\/([^\/]+)$/);
    if (posterMatch) {
        req.params = { id: posterMatch[1] };
        await posterService.handleDelete(req, res);
        return;
    }

    return res.status(404).json({ error: 'Route not found' });
};