import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isInStock = product.stock > 0;
  const stockText = isInStock ? 'In Stock' : 'Out of Stock';
  const stockClass = isInStock ? 'bg-green-600 text-white' : 'bg-red-600 text-white';

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image ||
    'https://placehold.co/400x300/e5e7eb/4b5563?text=No+Image';

  const secondaryImage =
    product.images?.find((img) => !img.is_primary)?.image ||
    'https://placehold.co/400x300/d1d5db/6b7280?text=Alternate+Image';

  const goToDetails = () => {
    navigate(`/product/details/${product.slug}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">
     {/* Image Section with Smooth Hover */}
      <div
        onClick={goToDetails}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-60 md:h-64 lg:h-72 cursor-pointer overflow-hidden rounded-t-xl"
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ease-in-out ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {/* Secondary Image */}
        <img
          src={secondaryImage}
          alt={`${product.name} alternate`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ease-in-out ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Stock Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${stockClass}`}
        >
          {stockText}
        </div>
      </div>


      {/* Product Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={goToDetails}
            className="text-base font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition"
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <span className="flex items-center gap-3">
              {/* Discount Price */}
              <span className="text-xl font-extrabold text-gray-900 flex items-center">
                <span className="mr-1" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>৳</span>
                {parseFloat(product.discount_price).toFixed(2)}
              </span>

              {/* Original Price */}
              {product.price && (
                <span className="text-sm line-through text-gray-400 flex items-center">
                  <span className="mr-0.5">৳</span>
                  {parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </span>


          <div className="flex space-x-2">
            {isInStock ? (
              <button
                onClick={goToDetails}
                className="flex-1 flex items-center justify-center text-sm px-2 py-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition active:scale-95"
              >
                অর্ডার করুন
              </button>
            ) : (
              <button
                disabled
                className="w-full text-sm px-3 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
            {/* add to wishlist  */}
          {/* <button className="w-full text-sm text-gray-500 hover:text-pink-600 transition flex items-center justify-center py-1">
            <Heart size={16} className="mr-1" /> Add to Wishlist
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
