import * as journalService from '../services/journalService.js';
import * as posterService from '../services/posterService.js';
import * as eventService from '../services/eventService.js';
import { client } from "../Database/Mongodb.js";

export const handleDeleteRequest = async (req, res) => {
    console.log("Incoming DELETE request to:", req.path);

    const requestHandlers = {
        '/posters/:id': posterService.handleDelete,
        '/journals/:id': journalService.handleDelete,
        '/events/:id': eventService.handleDelete
    };

    const handler = requestHandlers[req.path];
    if (handler) {
        await handler(req, res);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
};