import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Generate a fallback ID if item has no ID from backend
  const ensureId = (item) => {
    return item.id || `${item.name}-${Date.now()}-${Math.random()}`;
  };

  // ADD TO CART
  const addToCart = (item) => {
    const fixedId = ensureId(item);

    const existing = cart.find((i) => i.id === fixedId);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === fixedId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, id: fixedId, quantity: 1 }]);
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
