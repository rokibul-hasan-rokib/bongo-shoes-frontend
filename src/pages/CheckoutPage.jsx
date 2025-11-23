import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Lock, DollarSign, CreditCard, User, Phone, MapPin, Home, MessageCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { fetchDefaultShipping, saveShippingAddress } from '../services/shippingService';
import { toast } from 'react-hot-toast';

const paymentOptions = [
    { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, isPrimary: true, note: 'পণ্য ডেলিভারির সময় নগদ অর্থ প্রদান করুন।' },
];

const CheckoutPage = () => {
    const { cart, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '', phone: '', full_address: '', city: '', note: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shippingCharge, setShippingCharge] = useState(80);
    const [subDistrict, setSubDistrict] = useState('');

    useEffect(() => {
        const fetchAddress = async () => {
            const data = await fetchDefaultShipping();
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    fullName: data.full_name || '',
                    phone: data.phone || '',
                    full_address: data.full_address || '',
                    city: data.city || '',
                    note: data.note || ''
                }));
                setShippingCharge(data.city?.toLowerCase() === 'dhaka' ? 80 : 130);
            }
        };
        fetchAddress();
    }, []);

    const handleInputChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (e.target.name === 'city') {
            if (e.target.value.toLowerCase() === 'dhaka') {
                setShippingCharge(80);
                setSubDistrict('');
            } else if (e.target.value.toLowerCase() === 'sub-dhaka') {
                setShippingCharge(100);
            } else {
                setShippingCharge(130);
                setSubDistrict('');
            }
        }
    };

    const items = cart?.items?.map(i => {
        const primaryImageObj = i.product.images?.find(img => img.is_primary) || i.product.images?.[0];
        const discountPrice = parseFloat(i.product.discount_price);
        return {
            id: i.id,
            name: i.product.name,
            price: isNaN(discountPrice) ? 0 : discountPrice,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            image: primaryImageObj?.image || '',
        };
    }) || [];
    console.log(items)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = 0;
    const total = subtotal + tax + shippingCharge;

    const handleCompleteOrder = async () => {
        // Validation
        if (!formData.fullName.trim()) return toast.error('দয়া করে পূর্ণ নাম লিখুন।');
        if (!formData.phone.trim()) return toast.error('দয়া করে ফোন নম্বর লিখুন।');
        if (!formData.city.trim()) return toast.error('দয়া করে শহর লিখুন।');
        if (!formData.full_address.trim()) return toast.error('দয়া করে পুরো ঠিকানা লিখুন।');

        if (!cart || items.length === 0) return;

        try {
            const shippingResp = await saveShippingAddress({
                full_name: formData.fullName,
                phone: formData.phone,
                full_address: formData.full_address,
                city: formData.city,
                note: formData.note
            });

            const payload = {
                items: items.map(i => ({ ...i })),
                total: total.toFixed(2),
                shippingAddress: shippingResp,
                paymentMethod
            };

            await createOrder(payload);

            toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
            setCart({ items: [] });
            navigate('/order-confirmation-message');
        } catch (err) {
            console.error("Order Placement Error:", err);
            toast.error(err.message || 'অর্ডার স্থাপন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
        }
    };

    if (!cart || items.length === 0) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center bg-white rounded-xl shadow-md mt-10 border border-gray-200">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">আপনার কার্ট খালি</h1>
            <p className="mb-6 text-gray-600">আপনি এখনও কোনো পণ্য কার্টে যোগ করেননি।</p>
            <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                কেনাকাটা চালিয়ে যান
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/cart" className="flex items-center text-indigo-600 hover:text-indigo-700 mb-8 font-semibold transition-colors duration-200">
                    <ArrowLeft size={20} className="mr-2"/> কার্টে ফিরে যান
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">চেকআউট</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <Truck className="mr-3 text-indigo-600 w-6 h-6"/> শিপিং ঠিকানা
                                </h2>
                                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                    ডেলিভারি ফি: ৳{shippingCharge} ({formData.city?.toLowerCase() === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'})
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        name="fullName" 
                                        value={formData.fullName} 
                                        onChange={handleInputChange} 
                                        placeholder="পূর্ণ নাম *" 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50" 
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                        placeholder="ফোন নম্বর *" 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50" 
                                    />
                                </div>
                            </div>
                            <div className="relative mb-4">
                                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 appearance-none"
                                >
                                    <option value="">শহর নির্বাচন করুন *</option>
                                    <option value="Dhaka">ঢাকার ভিতরে (৳৮০)</option>
                                    <option value="Sub-Dhaka">সাব-ঢাকা (৳১০০)</option>
                                    <option value="Other">ঢাকার বাইরে (৳১৩০)</option>
                                </select>
                            </div>
                            <div className="relative mb-4">
                                <Home className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <textarea 
                                    name="full_address" 
                                    value={formData.full_address} 
                                    onChange={handleInputChange} 
                                    placeholder="পূর্ণ ঠিকানা *" 
                                    rows="3" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-gray-50/50" 
                                />
                            </div>
                            <div className="relative">
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

                        {/* Payment Method */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                                <CreditCard className="mr-3 text-indigo-600 w-6 h-6"/> পেমেন্ট পদ্ধতি
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {paymentOptions.map(option => (
                                    <div 
                                        key={option.id} 
                                        className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                                            paymentMethod === option.id 
                                                ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg' 
                                                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50'
                                        }`}
                                        onClick={() => setPaymentMethod(option.id)}
                                    >
                                        <div className="flex items-center mb-3">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                id={option.id}
                                                value={option.id}
                                                checked={paymentMethod === option.id}
                                                onChange={() => setPaymentMethod(option.id)}
                                                className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 relative z-10"
                                            />
                                            <option.icon size={24} className={`ml-4 mr-3 ${paymentMethod === option.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'} transition-colors duration-200`}/>
                                            <label htmlFor={option.id} className="text-base font-semibold text-gray-900 flex-1 cursor-pointer">{option.name}</label>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed">{option.note}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl flex items-center border border-indigo-200 mb-6">
                                <Lock className="text-indigo-600 mr-3 w-5 h-5 flex-shrink-0"/> 
                                <span className="text-indigo-800 font-medium text-sm">আপনার তথ্য SSL এনক্রিপশন দ্বারা নিরাপদ।</span>
                            </div>

                            <button 
                                onClick={handleCompleteOrder} 
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 mt-6 text-lg font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                            >
                                অর্ডার কনফার্ম করুন: ৳{total.toLocaleString()}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg h-fit lg:sticky lg:top-8 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 text-gray-900">অর্ডার সংক্ষিপ্তসার</h2>
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {items.map(item => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                        <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0 shadow-sm" />
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold text-sm text-gray-900 whitespace-nowrap">৳{(item.price*item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-600 font-medium"><span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span><span>৳{subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-gray-900 font-medium">৳{shippingCharge}</span></div>
                                <div className="flex justify-between text-sm text-gray-600"><span>Tax (0%)</span><span>৳{tax.toLocaleString()}</span></div>
                                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    <span>Total Due</span>
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

export default CheckoutPage;
