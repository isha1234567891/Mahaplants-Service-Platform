import React from 'react';
import { FaLeaf } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-primary-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export const InlineSpinner = ({ className = '' }) => {
  return (
    <div className={`w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} />
  );
};

export const PlantSpinner = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaLeaf className="text-primary-600 text-2xl animate-pulse" />
    </div>
  );
};

export default LoadingSpinner;