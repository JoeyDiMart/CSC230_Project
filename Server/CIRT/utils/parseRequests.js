import http from "http";
import path from "path"
import fs from "fs"; 
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMain() {
  return "NIHUYA";
}

async function handleGetRequest(req, res) {
    console.log("REQUEST");
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    switch (pathname) {
        case "/main": {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");

            const filePath = path.join(__dirname, "../frontend/index.html"); // Adjust path

            // Read and send the file
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    console.error("File read error:", err);
                    return res.end("Error loading the file");
                }
                res.end(data);
            });

            return;
        }

        case "/secret":{
          res.statusCode = 202
          res.setHeader("Content-Type", "text/plain");
          res.end("You have found Daniels lair, have a cake 🎂");

        }

        default: {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end("Page Not Found");
        }
    }
}





async function handlePostRequest(req, res) {
  res.statusCode = 500;
  return res.end("Unable to create record");
}

async function handleDeleteRequest(req, res) {
  res.statusCode = 500;
  return res.end("Unable to delete record");
}

async function handlePutRequest(req, res) {
  res.statusCode = 500;
  return res.end("Unable to put record");
}

// Export functions for ES Module usage
export { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest };
