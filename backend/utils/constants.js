// Application Constants
export const APP_CONSTANTS = {
  APP_NAME: "TrackRuit",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@trackruit.com",
  COMPANY_NAME: "TrackRuit Technologies",
  WEBSITE: "https://trackruit.com",
};

// Job Application Constants
export const JOB_CONSTANTS = {
  STATUS: {
    APPLIED: "applied",
    UNDER_REVIEW: "under_review",
    INTERVIEW: "interview",
    REJECTED: "rejected",
    ACCEPTED: "accepted",
    OFFERED: "offered",
    WITHDRAWN: "withdrawn",
  },

  PLATFORMS: {
    LINKEDIN: "linkedin",
    INTERNSHALA: "internshala",
    UNSTOP: "unstop",
    INDEED: "indeed",
    OTHER: "other",
    MANUAL: "manual",
  },

  SOURCES: {
    AUTO_DETECT: "auto_detect",
    MANUAL: "manual",
  },
};

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Authentication Constants
export const AUTH_CONSTANTS = {
  JWT_EXPIRY: "7d",
  OTP_EXPIRY: 10, // minutes
  PASSWORD_RESET_EXPIRY: 60, // minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 30, // minutes
};

// File Upload Constants
export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ],
  UPLOAD_PATHS: {
    RESUMES: "resumes",
    AVATARS: "avatars",
    DOCUMENTS: "documents",
  },
};

// ML Service Constants
export const ML_CONSTANTS = {
  ENDPOINTS: {
    MATCH: "/ml/match",
    RECOMMEND: "/ml/recommend",
    INTERVIEW: "/ml/interview",
    FEEDBACK: "/ml/resume/feedback",
    ATS: "/ml/ats",
    STATUS: "/ml/status",
  },
  CACHE_TTL: {
    RESUME_ANALYSIS: 86400, // 24 hours
    JOB_MATCH: 43200, // 12 hours
    RECOMMENDATIONS: 3600, // 1 hour
  },
};

// Analytics Constants
export const ANALYTICS_CONSTANTS = {
  PERIODS: {
    WEEK: "7d",
    MONTH: "30d",
    QUARTER: "90d",
  },
  METRICS: {
    APPLICATION_COUNT: "application_count",
    SUCCESS_RATE: "success_rate",
    RESPONSE_TIME: "response_time",
    ENGAGEMENT: "engagement",
  },
};

// Email Constants
export const EMAIL_CONSTANTS = {
  TEMPLATES: {
    WELCOME: "welcome",
    OTP: "otp",
    PASSWORD_RESET: "password_reset",
    JOB_ALERT: "job_alert",
    APPLICATION_UPDATE: "application_update",
    WEEKLY_SUMMARY: "weekly_summary",
    SECURITY_ALERT: "security_alert",
  },
  SUBJECTS: {
    WELCOME: "Welcome to TrackRuit",
    OTP: "Your TrackRuit Verification Code",
    PASSWORD_RESET: "TrackRuit Password Reset Request",
    JOB_ALERT: "New Job Recommendations for You",
    APPLICATION_UPDATE: "Application Status Update",
    WEEKLY_SUMMARY: "Your Weekly Job Search Summary",
    SECURITY_ALERT: "Security Alert: Important Account Activity",
  },
};

// Extension Constants
export const EXTENSION_CONSTANTS = {
  VERSION: "1.0.0",
  SUPPORTED_PLATFORMS: ["linkedin", "internshala", "unstop", "indeed"],
  CONFIG: {
    AUTO_CAPTURE: true,
    MANUAL_CAPTURE: true,
    OFFLINE_SUPPORT: true,
    SYNC_INTERVAL: 30000, // 30 seconds
    MAX_PENDING_JOBS: 50,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication Errors
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_NOT_FOUND: "User not found",
    USER_EXISTS: "User already exists with this email",
    INVALID_TOKEN: "Invalid or expired token",
    UNAUTHORIZED: "Not authorized to access this route",
    FORBIDDEN: "Access forbidden",
    EMAIL_NOT_VERIFIED: "Please verify your email first",
    INVALID_OTP: "Invalid or expired OTP",
    ACCOUNT_LOCKED:
      "Account temporarily locked due to too many failed attempts",
  },

  // Validation Errors
  VALIDATION: {
    INVALID_EMAIL: "Please provide a valid email",
    PASSWORD_TOO_WEAK: "Password must be at least 6 characters long",
    REQUIRED_FIELD: "This field is required",
    INVALID_FILE_TYPE: "Invalid file type",
    FILE_TOO_LARGE: "File too large",
    INVALID_URL: "Please provide a valid URL",
  },

  // Job Errors
  JOB: {
    NOT_FOUND: "Job not found",
    CREATE_FAILED: "Failed to create job",
    UPDATE_FAILED: "Failed to update job",
    DELETE_FAILED: "Failed to delete job",
  },

  // Resume Errors
  RESUME: {
    NOT_FOUND: "Resume not found",
    UPLOAD_FAILED: "Failed to upload resume",
    ANALYSIS_FAILED: "Failed to analyze resume",
    DELETE_FAILED: "Failed to delete resume",
  },

  // System Errors
  SYSTEM: {
    DATABASE_ERROR: "Database error occurred",
    EXTERNAL_SERVICE_ERROR: "External service unavailable",
    FILE_UPLOAD_ERROR: "File upload failed",
    EMAIL_SEND_ERROR: "Failed to send email",
    CACHE_ERROR: "Cache service error",
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication Success
  AUTH: {
    REGISTER_SUCCESS: "Registration successful. Please verify your email.",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logged out successfully",
    OTP_SENT: "OTP sent successfully",
    OTP_VERIFIED: "Email verified successfully",
    PASSWORD_RESET_SENT: "Password reset email sent",
    PASSWORD_CHANGED: "Password changed successfully",
    PROFILE_UPDATED: "Profile updated successfully",
  },

  // Job Success
  JOB: {
    CREATED: "Job created successfully",
    UPDATED: "Job updated successfully",
    DELETED: "Job deleted successfully",
    SYNCED: "Jobs synced successfully",
  },

  // Resume Success
  RESUME: {
    UPLOADED: "Resume uploaded successfully",
    ANALYZED: "Resume analysis completed",
    UPDATED: "Resume updated successfully",
    DELETED: "Resume deleted successfully",
  },

  // General Success
  GENERAL: {
    OPERATION_SUCCESS: "Operation completed successfully",
    DATA_RETRIEVED: "Data retrieved successfully",
    SETTINGS_UPDATED: "Settings updated successfully",
  },
};

// Default Values
export const DEFAULT_VALUES = {
  USER: {
    AVATAR: "",
    ROLE: "user",
    IS_VERIFIED: false,
    PREFERENCES: {
      jobAlerts: true,
      emailNotifications: true,
      darkMode: false,
    },
  },

  JOB: {
    STATUS: "applied",
    PLATFORM: "manual",
    SOURCE: "manual",
  },

  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    SORT_BY: "createdAt",
    SORT_ORDER: "desc",
  },
};

// Environment Constants
export const ENV_CONSTANTS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

export default {
  APP_CONSTANTS,
  JOB_CONSTANTS,
  USER_ROLES,
  AUTH_CONSTANTS,
  FILE_CONSTANTS,
  ML_CONSTANTS,
  ANALYTICS_CONSTANTS,
  EMAIL_CONSTANTS,
  EXTENSION_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_VALUES,
  ENV_CONSTANTS,
};
