import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { FILE_CONSTANTS } from "./constants.js";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File upload configuration
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads/resumes");
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      cb(null, "resume-" + uniqueSuffix + fileExtension);
    },
  }),
  limits: {
    fileSize: FILE_CONSTANTS.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (FILE_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${FILE_CONSTANTS.ALLOWED_MIME_TYPES.join(
            ", "
          )}`
        ),
        false
      );
    }
  },
});

// Generate random token
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

// Generate random OTP
export const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Format date to readable string
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
};

// Format date to relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(date);
  }
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Sanitize input data
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Flatten nested object
export const flattenObject = (obj, prefix = "") => {
  let flattened = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(flattened, flattenObject(obj[key], prefixedKey));
      } else {
        flattened[prefixedKey] = obj[key];
      }
    }
  }

  return flattened;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = "asc") => {
  return array.sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    // Handle nested keys
    if (key.includes(".")) {
      const keys = key.split(".");
      aValue = keys.reduce((obj, k) => obj?.[k], a);
      bValue = keys.reduce((obj, k) => obj?.[k], b);
    }

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter array by multiple criteria
export const filterBy = (array, filters) => {
  return array.filter((item) => {
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const filterValue = filters[key];
        let itemValue = item[key];

        // Handle nested keys
        if (key.includes(".")) {
          const keys = key.split(".");
          itemValue = keys.reduce((obj, k) => obj?.[k], item);
        }

        // Handle different filter types
        if (typeof filterValue === "string") {
          if (
            !String(itemValue).toLowerCase().includes(filterValue.toLowerCase())
          ) {
            return false;
          }
        } else if (Array.isArray(filterValue)) {
          if (!filterValue.includes(itemValue)) {
            return false;
          }
        } else if (typeof filterValue === "function") {
          if (!filterValue(itemValue)) {
            return false;
          }
        } else {
          if (itemValue !== filterValue) {
            return false;
          }
        }
      }
    }
    return true;
  });
};

// Paginate array
export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      current: page,
      pages: Math.ceil(array.length / limit),
      total: array.length,
      hasNext: endIndex < array.length,
      hasPrev: page > 1,
    },
  };
};

// Generate unique ID
export const generateId = (prefix = "") => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return !obj;
};

// Sleep function for delays
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Retry function with exponential backoff
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};

// Parse JSON safely
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};

// Stringify JSON safely
export const safeJsonStringify = (obj, defaultValue = "{}") => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return defaultValue;
  }
};

// Get file extension from filename
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// Get file size in human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate phone number (basic)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Mask sensitive data
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data || data.length <= visibleChars * 2) {
    return "*".repeat(data?.length || 0);
  }

  const firstPart = data.substring(0, visibleChars);
  const lastPart = data.substring(data.length - visibleChars);
  const maskedPart = "*".repeat(data.length - visibleChars * 2);

  return firstPart + maskedPart + lastPart;
};

export default {
  upload,
  generateToken,
  generateOTP,
  formatDate,
  formatRelativeTime,
  calculatePercentage,
  isValidEmail,
  isValidUrl,
  sanitizeInput,
  capitalizeWords,
  generateSlug,
  debounce,
  throttle,
  deepClone,
  flattenObject,
  groupBy,
  sortBy,
  filterBy,
  paginate,
  generateId,
  isEmpty,
  sleep,
  retry,
  safeJsonParse,
  safeJsonStringify,
  getFileExtension,
  formatFileSize,
  isValidPhone,
  maskSensitiveData,
};
