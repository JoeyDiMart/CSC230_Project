  // url = new URL(req.http)
  // url host = url.hostname; // example.com
  // const pathname = url.pathname; // /p/a/t/h
  // const searchParams = url.searchParams; // {query: 'string'}

  import http from "http";
  import https from 'https'; /* For later use */
  import { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest } from "./utils/parseRequests.js";
  
  const server = http.createServer((req, res) => {
    const { method } = req;
  
    switch (method) {
      case "GET":
        return handleGetRequest(req, res);
      case "POST":
        return handlePostRequest(req, res);
      case "DELETE":
        return handleDeleteRequest(req, res);
      case "PUT":
        return handlePutRequest(req, res);
      default:
        res.writeHead(405);
        res.end(`Unsupported request method: ${method}`);
    }
  });
  
  server.listen(8080, () => {
    console.log(`Server is listening on: http://localhost:8080`);
  });
  