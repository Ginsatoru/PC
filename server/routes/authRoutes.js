import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getUsers,
  deleteUser,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
// NEW: Google login route
router.post("/google", googleLogin);

// Protected routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("profilePic"), updateUserProfile);

router.put("/change-password", protect, changeUserPassword);

// Admin routes
router.route("/users").get(protect, admin, getUsers);

router.route("/users/:id").delete(protect, admin, deleteUser);

export default router;
