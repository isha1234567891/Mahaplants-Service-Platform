import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { subscriptionsAPI } from '../utils/api';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getTotalPrice, placeOrder } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      // Create subscriptions for each cart item
      for (const item of cartItems) {
        const subscriptionData = {
          packageName: item.name,
          plantsCount: item.plantsCount,
          price: item.price,
          potSize: item.potSize,
          maintenanceSchedule: item.maintenanceSchedule,
          tasksChecklist: item.tasksChecklist,
          deliveryAddress: {
            address: '123 Default Street',
            city: 'Default City',
            pincode: '12345',
            phone: '1234567890'
          }
        };
        
        await subscriptionsAPI.create(subscriptionData);
      }
      
      clearCart();
      toast.success('Subscriptions created successfully!');
      navigate('/user/subscriptions');
    } catch (error) {
      console.error('Subscription creation error:', error);
      toast.error('Failed to create subscriptions: ' + error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400">Add some packages to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
        
        <div className="space-y-4">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.plantsCount} plants • {item.potSize}</p>
                  <p className="text-2xl font-bold text-primary-600">₹{item.price.toLocaleString()}/month</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Total:</span>
            <span className="text-2xl font-bold text-primary-600">₹{getTotalPrice().toLocaleString()}/month</span>
          </div>
          <div className="flex justify-between">
            <button
              onClick={clearCart}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear Cart
            </button>
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isPlacingOrder ? 'Creating Subscriptions...' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;