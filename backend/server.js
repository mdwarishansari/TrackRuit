import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

// Import configurations
import { connectDB } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import passport from "./config/passport.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { authenticate } from "./middleware/auth.js";

// Import routes
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import resumeRoutes from "./routes/resumes.js";
import userRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import extensionRoutes from "./routes/extension.js";

// Import admin setup
import { setupAdmin } from "./utils/adminSetup.js";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ========================
// 🛡️ SECURITY MIDDLEWARE
// ========================
// Add to server.js or routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || [
      "http://localhost:3000",
      "https://trackruit.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-extension-secret",
      "x-request-timestamp",
      "x-extension-version",
      "x-user-id",
    ],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: { error: "Too many requests from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ========================
// 📦 BODY PARSING & COMPRESSION
// ========================

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// ========================
// 📊 LOGGING
// ========================

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ========================
// 🔐 AUTHENTICATION
// ========================

app.use(passport.initialize());

// ========================
// 🛣️ DATABASE CONNECTIONS
// ========================

connectDB();
connectRedis();

// ========================
// 🛣️ ROUTES
// ========================

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 TrackRuit Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// API docs endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "📚 TrackRuit API Documentation",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      jobs: "/api/jobs",
      resumes: "/api/resumes",
      users: "/api/users",
      analytics: "/api/analytics",
      extension: "/api/extension",
    },
    documentation: "https://docs.trackruit.com",
  });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/extension", extensionRoutes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================
// ❌ 404 HANDLER
// ========================

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "🔍 Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ========================
// ⚠️ ERROR HANDLER
// ========================

app.use(errorHandler);

// ========================
// 🚀 START SERVER
// ========================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await new Promise((resolve, reject) => {
      mongoose.connection.on("open", resolve);
      mongoose.connection.on("error", reject);
    });

    // Setup admin user on server start
    await setupAdmin();

    const server = app.listen(PORT, () => {
      console.log(`
🚀 TrackRuit Backend Server Started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📅 ${new Date().toLocaleString()}
✅ Database: ${
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
      }
🔐 Admin Setup: Completed
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        mongoose.connection.close(false, () => process.exit(0));
      });
      setTimeout(() => process.exit(1), 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
