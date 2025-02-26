/////////////////////
// GET HANDLER CODE//
/////////////////////



// Imports
import path from 'path';
import { fileURLToPath } from 'url';

// Main function 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleGetRequest = async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
};

