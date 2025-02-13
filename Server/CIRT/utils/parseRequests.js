import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function handleGetRequest(req, res) {
    const routes = {
        "/main": "mainPage.html",
        "/login": "loginPage.html",
        "/signup": "signupPage.html",
        "/research": "researchPage.html",
        "/forgotpassword": "forgotpasswordPage.html",
        "/aboutus": "aboutusPage.html",
    };

    const fileName = routes[req.path] || "mainPage.html"; // Default to mainPage.html
    const filePath = path.join(__dirname, "../frontend", fileName);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File send error:", err);
            res.status(err.status || 500).send("Error loading the file");
        }
    });
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
