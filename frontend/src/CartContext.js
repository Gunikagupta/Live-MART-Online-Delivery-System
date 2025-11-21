import React, { createContext, useContext, useState, useEffect } from "react";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    setCart(prevCart => {
      const found = prevCart.find(ci => ci.itemId === item.itemId);
      if (found) {
        return prevCart.map(ci =>
          ci.itemId === item.itemId
            ? { ...ci, quantity: (ci.quantity || 1) + 1 }
            : ci
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(itemId) {
    setCart(prevCart => prevCart.filter(ci => ci.itemId !== itemId));
  }

  function updateQuantity(itemId, newQty) {
    setCart(prevCart =>
      prevCart.map(ci =>
        ci.itemId === itemId
          ? { ...ci, quantity: Math.max(1, newQty) }
          : ci
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
