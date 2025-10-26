import express from "express";
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getJobAnalytics,
  syncJobs,
  bulkUpdateJobs,
} from "../controllers/jobController.js";
import { authenticate } from "../middleware/auth.js";
import { handleValidationErrors } from "../middleware/validation.js";
import { validateJob, validateJobUpdate } from "../utils/validators.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

router
  .route("/")
  .get(getJobs)
  .post(validateJob, handleValidationErrors, createJob);

router.route("/stats").get(getJobStats);

router.route("/analytics").get(getJobAnalytics);

router.route("/sync").post(syncJobs);

router.route("/bulk-update").put(bulkUpdateJobs);

router
  .route("/:id")
  .get(getJob)
  .put(validateJobUpdate, handleValidationErrors, updateJob)
  .delete(deleteJob);

export default router;
