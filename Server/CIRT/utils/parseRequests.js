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
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
    if (pathname === "/main") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
  
      const filePath = path.join(__dirname, "../frontend/index.html"); // Adjust path
  
      // Read and send the file
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          console.log(err)
          return res.end("Error loading the file");
        }
        res.end(data);
      });
  
      return; // Ensure no further execution
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
