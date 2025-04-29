import { Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/home/Home";
import ProductList from "./pages/arrivals/Arrivals";
import ProductDetail from "./pages/product/SingleProduct";
import Contact from "./pages/contact/Contact";
import Cart from "./pages/cart/Cart";
import Account from "./pages/Account";
import ChatBot from "./pages/ChatBot";
import ChatApp from "./pages/communityChat/commChat";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={() => window.location.reload()} />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="chat" element={<ChatBot />} />
          <Route path="commchat" element={<ChatApp />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={1500} />
    </>
  );
}

export default App;
