import express from "express";
import { promptExtraction } from "../controllers/queryController.js";

const router = express.Router();

router.post("/query", promptExtraction);

export default router;