import { useState, useEffect } from "react";
import API_BASE_URL from "../../config.js";


// api.js
export const fetchUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/api/publications2`);

  if (!res.ok) {
    throw new Error("Failed to fetch publications");
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("Expected array but got:", data);
    throw new Error("Invalid data format");
  }

  return data;
};
