import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const categories = {
    cpu: 'CPUs',
    gpu: 'Graphics Cards',
    ram: 'Memory (RAM)',
    ssd: 'Storage (SSD)',
    hdd: 'Storage (HDD)',
    motherboard: 'Motherboards',
    psu: 'Power Supplies',
    case: 'PC Cases',
    cooling: 'Cooling Solutions'
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products?category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {categories[category] || category.toUpperCase()}
              </h1>
              <p className="text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="brand-asc">Brand (A-Z)</option>
                <option value="createdAt-desc">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Browse Categories</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, name]) => (
              <button
                key={key}
                onClick={() => window.location.href = `/category/${key}`}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  category === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                We don't have any products in the {categories[category] || category} category yet.
              </p>
              <button
                onClick={() => window.location.href = '/products'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Category Description */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            About {categories[category] || category.toUpperCase()}
          </h2>
          <div className="text-gray-600 space-y-2">
            {category === 'cpu' && (
              <p>Discover high-performance processors from leading brands like Intel and AMD. Whether you're building a gaming rig or workstation, find the perfect CPU for your needs.</p>
            )}
            {category === 'gpu' && (
              <p>Explore powerful graphics cards from NVIDIA and AMD. From budget-friendly options to high-end gaming and professional GPUs for the ultimate visual experience.</p>
            )}
            {category === 'ram' && (
              <p>Boost your system's performance with high-quality memory modules. Choose from various speeds, capacities, and form factors to optimize your build.</p>
            )}
            {category === 'ssd' && (
              <p>Fast and reliable solid-state drives for lightning-quick boot times and file transfers. Available in various interfaces including SATA, NVMe, and M.2.</p>
            )}
            {category === 'motherboard' && (
              <p>The foundation of your PC build. Find compatible motherboards with the features you need, from basic builds to advanced enthusiast systems.</p>
            )}
            {category === 'psu' && (
              <p>Reliable power supplies to keep your system running smoothly. Choose from efficient, modular, and high-wattage options for any build.</p>
            )}
            {!categories[category] && (
              <p>Browse our selection of high-quality PC components and accessories. All products come with manufacturer warranty and fast shipping.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;