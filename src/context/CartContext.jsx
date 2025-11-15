import React, { createContext, useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem,addCartItem } from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await getCart(token);
      setCart(data[0]); // API returns array
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Update quantity with optimistic UI and stock check
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (!cart) return;
    const item = cart.items.find(i => i.id === itemId);
    if (!item) return;

    // Stock check
    if (newQuantity > (item.product.stock || 99)) return;

    // Optimistic UI
    const oldCart = { ...cart };
    const updatedItems = cart.items.map(i =>
      i.id === itemId ? { ...i, quantity: newQuantity, total_price: newQuantity * parseFloat(i.product.price) } : i
    );
    setCart({ ...cart, items: updatedItems });

    try {
      const token = localStorage.getItem("token");
      await updateCartItem(itemId, newQuantity, token);
      await fetchCart(); // fetch fresh cart after API success
    } catch (error) {
      console.error("Error updating cart item:", error);
      setCart(oldCart); // revert if API fails
    }
  };

  // ✅ Remove item with optimistic UI
  const handleRemoveItem = async (itemId) => {
    if (!cart) return;

    // Optimistic UI
    const oldCart = { ...cart };
    const updatedItems = cart.items.filter(i => i.id !== itemId);
    setCart({ ...cart, items: updatedItems, total_items: cart.total_items - 1 });

    try {
      const token = localStorage.getItem("token");
      await removeCartItem(itemId, token);
      await fetchCart();
    } catch (error) {
      console.error("Error removing cart item:", error);
      setCart(oldCart); // revert if API fails
    }
  };

  const handleAddToCart = async (product, quantity = 1, size = null, color = null) => {
  const token = localStorage.getItem("token"); // ✅ check key name
  if (!token) {
    console.warn("User not logged in");
    return;
  }

  try {
    // Fetch cart first if not loaded
    if (!cart) await fetchCart();

    // Find existing item with same variant (size/color)
    const existingItem = cart?.items?.find(
      (i) =>
        i.product.id === product.id &&
        i.size === size &&
        i.color === color
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // ✅ Check stock limit (handle both normal + variant)
      const maxStock = product.stock || 99;
      if (newQuantity > maxStock) {
        console.warn("Not enough stock available");
        return;
      }

      await updateCartItem(existingItem.id, newQuantity, token);
    } else {
      await addCartItem(product.id, quantity, size, color, token);
    }

    await fetchCart();
    console.log("✅ Item added or updated in cart");

  } catch (error) {
    console.error("❌ Error adding to cart:", error);
  }
};


  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        handleUpdateQuantity,
        handleRemoveItem,
        handleAddToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
