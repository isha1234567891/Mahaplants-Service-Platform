import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaLeaf,
  FaPhone,
  FaBuilding,
  FaGoogle,
  FaFacebook,
  FaExclamationTriangle
} from 'react-icons/fa';
import { InlineSpinner } from '../common/LoadingSpinner';

// Error types for better error handling
const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  AUTH: 'auth',
  UNKNOWN: 'unknown'
};

// Validation patterns
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
  password: {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/
  }
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const { register, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Password validation
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: VALIDATION_PATTERNS.password.length.test(password),
      uppercase: VALIDATION_PATTERNS.password.uppercase.test(password),
      lowercase: VALIDATION_PATTERNS.password.lowercase.test(password),
      number: VALIDATION_PATTERNS.password.number.test(password),
      special: VALIDATION_PATTERNS.password.special.test(password)
    });
  }, [formData.password]);

  // Field validation function
  const validateField = useCallback((name, value) => {
    const fieldErrors = {};

    switch (name) {
      case 'name':
        if (!value.trim()) {
          fieldErrors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          fieldErrors.name = 'Full name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          fieldErrors.name = 'Full name must be less than 50 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          fieldErrors.email = 'Email address is required';
        } else if (!VALIDATION_PATTERNS.email.test(value)) {
          fieldErrors.email = 'Please enter a valid email address';
        } else if (value.length > 254) {
          fieldErrors.email = 'Email address is too long';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          fieldErrors.phone = 'Phone number is required';
        } else if (!VALIDATION_PATTERNS.phone.test(value)) {
          fieldErrors.phone = 'Please enter a valid phone number';
        }
        break;

      case 'company':
        if (value && value.length > 100) {
          fieldErrors.company = 'Company name must be less than 100 characters';
        }
        break;

      case 'password':
        if (!value) {
          fieldErrors.password = 'Password is required';
        } else {
          const validationErrors = [];
          if (!passwordValidation.length) validationErrors.push('at least 8 characters');
          if (!passwordValidation.uppercase) validationErrors.push('one uppercase letter');
          if (!passwordValidation.lowercase) validationErrors.push('one lowercase letter');
          if (!passwordValidation.number) validationErrors.push('one number');
          if (!passwordValidation.special) validationErrors.push('one special character');
          
          if (validationErrors.length > 0) {
            fieldErrors.password = `Password must contain ${validationErrors.join(', ')}`;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          fieldErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          fieldErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return fieldErrors;
  }, [formData.password, passwordValidation]);

  // Handle input changes with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Validate field if it has been touched or form was submitted
    if (touched[name] || isSubmitAttempted) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        ...fieldErrors
      }));
    }
  }, [errors, touched, isSubmitAttempted, validateField]);

  // Handle field blur (when user leaves field)
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const fieldErrors = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  }, [validateField]);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const allErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      Object.assign(allErrors, fieldErrors);
    });

    // Additional cross-field validations
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      allErrors.confirmPassword = 'Passwords do not match';
    }

    return allErrors;
  }, [formData, validateField]);

  // Handle form submission with comprehensive error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitAttempted(true);

    try {
      // Clear previous errors
      setErrors({});
      clearError();

      // Validate form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Focus on first error field
        const firstErrorField = Object.keys(validationErrors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
        }
        return;
      }

      setIsLoading(true);

      // Prepare user data
      const { confirmPassword, ...userData } = formData;
      
      // Sanitize data
      const sanitizedData = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone.trim(),
        company: userData.company.trim(),
        password: userData.password
      };

      // Attempt registration
      await register(sanitizedData);
      
      // Success - navigate to home
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      const errorType = determineErrorType(error);
      const errorMessage = getErrorMessage(error, errorType);
      
      setErrors({ 
        general: errorMessage 
      });

      // Handle specific field errors from server
      if (error?.response?.data?.fieldErrors) {
        setErrors(prev => ({
          ...prev,
          ...error.response.data.fieldErrors
        }));
      }

    } finally {
      setIsLoading(false);
    }
  };

  // Determine error type for better handling
  const determineErrorType = (error) => {
    if (!error) return ERROR_TYPES.UNKNOWN;
    
    if (error.name === 'ValidationError') return ERROR_TYPES.VALIDATION;
    if (error.code === 'NETWORK_ERROR' || !navigator.onLine) return ERROR_TYPES.NETWORK;
    if (error.response?.status >= 400 && error.response?.status < 500) return ERROR_TYPES.AUTH;
    if (error.response?.status >= 500) return ERROR_TYPES.SERVER;
    
    return ERROR_TYPES.UNKNOWN;
  };

  // Get appropriate error message based on error type
  const getErrorMessage = (error, errorType) => {
    switch (errorType) {
      case ERROR_TYPES.VALIDATION:
        return error.message || 'Please check your input and try again';
      
      case ERROR_TYPES.NETWORK:
        return 'Network error. Please check your connection and try again';
      
      case ERROR_TYPES.AUTH:
        if (error.response?.status === 409) {
          return 'An account with this email already exists';
        }
        if (error.response?.status === 422) {
          return 'Invalid input data. Please check your information';
        }
        return error.response?.data?.message || 'Authentication error occurred';
      
      case ERROR_TYPES.SERVER:
        return 'Server error. Please try again later';
      
      default:
        return 'An unexpected error occurred. Please try again';
    }
  };

  // Handle social login with error handling
  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      // Implement social login logic here
      console.log(`${provider} login not implemented yet`);
      setErrors({ general: `${provider} login is not available yet` });
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setErrors({ general: `Failed to login with ${provider}. Please try again` });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    if (validCount === 0) return { strength: 0, label: '', color: '' };
    if (validCount <= 2) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (validCount <= 3) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (validCount <= 4) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();
  const isFormValid = Object.keys(validateForm()).length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-primary-500 p-3 rounded-full">
              <FaLeaf className="text-white text-2xl" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Green Planet
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your account and start transforming your workspace
          </p>
        </div>

        {/* Signup Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* General Error Message */}
          {(authError || errors.general) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-start space-x-2"
            >
              <FaExclamationTriangle className="flex-shrink-0 mt-0.5" />
              <span>{authError || errors.general}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                  aria-describedby={errors.name ? "name-error" : undefined}
                  aria-invalid={errors.name ? "true" : "false"}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your phone number"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.company ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your company name"
                  aria-describedby={errors.company ? "company-error" : undefined}
                  aria-invalid={errors.company ? "true" : "false"}
                />
              </div>
              {errors.company && (
                <p id="company-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.company}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full pl-10 pr-12 py-3 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Create a strong password"
                  aria-describedby={errors.password ? "password-error" : "password-help"}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2" id="password-help">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength === 100 ? 'text-green-600' : 
                      passwordStrength.strength >= 75 ? 'text-blue-600' :
                      passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2" role="progressbar" aria-valuenow={passwordStrength.strength} aria-valuemin="0" aria-valuemax="100">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1" role="list">
                    <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : ''}`} role="listitem">
                      <span className="mr-2" aria-hidden="true">{passwordValidation.length ? '✓' : '✗'}</span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : ''}`} role="listitem">
                      <span className="mr-2" aria-hidden="true">{passwordValidation.uppercase ? '✓' : '✗'}</span>
                      One uppercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : ''}`} role="listitem">
                      <span className="mr-2" aria-hidden="true">{passwordValidation.lowercase ? '✓' : '✗'}</span>
                      One lowercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : ''}`} role="listitem">
                      <span className="mr-2" aria-hidden="true">{passwordValidation.number ? '✓' : '✗'}</span>
                      One number
                    </div>
                    <div className={`flex items-center ${passwordValidation.special ? 'text-green-600' : ''}`} role="listitem">
                      <span className="mr-2" aria-hidden="true">{passwordValidation.special ? '✓' : '✗'}</span>
                      One special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full pl-10 pr-12 py-3 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Confirm your password"
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !isFormValid}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <InlineSpinner className="w-5 h-5 mr-2" />
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaFacebook className="h-5 w-5 text-blue-500" />
              <span className="ml-2">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Sign in here
              </Link>
            </span>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signup;