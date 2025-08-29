import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getBrands,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  uploadSingle,
  handleUploadError,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, uploadSingle, handleUploadError, createProduct);

router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, uploadSingle, handleUploadError, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route("/:id/reviews").post(protect, createProductReview);

export default router;
