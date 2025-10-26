import User from "../models/User.js";
import { logger } from "./logger.js";
import { sendEmail } from "../config/mailer.js";

// Default admin credentials (should be changed after first login)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@trackruit.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";

/**
 * Setup admin user on application start
 * This creates the initial admin user if it doesn't exist
 */
export const setupAdmin = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      role: "admin",
      email: DEFAULT_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      logger.info("Admin user already exists");
      return {
        success: true,
        message: "Admin user already exists",
        admin: {
          id: existingAdmin._id,
          email: existingAdmin.email,
          name: existingAdmin.name,
        },
      };
    }

    // Check if any admin exists
    const anyAdmin = await User.findOne({ role: "admin" });
    if (anyAdmin) {
      logger.info("Admin user exists with different email");
      return {
        success: true,
        message: "Admin user exists with different email",
        admin: {
          id: anyAdmin._id,
          email: anyAdmin.email,
          name: anyAdmin.name,
        },
      };
    }

    // Create admin user
    const adminUser = await User.create({
      name: "TrackRuit Admin",
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      role: "admin",
      isVerified: true,
      profileCompleted: true,
    });

    logger.info("Admin user created successfully");

    // Send admin credentials email (in production, this should be sent securely)
    if (process.env.NODE_ENV === "production") {
      await sendAdminCredentials(adminUser);
    } else {
      // In development, log the credentials
      logger.warn(
        `ADMIN CREDENTIALS - Email: ${DEFAULT_ADMIN_EMAIL}, Password: ${DEFAULT_ADMIN_PASSWORD}`
      );
      logger.warn("Please change the admin password after first login!");
    }

    return {
      success: true,
      message: "Admin user created successfully",
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
      },
    };
  } catch (error) {
    logger.error("Admin setup failed:", error);
    return {
      success: false,
      message: "Failed to setup admin user",
      error: error.message,
    };
  }
};

/**
 * Send admin credentials via email
 */
const sendAdminCredentials = async (adminUser) => {
  try {
    const subject = "TrackRuit Admin Account Created";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">TrackRuit Admin Account</h2>
        <p>Your admin account has been created successfully.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0369a1;">Login Credentials</h4>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${adminUser.email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${DEFAULT_ADMIN_PASSWORD}</p>
        </div>

        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">⚠️ Security Notice</h4>
          <p style="margin: 0; font-size: 14px;">
            For security reasons, please change your password immediately after first login.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/admin/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Admin Panel
          </a>
        </div>
        
        <p><strong>Note:</strong> This email contains sensitive information. Please keep it secure.</p>
        <br>
        <p>Best regards,<br>The TrackRuit Team</p>
      </div>
    `;

    await sendEmail({
      to: adminUser.email,
      subject,
      html,
    });

    logger.info("Admin credentials email sent successfully");
  } catch (error) {
    logger.error("Failed to send admin credentials email:", error);
  }
};

/**
 * Change admin password
 */
export const changeAdminPassword = async (
  adminId,
  currentPassword,
  newPassword
) => {
  try {
    const admin = await User.findById(adminId).select("+password");

    if (!admin) {
      return {
        success: false,
        message: "Admin user not found",
      };
    }

    // Verify current password
    const isPasswordValid = await admin.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    logger.info("Admin password changed successfully");

    // Send password change notification
    await sendPasswordChangeNotification(admin);

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    logger.error("Admin password change failed:", error);
    return {
      success: false,
      message: "Failed to change password",
      error: error.message,
    };
  }
};

/**
 * Send password change notification
 */
const sendPasswordChangeNotification = async (admin) => {
  try {
    const subject = "TrackRuit Admin Password Changed";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Admin Password Changed</h2>
        <p>Hello ${admin.name},</p>
        <p>Your admin password was changed successfully.</p>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0369a1;">Change Details</h4>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Account:</strong> ${admin.email}</p>
        </div>

        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">Security Notice</h4>
          <p style="margin: 0; font-size: 14px;">
            If you did not make this change, please contact support immediately.
          </p>
        </div>
        
        <p>Best regards,<br>The TrackRuit Security Team</p>
      </div>
    `;

    await sendEmail({
      to: admin.email,
      subject,
      html,
    });

    logger.info("Admin password change notification sent");
  } catch (error) {
    logger.error("Failed to send password change notification:", error);
  }
};

/**
 * Update admin email with OTP verification
 */
export const updateAdminEmail = async (adminId, newEmail) => {
  try {
    const admin = await User.findById(adminId);

    if (!admin) {
      return {
        success: false,
        message: "Admin user not found",
      };
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== adminId) {
      return {
        success: false,
        message: "Email is already in use",
      };
    }

    // Generate OTP for email verification
    const otp = admin.generateOTP();
    admin.pendingEmail = newEmail;
    await admin.save({ validateBeforeSave: false });

    // Send OTP to new email
    await sendEmailVerificationOTP(newEmail, otp, admin.name);

    return {
      success: true,
      message: "OTP sent to new email for verification",
    };
  } catch (error) {
    logger.error("Admin email update failed:", error);
    return {
      success: false,
      message: "Failed to update email",
      error: error.message,
    };
  }
};

/**
 * Verify admin email with OTP
 */
export const verifyAdminEmail = async (adminId, otp) => {
  try {
    const admin = await User.findById(adminId).select(
      "+otp +otpExpiry +pendingEmail"
    );

    if (!admin) {
      return {
        success: false,
        message: "Admin user not found",
      };
    }

    if (!admin.isValidOTP(otp)) {
      return {
        success: false,
        message: "Invalid or expired OTP",
      };
    }

    // Update email
    const oldEmail = admin.email;
    admin.email = admin.pendingEmail;
    admin.pendingEmail = undefined;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    logger.info(`Admin email updated from ${oldEmail} to ${admin.email}`);

    // Send email change notification to both old and new email
    await sendEmailChangeNotification(oldEmail, admin.email, admin.name);

    return {
      success: true,
      message: "Email updated successfully",
    };
  } catch (error) {
    logger.error("Admin email verification failed:", error);
    return {
      success: false,
      message: "Failed to verify email",
      error: error.message,
    };
  }
};

/**
 * Send email verification OTP
 */
const sendEmailVerificationOTP = async (email, otp, name) => {
  try {
    const subject = "Verify Your New Email Address";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Email Change Verification</h2>
        <p>Hello ${name},</p>
        <p>You requested to change your email address. Please use the verification code below:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this change, please contact support immediately.</p>
        <br>
        <p>Best regards,<br>The TrackRuit Team</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject,
      html,
    });

    logger.info("Email verification OTP sent");
  } catch (error) {
    logger.error("Failed to send email verification OTP:", error);
  }
};

/**
 * Send email change notification
 */
const sendEmailChangeNotification = async (oldEmail, newEmail, name) => {
  try {
    const subject = "Email Address Updated";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Email Address Updated</h2>
        <p>Hello ${name},</p>
        <p>Your email address has been successfully updated.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Old Email:</strong> ${oldEmail}</p>
          <p style="margin: 5px 0;"><strong>New Email:</strong> ${newEmail}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">Security Notice</h4>
          <p style="margin: 0; font-size: 14px;">
            If you did not make this change, please contact support immediately.
          </p>
        </div>
        
        <p>Best regards,<br>The TrackRuit Security Team</p>
      </div>
    `;

    // Send to old email
    await sendEmail({
      to: oldEmail,
      subject,
      html,
    });

    // Send to new email
    await sendEmail({
      to: newEmail,
      subject,
      html,
    });

    logger.info("Email change notifications sent");
  } catch (error) {
    logger.error("Failed to send email change notifications:", error);
  }
};

/**
 * Get admin dashboard statistics
 */
export const getAdminDashboardStats = async () => {
  try {
    const User = await import("../models/User.js").then((mod) => mod.default);
    const Job = await import("../models/Job.js").then((mod) => mod.default);
    const Resume = await import("../models/Resume.js").then(
      (mod) => mod.default
    );

    const [totalUsers, totalJobs, totalResumes, recentUsers, recentJobs] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments({ isActive: true }),
        Resume.countDocuments({ isActive: true }),
        User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("name email role createdAt"),
        Job.find({ isActive: true })
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    return {
      success: true,
      data: {
        overview: {
          totalUsers,
          totalJobs,
          totalResumes,
        },
        recentActivity: {
          users: recentUsers,
          jobs: recentJobs,
        },
      },
    };
  } catch (error) {
    logger.error("Failed to get admin dashboard stats:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    };
  }
};

// Remove the default export at the bottom and only use named exports
// This ensures the named export 'setupAdmin' is properly available
