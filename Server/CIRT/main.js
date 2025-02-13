import http from "http";
import https from 'https'; /* For later use */ 
import express from 'express'// Importing express, middleman between us and Node.js

import { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest } from "./utils/parseRequests.js";

const app = express(); // Main server object
const PORT = 8080

app.use(express.static('public')) // Making it accessible and reloadable
app.use(express.json()); // Adding parsing jSON capabilities

// All get, post, delete, and put requests will be handled by their respective functions
app.get("*", handleGetRequest);
app.post("*", handlePostRequest);
app.delete("*", handleDeleteRequest);
app.put("*", handlePutRequest);

// The walls have ears, and they are listening to you
app.listen(PORT, (error) =>{
  if(!error)
      console.log("Server is Successfully Running, and App is listening on port http://localhost:"+ PORT)
  else 
      console.log("Error occurred, server can't start", error);
  }
);
