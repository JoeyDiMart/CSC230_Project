import { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest } from "./utils/parseRequests.js";

app.post("*", handlePostRequest);
app.get("*", handleGetRequest);
app.delete("*", handleDeleteRequest);
app.put("*", handlePutRequest);