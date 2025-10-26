import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  getMe,
  updateProfile,
  changePassword,
  updatePreferences,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { handleValidationErrors } from "../middleware/validation.js";
import {
  validateRegistration,
  validateLogin,
  validateOTP,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword,
} from "../utils/validators.js";

const router = express.Router();

// Public routes
router.post(
  "/register",
  authLimiter,
  validateRegistration,
  handleValidationErrors,
  register
);
router.post(
  "/login",
  authLimiter,
  validateLogin,
  handleValidationErrors,
  login
);
router.post("/verify-otp", validateOTP, handleValidationErrors, verifyOTP);
router.post("/resend-otp", resendOTP);
router.post(
  "/forgot-password",
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);
router.put(
  "/reset-password",
  validateResetPassword,
  handleValidationErrors,
  resetPassword
);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback, (req, res) => {
  // Successful authentication, redirect to frontend with token
  const token = req.user.generateAuthToken();
  res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
});

// Protected routes
router.get("/me", authenticate, getMe);
router.put(
  "/profile",
  authenticate,
  validateUpdateProfile,
  handleValidationErrors,
  updateProfile
);
router.put(
  "/change-password",
  authenticate,
  validateChangePassword,
  handleValidationErrors,
  changePassword
);
router.put("/preferences", authenticate, updatePreferences);
router.post("/logout", authenticate, logout);

export default router;
