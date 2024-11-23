import { Router } from "express";
import { manualSyncWebexData, getExtensionData } from "../Controller/WebexController.js";

const router = Router();

// Manual sync
router.post("/sync", manualSyncWebexData);

// Query extension
router.get("/extension/:extension", getExtensionData);

export default router;
