import express from "express";
import { promptExtraction } from "../controllers/queryContoller.js";

const router = express.Router();

router.post("/query", promptExtraction);

export default router;