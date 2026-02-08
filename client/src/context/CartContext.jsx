import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedPackage(null);
  };

  const selectPackage = (packageData) => {
    setSelectedPackage(packageData);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      items: [...cartItems],
      total: getTotalPrice(),
      status: 'pending',
      date: new Date().toISOString(),
      ...orderData
    };
    setOrders(prev => [...prev, newOrder]);
    setCartItems([]);
    return newOrder;
  };

  const value = {
    cartItems,
    selectedPackage,
    orders,
    addToCart,
    removeFromCart,
    clearCart,
    selectPackage,
    getTotalPrice,
    placeOrder,
    cartCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};