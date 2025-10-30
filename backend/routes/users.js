import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  updateUserRole,
  getAdminDashboard,
  getUserProfile,
  changePassword,
  deleteUserAccount,
  getUserDashboard,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected and admin only
router.use(authenticate, authorize("admin"));

router.route("/").get(getUsers);

router.route("/stats").get(getUserStats);

router.route("/dashboard").get(getAdminDashboard);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.route("/:id/role").put(updateUserRole);

// Optional additional routes
router.route("/:id/profile").get(getUserProfile);

router.route("/:id/password").put(changePassword);

router.route("/:id/account").delete(deleteUserAccount);

router.route("/:id/dashboard").get(getUserDashboard);

export default router;
