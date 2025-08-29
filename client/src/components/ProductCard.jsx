import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Otherwise, construct full URL with API base
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  const imageUrl = getImageUrl(product.image);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {imageError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-2">📦</div>
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          {product.stock > 0 ? (
            product.stock <= 10 ? (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                Low Stock
              </span>
            ) : (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                In Stock
              </span>
            )
          ) : (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-blue-600 font-medium mb-1">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition duration-200">
          <Link to={`/products/${product._id}`} className="block">
            {product.name}
          </Link>
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-600 mb-2">
            Brand: <span className="font-medium">{product.brand}</span>
          </p>
        )}

        {/* Description Preview */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price and Stock Info */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xl font-bold text-gray-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition duration-200 text-sm font-medium"
          >
            View Details
          </Link>
          {product.stock > 0 && (
            <button
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality here
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
