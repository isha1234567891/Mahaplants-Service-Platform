import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscriptionsAPI } from '../utils/api';
import { 
  FaLeaf, 
  FaCheck, 
  FaStar, 
  FaCrown, 
  FaRocket,
  FaInfoCircle
} from 'react-icons/fa';


const Packages = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPotSize, setSelectedPotSize] = useState('4-5-inch');

  // Package data based on PDF
  const packageData = {
    '4-5-inch': [
      {
        id: 'basic-4-5',
        name: 'Basic Package',
        plantsCount: 50,
        potSize: '4" Pot',
        price: 3499,
        pricePerPlant: 70,
        icon: FaLeaf,
        color: 'primary',
        popular: false,
        description: 'Perfect for small offices and startups',
        maintenanceSchedule: {
          frequency: 'monthly',
          services: ['watering', 'pruning', 'health-check']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Clean plant leaves'
        ],
        features: [
          '50 carefully selected plants',
          '4" pot size plants',
          'Monthly maintenance included',
          'Free plant replacement',
          'Basic consultation',
          'Watering and pruning'
        ]
      },
      {
        id: 'standard-4-5',
        name: 'Standard Package',
        plantsCount: 100,
        potSize: '4" Pot',
        price: 4999,
        pricePerPlant: 50,
        icon: FaStar,
        color: 'blue',
        popular: true,
        description: 'Most popular choice for medium offices',
        maintenanceSchedule: {
          frequency: 'bi-weekly',
          services: ['watering', 'pruning', 'health-check', 'pest-control']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Apply pest control if needed',
          'Clean plant leaves',
          'Check plant positioning'
        ],
        features: [
          '100 premium plants',
          '4" pot size plants',
          'Bi-weekly maintenance',
          'Free plant replacement',
          'Advanced consultation',
          'Pest control included',
          'Seasonal plant rotation'
        ]
      },
      {
        id: 'premium-4-5',
        name: 'Premium Package',
        plantsCount: 300,
        potSize: '4" Pot',
        price: 11999,
        pricePerPlant: 40,
        icon: FaCrown,
        color: 'purple',
        popular: false,
        description: 'Enterprise solution for large spaces',
        maintenanceSchedule: {
          frequency: 'weekly',
          services: ['watering', 'pruning', 'health-check', 'pest-control', 'fertilizing', 'plant-rotation']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Apply pest control if needed',
          'Clean plant leaves',
          'Check plant positioning',
          'Apply fertilizer',
          'Rotate plants for sunlight',
          'Document plant health'
        ],
        features: [
          '300 exotic plants',
          '4" pot size plants',
          'Weekly maintenance',
          'Priority plant replacement',
          'Dedicated plant consultant',
          'Advanced pest management',
          'Quarterly plant refresh',
          'Custom arrangements'
        ]
      }
    ],
    '5-inch': [
      {
        id: 'basic-5',
        name: 'Basic Package',
        plantsCount: 50,
        potSize: '5" Pot',
        price: 4499,
        pricePerPlant: 90,
        icon: FaLeaf,
        color: 'primary',
        popular: false,
        description: 'Enhanced basic package with larger plants',
        maintenanceSchedule: {
          frequency: 'monthly',
          services: ['watering', 'pruning', 'health-check']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Clean plant leaves'
        ],
        features: [
          '50 carefully selected plants',
          '5" pot size plants',
          'Monthly maintenance included',
          'Free plant replacement',
          'Basic consultation',
          'Watering and pruning'
        ]
      },
      {
        id: 'standard-5',
        name: 'Standard Package',
        plantsCount: 100,
        potSize: '5" Pot',
        price: 7499,
        pricePerPlant: 75,
        icon: FaStar,
        color: 'blue',
        popular: true,
        description: 'Premium medium office solution',
        maintenanceSchedule: {
          frequency: 'bi-weekly',
          services: ['watering', 'pruning', 'health-check', 'pest-control']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Apply pest control if needed',
          'Clean plant leaves',
          'Check plant positioning'
        ],
        features: [
          '100 premium plants',
          '5" pot size plants',
          'Bi-weekly maintenance',
          'Free plant replacement',
          'Advanced consultation',
          'Pest control included',
          'Seasonal plant rotation'
        ]
      },
      {
        id: 'premium-5',
        name: 'Premium Package',
        plantsCount: 300,
        potSize: '5" Pot',
        price: 17999,
        pricePerPlant: 60,
        icon: FaCrown,
        color: 'purple',
        popular: false,
        description: 'Luxury enterprise solution',
        maintenanceSchedule: {
          frequency: 'weekly',
          services: ['watering', 'pruning', 'health-check', 'pest-control', 'fertilizing', 'plant-rotation']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Apply pest control if needed',
          'Clean plant leaves',
          'Check plant positioning',
          'Apply fertilizer',
          'Rotate plants for sunlight',
          'Document plant health'
        ],
        features: [
          '300 exotic plants',
          '5" pot size plants',
          'Weekly maintenance',
          'Priority plant replacement',
          'Dedicated plant consultant',
          'Advanced pest management',
          'Quarterly plant refresh',
          'Custom arrangements'
        ]
      }
    ],
    '8-inch': [
      {
        id: 'basic-8',
        name: 'Basic Package',
        plantsCount: 20,
        potSize: '8" Pot',
        price: 2999,
        pricePerPlant: 150,
        icon: FaRocket,
        color: 'primary',
        popular: false,
        description: 'Statement plants for executive spaces',
        maintenanceSchedule: {
          frequency: 'monthly',
          services: ['watering', 'pruning', 'health-check']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Clean plant leaves'
        ],
        features: [
          '20 large statement plants',
          '8" pot size (2-2.5 ft height)',
          'Monthly maintenance included',
          'Free plant replacement',
          'Executive consultation',
          'Premium plant varieties'
        ]
      },
      {
        id: 'standard-8',
        name: 'Standard Package',
        plantsCount: 50,
        potSize: '8" Pot',
        price: 6499,
        pricePerPlant: 130,
        icon: FaStar,
        color: 'blue',
        popular: true,
        description: 'Perfect for lobbies and large offices',
        maintenanceSchedule: {
          frequency: 'bi-weekly',
          services: ['watering', 'pruning', 'health-check', 'pest-control']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Apply pest control if needed',
          'Clean plant leaves',
          'Check plant positioning'
        ],
        features: [
          '50 premium large plants',
          '8" pot size (2-2.5 ft height)',
          'Bi-weekly maintenance',
          'Free plant replacement',
          'Advanced consultation',
          'Pest control included',
          'Professional placement'
        ]
      },
      {
        id: 'premium-8',
        name: 'Premium Package',
        plantsCount: 100,
        potSize: '8" Pot',
        price: 11499,
        pricePerPlant: 115,
        icon: FaCrown,
        color: 'purple',
        popular: false,
        description: 'Ultimate luxury plant experience',
        maintenanceSchedule: {
          frequency: 'weekly',
          services: ['watering', 'pruning', 'health-check', 'pest-control', 'fertilizing', 'plant-rotation']
        },
        tasksChecklist: [
          'Check soil moisture',
          'Water plants as needed',
          'Prune dead leaves',
          'Inspect for pests',
          'Apply pest control if needed',
          'Clean plant leaves',
          'Check plant positioning',
          'Apply fertilizer',
          'Rotate plants for sunlight',
          'Document plant health'
        ],
        features: [
          '100 premium large plants',
          '8" pot size (2-2.5 ft height)',
          'Weekly maintenance',
          'Priority plant replacement',
          'Dedicated plant designer',
          'Advanced pest management',
          'Monthly plant refresh',
          'Landscape design service'
        ]
      }
    ]
  };

  const availablePlants = {
    '4-5-inch': [
      'Money Plant (Golden & Green)',
      'Syngonium (Pink, Golden, Milk Confitee)',
      'Spathyphyllum (Magic & Peacelilly)',
      'Xanadu (Golden & Green)',
      'Alocasia (Amezonica & Polly)',
      'Aglonem (Lipstick, Green, Red)',
      'Jade Plant',
      'Areca Palm Small',
      'Lucky Bamboo Plants'
    ],
    '5-inch': [
      'Money Plant (Golden & Green)',
      'Syngonium varieties',
      'Spathyphyllum varieties',
      'Xanadu varieties',
      'Alocasia varieties',
      'Aglonem varieties',
      'Jade Plant',
      'Areca Palm',
      'Sensivira',
      'Zamia'
    ],
    '8-inch': [
      'Aareca Palm (2.5 Ft.)',
      'Reader Machera (2.5 Ft.)',
      'Philodendron Miloni (2 ft.)',
      'Sensiveria (2 Ft.)',
      'Zamia Green (2 Ft.)',
      'Lyrata Ficus',
      'Rubber Plants',
      'Difenbecia'
    ]
  };

  const handlePackageSelect = async (packageId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const selectedPkg = currentPackages.find(pkg => pkg.id === packageId);
    if (!selectedPkg) return;

    setIsLoading(true);
    try {
      const subscriptionData = {
        packageName: selectedPkg.name,
        plantsCount: selectedPkg.plantsCount,
        price: selectedPkg.price,
        potSize: selectedPkg.potSize,
        maintenanceSchedule: selectedPkg.maintenanceSchedule,
        tasksChecklist: selectedPkg.tasksChecklist,
        deliveryAddress: {
          address: user?.address?.street || '',
          city: user?.address?.city || '',
          pincode: user?.address?.zipCode || '',
          phone: user?.phone || ''
        }
      };

      await subscriptionsAPI.create(subscriptionData);
      alert('Subscription created successfully! Your service visits have been scheduled.');
      navigate('/user/subscriptions');
    } catch (error) {
      console.error('Failed to create subscription:', error);
      alert('Failed to create subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClasses = (color, isPopular) => {
    const colors = {
      primary: {
        bg: 'bg-primary-500',
        text: 'text-primary-600',
        border: 'border-primary-500',
        gradient: 'from-primary-500 to-primary-600'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        border: 'border-blue-500',
        gradient: 'from-blue-500 to-blue-600'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-500',
        gradient: 'from-purple-500 to-purple-600'
      }
    };

    return colors[color] || colors.primary;
  };

  const currentPackages = packageData[selectedPotSize] || packageData['4-5-inch'];

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Perfect
              <span className="text-primary-600 dark:text-primary-400 block">
                Plant Package
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Select from our carefully curated rental packages designed for different space sizes and budgets. 
              All packages include professional maintenance and free plant replacement.
            </p>
          </motion.div>

          {/* Pot Size Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
              {Object.keys(packageData).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedPotSize(size)}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                    selectedPotSize === size
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {size === '4-5-inch' ? '4" & 5" Pots' : size === '5-inch' ? '5" Pots' : '8" Pots'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Available Plants Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-12"
          >
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-primary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Available Plants for {selectedPotSize === '4-5-inch' ? '4" & 5" Pots' : selectedPotSize === '5-inch' ? '5" Pots' : '8" Pots'}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availablePlants[selectedPotSize]?.map((plant, index) => (
                    <span
                      key={index}
                      className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    >
                      {plant}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {currentPackages.map((pkg, index) => {
              const Icon = pkg.icon;
              const colorClasses = getColorClasses(pkg.color, pkg.popular);
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                    pkg.popular ? `ring-2 ring-${pkg.color}-500 ring-opacity-50` : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className={`absolute top-0 right-0 bg-gradient-to-r ${colorClasses.gradient} text-white px-4 py-1 rounded-bl-lg text-sm font-semibold`}>
                      Most Popular
                    </div>
                  )}

                  {/* Package Header */}
                  <div className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${colorClasses.gradient} rounded-full mb-4`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {pkg.description}
                    </p>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{pkg.pricePerPlant}/plant • {pkg.plantsCount} plants • {pkg.potSize}
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="px-8 pb-8">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <FaCheck className={`${colorClasses.text} text-sm mt-1 flex-shrink-0`} />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePackageSelect(pkg.id)}
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        pkg.popular
                          ? `bg-gradient-to-r ${colorClasses.gradient} text-white hover:shadow-lg`
                          : `border-2 ${colorClasses.border} ${colorClasses.text} hover:bg-gradient-to-r hover:${colorClasses.gradient} hover:text-white`
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Subscription...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          <span>Subscribe Now</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Need a Custom Package?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              We can create a personalized plant rental solution tailored to your specific needs and space requirements.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get Custom Quote</span>
              <FaInfoCircle />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Packages;