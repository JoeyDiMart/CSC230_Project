import { client } from './Mongodb.js';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inserting a publication given a file path and publication name
export async function insertPublication(filePath, publicationName, contentType) {
    try {
        await client.connect();
        const db = client.db("CIRT");
        const publicationsCollection = db.collection("PUBLICATIONS");

        // Check if a publication with the same name already exists
        const existingPublication = await publicationsCollection.findOne({ name: publicationName });

        if (existingPublication) {
            console.log("A publication with this name already exists. Insertion skipped.");
            return;
        }

        // Read the file as binary data
        const fileData = fs.readFileSync(filePath);

        // Create a document to insert
        const publicationDocument = {
            name: publicationName,
            file: {
                data: fileData,
                // Set based on file type (e.g., application/pdf, text/plain)
                contentType: contentType
            },
            _id: new ObjectId(),
            uploadDate: new Date()
        };

        // Insert the publication document into the collection
        const result = await publicationsCollection.insertOne(publicationDocument);
        console.log('Publication inserted successfully:', result.insertedId);
    } catch (error) {
        console.error("Error inserting publication into MongoDB:", error);
    }
}

// Example publications
const pubPath1 = path.join(__dirname, 'uploads', 'Publications', 'esp_wroom_32_datasheet_en.pdf');
insertPublication(pubPath1, 'espWroom', 'application/pdf');


// Retrieve a publication by name
export async function getPublicationByName(publicationName) {
    try {
        const db = client.db("CIRT");
        const publicationsCollection = db.collection("PUBLICATIONS");

        // Find the publication by its name
        const publication = await publicationsCollection.findOne({ name: publicationName });

        if (publication) {
            console.log('Publication found:', publication);
            return publication.file.data;
        } else {
            console.log('Publication not found');
        }
    } catch (error) {
        console.error('Error retrieving publication:', error);
    }
}
getPublicationByName('espWroom')