import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directories if they don't exist
const productUploadDir = "uploads/products";
const userUploadDir = "uploads/users";

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

if (!fs.existsSync(userUploadDir)) {
  fs.mkdirSync(userUploadDir, { recursive: true });
}

// Configure multer for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configure multer for user profiles
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename for user profiles
    const uniqueName = `profile-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter to only allow image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"),
      false
    );
  }
};

// Configure multer for products
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Configure multer for user profiles
const userUpload = multer({
  storage: userStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// General upload (backwards compatibility)
const upload = multer({
  storage: userStorage, // Default to user storage
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Middleware for single product image upload
export const uploadSingle = productUpload.single("image");

// Middleware for multiple product image uploads
export const uploadMultiple = productUpload.array("images", 5); // Max 5 images

// Middleware for user profile picture upload
export const uploadProfilePic = userUpload.single("profilePic");

// General upload middleware (for backwards compatibility)
export { upload };

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 5 images.",
      });
    }
  }

  if (err.message.includes("Only image files")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};
