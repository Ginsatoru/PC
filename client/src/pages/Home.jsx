import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FiArrowRight, FiCpu, FiHardDrive, FiMonitor } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getFeaturedProducts();
        setFeaturedProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'CPUs & Processors',
      icon: FiCpu,
      slug: 'CPU',
      description: 'High-performance processors for gaming and productivity',
      color: 'bg-blue-500',
    },
    {
      name: 'Graphics Cards',
      icon: FiMonitor,
      slug: 'GPU',
      description: 'Powerful GPUs for gaming and content creation',
      color: 'bg-green-500',
    },
    {
      name: 'Storage & Memory',
      icon: FiHardDrive,
      slug: 'SSD',
      description: 'Fast SSDs and reliable storage solutions',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Your Dream PC
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Premium PC components and parts for enthusiasts, gamers, and professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Shop All Products
              </Link>
              <Link
                to="/category/GPU"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
              >
                View Graphics Cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect components for your build from our extensive selection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 text-center"
                >
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-primary-600 font-medium">
                    Browse {category.name}
                    <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Hand-picked components for the best performance and value
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              View All Products
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured products..." />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {featuredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No featured products available at the moment.</p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="btn btn-primary inline-flex items-center"
            >
              View All Products
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PC PartShop?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best PC building experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCpu className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Only the highest quality components from trusted brands
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHardDrive className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600">
                Quick and secure delivery to get your build started sooner
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMonitor className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Support
              </h3>
              <p className="text-gray-600">
                Knowledgeable support team to help with your PC building journey
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;