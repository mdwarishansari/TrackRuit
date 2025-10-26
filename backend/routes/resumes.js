import express from "express";
import {
  getResumes,
  getResume,
  uploadResume,
  updateResume,
  deleteResume,
  analyzeResume,
  setActiveResume,
  getResumeAnalysis,
} from "../controllers/resumeController.js";
import { authenticate } from "../middleware/auth.js";
import { handleValidationErrors } from "../middleware/validation.js";
import { validateResume } from "../utils/validators.js";
import { upload } from "../utils/helpers.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

router
  .route("/")
  .get(getResumes)
  .post(
    upload.single("resume"),
    validateResume,
    handleValidationErrors,
    uploadResume
  );

router.route("/:id/analyze").post(analyzeResume);

router.route("/:id/analysis").get(getResumeAnalysis);

router.route("/:id/set-active").put(setActiveResume);

router.route("/:id").get(getResume).put(updateResume).delete(deleteResume);

export default router;
