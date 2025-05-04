import { useState, useEffect } from "react";


// api.js
export async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:8081/api/publications2");
    const data = await response.json();
    console.log("Received publications:", data);
    return data; // ✅ return actual data here
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
