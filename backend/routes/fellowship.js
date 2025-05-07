import express from "express";
import { handleCreateFellowship, handleGetFellowships, uploadMiddleware } from "../services/fellowshipService.js";

const router = express.Router();

router.get("/", handleGetFellowships);
router.post("/upload", uploadMiddleware, handleCreateFellowship);

export default router;