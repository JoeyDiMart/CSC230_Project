/////////////////////
// MAIN SERVER CODE//
/////////////////////


// Modules Imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {client, connectToDatabase} from "./Database/Mongodb.js";
import cors from 'cors';

// Utils Imports
import { handlePostRequest } from "./utils/handlePOST.js";
import { handleGetRequest } from "./utils/handleGET.js";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a web server
const app = express();

// middle ware
app.use(express.json());
app.use(cors());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(express.json());


// Ensure database connection before handling requests
(async () => {
    await connectToDatabase();
})();

// Start listening on the PORT 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
});

// Send all requests to respective functions
app.post("*", handlePostRequest);
app.get("*", handleGetRequest);
// app.delete("*", handleDeleteRequest); // IN DEVELOPMENT
// app.put("*", handlePutRequest); // IN DEVELOPMENT
