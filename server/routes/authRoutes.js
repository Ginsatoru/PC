import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getUsers,
  deleteUser,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put("/change-password", protect, changeUserPassword);

// Admin routes
router.route("/users").get(protect, admin, getUsers);

router.route("/users/:id").delete(protect, admin, deleteUser);

export default router;
