import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  deleteOrder,
  getOrderStats,
  createOrderKHQR,
  checkKHQRStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

router.get("/myorders", protect, getMyOrders);
router.get("/stats", protect, admin, getOrderStats);

router
  .route("/:id")
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/status", protect, admin, updateOrderStatus);

// KHQR Payment Routes
router.post("/:id/khqr", protect, createOrderKHQR);
router.get("/:id/khqr/status", protect, checkKHQRStatus);

export default router;
