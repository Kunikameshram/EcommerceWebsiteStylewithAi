import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthPages = ({ onLoginSuccess }) => {
  const [activePage, setActivePage] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard/products");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("https://3.137.162.97:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Login successful!" });
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userId", data.user_id);
        sessionStorage.setItem("role", data.role);
        
        setTimeout(() => {
          window.location.href = "/dashboard/products";
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Server error" });
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignup();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      setMessage({ type: "error", text: "Please fix validation errors." });
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await fetch("https://3.137.162.97:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupName,
          email: signupEmail,
          password: signupPassword,
          role: "customer",
          gender: signupGender,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => {
          setActivePage("login");
          setMessage({ type: "", text: "" });
          setErrors({});
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Server error" });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("https://3.137.162.97:5001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => {
          setActivePage("login");
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Server error" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateSignup = () => {
    const newErrors = {};
  
    if (!signupName.trim()) {
      newErrors.signupName = "Name is required.";
    } else if (/\d/.test(signupName)) {
      newErrors.signupName = "Name cannot contain numbers.";
    }
  
    if (!signupMobile.trim()) {
      newErrors.signupMobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(signupMobile)) {
      newErrors.signupMobile = "Mobile number must be 10 digits.";
    }
  
    if (!signupEmail.trim()) {
      newErrors.signupEmail = "Email is required.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(signupEmail)) {
      newErrors.signupEmail = "Email format is invalid.";
    }
  
    if (!signupPassword.trim()) {
      newErrors.signupPassword = "Password is required.";
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = "Password must be at least 6 characters.";
    }
  
    return newErrors;
  };
  

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97 },
    initial: { scale: 1 }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {activePage === "login" && (
            <motion.div
              key="login"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="bg-white rounded-lg shadow-md p-8 w-full border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>
              <p className="text-center text-gray-600 mb-6">Welcome to our Fashion Store</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="loginEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="loginPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex justify-center items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>
              
              <div className="flex justify-between mt-4 text-sm">
                <button
                  onClick={() => setActivePage("signup")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setActivePage("forgot")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </button>
              </div>
            </motion.div>
          )}

          {activePage === "forgot" && (
            <motion.div
              key="forgot"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="bg-white rounded-lg shadow-md p-8 w-full border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New password"
                  />
                </div>
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex justify-center items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActivePage("login")}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Back to Sign In
                </button>
              </div>
            </motion.div>
          )}

          {activePage === "signup" && (
            <motion.div
              key="signup"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="bg-white rounded-lg shadow-md p-8 w-full border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="signupName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="signupName"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                    {errors.signupName && <p className="text-red-500 text-xs mt-1">{errors.signupName}</p>}

                </div>
                <div>
                  <label
                    htmlFor="signupMobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="signupMobile"
                    type="tel"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="Your mobile number"
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.signupMobile && <p className="text-red-500 text-xs mt-1">{errors.signupMobile}</p>}

                </div>
                <div>
                  <label
                    htmlFor="signupEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.signupEmail && <p className="text-red-500 text-xs mt-1">{errors.signupEmail}</p>}

                </div>
                <div>
                  <label
                    htmlFor="signupPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.signupPassword && <p className="text-red-500 text-xs mt-1">{errors.signupPassword}</p>}

                </div>
                <div>
                  <label
                    htmlFor="signupGender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Shopping Preference
                  </label>
                  <select
                    id="signupGender"
                    value={signupGender}
                    onChange={(e) => setSignupGender(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select preference</option>
                    <option value="Male">Men's Fashion</option>
                    <option value="Female">Women's Fashion</option>
                    <option value="Other">All Collections</option>
                  </select>
                </div>
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex justify-center items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActivePage("login")}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
              message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPages;