import * as posterService from '../services/posterService.js';
import * as eventService from '../services/eventService.js';
import { client } from "../Database/Mongodb.js";

export const handleDeleteRequest = async (req, res) => {
    console.log("Incoming DELETE request to:", req.path);

    const requestHandlers = {
        '/posters/:id': posterService.handleDelete,
    };

    const handler = requestHandlers[req.path];


    if (handler) {
        await handler(req, res);
    } else {
        const eventsMatch = req.path.match(/^\/events\/([^\/]+)$/);
        if (eventsMatch) {
            req.params = { id: eventsMatch[1] };
            return eventService.handleDelete(req, res);
        }

        res.status(404).json({ error: 'Not found' });
    }
};