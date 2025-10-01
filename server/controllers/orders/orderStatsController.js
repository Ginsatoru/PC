import Order from "../../models/Order.js";
import { asyncHandler } from "../../middleware/errorMiddleware.js";

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const processingOrders = await Order.countDocuments({ status: "processing" });
  const shippedOrders = await Order.countDocuments({ status: "shipped" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });
  const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

  const khqrOrders = await Order.countDocuments({ paymentMethod: "KHQR" });
  const paidOrders = await Order.countDocuments({ paymentStatus: "paid" });
  const pendingPayments = await Order.countDocuments({
    paymentStatus: "pending",
  });

  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" }, paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const khqrRevenueResult = await Order.aggregate([
    { $match: { paymentMethod: "KHQR", paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const khqrRevenue = khqrRevenueResult[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("_id totalPrice status paymentMethod paymentStatus createdAt user");

  res.json({
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    khqrOrders,
    paidOrders,
    pendingPayments,
    totalRevenue,
    khqrRevenue,
    recentOrders,
  });
});