import { client } from './Mongodb.js';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import {fileURLToPath} from "url";
// daniel did this no taking credit for Daniel's Work now joey!!!:)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// inserting a photo given a image path and name
export async function insertPhoto(imagePath, imageName) {
    try {
        await client.connect();
        const db = client.db("CIRT");
        const photosCollection = db.collection("PHOTOS");

        // Check if an image with the same name already exists
        const existingImage = await photosCollection.findOne({ name: imageName });

        if (existingImage) {
            console.log("An image with this name already exists. Insertion skipped.");
            return;
        }

        // Read the image file as binary data
        const imgData = fs.readFileSync(imagePath);

        // Create a document to insert
        const imageDocument = {
            name: imageName,
            img: {
                data: imgData,
                // Adjust this based on the actual file type
                contentType: 'image/png'
            },
            _id: new ObjectId(),
            uploadDate: new Date()
        };

        // Insert the image document into the collection
        const result = await photosCollection.insertOne(imageDocument);
        console.log('Image inserted successfully:', result.insertedId);
    } catch (error) {
        console.error("Error inserting image into MongoDB:", error);
    }
}
/*
// example one these are not in database
const imagePath = path.join(__dirname,'uploads','Photos', 'Picture1.jpg'); // Corrected path
insertPhoto(imagePath, 'Pickleball');

const imagePath1 = path.join(__dirname,'uploads','Photos', 'joey.jpg'); // Corrected path
insertPhoto(imagePath1, 'joey');

const imagePath2 = path.join(__dirname,'uploads','Photos', 'gourd-jean.jpg'); // Corrected path
insertPhoto(imagePath2, 'gourd');
*/
// get the image from the database
export async function getImageByName(imageName) {
    try {
        const db = client.db("CIRT");
        const photosCollection = db.collection("PHOTOS");

        // Find the image by its name
        const image = await photosCollection.findOne({ name: imageName });

        if (image) {

            console.log('Image found:', image);
            return image.img.data;
        } else {
            console.log('Image not found');
        }
    } catch (error) {
        console.error('Error retrieving image:', error);
    }
}
