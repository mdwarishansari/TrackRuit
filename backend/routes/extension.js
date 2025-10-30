import express from "express";
import {
  verifyExtension,
  addJobFromExtension,
  syncJobsFromExtension,
  getExtensionConfig,
} from "../controllers/extensionController.js";
import { extensionAuth } from "../middleware/auth.js"; // Changed from extensionAuth to the correct export
import { extensionLimiter } from "../middleware/rateLimiter.js";
import { handleValidationErrors } from "../middleware/validation.js";
import { validateExtensionJob } from "../utils/validators.js";

const router = express.Router();

// Extension verification
router.get("/verify", extensionAuth, verifyExtension);

// Extension configuration
router.get("/config", extensionAuth, getExtensionConfig);

// Job management from extension
router.post(
  "/jobs/add",
  extensionAuth,
  extensionLimiter,
  validateExtensionJob,
  handleValidationErrors,
  addJobFromExtension
);
router.post(
  "/jobs/sync",
  extensionAuth,
  extensionLimiter,
  syncJobsFromExtension
);

export default router;
