import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

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
    query.category = req.query.category;
  }

  // Brand filter
  if (req.query.brand) {
    query.brand = new RegExp(req.query.brand, 'i');
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Sort options
  let sortOptions = { createdAt: -1 };
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_low':
        sortOptions = { price: 1 };
        break;
      case 'price_high':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
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

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
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

  res.json(products);
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json(categories);
});

// @desc    Get product brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand', { isActive: true });
  res.json(brands);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews.user',
    select: 'name',
  });

  if (product && product.isActive) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

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
    image,
    images,
    featured,
  } = req.body;

  // Validation
  if (!name || !category || !brand || !model || !price || !description) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const product = new Product({
    name,
    category,
    brand,
    model,
    price,
    stock: stock || 0,
    description,
    specifications,
    image: image || 'https://via.placeholder.com/400x300?text=PC+Part',
    images: images || [],
    featured: featured || false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.model = req.body.model || product.model;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.description = req.body.description || product.description;
    product.specifications = req.body.specifications || product.specifications;
    product.image = req.body.image || product.image;
    product.images = req.body.images || product.images;
    product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;
    product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
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
      return res.status(400).json({ message: 'Product already reviewed' });
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
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});