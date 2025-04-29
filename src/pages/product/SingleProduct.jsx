import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaHandHoldingDollar, FaTruck, FaArrowLeft } from "react-icons/fa6";
import { BsBox2HeartFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { AiOutlineFileProtect, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-toastify/dist/ReactToastify.css";
import Deals from "../deals/Deals";


const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [wishlist, setWishlist] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  // Fetch product details, similar products, and reviews
  useEffect(() => {
    if (!id) return;

    // Fetch main product
    axios
      .get(`http://3.145.109.156:5001/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);

        // Set default selected size
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        } else {
          setSelectedSize("");
        }
        // Set default selected color
        if (
          res.data.colors &&
          res.data.colors.availableColors &&
          res.data.colors.availableColors.length > 0
        ) {
          setSelectedColor(res.data.colors.availableColors[0].name);
        } else {
          setSelectedColor("");
        }
      })
      .catch((err) => console.error(err));

    // Fetch reviews for this product
    setReviewsLoading(true);
    axios
      .get(`http://3.145.109.156:5001/api/products/${id}/reviews`)
      .then((res) => {
        setReviews(res.data);
        // Calculate average rating
        if (res.data.length > 0) {
          const total = res.data.reduce((sum, review) => sum + review.rating, 0);
          setAvgRating(total / res.data.length);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));

    // Fetch similar products
    axios
      .get(`http://3.145.109.156:5001/api/products/similar/${id}`)
      .then((res) => setSimilarProducts(res.data))
      .catch((err) => console.error("Failed to fetch similar products", err));
  }, [id]);

  const addToCart = () => {
    if (!product?.id) {
      toast.error("Invalid product.");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    setLoading(true);

    axios
      .post("http://3.145.109.156:5001/api/cart/add", {
        user_id: userId,
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
      .then(() => {
        toast.success("Item added to cart!");
        setTimeout(() => navigate("/dashboard/cart"), 1000);
      })
      .catch((err) => {
        toast.error("Failed to add to cart");
        console.error("Add to cart failed:", err);
      })
      .finally(() => setLoading(false));
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
    toast.success(wishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!product) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-6">
        <button 
          onClick={() => navigate("/dashboard/products")} 
          className="flex items-center text-gray-700 hover:text-black transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to shopping
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Details Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image Gallery */}
            <div className="w-full lg:w-1/2 relative">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                loop={true}
                className="h-full"
                onSwiper={(swiper) => (swiperRef.current = swiper)}
              >
                <SwiperSlide>
                  <div className="h-[600px] relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        SALE
                      </div>
                    )}
                  </div>
                </SwiperSlide>
                {/* Add more slides if product has multiple images */}
              </Swiper>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
              <div className="mb-auto">
                {/* Product Category */}
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                  {product.category || "Premium Collection"}
                </p>

                {/* Product Name */}
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <button 
                    onClick={toggleWishlist} 
                    className="text-2xl text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    {wishlist ? <BsHeartFill className="text-red-500" /> : <BsHeart />}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="text-yellow-400 mr-2">
                    {"★".repeat(Math.round(avgRating))}
                    {"☆".repeat(5 - Math.round(avgRating))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <p className="text-3xl font-bold text-gray-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  {product.original_price && (
                    <p className="text-gray-500 line-through text-lg">
                      ${parseFloat(product.original_price).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Tabs for product info */}
                <div className="mb-8">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "description"
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      Description
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "details"
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("details")}
                    >
                      Details
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "shipping"
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("shipping")}
                    >
                      Shipping
                    </button>
                  </div>

                  <div className="py-4">
                    {activeTab === "description" && (
                      <p className="text-gray-700">{product.description}</p>
                    )}
                    {activeTab === "details" && (
                      <ul className="list-disc pl-5 text-gray-700">
                        <li>Premium quality materials</li>
                        <li>Designed for comfort and style</li>
                        <li>Easy care instructions</li>
                        <li>Made with sustainable processes</li>
                      </ul>
                    )}
                    {activeTab === "shipping" && (
                      <div className="text-gray-700">
                        <p>Free standard shipping on orders over $250.</p>
                        <p className="mt-2">Express shipping available for an additional fee.</p>
                        <p className="mt-2">International shipping options available at checkout.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">Size</span>
                  <a href="#" className="text-sm text-gray-500 hover:underline">Size Guide</a>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`min-w-[40px] px-3 py-2 rounded-md font-medium text-sm transition-all ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No sizes available</span>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mt-6">
                <span className="font-medium text-gray-800 block mb-2">Color: {selectedColor}</span>
                <div className="flex gap-3 items-center flex-wrap">
                  {product.colors?.availableColors?.length > 0 ? (
                    product.colors.availableColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor === color.name
                            ? "border-black ring-2 ring-gray-300 scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{
                          background: color.hex,
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => setSelectedColor(color.name)}
                        aria-label={color.name}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No colors available</span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6">
                <span className="font-medium text-gray-800 block mb-2">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button 
                    className="px-3 py-2 text-gray-600 hover:text-black transition-colors"
                    onClick={decrementQuantity}
                  >
                    <AiOutlineMinus />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-full text-center border-0 focus:ring-0"
                  />
                  <button 
                    className="px-3 py-2 text-gray-600 hover:text-black transition-colors"
                    onClick={incrementQuantity}
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-md shadow font-medium text-base transition-all ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  }`}
                  onClick={addToCart}
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  className="flex-1 px-6 py-3 rounded-md border border-black bg-white text-black font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  onClick={() => {
                    addToCart();
                    setTimeout(() => navigate("/dashboard/checkout"), 1000);
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="rounded-xl shadow-md p-8 bg-white mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHandHoldingDollar className="text-3xl text-emerald-600" />,
                title: "Premium Quality",
                detail: "Crafted from the finest materials for durability and comfort",
              },
              {
                icon: <AiOutlineFileProtect className="text-3xl text-blue-600" />,
                title: "Warranty Protection",
                detail: "Full coverage warranty for over 1 year on all products",
              },
              {
                icon: <FaTruck className="text-3xl text-purple-600" />,
                title: "Free Shipping",
                detail: "Complimentary shipping on all orders over $250",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="p-3 mb-4 rounded-full bg-gray-50">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="rounded-xl shadow-md bg-white p-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <BsBox2HeartFill className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet for this product.</p>
              <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div>
              {/* Rating Summary */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
                    <div className="text-yellow-400 text-xl mt-2">
                      {"★".repeat(Math.round(avgRating))}
                      {"☆".repeat(5 - Math.round(avgRating))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                      
                      return (
                        <div key={star} className="flex items-center mb-1">
                          <div className="text-gray-600 w-8">{star}★</div>
                          <div className="flex-1 mx-3">
                            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-gray-500 text-sm w-16">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.username}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 mr-2">
                            {"★".repeat(review.rating)}
                            <span className="text-gray-200">{"★".repeat(5 - review.rating)}</span>
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">
                        Verified Purchase
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.comment}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <button className="flex items-center hover:text-gray-700">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                        Helpful (3)
                      </button>
                      <span className="mx-2">|</span>
                      <button className="hover:text-gray-700">Report</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <Swiper
              slidesPerView={1}
              spaceBetween={24}
              grabCursor={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              className="w-full"
            >
              {similarProducts.map((item) => (
                <SwiperSlide key={item.id}>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                    onClick={() => navigate(`/dashboard/product/${item.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-black font-medium px-4 py-2 rounded-md transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          Quick View
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                        <div className="text-yellow-400 text-sm">★★★★☆</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex justify-center mt-8 gap-4">
              <button className="swiper-button-prev bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button className="swiper-button-next bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <Deals />
    </div>
  );
};

export default SingleProduct;