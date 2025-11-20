import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getProductBySlug, getProductsByCategory } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";


const ProductDetailsPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { handleAddToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Variant selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Update meta tags for Facebook/social sharing
  useEffect(() => {
    if (product) {
      const currentUrl = window.location.href.split('?')[0]; // Remove any query params
      const productImage = product.images?.find(img => img.is_primary)?.image || product.images?.[0]?.image || '';
      const productTitle = `${product.name} | Bongo Shoes`;
      const productDescription = product.description?.substring(0, 160) || 'Premium quality shoes at Bongo Shoes';

      // Update or create meta tags
      const updateMetaTag = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      updateMetaTag('og:title', productTitle);
      updateMetaTag('og:description', productDescription);
      updateMetaTag('og:image', productImage);
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('og:type', 'product');

      // Update page title
      document.title = productTitle;
    }
  }, [product]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        const primaryImg = data.images?.find((img) => img.is_primary) || data.images?.[0];
        setSelectedImage(primaryImg?.image || null);
        if (primaryImg?.color) {
          const initialColors = [...new Map(data.variants.map((v) => [v.color.id, v.color])).values()];
          const matchingColor = initialColors.find(color => color.name === primaryImg.color);
          if (matchingColor) {
            setSelectedColor(matchingColor);
          }
        }

        if (data.category_slug) {
          const related = await getProductsByCategory(data.category_slug, slug);
          setRelatedProducts(related);
          setTotalPages(related.total_pages || 1);
          setCurrentPage(related.current || 1);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Variant update
  useEffect(() => {
    if (product?.variants?.length && selectedColor && selectedSize) {
      const found = product.variants.find(
        (v) => v.color.id === selectedColor.id && v.size.id === selectedSize.id
      );
      setSelectedVariant(found || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product]);
  
  useEffect(() => {
  if (selectedColor && product?.images?.length) {
    const matchedImage = product.images.find(
      (img) => img.color === selectedColor.name
    );
    if (matchedImage) {
      setSelectedImage(matchedImage.image);
    }
  }
}, [selectedColor, product]);

  const handleQuantityChange = (newQty) => {
    const stock = selectedVariant ? selectedVariant.stock : product?.stock || 0;
    if (newQty >= 1 && newQty <= stock) setQuantity(newQty);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-lg text-gray-600 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-[50vh] flex-col border border-gray-200 p-8 rounded-lg shadow-sm">
          <Package size={32} className="text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-700 mb-2">Product Not Found</p>
          <p className="text-gray-500">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const activePrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.discount_price || product.price);
  const basePrice = parseFloat(product.price);
  const isInStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.stock > 0;
  const stockText = isInStock ? "In Stock" : "Out of Stock";
  const stockClass = isInStock
    ? "text-green-600 border-green-200 bg-green-50"
    : "text-red-600 border-red-200 bg-red-50";

  const variantColors = [
    ...new Map(product.variants.map((v) => [v.color.id, v.color])).values(),
  ];
  const variantSizes = [
    ...new Map(product.variants.map((v) => [v.size.id, v.size])).values(),
  ];

  // ✅ Handle Add & Buy Now with Toast
  const handleAdd = () => {
    if (!isAuthenticated) {
    toast.error("You must login first!");
    navigate("/login"); 
    return;
  }
    const targetProduct = selectedVariant || product;
    handleAddToCart(targetProduct, quantity, selectedSize?.name, selectedColor?.name);
    toast.success(`${product.name} added to cart!`);
  };
  //declare for get discount price in guestCheckout page
const d_price=product.discount_price
const id = product.id
console.log(id)
const handleBuyNow = async () => {
  let targetProduct = selectedVariant 
    ? { ...selectedVariant, productId: product.id } 
    : product;

  // ✅ যদি লগইন করা থাকে, স্বাভাবিক checkout
  if (isAuthenticated) {
    await handleAddToCart(targetProduct, quantity, selectedSize?.name, selectedColor?.name);
    toast.success(`${product.name} added to cart!`);
    navigate("/checkout", { 
      state: { 
        discount_price: Number(d_price)
      } 
    });
  } 
  // ✅ যদি লগইন না করা থাকে, guest checkout route এ product details পাঠাও
  else {
    const guestOrder = {
      id:id,
      product: targetProduct,
      quantity,
      size: selectedSize?.name,
      color: selectedColor?.name,
      image: selectedImage,
      discount_price:d_price,
      
    };
    navigate("/guest-checkout", { state: { guestOrder } });
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {/* === Image Gallery === */}
        <div className="space-y-6">
          <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <img
              src={
                selectedImage ||
                "https://placehold.co/800x600/f3f4f6/6b7280?text=Product+Image"
              }
              alt={product.name}
              className="w-full h-full object-cover transition duration-300 ease-in-out"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(img.image);
                    if (img.color) {
                      const matchingColor = variantColors.find(color => color.name === img.color);
                      if (matchingColor) {
                        setSelectedColor(matchingColor);
                      }
                    }
                  }}
                  className={`block h-24 border-2 rounded-lg overflow-hidden transition duration-200 ${
                    selectedImage === img.image
                      ? "border-indigo-600 ring-2 ring-indigo-300"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === Product Info === */}
        <div className="flex flex-col space-y-7 pt-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              {product.brand || "Brand"}
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
              {product.name}
            </h1>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 pb-3 border-b border-gray-100">
            <span className="text-3xl font-extrabold text-indigo-600">
              ৳{activePrice.toFixed(2)}
            </span>
            {product.discount_price && !selectedVariant && (
              <span className="text-lg line-through text-gray-400">
                ৳{basePrice.toFixed(2)}
              </span>
            )}
            <div
              className={`ml-auto text-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${stockClass}`}
            >
              {stockText}
            </div>
          </div>

          {/* === Variant Section === */}
         {product.variants?.length > 0 && (
          <>
            {/* Size */}
            <div className="space-y-2">
              <span className="text-base font-semibold text-gray-700">
                সাইজ নির্বাচন করুন :{" "}
                <span className="font-normal text-gray-500">
                  {selectedSize?.name || "--"}
                </span>
              </span>
              <div className="flex flex-wrap gap-3">
                {variantSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-10 flex items-center justify-center border text-sm font-medium rounded-full transition duration-150 ease-in-out ${
                      selectedSize?.id === size.id
                        ? "bg-indigo-600 text-white shadow-md border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
             
              {selectedSize && (
                <div className="text-sm text-gray-600 mt-1">
                  নির্বাচিত সাইজ: <span className="font-medium">{selectedSize.name}</span>
                </div>
              )}
            </div>

            {/* Color */}
            <div className="space-y-2 mt-6">
              <span className="text-base font-semibold text-gray-700">
                কালার নির্বাচন করুন :{" "}
                <span className="font-normal text-gray-500">
                  {selectedColor?.name || "--"}
                </span>
              </span>
              <div className="grid grid-cols-4 gap-4">
                {variantColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`flex flex-col items-center p-2 rounded-lg transition duration-150 ease-in-out ${
                      selectedColor?.id === color.id
                        ? "ring-2 ring-indigo-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border mb-2 ${
                        selectedColor?.id === color.id
                          ? "ring-2 ring-indigo-300"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                    ></div>
                    <span className="text-xs text-gray-700 text-center font-medium">
                      {color.name === 'Black' ? 'কালো' :
                       color.name === 'Chocolate' ? 'চকোলেট' :
                       color.name === 'Brown' ? 'ব্রাউন' :
                       color.name === 'Walnut Brown' ? 'ওয়ালনাট ব্রাউন' :
                       color.name}
                    </span>
                  </button>
                ))}
              </div>
             
              {selectedColor && (
                <div className="text-sm text-gray-600 mt-1">
                  নির্বাচিত কালার: <span className="font-medium">{selectedColor.name}</span>
                  
                </div>
                
              )}
            </div>
          </>
        )}


          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-base font-semibold text-gray-700">
              পরিমাণ দিন :
            </span>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || !isInStock}
                className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition duration-150 ${
                  quantity <= 1 || !isInStock
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-l-lg`}
              >
                −
              </button>
              <span className="w-12 text-center text-lg font-semibold text-gray-900 border-x border-gray-300 h-10 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={
                  quantity >=
                    (selectedVariant
                      ? selectedVariant.stock
                      : product.stock) || !isInStock
                }
                className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition duration-150 ${
                  quantity >=
                    (selectedVariant
                      ? selectedVariant.stock
                      : product.stock) || !isInStock
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-r-lg`}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {isInStock ? (
              <>
                <button onClick={handleAdd} className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold text-base rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-[1.01]">
                  <ShoppingCart size={20} className="mr-2" /> কার্টে যুক্ত করুন
                </button>
                <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 font-semibold text-base rounded-lg shadow-md hover:bg-indigo-50 transition duration-300 ease-in-out">
                  <Package size={20} className="mr-2" /> অর্ডার করুন
                </button>
              </>
            ) : (
              <button
                disabled
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-500 font-semibold text-base rounded-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
            {/* add to wishlist */}
            {/* <button className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:border-pink-500 hover:text-pink-600 transition duration-300 ease-in-out shadow-sm">
              <Heart size={24} />
            </button> */}
          </div>
        </div>
      </div>

      {/* Description */}
        {/* Product Description & Secondary Image Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Description */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 border-b pb-2 border-indigo-200">
                📝 পণ্যের বিস্তারিত
              </h2>
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p>এই পণ্যের জন্য কোনো বিস্তারিত বিবরণ পাওয়া যায়নি।</p>
              )}
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-700 mb-1">কেন এই পণ্যটি বেছে নেবেন?</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-base">
                <li>উচ্চমানের উপাদানে তৈরি</li>
                <li>দীর্ঘস্থায়ী এবং টেকসই</li>
                <li>স্টাইলিশ ডিজাইন ও আরামদায়ক ব্যবহার</li>
              </ul>
            </div>
          </div>

          {/* Right: Secondary Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-gray-300 bg-gradient-to-br from-white to-gray-50 transition-transform hover:scale-[1.03]">
              <img
                src={
                  product.images?.find((img) => !img.is_primary)?.image ||
                  "https://placehold.co/800x600/f3f4f6/6b7280?text=Secondary+Image"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>


      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={!relatedProducts.length || currentPage === 1}
                  className="px-3 py-1 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 border rounded-lg text-sm ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={!relatedProducts.length || currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
