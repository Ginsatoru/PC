import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import crypto from "crypto";

// KHQR Helper Functions
const generateTLV = (tag, value) => {
  const length = value.length.toString().padStart(2, "0");
  return `${tag}${length}${value}`;
};

const calculateCRC = (data) => {
  // CRC-16 CCITT calculation
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
};

const generateKHQR = (
  amount,
  orderId,
  merchantAccount,
  merchantName,
  merchantCity
) => {
  try {
    const billNumber = `ORD${orderId.slice(-8)}`;
    const timestamp = Date.now().toString();

    // Convert amount to USD (since you want to use USD)
    const usdAmount = parseFloat(amount).toFixed(2);

    // EMV QR Code Data Objects
    let qrData = "";

    // 00: Payload Format Indicator
    qrData += generateTLV("00", "01");

    // 01: Point of Initiation Method (12 = dynamic)
    qrData += generateTLV("01", "12");

    // 29: Merchant Account Information (Bakong)
    let merchantInfo = "";
    merchantInfo += generateTLV("00", "kh.gov.nbc.bakong"); // Globally Unique Identifier
    merchantInfo += generateTLV("01", merchantAccount); // Merchant Account
    qrData += generateTLV("29", merchantInfo);

    // 52: Merchant Category Code
    qrData += generateTLV("52", "5734"); // Computer and Software Stores

    // 53: Transaction Currency (840 = USD, 116 = KHR)
    qrData += generateTLV("53", "840"); // USD

    // 54: Transaction Amount
    qrData += generateTLV("54", usdAmount);

    // 58: Country Code
    qrData += generateTLV("58", "KH");

    // 59: Merchant Name
    qrData += generateTLV("59", merchantName.substring(0, 25)); // Max 25 chars

    // 60: Merchant City
    qrData += generateTLV("60", merchantCity.substring(0, 15)); // Max 15 chars

    // 62: Additional Data Field Template
    let additionalData = "";
    additionalData += generateTLV("01", billNumber); // Bill Number
    additionalData += generateTLV("02", "GINPC"); // Store Label
    additionalData += generateTLV("03", "WEB001"); // Terminal Label
    qrData += generateTLV("62", additionalData);

    // 63: CRC (placeholder for now)
    const dataForCRC = qrData + "6304";
    const crc = calculateCRC(dataForCRC);
    qrData += generateTLV("63", crc);

    // Generate MD5 hash for tracking
    const md5Hash = crypto
      .createHash("md5")
      .update(`${merchantAccount}${usdAmount}${billNumber}${timestamp}`)
      .digest("hex");

    return {
      qrString: qrData,
      md5Hash,
      billNumber,
      qrData: {
        merchantAccount,
        amount: usdAmount,
        currency: "USD",
        billNumber,
        merchantName,
        merchantCity,
      },
    };
  } catch (error) {
    console.error("KHQR Generation Error:", error);
    throw new Error("Failed to generate KHQR: " + error.message);
  }
};

const checkKHQRPayment = async (md5Hash) => {
  try {
    const response = await fetch(
      `${process.env.BAKONG_BASE_URL}/v1/check_transaction_by_md5`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BAKONG_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          md5: md5Hash,
        }),
      }
    );

    const result = await response.json();
    console.log("Bakong API Response:", { status: response.status, result });

    if (response.ok) {
      // Map Bakong response to our status
      switch (result.status || result.responseCode) {
        case "SUCCESS":
        case "PAID":
        case "00": // Success response code
          return { status: "paid", data: result };
        case "FAILED":
        case "01": // Failed response code
          return { status: "failed", data: result };
        case "EXPIRED":
        case "02": // Expired response code
          return { status: "expired", data: result };
        default:
          return { status: "pending", data: result };
      }
    } else {
      console.error("Bakong API Error:", result);
      return {
        status: "pending",
        error: result.message || result.errorMessage,
      };
    }
  } catch (error) {
    console.error("KHQR Check Error:", error);
    return { status: "pending", error: error.message };
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  // Verify products exist and update stock
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found: ${item.name}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      });
    }
  }

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item.product,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    // Set initial payment status
    paymentStatus: paymentMethod === "KHQR" ? "pending" : "pending",
  });

  const createdOrder = await order.save();

  // Update product stock
  for (let item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json(createdOrder);
});

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

  // Verify amount matches order total (allowing small floating point differences)
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

  // Check required environment variables
  if (!process.env.KHQR_MERCHANT_ACCOUNT || !process.env.BAKONG_ACCESS_TOKEN) {
    console.error("Missing KHQR configuration:", {
      hasAccount: !!process.env.KHQR_MERCHANT_ACCOUNT,
      hasToken: !!process.env.BAKONG_ACCESS_TOKEN,
    });
    return res.status(500).json({ message: "KHQR configuration missing" });
  }

  try {
    const qrAmount = requestedAmount;
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.KHQR_QR_TTL_MS || 300000)
    );

    console.log("Generating KHQR with:", {
      amount: qrAmount,
      orderId: order._id.toString(),
      merchantAccount: process.env.KHQR_MERCHANT_ACCOUNT,
      merchantName: process.env.KHQR_MERCHANT_NAME,
      merchantCity: process.env.KHQR_MERCHANT_CITY,
    });

    // Generate KHQR
    const khqrData = generateKHQR(
      qrAmount,
      order._id.toString(),
      process.env.KHQR_MERCHANT_ACCOUNT,
      process.env.KHQR_MERCHANT_NAME || "Gin PC & Accessories",
      process.env.KHQR_MERCHANT_CITY || "Siem Reap City"
    );

    console.log("Generated KHQR:", {
      qrLength: khqrData.qrString.length,
      md5Hash: khqrData.md5Hash,
      billNumber: khqrData.billNumber,
    });

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
    res
      .status(500)
      .json({ message: "Failed to generate KHQR", error: error.message });
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
    const paymentResult = await checkKHQRPayment(order.khqrMd5);

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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name brand model");

  if (order) {
    // Check if user owns the order or is admin
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      res.json(order);
    } else {
      res.status(403).json({ message: "Not authorized to view this order" });
    }
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "processing";
    order.paymentStatus = "paid";
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc    Update order to delivered (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    if (notes) order.notes = notes;

    // Update delivered status based on status
    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else if (status === "cancelled") {
      // Restore product stock for cancelled orders
      for (let item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("orderItems.product", "name image");

  const total = await Order.countDocuments({ user: req.user._id });

  res.json({
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by payment status
  if (req.query.paymentStatus) {
    query.paymentStatus = req.query.paymentStatus;
  }

  // Filter by payment method
  if (req.query.paymentMethod) {
    query.paymentMethod = req.query.paymentMethod;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const orders = await Order.find(query)
    .populate("user", "name email")
    .populate("orderItems.product", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Restore stock if order is not delivered
    if (order.status !== "delivered" && order.status !== "cancelled") {
      for (let item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.deleteOne();
    res.json({ message: "Order removed" });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const processingOrders = await Order.countDocuments({ status: "processing" });
  const shippedOrders = await Order.countDocuments({ status: "shipped" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });
  const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

  // Payment method statistics
  const khqrOrders = await Order.countDocuments({ paymentMethod: "KHQR" });
  const paidOrders = await Order.countDocuments({ paymentStatus: "paid" });
  const pendingPayments = await Order.countDocuments({
    paymentStatus: "pending",
  });

  // Total revenue
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" }, paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // KHQR revenue
  const khqrRevenueResult = await Order.aggregate([
    { $match: { paymentMethod: "KHQR", paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const khqrRevenue = khqrRevenueResult[0]?.total || 0;

  // Recent orders
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
