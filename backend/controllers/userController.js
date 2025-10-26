import User from "../models/User.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { logger } from "../utils/logger.js";

// ===== ADMIN FUNCTIONS =====

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    logger.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// @desc    Get single user (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user },
    });
  } catch (error) {
    logger.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: "admin" });

    res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        adminUsers,
      },
    });
  } catch (error) {
    logger.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/users/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalResumes = await Resume.countDocuments();

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalJobs,
          totalResumes,
        },
      },
    });
  } catch (error) {
    logger.error("Get admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

// ===== USER PROFILE FUNCTIONS =====

// @desc    Get user profile (for regular users to view their own profile)
// @route   GET /api/users/profile/:id
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Users can only view their own profile, unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this profile",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

// @desc    Get user dashboard data (for regular users)
// @route   GET /api/users/:id/dashboard
// @access  Private
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User can only access their own dashboard, unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this dashboard",
      });
    }

    // Get user-specific data
    const userJobs = await Job.countDocuments({ user: req.params.id });
    const userResumes = await Resume.countDocuments({ user: req.params.id });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        overview: {
          totalJobs: userJobs,
          totalResumes: userResumes,
        },
      },
    });
  } catch (error) {
    logger.error("Get user dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user dashboard data",
    });
  }
};

// ===== PASSWORD MANAGEMENT =====

// @desc    Change user password (for users to change their own password)
// @route   PUT /api/users/:id/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Users can only change their own password, unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to change this user's password",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    logger.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// ===== ACCOUNT MANAGEMENT =====

// @desc    Delete user account (with additional cleanup)
// @route   DELETE /api/users/:id/account
// @access  Private/Admin
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Additional cleanup logic here if needed
    // For example: delete user's jobs, resumes, etc.
    await Job.deleteMany({ user: req.params.id });
    await Resume.deleteMany({ user: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User account and all associated data deleted successfully",
    });
  } catch (error) {
    logger.error("Delete user account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user account",
    });
  }
};
