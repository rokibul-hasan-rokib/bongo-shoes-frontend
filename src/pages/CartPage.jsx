import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, fetchCart, handleUpdateQuantity, handleRemoveItem } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({}); // Track loading per item

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  const handleIncrease = async (item) => {
    if (item.quantity >= (item.product.stock || 99)) return; // Stock limit check
    setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
    await handleUpdateQuantity(item.id, item.quantity + 1);
    setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
    await handleUpdateQuantity(item.id, item.quantity - 1);
    setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
  };

  const handleRemove = async (item) => {
    setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
    await handleRemoveItem(item.id);
    setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-600">Loading your cart...</p>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const items = cart.items;
  const total = parseFloat(cart.total_price || 0);
  const itemCount = cart.total_items || 0;
  const shippingCost = total > 75 ? 0 : 9.99;
  // const tax = total * 0.08;
  const tax = total * 0;
  const finalTotal = total + shippingCost + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart ({itemCount} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={
                    item.product.images?.length
                      ? item.product.images.find(img => img.is_primary)?.image
                      : "https://via.placeholder.com/100"
                  }
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {item.size && (
                      <p>
                        Size:{" "}
                        <span className="font-medium text-gray-700">
                          {item.size}
                        </span>
                      </p>
                    )}
                    {item.color && (
                      <div className="flex items-center gap-2 mt-1">
                        <span>Color:</span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1 || updatingItems[item.id]}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    disabled={updatingItems[item.id] || item.quantity >= (item.product.stock || 99)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-gray-900 font-semibold flex items-center">
                    <span className="mr-1" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>
                      ৳
                    </span>
                    {item.total_price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item)}
                    className="mt-2 text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition"
                    disabled={updatingItems[item.id]}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
             <span className="text-gray-800 font-medium flex items-center">
                <span className="mr-1" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 500 }}>
                  ৳
                </span>
                {total.toFixed(2)}
              </span>

            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span
                className={`font-medium ${
                  shippingCost === 0 ? "text-green-600" : "text-gray-800"
                }`}
              >
                {shippingCost === 0
                  ? "Free"
                  : `৳${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (0%)</span>
              <span className="font-medium text-gray-800">
                ৳{tax.toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span className="flex items-center text-gray-900 font-semibold">
                <span className="mr-1" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>
                  ৳
                </span>
                {finalTotal.toFixed(2)}
              </span>

            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium text-center block shadow"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition font-medium text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
