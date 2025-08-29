import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import fs from "fs";
import path from "path";

// @desc    Get all products with pagination and filtering
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  let query = { isActive: true };

  // Category filter
  if (req.query.category) {
    query.category = new RegExp(req.query.category, "i");
  }

  // Brand filter
  if (req.query.brand) {
    query.brand = new RegExp(req.query.brand, "i");
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Search functionality
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { brand: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Sort options - Updated to match frontend expectations
  let sortOptions = { createdAt: -1 };
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  if (sortBy) {
    switch (sortBy) {
      case "name":
        sortOptions = { name: sortOrder };
        break;
      case "price":
        sortOptions = { price: sortOrder };
        break;
      case "brand":
        sortOptions = { brand: sortOrder };
        break;
      case "createdAt":
        sortOptions = { createdAt: sortOrder };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
  }

  // Handle legacy sort parameter
  if (req.query.sort && !sortBy) {
    switch (req.query.sort) {
      case "price_low":
        sortOptions = { price: 1 };
        break;
      case "price_high":
        sortOptions = { price: -1 };
        break;
      case "name_asc":
        sortOptions = { name: 1 };
        break;
      case "name_desc":
        sortOptions = { name: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
  }

  const products = await Product.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Fixed response format to match frontend expectations
  res.json({
    success: true,
    data: {
      products,
      totalPages,
      currentPage: page,
      totalProducts: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    pagination: {
      page,
      limit,
      total,
      pages: totalPages,
    },
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true })
    .limit(8)
    .lean();

  res.json({
    success: true,
    data: products,
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category", { isActive: true });
  res.json({
    success: true,
    data: categories,
  });
});

// @desc    Get product brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct("brand", { isActive: true });
  res.json({
    success: true,
    data: brands,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews.user",
    select: "name",
  });

  if (product && product.isActive) {
    res.json({
      success: true,
      data: product,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
});

// Helper function to delete old image file
const deleteImageFile = (imagePath) => {
  if (
    imagePath &&
    !imagePath.startsWith("http") &&
    !imagePath.includes("placeholder")
  ) {
    const fullPath = path.join(
      process.cwd(),
      "uploads",
      "products",
      path.basename(imagePath)
    );
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    brand,
    model,
    price,
    stock,
    description,
    specifications,
    featured,
  } = req.body;

  // Validation
  if (!name || !category || !brand || !model || !price || !description) {
    // If file was uploaded but validation failed, delete it
    if (req.file) {
      deleteImageFile(req.file.filename);
    }
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Handle image - either uploaded file or default placeholder
  let imageUrl = "https://via.placeholder.com/400x300?text=PC+Part";
  if (req.file) {
    imageUrl = `/uploads/products/${req.file.filename}`;
  }

  const product = new Product({
    name,
    category,
    brand,
    model,
    price,
    stock: stock || 0,
    description,
    specifications: specifications ? JSON.parse(specifications) : {},
    image: imageUrl,
    images: [],
    featured: featured === "true" || featured === true || false,
  });

  const createdProduct = await product.save();
  res.status(201).json({
    success: true,
    data: createdProduct,
    message: "Product created successfully",
  });
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    // If file was uploaded but product not found, delete it
    if (req.file) {
      deleteImageFile(req.file.filename);
    }
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Store old image path for potential deletion
  const oldImagePath = product.image;

  // Update product fields
  product.name = req.body.name || product.name;
  product.category = req.body.category || product.category;
  product.brand = req.body.brand || product.brand;
  product.model = req.body.model || product.model;
  product.price = req.body.price !== undefined ? req.body.price : product.price;
  product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
  product.description = req.body.description || product.description;
  product.specifications = req.body.specifications
    ? typeof req.body.specifications === "string"
      ? JSON.parse(req.body.specifications)
      : req.body.specifications
    : product.specifications;
  product.featured =
    req.body.featured !== undefined
      ? req.body.featured === "true" || req.body.featured === true
      : product.featured;
  product.isActive =
    req.body.isActive !== undefined ? req.body.isActive : product.isActive;

  // Handle image update
  if (req.file) {
    // Delete old image if it's not a placeholder or external URL
    if (
      oldImagePath &&
      !oldImagePath.startsWith("http") &&
      !oldImagePath.includes("placeholder")
    ) {
      deleteImageFile(oldImagePath);
    }
    product.image = `/uploads/products/${req.file.filename}`;
  }

  const updatedProduct = await product.save();
  res.json({
    success: true,
    data: updatedProduct,
    message: "Product updated successfully",
  });
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete associated image file
    if (
      product.image &&
      !product.image.startsWith("http") &&
      !product.image.includes("placeholder")
    ) {
      deleteImageFile(product.image);
    }

    await product.deleteOne();
    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.ratings.count = product.reviews.length;
    product.ratings.average =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
});
