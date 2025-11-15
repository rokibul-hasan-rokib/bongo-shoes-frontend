import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, MapPin, CreditCard } from "lucide-react";
import { getOrderById } from "../services/orderService";

export default function OrderSuccessPage() {
  const location = useLocation();
  const { orderId } = location.state || {}; 
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ error state

  useEffect(() => {
    if (!orderId) {
      console.error("No orderId found in navigation state");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId); 
        setOrder(data);
      } catch (err) {
        console.error("❌ Failed to load order:", err);
        setError("Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);
console.log(order)
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Order...</h1>
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        <Link
          to="/products"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">
          No order found. Please check your orders.
        </h2>
        <Link
          to="/products"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border-t-8 border-green-500">
        {/* Header */}
        <div className="text-center mb-10">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. A confirmation email has been sent to your inbox.
          </p>
        </div>

        <hr className="mb-8 border-gray-200" />

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Order #{order.id}
            </h2>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 font-medium">Items Ordered:</span>
                <span className="font-bold">{order.items?.length || 0}</span>
              </div>

              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 font-medium">Payment Status:</span>
                <span
                  className={`font-bold ${
                    order.payment_status === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.payment_status || "unpaid"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping & Total */}
          <div className="space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-8">
            <h3 className="text-xl font-semibold text-gray-800">
              Total Charged:{" "}
              <span className="text-green-600">{order.total_amount} Tk</span>
            </h3>
            <p className="text-sm text-gray-600">Estimated Delivery: 3–5 business days</p>

            {order.shipping_address && (
              <div className="flex items-start space-x-3 text-sm text-gray-700">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                <p>
                  <strong>Shipping to:</strong> <br />
                  {order.shipping_address.street}, {order.shipping_address.city}
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="mt-8 mb-8 border-gray-200" />

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={`/order/details/${order.id}`}
            className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center shadow-md"
          >
            View Order Details
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
