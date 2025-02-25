import { handlePostRequest } from "./utils/handlePOST";

app.post("*", handlePostRequest);
app.get("*", handleGetRequest);
app.delete("*", handleDeleteRequest);
app.put("*", handlePutRequest);