import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Arrivals = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Women's Fashion");
  const [visibleCount, setVisibleCount] = useState(6);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [expandedProductData, setExpandedProductData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");         // Search state
  const [sortOrder, setSortOrder] = useState("");           // Sort state

  useEffect(() => {
    axios
      .get("https://3.137.162.97:5001/api/products/arrivals?page=1&limit=30")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    "ALL",
    "Men's Fashion",
    "Women's Fashion",
    "Women Accessories",
    "Men Accessories",
    "Discount Deals",
  ];

  // Filter by category and search, then sort by price
  let filteredProducts = products.filter((product) => {
    // If ALL, do not filter by category
    const categoryMatch =
      activeCategory === "ALL" ||
      (product.category && product.category.includes(activeCategory));
    const nameMatch =
      product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && nameMatch;
  });
  

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => parseFloat(b.price) - parseFloat(a.price)
    );
  }

  const handleExpand = (productId) => {
    window.open(`/dashboard/product/${productId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-6xl font-bold text-center text-gray-800 mb-4">
        New Arrivals
      </h1>

      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-5xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black"
        />
      </div>

      {/* Category Filters & Sort Dropdown */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 items-center">
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setVisibleCount(6);
                setExpandedProductId(null);
                setExpandedProductData(null);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="highToLow">Ratings</option>

        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <React.Fragment key={product.id}>
            <div
              onClick={() => handleExpand(product.id)}
              className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:scale-[1.01] transition"
            >
              <img
                src={product.image_url || "/images/default.png"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800">
                {product.name}
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                ${parseFloat(product.price).toFixed(2)}
              </p>
              <p
                className={`text-sm font-semibold mt-2 ${
                  product.status?.includes("High")
                    ? "text-red-500"
                    : "text-orange-500"
                }`}
              >
                {product.status || "Available"}
              </p>
            </div>

            {expandedProductId === product.id && expandedProductData && (
              <div className="col-span-full bg-white rounded-lg shadow-md p-6 sm:flex gap-6">
                <div className="sm:w-1/2">
                  <img
                    src={expandedProductData.image_url}
                    alt={expandedProductData.name}
                    className="w-full h-[400px] object-cover rounded"
                  />
                </div>
                <div className="sm:w-1/2 mt-6 sm:mt-0 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {expandedProductData.name}
                    </h2>
                    <p className="text-gray-600 text-sm mt-4 font-semibold">
                      DESCRIPTION
                    </p>
                    <p className="text-gray-700 mt-4 text-sm">
                      {expandedProductData.description}
                    </p>
                    <div className="mt-4">
                      <span className="font-semibold text-gray-700">Size:</span>
                      <span className="ml-2 bg-black text-white text-xs px-3 py-1 rounded">
                        {expandedProductData.size}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold mt-6 text-gray-900">
                      ${parseFloat(expandedProductData.price).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      axios
                        .post("https://3.137.162.97:5001/api/cart/add", {
                          user_id: 1,
                          product_id: expandedProductData.id,
                          quantity: 1,
                        })
                        .then(() => {
                          toast.success("Item added to cart!");
                          setTimeout(
                            () => (window.location.href = "/dashboard/cart"),
                            1000
                          );
                        })
                        .catch(() => toast.error("Failed to add to cart"));
                    }}
                    className="mt-8 bg-black text-white px-6 py-2 rounded shadow hover:bg-gray-800 transition w-max"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => setVisibleCount((prev) => prev + 6)}
          className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default Arrivals;
