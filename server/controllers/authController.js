import User from "../models/User.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please add all fields",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer",
  });

  if (user) {
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
    });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  console.log("=== LOGIN ENDPOINT HIT ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  const { email, password } = req.body;

  console.log("Extracted credentials:", {
    email,
    password: password ? "***" : "undefined",
  });

  // Check if email and password are provided
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    // Check for user email
    console.log("Searching for user with email:", email);
    const user = await User.findOne({ email });
    console.log(
      "User found:",
      user ? `Yes - ${user.name} (${user.role})` : "No"
    );

    if (user) {
      console.log("Checking password...");
      const isPasswordMatch = await user.matchPassword(password);
      console.log("Password match:", isPasswordMatch);

      if (isPasswordMatch) {
        const token = generateToken(user._id);
        console.log("Token generated successfully");

        const response = {
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
          },
        };

        console.log("Login successful, sending response:", {
          ...response,
          token: "***",
        });
        res.json(response);
      } else {
        console.log("Password mismatch");
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    } else {
      console.log("User not found");
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("=== UPDATE PROFILE ENDPOINT HIT ===");
  console.log("Request body:", req.body);
  console.log("User ID from token:", req.user.id);

  try {
    const user = await User.findById(req.user.id);
    console.log("User found:", user ? `Yes - ${user.name}` : "No");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate required fields
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email is already taken by another user
    if (req.body.email !== user.email) {
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    // Update basic user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // UPDATED: Handle structured address properly
    if (req.body.address) {
      // If address is provided, update the address object
      user.address = {
        street: req.body.address.street || user.address?.street || "",
        city: req.body.address.city || user.address?.city || "",
        state: req.body.address.state || user.address?.state || "",
        zipCode: req.body.address.zipCode || user.address?.zipCode || "",
        country: req.body.address.country || user.address?.country || "",
      };
    }

    console.log("Updated user data before save:", {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });

    const updatedUser = await user.save();
    console.log("User saved successfully");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during profile update",
    });
  }
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password change",
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  res.json({
    success: true,
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({
      success: true,
      message: "User removed successfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});
