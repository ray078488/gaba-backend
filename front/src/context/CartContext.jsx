import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  // Load cart items on start or when authentication state changes
  useEffect(() => {
    const loadCart = async () => {
      if (!token) {
        // Load offline cart from localStorage
        const localCart = localStorage.getItem('gaba_offline_cart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/orders/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data);
        }
      } catch (err) {
        console.error('Failed to fetch cart from server:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token]);

  // Save local cart to localStorage when it changes (only for guest/offline users)
  useEffect(() => {
    if (!token) {
      localStorage.setItem('gaba_offline_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // Add Item to Cart
  const addToCart = async (product, size, quantity = 1) => {
    if (token) {
      try {
        const res = await fetch('/api/orders/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            Product_ID: product.Product_ID,
            Size: size,
            Quantity: quantity
          })
        });

        if (res.ok) {
          // Refetch fresh cart items from server
          const cartRes = await fetch('/api/orders/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await cartRes.json();
          setCartItems(data);
          return { success: true };
        } else {
          const data = await res.json();
          return { success: false, message: data.message };
        }
      } catch (err) {
        return { success: false, message: 'Server error adding item to cart.' };
      }
    } else {
      // Local/Offline Cart logic
      setCartItems(prevItems => {
        const existingIdx = prevItems.findIndex(item => item.Product_ID === product.Product_ID && item.Size === size);

        if (existingIdx !== -1) {
          const updated = [...prevItems];
          // Check stock limit
          if (updated[existingIdx].Quantity + quantity > product.Stock_Quantity) {
            alert(`Sorry! GABA only has ${product.Stock_Quantity} items in stock for this product.`);
            return prevItems;
          }
          updated[existingIdx].Quantity += quantity;
          return updated;
        } else {
          return [...prevItems, {
            Cart_ID: Date.now(), // Local key
            Product_ID: product.Product_ID,
            Product_Name: product.Product_Name,
            Price: product.Price,
            Image_URL: product.Image_URL,
            Fabric_Quality: product.Fabric_Quality,
            Brand_Name: product.Brand_Name || 'GABA',
            Size: size,
            Quantity: quantity,
            Stock_Quantity: product.Stock_Quantity
          }];
        }
      });
      return { success: true };
    }
  };

  // Update Cart Quantity
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity <= 0) return;

    if (token) {
      try {
        const res = await fetch(`/api/orders/cart/${cartId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ Quantity: newQuantity })
        });

        if (res.ok) {
          setCartItems(prev => prev.map(item => item.Cart_ID === cartId ? { ...item, Quantity: newQuantity } : item));
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    } else {
      setCartItems(prev => prev.map(item => item.Cart_ID === cartId ? { ...item, Quantity: newQuantity } : item));
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (cartId) => {
    if (token) {
      try {
        const res = await fetch(`/api/orders/cart/${cartId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setCartItems(prev => prev.filter(item => item.Cart_ID !== cartId));
        }
      } catch (err) {
        console.error('Error removing item:', err);
      }
    } else {
      setCartItems(prev => prev.filter(item => item.Cart_ID !== cartId));
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (token) {
      try {
        const res = await fetch('/api/orders/cart', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setCartItems([]);
        }
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('gaba_offline_cart');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.Quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.Price * item.Quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
