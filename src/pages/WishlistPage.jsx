import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

// Simple NavLink replacement for react-router-dom's Link
const NavLink = ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
);

// --- MOCK DATA (Updated with professional images and descriptions) ---
const MOCK_WISHLIST_ITEMS = [
  { 
    id: 'prod_1', 
    name: 'The Chronos Backpack', 
    price: 149.99, 
    imageUrl: 'https://images.unsplash.com/photo-1544253335-d7a9c3d49b2c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isAvailable: true,
    description: 'Ultra-durable, waterproof shell with dedicated laptop sleeve and ergonomic design for long journeys.'
  },
  { 
    id: 'prod_2', 
    name: 'Linen Blend Overshirt', 
    price: 79.00, 
    imageUrl: 'https://images.unsplash.com/photo-1589178229875-9e663806f366?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isAvailable: true,
    description: 'A breathable, lightweight overshirt perfect for layering in transition seasons. Modern cut.'
  },
  { 
    id: 'prod_3', 
    name: 'Ceramic Pour-Over Set', 
    price: 55.50, 
    imageUrl: 'https://images.unsplash.com/photo-1584210600109-17d475ce910f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isAvailable: false,
    description: 'Handcrafted matte black ceramic set for the perfect morning brew. Limited edition.'
  },
  { 
    id: 'prod_4', 
    name: 'Minimalist Sneaker V3', 
    price: 129.99, 
    imageUrl: 'https://images.unsplash.com/photo-1595341888016-a3ee594b63ae?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isAvailable: true,
    description: 'Ethically sourced leather and recycled rubber sole. Designed for all-day comfort and style.'
  },
];

// --- INDUSTRY STANDARD Wishlist Item Card Component ---
const ProductListCard = ({ product, onRemove }) => {
    const handleRemoveClick = () => onRemove(product.id);

    const handleAddToCartClick = () => {
        console.log(`[DRF Action]: Preparing to move ${product.id} to cart.`);
        // When integrating DRF: fetch('/api/cart/add/', { method: 'POST', body: JSON.stringify({ product_id: product.id }) });
    };

    return (
        <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden 
                       transition-all duration-300 transform hover:shadow-2xl hover:translate-y-[-2px] group">
            
            {/* 1. Product Image and Status */}
            <div className="w-full sm:w-56 h-64 sm:h-auto flex-shrink-0 relative bg-gray-50">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    // Fallback to a placeholder image if the provided URL fails to load
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x400/374151/ffffff?text=Product+Image'; }}
                />
                {!product.isAvailable && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        OUT OF STOCK
                    </span>
                )}
            </div>

            {/* 2. Product Details and Price */}
            <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between w-full">
                <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-md text-gray-600 mb-4 h-12 overflow-hidden line-clamp-2">{product.description || 'No description provided.'}</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">${product.price.toFixed(2)}</p>
                </div>

                {/* 3. Action Buttons */}
                <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                    <button
                        onClick={handleAddToCartClick}
                        disabled={!product.isAvailable}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-full 
                                    transition-colors duration-200 font-semibold text-lg shadow-lg ${
                                        product.isAvailable 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                    >
                        <ShoppingBag size={20} />
                        <span>{product.isAvailable ? 'Move to Bag' : 'Unavailable'}</span>
                    </button>

                    <button
                        onClick={handleRemoveClick}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-full 
                                   text-red-600 border border-red-200 bg-white hover:bg-red-50 
                                   transition-colors duration-200 font-semibold shadow-md"
                        title="Remove from Wishlist"
                    >
                        <Heart size={20} fill="currentColor" />
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Wishlist Page ---
export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState(MOCK_WISHLIST_ITEMS);

    const handleRemoveFromWishlist = (productId) => {
        console.log(`[DRF Action]: Preparing to remove product ID ${productId}.`);
        // Optimistic UI Update
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
        // DRF Deletion logic goes here
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
                    <Heart className="mx-auto h-28 w-28 text-red-400 mb-6 animate-pulse" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h1>
                    <p className="text-lg text-gray-600 mb-10">
                        Start saving your favorite items now.
                    </p>
                    <NavLink
                        to="/products"
                        className="bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-700 
                                   transition-colors duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                        Explore Our Collection
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-5 border-b-2 border-blue-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
                    My Wishlist <span className="text-blue-600">({wishlistItems.length} items)</span>
                </h1>
                <NavLink
                    to="/products"
                    className="bg-gray-100 text-gray-700 px-7 py-3 rounded-full hover:bg-gray-200 
                               transition-colors duration-200 font-medium shadow-md"
                >
                    Continue Shopping
                </NavLink>
            </div>

            <div className="space-y-8">
                {wishlistItems.map((product) => (
                    <ProductListCard 
                        key={product.id} 
                        product={product} 
                        onRemove={handleRemoveFromWishlist}
                    />
                ))}
            </div>
            
           
        </div>
    );
}
