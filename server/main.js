import http from "http";
import https from 'https'; /* For later use */
import express from 'express'// Importing express, middleman between us and Node.js
import {client, connectToDatabase} from "./utils/Mongodb.js";
import { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest } from "./utils/parseRequests.js";
import bcrypt from "bcryptjs";
import cors from "cors";


const app = express(); // Main server object
const PORT = 8080;

// enable cors for all reqyres
// allows for cross-origin requests
app.use(cors());

app.use(express.static('public')) // Making it accessible and reloadable
app.use(express.json()); // Adding parsing jSON capabilities


// ensures datebases connection is established before handling requests
(async () => {
    await connectToDatabase();
})();

// All get, post, delete, and put requests will be handled by their respective functions
app.get("*", handleGetRequest);
app.post("*", handlePostRequest);
app.delete("*", handleDeleteRequest);
app.put("*", handlePutRequest);

console.log()
// user registration
app.post("/signup", async(req,res)=>{
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({error: "email and password are required"});
    }
    try{
        const db = client.db('CIRT');
        console.log("Connected to CIRT database");

        const collection = db.collection('USERS');
        console.log("Using USERS collection");

        // now check if the user already exists
        const existingUser  = await collection.findOne({email: email});
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }
        // hashes password
        const hashPassword = await bcrypt.hash(password,10);

        // insert user into the database
        const result = await collection.insertOne({ email, password: hashPassword });
        console.log("Insert result:", result);
        if (result.insertedId) {
            res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
        } else {
            res.status(400).json({ error: "Failed to register user" });
        }


    } catch(err) {
        console.log(err);
        res.status(400).json({error: 'Internal server error'});
    }

});

// The walls have ears, and they are listening to you
app.listen(PORT, (error) =>{
  if(!error)
      console.log("Server is Successfully Running, and App is listening on port http://localhost:"+ PORT)
  else
      console.log("Error occurred, server can't start", error);
  }
);
