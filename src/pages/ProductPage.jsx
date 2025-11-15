import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useLocation } from "react-router-dom"; // ✅ Added for search
import ProductCard from "../components/ProductCard";
// import { getCategories, getBrands, getProducts } from "../services/productService";
import { getCategories, getProducts } from "../services/productService";
const ProductPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation(); // ✅ to get query params from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch Categories & Brands
  useEffect(() => {
    const fetchData = async () => {
      setCategories(await getCategories());
      // setBrands(await getBrands());
    };
    fetchData();
  }, []);

  // Fetch Products whenever filter, page or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      const params = {};

      if (selectedCategory) params["category__slug"] = selectedCategory;
      if (selectedBrand) params["brand__slug"] = selectedBrand;
      if (priceRange[0] !== null) params["price__gte"] = priceRange[0];
      if (priceRange[1] !== null) params["price__lte"] = priceRange[1];
      if (searchQuery) params["search"] = searchQuery; // ✅ for header search

      if (sortOption === "price_low") params["ordering"] = "price";
      else if (sortOption === "price_high") params["ordering"] = "-price";
      else if (sortOption === "newest") params["ordering"] = "-created_at";

      const data = await getProducts(params, currentPage);

      setProducts(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.current || 1);
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedBrand,
    priceRange,
    sortOption,
    currentPage,
    searchQuery,
  ]);

  const handleFilterChange = (applyChangeFn) => {
    applyChangeFn();
    setCurrentPage(1);
  };

  const handleCategoryClick = (slug) =>
    handleFilterChange(() =>
      setSelectedCategory((prev) => (prev === slug ? null : slug))
    );

  // const handleBrandSelect = (slug) =>
  //   handleFilterChange(() =>
  //     setSelectedBrand((prev) => (prev === slug ? null : slug))
  //   );

  const handlePriceChange = (min, max) =>
    handleFilterChange(() => setPriceRange([min, max]));

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange([0, 5000]);
    setSortOption("default");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          </h1>
          <p className="text-gray-600">
            {searchQuery
              ? "Here are the products that match your search."
              : "Discover our complete collection of premium products"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside
            className={`bg-gray-50 rounded-lg  p-4 w-full lg:w-64 transition-transform lg:translate-x-0
              ${sidebarOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="flex justify-between items-center lg:hidden pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                X
              </button>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-semibold ${
                    selectedCategory === null ? "bg-blue-100" : "text-gray-700"
                  }`}
                >
                  All Products
                </button>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div key={cat.slug}>
                      <button
                        onClick={() => handleCategoryClick(cat.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 ${
                          selectedCategory === cat.slug
                            ? "bg-blue-100"
                            : "text-gray-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                      {cat.children && cat.children.length > 0 && (
                        <div className="pl-4 mt-1 space-y-1">
                          {cat.children.map((child) => (
                            <button
                              key={child.slug}
                              onClick={() => handleCategoryClick(child.slug)}
                              className={`block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 ${
                                selectedCategory === child.slug
                                  ? "bg-blue-100"
                                  : "text-gray-600"
                              }`}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Loading categories...
                  </p>
                )}
              </div>
            </div>

            {/* Brands */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md lg:shadow-sm mb-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Brands</h3>
              <div className="space-y-2">
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <label
                      key={brand.slug}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand.slug}
                        onChange={() => handleBrandSelect(brand.slug)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{brand.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Loading brands...
                  </p>
                )}
              </div>
            </div> */}

            {/* Price Range */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceChange(Number(e.target.value), priceRange[1])
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-xl font-light text-gray-400">-</span>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceChange(priceRange[0], Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(priceRange[0], Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearAllFilters}
              className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium border border-red-200 shadow-sm"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <span className="text-gray-600 text-sm">
                  Showing <span className="font-semibold">{products.length}</span>{" "}
                  products
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-600 text-sm font-medium">
                  Sort by:
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low → High</option>
                  <option value="price_high">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 min-h-[300px]">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard key={product.id || index} product={product} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any products matching your filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={!products.length || currentPage === 1}
                    className="px-3 py-1 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 border rounded-lg text-sm ${
                        currentPage === idx + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={!products.length || currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
