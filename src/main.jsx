import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProductDetails from './pages/ProductDetailsPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import GuestCheckoutPage from './pages/GuestCheckoutPage.jsx';
import OrderConfirmationMessage from './components/OrderConfirmationMessage.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      { 
        index:true, 
        element: <HomePage></HomePage> 
      },
      { 
        path: "/products", 
        element: <ProductsPage></ProductsPage>
      },
      { 
        path: "/about", 
        element: <AboutPage></AboutPage>
      },
      { 
        path: "/contact", 
        element: <ContactPage></ContactPage>
      },
       { 
        path: "/product/details/:slug", 
        element: <ProductDetails></ProductDetails>
      },
      { 
        path: "/profile", 
        element: <AccountPage></AccountPage>
      },
       { 
        path: "/wishlist", 
        element: <WishlistPage></WishlistPage>
      },
       { 
        path: "/cart", 
        element: <CartPage></CartPage>
      },
        { 
        path: "/checkout", 
        element: <CheckoutPage></CheckoutPage>
      },
        { 
        path: "/guest-checkout", 
        element: <GuestCheckoutPage></GuestCheckoutPage>
      },
        { 
        path: "/order-success", 
        element: <OrderSuccessPage></OrderSuccessPage>
      },
       { 
        path: "/order/details/:id", 
        element: <OrderDetailsPage></OrderDetailsPage>
      },
       { 
        path: "/order-confirmation-message", 
        element: <OrderConfirmationMessage></OrderConfirmationMessage>
      },
      { 
        path: "/login", 
        element: <LoginPage></LoginPage>
      },
       { 
        path: "/signup", 
        element: <SignupPage></SignupPage>
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
