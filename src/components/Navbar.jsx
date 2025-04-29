import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // add this

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate(); // add this

  // Simulate cart item fetch
  useEffect(() => {
    // Mock data - in production this would come from your state management
    setCartCount(3);
  }, []);
  
  // Navbar color change on scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/"); // use navigate, not window.location.href
  };

  
  return (
    <>
      {/* This is a spacer div that takes up the same amount of space as the navbar */}
      <div className={`w-full ${isScrolled ? "h-16" : "h-20"}`}></div>
      
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-white py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                StyleWithAi
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks />
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center">
              <Link to="/dashboard/cart" className="relative p-2 mr-4 hover:text-purple-600 transition-colors">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link to="/dashboard/account" className="p-2 mr-4 text-xl hover:text-purple-600 transition-colors">
                <FaUserCircle />
              </Link>
              
              {/* Distinct Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-md transition-all duration-200"
              >
                <FaSignOutAlt className="mr-1" />
                <span>Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button 
                className="ml-4 md:hidden focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <FaTimes className="h-6 w-6 text-purple-600" />
                ) : (
                  <FaBars className="h-6 w-6 text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white shadow-inner">
            <MobileNavLinks closeMenu={() => setMobileMenuOpen(false)} />
            <button 
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-md"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

const NavLinks = () => {
  const links = [
    { name: "Products", path: "/dashboard/products" },
    { name: "Chat", path: "/dashboard/commchat" },
    { name: "StyleBot", path: "/dashboard/chat" },
    { name: "Contact Us", path: "/dashboard/contact" }
  ];
  
  return (
    <>
      {links.map((link) => (
        <NavLink key={link.name} to={link.path}>
          {link.name}
        </NavLink>
      ))}
    </>
  );
};

const MobileNavLinks = ({ closeMenu }) => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/dashboard/products" },
    { name: "Chat", path: "/dashboard/commchat" },
    { name: "StyleBot", path: "/dashboard/chat" },
    { name: "Contact Us", path: "/dashboard/contact" },
    { name: "Cart", path: "/dashboard/cart" },
    { name: "My Account", path: "/dashboard/account" }
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-600 rounded-md"
          onClick={closeMenu}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

const NavLink = ({ to, children }) => {
  return (
    <Link 
      to={to} 
      className="relative text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200 py-2 px-1 group"
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
    </Link>
  );
};

export default Navbar;