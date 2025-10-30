import { body, param, query } from "express-validator";
import { FILE_CONSTANTS, JOB_CONSTANTS } from "./constants.js";

// Authentication Validators
export const validateRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

export const validateOTP = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

export const validateForgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

export const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];

export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
];

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];

// Job Validators
export const validateJob = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title cannot be more than 100 characters"),

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name cannot be more than 100 characters"),

  body("platform")
    .isIn(Object.values(JOB_CONSTANTS.PLATFORMS))
    .withMessage(
      `Platform must be one of: ${Object.values(JOB_CONSTANTS.PLATFORMS).join(
        ", "
      )}`
    ),

  body("url").optional().isURL().withMessage("URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(Object.values(JOB_CONSTANTS.STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(JOB_CONSTANTS.STATUS).join(", ")}`
    ),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot be more than 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description cannot be more than 2000 characters"),

  body("salary")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary cannot be more than 50 characters"),

  body("appliedAt")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid ISO 8601 date"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid ISO 8601 date"),
];

export const validateJobUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Job title cannot be more than 100 characters"),

  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot be more than 100 characters"),

  body("platform")
    .optional()
    .isIn(Object.values(JOB_CONSTANTS.PLATFORMS))
    .withMessage(
      `Platform must be one of: ${Object.values(JOB_CONSTANTS.PLATFORMS).join(
        ", "
      )}`
    ),

  body("url").optional().isURL().withMessage("URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(Object.values(JOB_CONSTANTS.STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(JOB_CONSTANTS.STATUS).join(", ")}`
    ),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot be more than 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description cannot be more than 2000 characters"),

  body("salary")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary cannot be more than 50 characters"),

  body("appliedAt")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid ISO 8601 date"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid ISO 8601 date"),
];

// Resume Validators
export const validateResume = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Resume title cannot be more than 100 characters"),

  // File validation is handled by multer, but we can add additional checks here
];

// Extension Validators
export const validateExtensionJob = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title cannot be more than 100 characters"),

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name cannot be more than 100 characters"),

  body("platform")
    .isIn(Object.values(JOB_CONSTANTS.PLATFORMS))
    .withMessage(
      `Platform must be one of: ${Object.values(JOB_CONSTANTS.PLATFORMS).join(
        ", "
      )}`
    ),

  body("url").optional().isURL().withMessage("URL must be a valid URL"),

  body("appliedAt")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid ISO 8601 date"),

  body("status")
    .optional()
    .isIn(Object.values(JOB_CONSTANTS.STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(JOB_CONSTANTS.STATUS).join(", ")}`
    ),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot be more than 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description cannot be more than 2000 characters"),

  body("salary")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary cannot be more than 50 characters"),
];

// Query Parameter Validators
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sortBy").optional().isString().withMessage("SortBy must be a string"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage('SortOrder must be either "asc" or "desc"'),
];

export const validateJobQuery = [
  ...validatePagination,

  query("status")
    .optional()
    .isIn(Object.values(JOB_CONSTANTS.STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(JOB_CONSTANTS.STATUS).join(", ")}`
    ),

  query("platform")
    .optional()
    .isIn(Object.values(JOB_CONSTANTS.PLATFORMS))
    .withMessage(
      `Platform must be one of: ${Object.values(JOB_CONSTANTS.PLATFORMS).join(
        ", "
      )}`
    ),

  query("company")
    .optional()
    .isString()
    .withMessage("Company must be a string"),
];

export const validateAnalyticsQuery = [
  query("period")
    .optional()
    .isIn(["7d", "30d", "90d"])
    .withMessage("Period must be one of: 7d, 30d, 90d"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
];

// ID Parameter Validators
export const validateObjectId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

// File Upload Validators
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  // Check file type
  if (!FILE_CONSTANTS.ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: `Invalid file type. Allowed types: ${FILE_CONSTANTS.ALLOWED_MIME_TYPES.join(
        ", "
      )}`,
    });
  }

  // Check file size
  if (req.file.size > FILE_CONSTANTS.MAX_FILE_SIZE) {
    return res.status(400).json({
      success: false,
      message: `File too large. Maximum size: ${
        FILE_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024
      }MB`,
    });
  }

  next();
};

// Custom validators
export const validateEmailDomain = (domains) => {
  return body("email").custom((value) => {
    const domain = value.split("@")[1];
    if (!domains.includes(domain)) {
      throw new Error(`Email domain must be one of: ${domains.join(", ")}`);
    }
    return true;
  });
};

export const validateFutureDate = (field) => {
  return body(field).custom((value) => {
    if (value && new Date(value) <= new Date()) {
      throw new Error(`${field} must be a future date`);
    }
    return true;
  });
};

export const validatePastDate = (field) => {
  return body(field).custom((value) => {
    if (value && new Date(value) >= new Date()) {
      throw new Error(`${field} must be a past date`);
    }
    return true;
  });
};

export const validateArrayNotEmpty = (field) => {
  return body(field).custom((value) => {
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error(`${field} must be a non-empty array`);
    }
    return true;
  });
};

export const validateArrayMaxLength = (field, maxLength) => {
  return body(field).custom((value) => {
    if (Array.isArray(value) && value.length > maxLength) {
      throw new Error(`${field} cannot have more than ${maxLength} items`);
    }
    return true;
  });
};

export default {
  // Authentication
  validateRegistration,
  validateLogin,
  validateOTP,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword,

  // Jobs
  validateJob,
  validateJobUpdate,

  // Resumes
  validateResume,

  // Extension
  validateExtensionJob,

  // Query Parameters
  validatePagination,
  validateJobQuery,
  validateAnalyticsQuery,

  // ID Parameters
  validateObjectId,

  // File Upload
  validateFileUpload,

  // Custom Validators
  validateEmailDomain,
  validateFutureDate,
  validatePastDate,
  validateArrayNotEmpty,
  validateArrayMaxLength,
};
