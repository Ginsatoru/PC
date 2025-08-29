import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../utils/api";
import ProductCard from "../components/ProductCard";
import {
  FiArrowRight,
  FiCpu,
  FiHardDrive,
  FiMonitor,
  FiShield,
  FiTruck,
  FiHeadphones,
  FiStar,
  FiAward,
  FiZap
} from "react-icons/fi";
import bannerImage from "../images/banner.png";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getFeaturedProducts();
        setFeaturedProducts(response.data.data || []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const categories = [
    {
      name: "CPUs & Processors",
      icon: FiCpu,
      slug: "CPU",
      description: "High-performance processors for gaming and productivity",
      gradient: "from-sky-400 to-blue-600",
    },
    {
      name: "Graphics Cards",
      icon: FiMonitor,
      slug: "GPU",
      description: "Powerful GPUs for gaming and content creation",
      gradient: "from-emerald-400 to-green-600",
    },
    {
      name: "Storage & Memory",
      icon: FiHardDrive,
      slug: "SSD",
      description: "Fast SSDs and reliable storage solutions",
      gradient: "from-purple-400 to-indigo-600",
    },
  ];

  const features = [
    {
      icon: FiAward,
      title: "Premium Quality",
      description: "Only the highest quality components from trusted brands worldwide"
    },
    {
      icon: FiTruck,
      title: "Fast Shipping",
      description: "Quick and secure delivery to get your build started sooner"
    },
    {
      icon: FiHeadphones,
      title: "Expert Support",
      description: "Knowledgeable support team to help with your PC building journey"
    },
    {
      icon: FiShield,
      title: "Warranty Protection",
      description: "Comprehensive warranty coverage on all products"
    },
    {
      icon: FiZap,
      title: "Latest Technology",
      description: "Stay ahead with the newest components and innovations"
    },
    {
      icon: FiStar,
      title: "5-Star Reviews",
      description: "Trusted by thousands of satisfied customers"
    }
  ];

  // Skeleton loading component
  const ProductSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  const isVisible = (id) => visibleElements.has(id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section
        className="relative text-white py-20 sm:py-24 lg:py-72 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Build Your Dream PC
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-sky-100 animate-fade-in animation-delay-200">
              Premium PC components and parts for enthusiasts, gamers, and professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
              <Link
                to="/products"
                className="group bg-white text-sky-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                Shop All Products
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/category/GPU"
                className="group border-2 border-white text-white hover:bg-white hover:text-sky-600 px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                View Graphics Cards
                <FiMonitor className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-700 ${isVisible('categories-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            id="categories-header"
            data-animate
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect components for your build from our extensive selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 sm:p-8 text-center transform hover:-translate-y-2 ${isVisible(`category-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  id={`category-${index}`}
                  data-animate
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`bg-gradient-to-r ${category.gradient} w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <span className="inline-flex items-center text-sky-500 dark:text-sky-400 font-medium text-sm sm:text-base">
                    Browse {category.name}
                    <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 transition-all duration-700 ${isVisible('products-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            id="products-header"
            data-animate
          >
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Hand-picked components for the best performance and value
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center text-sky-500 dark:text-sky-400 font-medium hover:text-sky-600 dark:hover:text-sky-300 transition-colors duration-300 group"
            >
              View All Products
              <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array(8).fill(0).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl transition-colors duration-300 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts && featuredProducts.length > 0
                  ? featuredProducts
                    .slice(0, 8)
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className={`transition-all duration-700 ${isVisible(`product-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        id={`product-${index}`}
                        data-animate
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))
                  : null}
              </div>

              {(!featuredProducts || featuredProducts.length === 0) && (
                <div className="text-center py-12">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      No featured products available at the moment.
                    </p>
                    <Link
                      to="/products"
                      className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl transition-colors duration-300 font-medium inline-flex items-center"
                    >
                      Browse All Products
                      <FiArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/products"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl transition-colors duration-300 font-medium inline-flex items-center"
            >
              View All Products
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-700 ${isVisible('features-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            id="features-header"
            data-animate
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Gin PC & Accessories?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best PC building experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`group bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible(`feature-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  id={`feature-${index}`}
                  data-animate
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;