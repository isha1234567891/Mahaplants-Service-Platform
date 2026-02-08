import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 1.1 : 1
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {isDarkMode ? (
          <FaMoon className="text-lg" />
        ) : (
          <FaSun className="text-lg" />
        )}
      </motion.div>
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;