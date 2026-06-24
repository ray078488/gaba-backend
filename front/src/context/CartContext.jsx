import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('royalCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to LocalStorage when items update
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('royalCart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('royalCart');
    }
  }, [cartItems]);

  const addToCart = (product, qty, size, color) => {
    setCartItems((prev) => {
      // Find matching item by product, size, AND color
      const existItem = prev.find(
        (x) =>
          x.product === product._id &&
          x.size === size &&
          x.color === color
      );

      if (existItem) {
        return prev.map((x) =>
          x.product === product._id &&
          x.size === size &&
          x.color === color
            ? { ...x, qty: Math.min(product.stock, x.qty + qty) }
            : x
        );
      } else {
        return [
          ...prev,
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            stock: product.stock,
            size,
            color,
            qty,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (x) =>
          !(x.product === productId && x.size === size && x.color === color)
      )
    );
  };

  const updateCartQty = (productId, size, color, qty) => {
    setCartItems((prev) =>
      prev.map((x) =>
        x.product === productId && x.size === size && x.color === color
          ? { ...x, qty: Number(qty) }
          : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
