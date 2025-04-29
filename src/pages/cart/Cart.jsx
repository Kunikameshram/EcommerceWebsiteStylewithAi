import { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const userId = sessionStorage.getItem("userId");

useEffect(() => {
  if (!userId) return;
  axios
    .get(`http://3.137.162.97:5001/api/cart?userId=${userId}`)
    .then((res) => setCartItems(res.data))
    .catch((err) => console.error(err));
}, [userId]);


  const updateQuantity = (id, change) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updated);

    const updatedItem = updated.find((item) => item.id === id);
    axios.put("http://3.137.162.97:5001/api/cart/update", {
      id,
      quantity: updatedItem.quantity,
    });
  };

  const removeItem = (id) => {
    axios.delete(`http://3.137.162.97:5001/api/cart/${id}`).then(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 text-xl min-h-screen bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">YOUR CART</h2>
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center">YOUR CART</h2>
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Cart Items */}
        <div className="flex-1 bg-white p-4 shadow rounded-lg">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                  Size: {item.size ? item.size : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Color: {item.color || "Default"}
                  </p>
                  <p className="font-bold">${item.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="px-3 py-1 border rounded-l"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  className="px-3 py-1 border rounded-r"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
                <button
                  className="ml-3 px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3 bg-white p-4 shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Discount (-20%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <input
            type="text"
            placeholder="Add promo code"
            className="w-full p-2 mt-4 border rounded"
          />
          <button className="w-full bg-black text-white p-3 mt-2 rounded">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
