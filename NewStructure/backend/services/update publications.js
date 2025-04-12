import { client } from "../Database/Mongodb.js";
import { ReviewStatus } from "../Database/schemas.js";
import { ObjectId } from "mongodb";

export async function updateReviewStatus(publicationId, newStatus) {
    // Validate that the new status is a valid ReviewStatus
    if (!Object.values(ReviewStatus).includes(newStatus)) {
        console.error(`Invalid review status: ${newStatus}`);
        return { success: false, message: `Invalid review status: ${newStatus}` };
    }

    try {
        // Connect to MongoDB
        const db = client.db("CIRT");
        const collection = db.collection("PUBLICATIONS");

        // Update the publication's review status
        const result = await collection.updateOne(
            { _id: new ObjectId(publicationId) },
            { $set: { reviewed: newStatus } }
        );

        // Check if the publication was found and updated
        if (result.matchedCount === 0) {
            console.error("Publication not found");
            return { success: false, message: "Publication not found" };
        }

        console.log("Review status updated successfully");
        return { success: true, message: "Review status updated successfully" };
    } catch (error) {
        console.error("Error updating review status:", error);
        return { success: false, message: "Failed to update review status" };
    }
}

// Example: Manual ID and status update // todo get rid at end
const publicationId = "67f94b158e81bb38135db732";
const newStatus = "accepted";

// Call the function to update the review status
updateReviewStatus(publicationId, newStatus).then(response => {
    console.log(response);
});