import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Truck, Lock, DollarSign, CreditCard, ArrowLeft, User, Phone, MapPin, Home, MessageCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createGuestOrder } from "../services/orderService";

const paymentOptions = [
  { id: "cod", name: "Cash on Delivery", icon: DollarSign, note: "ডেলিভারির সময় নগদে প্রদান করুন।" },
];

const GuestCheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const productData = state?.guestOrder;
console.log("productData", productData);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    full_address: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingCharge, setShippingCharge] = useState(80);
  const [subDistrict, setSubDistrict] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "city") {
      if (value.toLowerCase() === "dhaka") {
        setShippingCharge(80);
        setSubDistrict("");
      } else if (value.toLowerCase() === "sub-dhaka") {
        setShippingCharge(100);
      } else {
        setShippingCharge(130);
        setSubDistrict("");
      }
    }
  };

  if (!productData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center bg-white rounded-2xl shadow-md mt-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">কোনো প্রোডাক্ট নির্বাচিত হয়নি!</h2>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const { product, quantity, size, color, image, discount_price, } = productData;
  const subtotal = Number(discount_price) * Number(quantity);
  const total = subtotal + Number(shippingCharge);
  

  const handlePlaceOrder = async () => {
    if (!formData.fullName.trim()) return toast.error("নাম অবশ্যই দিতে হবে!");
    if (!formData.phone.trim()) return toast.error("ফোন নম্বর অবশ্যই দিতে হবে!");
    if (!formData.city.trim()) return toast.error("শহর অবশ্যই দিতে হবে!");
    if (!formData.full_address.trim()) return toast.error("পুরো ঠিকানা অবশ্যই দিতে হবে!");

   const payload = {
  shipping_address: {
    full_name: formData.fullName,
    phone: formData.phone,
    city: formData.city,
    full_address: formData.full_address,
    note: formData.note,
  },
   items: [
    {
      // যদি nested structure থাকে তাহলে সঠিক Product ID পাঠাও
      product: productData?.id || product?.id,
      quantity: Number(quantity),
      size: product?.size?.id || null,
      color: product?.color?.id || null,
      price: Number(discount_price),
    },
  ],
  total_amount: Number(total),
  payment_method: paymentMethod,
};
console.log("Payload",payload)
    try {
      await createGuestOrder(payload);
      toast.success("✅ অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      navigate("/order-confirmation-message");
    } catch (error) {
      console.error("Guest order error:", error);
      toast.error("❌ অর্ডার ব্যর্থ হয়েছে। তথ্য যাচাই করুন এবং পুনরায় চেষ্টা করুন!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      {/* Toaster root */}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-8 font-semibold transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" /> হোমে ফিরে যান
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Guest Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Truck className="mr-3 text-indigo-600 w-6 h-6" /> ডেলিভারি ঠিকানা
                </h2>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                  ডেলিভারি চার্জ: ৳{shippingCharge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="relative w-full">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="পূর্ণ নাম (প্রয়োজনীয়)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                  />
                </div>
                <div className="relative w-full">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="ফোন নম্বর (প্রয়োজনীয়)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="relative mb-4 w-full">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 appearance-none"
                >
                  <option value="">শহর নির্বাচন করুন (প্রয়োজনীয়)</option>
                  <option value="Dhaka">ঢাকার ভিতরে (৳৮০)</option>
                  <option value="Sub-Dhaka">সাব-ঢাকা (৳১০০)</option>
                  <option value="Other">ঢাকার বাইরে (৳১৩০)</option>
                </select>
              </div>

              <div className="relative mb-4 w-full">
                <Home className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleInputChange}
                  placeholder="পুরো ঠিকানা (প্রয়োজনীয়)"
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-gray-50/50"
                />
              </div>

              <div className="relative mb-8 w-full">
                <MessageCircle className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="ডেলিভারি নোট (ঐচ্ছিক)"
                  rows="2"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-gray-50/50"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <CreditCard className="mr-3 text-indigo-600 w-6 h-6" /> পেমেন্ট পদ্ধতি
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex flex-col p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group w-full ${
                      paymentMethod === option.id
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50"
                    }`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={paymentMethod === option.id}
                        readOnly
                        className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 relative z-10"
                      />
                      <option.icon
                        className={`ml-3 mr-2 ${
                          paymentMethod === option.id
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-indigo-500"
                        } transition-colors duration-200`}
                        size={22}
                      />
                      <span className="font-semibold text-gray-900 flex-1 cursor-pointer">{option.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed ml-1">{option.note}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl flex items-center border border-indigo-200 mb-6 text-sm">
                <Lock className="text-indigo-600 mr-3 w-5 h-5 flex-shrink-0" />
                <span className="text-indigo-800 font-medium">আপনার তথ্য SSL এনক্রিপশন দ্বারা নিরাপদ।</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 text-lg font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300 focus:outline-none"
              >
                অর্ডার করুন: ৳{total.toLocaleString()}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1 w-full">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg lg:sticky lg:top-8 border border-gray-100 w-full">
              <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 text-gray-900">অর্ডার সংক্ষিপ্ত</h2>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={image || product.images?.[0]?.image || "https://via.placeholder.com/80"}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
                  {size && <p className="text-xs text-gray-500 mt-1">সাইজ: {size}</p>}
                  {color && <p className="text-xs text-gray-500">রঙ: {color}</p>}
                  <p className="text-xs text-gray-500">পরিমাণ: {quantity}</p>
                </div>
                <span className="font-bold text-sm text-gray-900 whitespace-nowrap">৳{discount_price}</span>
                
              </div>

              {/* Subtotal and Total */}
              
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Original Price</span>
                  <span className="text-gray-900">৳{product.price}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Discount Price</span>
                  <span className="text-gray-900">৳{discount_price}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Subtotal ({product.discount_price} x {quantity})</span>
                  <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-gray-900">৳{shippingCharge}</span>
                </div>

                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl text-gray-900 bg-gray-50 p-3 rounded-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckoutPage;
