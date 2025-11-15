import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "../context/AuthProvider";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";

const Root = () => {
  return (
    
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
         <Toaster position="top-center" reverseOrder={false} />
          <Header />
            <Outlet />
          <Footer />
      </CartProvider>
    </AuthProvider>
  );
};

export default Root;
