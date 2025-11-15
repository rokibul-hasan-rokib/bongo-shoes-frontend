import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Truck,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { getOrderById } from "../services/orderService";

const StatusBadge = ({ status }) => {
  let icon, color;
  switch (status?.toLowerCase()) {
    case "delivered":
      icon = CheckCircle;
      color = "text-green-600 bg-green-100";
      break;
    case "shipped":
      icon = Truck;
      color = "text-blue-600 bg-blue-100";
      break;
    case "cancelled":
      icon = XCircle;
      color = "text-red-600 bg-red-100";
      break;
    default:
      icon = Clock;
      color = "text-yellow-600 bg-yellow-100";
  }
  const IconComponent = icon;
  return (
    <span
      className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold capitalize ${color}`}
    >
      <IconComponent className="w-4 h-4 mr-2" />
      {status}
    </span>
  );
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data); 
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        Loading order details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-medium">{error}</div>
    );

  if (!order)
    return (
      <div className="text-center py-20 text-gray-600 font-medium">
        No order found.
      </div>
    );

  const items = order?.items || []; 
  const subtotal = order.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Home
      </Link>

      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              Order Details
            </h1>
            <p className="text-lg text-gray-600">Order #{order.id}</p>
          </div>
          <StatusBadge status={order.order_status} />
        </div>

        {/* Timeline */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Order Timeline
          </h2>
          <div className="flex items-center space-x-4">
            <Truck className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-800">
                Tracking Number: {order.tracking_number || "Not available"}
              </p>
              {order.tracking_link && (
                <a
                  href={order.tracking_link}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Track Shipment →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Shipping */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="font-semibold text-lg text-gray-800">
                Shipping Address
              </h2>
            </div>
            <address className="text-gray-600 text-sm not-italic space-y-1">
              <p className="font-medium">
                {order.shipping_address?.full_name}
              </p>
              <p>{order.shipping_address?.street}</p>
              <p>
                {order.shipping_address?.city},{" "}
                {order.shipping_address?.state}{" "}
                {order.shipping_address?.postal_code}
              </p>
              <p>{order.shipping_address?.country}</p>
              <p>📞 {order.shipping_address?.phone}</p>
              {order.shipping_address?.note && (
                <p className="italic text-gray-500">
                  Note: {order.shipping_address.note}
                </p>
              )}
            </address>
          </div>

          {/* Order Info */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="font-semibold text-lg text-gray-800">
                Order Info
              </h2>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {order.created_at || "N/A"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {order.order_status}
              </p>
              <p>
                <span className="font-medium">Total Items:</span>{" "}
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center mb-3">
              <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="font-semibold text-lg text-gray-800">Payment</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Status:</span>{" "}
                {order.payment_status}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> $
                {order.total_amount}
              </p>
              {order.payment_status === "paid" ? (
                <p className="text-green-600 font-medium mt-2">
                  Payment successfully processed.
                </p>
              ) : (
                <p className="text-yellow-600 font-medium mt-2">
                  Awaiting payment.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Package className="w-6 h-6 mr-2 text-gray-700" />
          Items in Order
        </h2>

        <div className="space-y-4 border-t pt-4">
          {items.length === 0 ? (
            <p className="text-gray-600 italic">No items found.</p>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <img
                  src={item.product_image || "https://via.placeholder.com/64"}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    (${parseFloat(item.price).toFixed(2)} each)
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="max-w-sm ml-auto space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>৳ 
                {order.shipping_charge}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (0%)</span>
              <span>৳ 0</span>
            </div>
            <div className="flex justify-between font-extrabold text-xl text-gray-900 pt-2 border-t mt-3">
              <span>Order Total</span>
              <span>৳ {order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default  OrderDetailsPage