import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";
import rateLimit from 'express-rate-limit';

export const extensionAuth = async (req, res, next) => {
  try {
    // Check extension secret
    const extensionSecret = req.headers["x-extension-secret"];
    if (extensionSecret !== process.env.EXTENSION_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Invalid extension secret",
      });
    }

    // Check timestamp (prevent replay attacks)
    const requestTime = parseInt(req.headers["x-request-timestamp"]);
    if (Math.abs(Date.now() - requestTime) > 300000) {
      // 5 minutes
      return res.status(401).json({
        success: false,
        message: "Request timestamp expired",
      });
    }

    // Verify JWT token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Extension authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Extension authentication failed",
    });
  }
};


export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (
        !user.isVerified &&
        req.path !== "/verify-otp" &&
        req.path !== "/resend-otp"
      ) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email before accessing this resource",
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

export const authenticateExtension = async (req, res, next) => {
  try {
    // Check extension secret
    const extensionSecret = req.headers["x-extension-secret"];
    if (extensionSecret !== process.env.EXTENSION_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Invalid extension secret",
      });
    }

    // Check timestamp (prevent replay attacks)
    const requestTime = parseInt(req.headers["x-request-timestamp"]);
    if (Math.abs(Date.now() - requestTime) > 300000) {
      // 5 minutes
      return res.status(401).json({
        success: false,
        message: "Request timestamp expired",
      });
    }

    // Verify JWT token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Extension authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Extension authentication failed",
    });
  }
};
