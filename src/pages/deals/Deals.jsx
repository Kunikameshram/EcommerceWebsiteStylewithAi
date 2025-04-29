import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Pass userId as a prop or get from context/auth/session
const userId = sessionStorage.getItem("userId"); // Example: replace with actual user ID

const EnhancedDealsCarousel = () => {
  const [deals, setDeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const handleExpand = (productId) => {
    window.open(`/dashboard/product/${productId}`, "_blank");
  };

  // Fetch personalized deals from backend
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://3.145.109.156:5001/api/products/deals?user_id=${userId}`)
      .then((res) => {
        setDeals(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching deals:", error);
        setLoading(false);
        // Optional fallback sample data matching new API fields
        setDeals([
          {
            id: 1,
            name: "Men's Classic White Shirt",
            description: "100% cotton formal shirt with slim fit",
            price: 29.99,
            image_url: "/images/shirt.png",
            category: "Men's Fashion",
            stock_quantity: 50,
          },
          {
            id: 2,
            name: "Women's Designer Handbag",
            description: "Trendy handbag with gold accents",
            price: 79.99,
            image_url: "/images/handbag.png",
            category: "Women Accessories",
            stock_quantity: 25,
          },
        ]);
      });
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (deals.length <= 1 || !autoplay || isHovering) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deals.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [deals, autoplay, isHovering]);

  const handleNextDeal = () => {
    setCurrentIndex((prev) => (prev + 1) % deals.length);
    setAutoplay(false);
  };

  const handlePrevDeal = () => {
    setCurrentIndex((prev) => (prev === 0 ? deals.length - 1 : prev - 1));
    setAutoplay(false);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setAutoplay(false);
  };

  if (loading) {
    return (
      <div className="w-full h-screen max-h-screen bg-gray-50 flex justify-center items-center rounded-lg overflow-hidden shadow-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-32 bg-gray-300 rounded mb-6"></div>
          <div className="h-32 w-32 rounded-full bg-gray-300 mb-6"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!deals.length) {
    return (
      <div className="w-full h-screen max-h-screen bg-white flex justify-center items-center rounded-lg overflow-hidden shadow-lg">
        <p className="text-gray-500 text-xl font-light">
          No recommendations available
        </p>
      </div>
    );
  }

  const currentDeal = deals[currentIndex];

  return (
    <div 
      className="w-full h-screen max-h-screen relative bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress bar indicating autoplay progress */}
      {autoplay && (
        <div className="absolute top-0 left-0 right-0 h-1 z-10">
          <div className="relative h-full">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear", repeat: 0 }}
              key={currentIndex}
              className="absolute h-full bg-white bg-opacity-70"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-6 flex justify-between items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white font-medium text-xl tracking-tight"
        >
          Personalized Deal by AI
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm text-gray-300 flex items-center"
        >
          <span className="mr-2">Recommended for You</span>
          <div className="h-5 w-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <span className="text-xs">{currentIndex + 1}/{deals.length}</span>
          </div>
        </motion.div>
      </div>

      {/* Main carousel */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col md:flex-row"
          >
            {/* Product showcase */}
            <div className="relative z-10 h-full w-full flex flex-col md:flex-row items-center">
              {/* Left side - image */}
              <div className="md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="p-6 md:p-10 w-full h-full flex items-center justify-center"
                >
                  <img
                    src={currentDeal.image_url}
                    alt={currentDeal.name}
                    className="max-w-full max-h-full object-contain drop-shadow-xl"
                  />
                </motion.div>
              </div>

              {/* Right side - info */}
              <div className="md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-6 md:p-10">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-sm font-light text-gray-400 uppercase tracking-widest mb-3">
                    {currentDeal.category}
                  </div>
                  
                  <h1 className="text-2xl md:text-4xl font-light text-white tracking-tight leading-tight mb-4">
                    {currentDeal.name}
                  </h1>
                  
                  <p className="text-gray-300 mb-6 font-light leading-relaxed">
                    {currentDeal.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-3xl font-normal text-white">
                      ${currentDeal.price}
                    </span>
                    {currentDeal.original_price && (
                      <span className="text-lg font-light text-gray-400 line-through">
                        ${currentDeal.original_price}
                      </span>
                    )}
                  </div>

                  {currentDeal.stock_quantity && (
                    <div className="mb-6">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            style={{ width: `${Math.min(currentDeal.stock_quantity/100 * 100, 100)}%` }} 
                            className="bg-white h-1.5 rounded-full"
                          ></div>
                        </div>
                        <span className="ml-4 text-gray-300 text-sm">
                          {currentDeal.stock_quantity} left
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExpand(currentDeal.id)}
                    className="w-full bg-white text-black py-3 px-6 transition-all duration-300 text-base uppercase tracking-wider font-medium rounded-sm shadow-lg hover:shadow-xl"
                  >
                    View Details
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrevDeal}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white h-12 w-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 focus:outline-none z-20"
        aria-label="Previous deal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      <button
        onClick={handleNextDeal}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white h-12 w-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 focus:outline-none z-20"
        aria-label="Next deal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6 px-6 z-10">
        <div className="flex justify-between items-center">
          {/* Dot indicators */}
          <div className="flex-1">
            <div className="flex space-x-2">
              {deals.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-1 transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-gray-500 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Autoplay toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setAutoplay(!autoplay)}
              className="flex items-center"
            >
              <span className="mr-2 text-xs text-gray-300">
                {autoplay ? "Autoplay" : "Manual"}
              </span>
              <div
                className={`w-10 h-5 rounded-full relative ${
                  autoplay ? "bg-white" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full transition-transform ${
                    autoplay 
                      ? "right-0.5 bg-black" 
                      : "left-0.5 bg-gray-300"
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Thumbnail strip */}
      {deals.length > 1 && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <div className="flex space-x-3 overflow-x-auto py-2 px-4 max-w-md scrollbar-hide">
            {deals.map((deal, idx) => (
              <button
                key={deal.id}
                onClick={() => handleDotClick(idx)}
                className={`flex-shrink-0 transition-all duration-300 ${
                  idx === currentIndex
                    ? "opacity-100 transform scale-105"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="relative w-14 h-14 rounded overflow-hidden">
                  <img
                    src={deal.image_url}
                    alt={deal.name}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 border-2 rounded ${
                      idx === currentIndex
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDealsCarousel;