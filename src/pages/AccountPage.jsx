import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  User, Package, Heart, MapPin, CreditCard, Settings,
  ChevronLeft, ChevronRight, Truck, CheckCircle, Clock, XCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../services/orderService";
import { useNavigate } from "react-router-dom";

const ORDERS_PER_PAGE = 5;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, handleProfileUpdate, handleLogout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState(user || {});
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        // Ensure orders is always an array
        setOrders(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status){
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status){
      case "delivered": return <CheckCircle size={18} className="text-green-600 mr-2"/>;
      case "shipped": return <Truck size={18} className="text-blue-600 mr-2"/>;
      case "pending": return <Clock size={18} className="text-yellow-600 mr-2"/>;
      case "cancelled": return <XCircle size={18} className="text-red-600 mr-2"/>;
      default: return <Package size={18} className="text-gray-500 mr-2"/>;
    }
  };

  const getStatusBorderColor = (status) => {
    switch(status){
      case "delivered": return "border-green-500";
      case "shipped": return "border-blue-500";
      case "pending": return "border-yellow-500";
      case "cancelled": return "border-red-500";
      default: return "border-gray-300";
    }
  };

 

  // Pagination
  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
  const currentOrders = Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "orders", name: "Orders", icon: Package },
    { id: "wishlist", name: "Wishlist", icon: Heart },
    { id: "addresses", name: "Addresses", icon: MapPin },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const handleChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleProfileUpdate(formData);
    setMessage({ type: "success", text: "Profile updated successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const renderOrdersContent = () => {
   if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                {/* Reusing the beautiful spinner */}
                <div 
                    className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin shadow-xl"
                    style={{ borderRightColor: '#3b82f6', borderBottomColor: '#3b82f6' }}
                    aria-label="Loading orders"
                ></div>
                <p className="ml-4 text-lg font-semibold text-blue-600">Fetching your order history...</p>
            </div>
        );
    }

    // 2. Empty State (Illustration/Graphic Look)
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Package size={64} className="text-gray-400 mb-4" /> 
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found!</h3>
                <p className="text-lg text-gray-600 mb-6">
                    It looks like you haven't placed any orders yet.
                </p>
                <button
                    // Apni ekhane 'navigate' use kore shopping page-e pathate paren
                    onClick={() => navigate("/products")} 
                    className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
                >
                    Start Shopping Now
                </button>
            </div>
        );
    }

    const PaginationComponent = () => {
      if(totalPages <= 1) return null;
      const pages = Array.from({length: totalPages}, (_, i) => i+1);

      return (
        <nav className="flex justify-center mt-8">
          <ul className="flex items-center space-x-2">
            <li>
              <button 
                onClick={() => paginate(currentPage -1)}
                disabled={currentPage===1}
                className="p-2 border border-gray-300 rounded-xl hover:bg-blue-50 disabled:opacity-50"
              >
                <ChevronLeft size={20}/>
              </button>
            </li>
            {pages.map(num => (
              <li key={num}>
                <button 
                  onClick={() => paginate(num)}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    currentPage===num ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={() => paginate(currentPage +1)}
                disabled={currentPage===totalPages}
                className="p-2 border border-gray-300 rounded-xl hover:bg-blue-50 disabled:opacity-50"
              >
                <ChevronRight size={20}/>
              </button>
            </li>
          </ul>
        </nav>
      );
    };

    return (
      <div>
        <h2 className="text-2xl font-bold mb-8 text-gray-800">My Orders ({orders.length})</h2>
        <div className="space-y-6">
          {currentOrders.map(order => (
            <div 
              key={order.id} 
              className={`bg-white rounded-xl shadow-lg border-l-4 ${getStatusBorderColor(order.order_status)} hover:shadow-xl cursor-pointer`}
              
            >
              <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0 flex-grow">
                  <div className="flex items-center space-x-2 text-gray-900">
                    {getStatusIcon(order.order_status)}
                    <h3 className="text-lg font-semibold">
                      Order ID: <span className="text-blue-700 font-bold">#{order.id}</span>
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-7">
                    Ordered On: {new Date(order.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mx-6">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-3xl font-extrabold text-green-700 mt-1">
                    ৳{order.total_amount || '0.00'}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end space-y-3">
                  <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </span>
                 <Link
                    to={`/order/details/${order.id}`}
                    className="text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-700 text-sm"
                  >
                    <span>View Details</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <PaginationComponent/>
      </div>
    );
  };

  if(!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4"> Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
                <User size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors font-medium ${
                      activeTab===tab.id ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={22}/>
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
            <button 
              onClick={handleLogout}
              className="w-full mt-8 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px] border border-gray-100">
            {message && (
              <div className={`p-4 mb-6 rounded-xl text-white font-medium ${message.type==="success"?"bg-green-500":"bg-red-500"}`}>
                {message.text}
              </div>
            )}
            {activeTab==="profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Profile Information</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Form fields same as previous */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input type="text" name="name" value={formData.name || ""} onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input type="text" name="address" value={formData.address || ""} onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="text" name="city" value={formData.city || ""} onChange={handleChange} placeholder="City"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                    <input type="text" name="state" value={formData.state || ""} onChange={handleChange} placeholder="State"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                    <input type="text" name="postal_code" value={formData.postal_code || ""} onChange={handleChange} placeholder="Postal Code"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                  </div>
                  <div>
                    <input type="text" name="country" value={formData.country || ""} onChange={handleChange} placeholder="Country"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
                  </div>
                  <button type="submit" className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg">Update Profile</button>
                </form>
              </div>
            )}
            {activeTab==="orders" && renderOrdersContent()}
            {(activeTab !== "profile" && activeTab !== "orders") && (
              <div className="text-center text-gray-500 py-20">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
