import { useState, useEffect } from "react";
import API_BASE_URL from "../../config.js";


// api.js
export async function fetchUsers() {
  try {
    const response = await fetch("${API_BASE_URL}/api/publications2");
    const data = await response.json();
    console.log("Received publications:", data);
    return data; // ✅ return actual data here
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
