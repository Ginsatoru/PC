import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product, 1);
    } else {
      toast.error('Product is out of stock');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
              Low Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Brand and Model */}
          <p className="text-sm text-gray-600 mb-2">
            {product.brand} • {product.model}
          </p>

          {/* Rating */}
          {product.ratings && product.ratings.count > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {renderStars(product.ratings.average)}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.ratings.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-gray-500">
              Stock: {product.stock}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 btn btn-outline text-center"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 btn flex items-center justify-center space-x-2 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;