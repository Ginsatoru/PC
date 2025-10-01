import Order from "../../models/Order.js";
import { asyncHandler } from "../../middleware/errorMiddleware.js";
import { generateBakongKHQR, checkBakongPayment } from "../../utils/bakongHelper.js";

// @desc    Create KHQR for order
// @route   POST /api/orders/:id/khqr
// @access  Private
export const createOrderKHQR = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check ownership
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Verify amount matches order total
  const orderTotal = parseFloat(order.totalPrice);
  const requestedAmount = amount ? parseFloat(amount) : orderTotal;

  if (Math.abs(requestedAmount - orderTotal) > 0.01) {
    return res.status(400).json({
      message: `Amount mismatch. Expected: ${orderTotal}, Received: ${requestedAmount}`,
    });
  }

  // Check if order is already paid
  if (order.isPaid || order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order is already paid" });
  }

  // Validate required environment variables
  const requiredEnvVars = [
    'KHQR_MERCHANT_ACCOUNT',
    'BAKONG_ACCESS_TOKEN',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars);
    return res.status(500).json({ 
      message: "KHQR configuration incomplete",
      missing: missingVars
    });
  }

  try {
    const qrAmount = requestedAmount;
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.KHQR_QR_TTL_MS || 300000)
    );

    console.log("Generating Bakong KHQR with:", {
      amount: qrAmount,
      orderId: order._id.toString(),
      merchantAccount: process.env.KHQR_MERCHANT_ACCOUNT,
      merchantName: process.env.KHQR_MERCHANT_NAME,
      merchantCity: process.env.KHQR_MERCHANT_CITY,
    });

    // Generate KHQR using local generation (EMV compliant)
    const khqrData = await generateBakongKHQR(
      qrAmount,
      order._id.toString(),
      process.env.KHQR_MERCHANT_ACCOUNT,
      process.env.KHQR_MERCHANT_NAME || "Gin PC & Accessories",
      process.env.KHQR_MERCHANT_CITY || "Siem Reap City"
    );

    // Update order with KHQR data
    order.paymentMethod = "KHQR";
    order.paymentStatus = "pending";
    order.khqrMd5 = khqrData.md5Hash;
    order.khqrExpiresAt = expiresAt;
    order.khqrMeta = {
      currency: "USD",
      amount: qrAmount,
      billNumber: khqrData.billNumber,
      storeLabel: "GINPC",
      terminalLabel: "WEB001",
      merchantName: process.env.KHQR_MERCHANT_NAME || "Gin PC & Accessories",
      merchantCity: process.env.KHQR_MERCHANT_CITY || "Siem Reap City",
      merchantAccount: process.env.KHQR_MERCHANT_ACCOUNT,
      qrString: khqrData.qrString,
      checkCount: 0,
      createdAt: new Date(),
    };

    await order.save();

    console.log("KHQR created successfully for order:", order._id);

    res.json({
      qrString: khqrData.qrString,
      md5Hash: khqrData.md5Hash,
      expiresAt: expiresAt.toISOString(),
      amount: qrAmount,
      currency: "USD",
      billNumber: khqrData.billNumber,
      orderId: order._id,
      merchantName: process.env.KHQR_MERCHANT_NAME,
      merchantCity: process.env.KHQR_MERCHANT_CITY,
    });
  } catch (error) {
    console.error("KHQR Generation Error:", error);
    res.status(500).json({ 
      message: "Failed to generate KHQR", 
      error: error.message,
    });
  }
});

// @desc    Check KHQR payment status
// @route   GET /api/orders/:id/khqr/status
// @access  Private
export const checkKHQRStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check ownership
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Check if order has KHQR data
  if (!order.khqrMd5) {
    return res
      .status(400)
      .json({ message: "No KHQR data found for this order" });
  }

  // Check if already paid
  if (order.paymentStatus === "paid") {
    return res.json({
      status: "paid",
      message: "Payment confirmed",
      paidAt: order.paidAt,
    });
  }

  // Check if expired
  if (order.khqrExpiresAt && new Date() > order.khqrExpiresAt) {
    if (order.paymentStatus !== "expired") {
      order.paymentStatus = "expired";
      await order.save();
    }
    return res.json({
      status: "expired",
      message: "QR code has expired. Please generate a new one.",
      expiredAt: order.khqrExpiresAt,
    });
  }

  try {
    // Check payment status with Bakong
    const paymentResult = await checkBakongPayment(order.khqrMd5);

    // Update check metadata
    if (!order.khqrMeta) order.khqrMeta = {};
    order.khqrMeta.lastCheckedAt = new Date();
    order.khqrMeta.checkCount = (order.khqrMeta.checkCount || 0) + 1;
    await order.save();

    console.log("Payment check result:", paymentResult);

    if (paymentResult.status === "paid") {
      // Mark order as paid
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = "paid";
      order.status = "processing";
      order.paymentResult = {
        id: paymentResult.data?.transactionId || paymentResult.data?.txnId,
        status: "SUCCESS",
        update_time: new Date().toISOString(),
        amount: order.khqrMeta?.amount,
        currency: order.khqrMeta?.currency,
        method: "KHQR",
      };
      await order.save();

      return res.json({
        status: "paid",
        message: "Payment confirmed successfully!",
        transactionId:
          paymentResult.data?.transactionId || paymentResult.data?.txnId,
        paidAt: order.paidAt,
      });
    } else if (paymentResult.status === "failed") {
      order.paymentStatus = "failed";
      await order.save();

      return res.json({
        status: "failed",
        message: "Payment failed. Please try again.",
        error: paymentResult.data?.errorMessage || paymentResult.error,
      });
    } else if (paymentResult.status === "expired") {
      order.paymentStatus = "expired";
      await order.save();

      return res.json({
        status: "expired",
        message: "QR code has expired. Please generate a new one.",
        expiredAt: order.khqrExpiresAt,
      });
    } else {
      return res.json({
        status: "pending",
        message: "Payment is still pending. Please complete payment.",
        expiresAt: order.khqrExpiresAt,
        checkCount: order.khqrMeta?.checkCount || 0,
      });
    }
  } catch (error) {
    console.error("KHQR Status Check Error:", error);
    res.status(500).json({
      message: "Failed to check payment status",
      status: "pending",
      error: error.message,
    });
  }
});