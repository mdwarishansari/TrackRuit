import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";

export const verifyExtensionRequest = async (req, res, next) => {
  try {
    // Check extension secret
    const extensionSecret = req.headers["x-extension-secret"];
    const requestTimestamp = req.headers["x-request-timestamp"];
    const authToken = req.headers["authorization"]?.replace("Bearer ", "");

    if (!extensionSecret || extensionSecret !== process.env.EXTENSION_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Invalid extension secret",
      });
    }

    // Verify timestamp (prevent replay attacks)
    if (!requestTimestamp) {
      return res.status(401).json({
        success: false,
        message: "Missing request timestamp",
      });
    }

    const timeDiff = Math.abs(Date.now() - parseInt(requestTimestamp));
    if (timeDiff > 300000) { // 5 minutes
      return res.status(401).json({
        success: false,
        message: "Request timestamp expired",
      });
    }

    // Verify JWT token
    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user token",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Extension authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Extension authentication failed",
    });
  }
};