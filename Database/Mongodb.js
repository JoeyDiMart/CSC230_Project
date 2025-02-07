const { MongoClient } = require('mongodb')

// MongoDB connection URI
const uri = 'mongodb+srv://CIRTDATABASE:CIRT@cirtdatabase.cu1vp.mongodb.net/?retryWrites=true&w=majority&appName=CIRTDATABASE'

const client = new MongoClient(uri);

// connect to the database
async function connectToDatabase() {
    try{
        await client.connect();
        console.log("Connected to Database");
    }
    catch(err){
        console.log("MongoDB connection error:", err);
    }

}

module.exports = {client, connectToDatabase};

