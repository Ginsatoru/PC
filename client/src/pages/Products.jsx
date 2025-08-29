import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import api from "../utils/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const categories = [
    "CPU",
    "GPU",
    "RAM",
    "SSD",
    "HDD",
    "Motherboard",
    "Power Supply",
    "Cooling",
    "Case",
    "Monitor",
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "brand", label: "Brand" },
    { value: "createdAt", label: "Newest" },
  ];

  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
        sortBy,
        sortOrder,
      });

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      const response = await api.get(`/products?${params.toString()}`);

      if (response.data.success) {
        const responseData = response.data.data;
        const productsData = responseData.products || [];

        setProducts(productsData);
        setTotalPages(responseData.totalPages || 1);
        setTotalProducts(responseData.total || productsData.length);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 mx-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    );

    // First page if needed
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 mx-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 border rounded transition duration-200 ${
            currentPage === i
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 mx-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 mx-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return pages;
  };

  // Calculate display info for current page
  const startItem = (currentPage - 1) * productsPerPage + 1;
  const endItem = Math.min(currentPage * productsPerPage, totalProducts);

  if (loading && currentPage === 1) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            All Products
          </h1>
          <p className="text-gray-600">
            Discover the latest PC parts and components for your build
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* Categories Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm transition duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-3 py-1 rounded text-sm transition duration-200 ${
                  sortBy === option.value
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {option.label}
                {sortBy === option.value && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                    title="Remove search filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                    title="Remove category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition duration-200"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          /* No Products Found */
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Products Found
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory
                ? "No products match your current search criteria. Try adjusting your filters or search term."
                : "No products are available at the moment. Please check back later."}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          /* Products Display */
          <>
            {/* Products Count Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {searchTerm || selectedCategory ? (
                  <>
                    Search Results
                    {searchTerm && (
                      <span className="text-blue-600"> for "{searchTerm}"</span>
                    )}
                    {selectedCategory && (
                      <span className="text-blue-600">
                        {" "}
                        in {selectedCategory}
                      </span>
                    )}
                  </>
                ) : (
                  "All Products"
                )}
              </h2>
              <div className="text-sm text-gray-600">
                {totalProducts} {totalProducts === 1 ? "product" : "products"}{" "}
                found
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  {/* Page Numbers */}
                  <div className="flex justify-center items-center space-x-1">
                    {renderPagination()}
                  </div>

                  {/* Results Info */}
                  <div className="text-sm text-gray-600 text-center">
                    Showing {startItem} to {endItem} of {totalProducts} products
                    <span className="text-gray-500">
                      {" "}
                      (Page {currentPage} of {totalPages})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Single page results info */}
            {totalPages === 1 && totalProducts > 0 && (
              <div className="text-center text-sm text-gray-600 mt-4">
                Showing all {totalProducts}{" "}
                {totalProducts === 1 ? "product" : "products"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
