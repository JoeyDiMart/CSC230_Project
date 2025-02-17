import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection URI
const uri = "mongodb+srv://CIRTDATABASE:CIRT@cirtdatabase.cu1vp.mongodb.net/?retryWrites=true&w=majority&appName=CIRTDATABASE";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Function to connect to the database
async function connectToDatabase() {
    try {
        await client.connect(); // Connect to the server
        console.log("Connected to Database");
        // Ping to confirm successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Export the client and connectToDatabase function for reuse
export { client, connectToDatabase };
