import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaGift, 
  FaClock, 
  FaPercent, 
  FaStar,
  FaCalendarAlt,
  FaUsers,
  FaLeaf,
  FaBolt,
  FaArrowRight,
  FaCheckCircle,
  FaFire
} from 'react-icons/fa';

const Offers = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer for limited time offers
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentOffers = [
    {
      id: 1,
      title: "New Customer Special",
      subtitle: "First Month 50% Off",
      description: "Get 50% discount on your first month's rental for any package. Perfect for trying our services risk-free.",
      discount: "50%",
      originalPrice: "₹3,499",
      discountedPrice: "₹1,749",
      savings: "₹1,750",
      validUntil: "Limited Time",
      features: [
        "50% off first month",
        "Free consultation included",
        "All maintenance included",
        "Free plant replacement",
        "No setup fees"
      ],
      badge: "Popular",
      color: "primary",
      icon: FaGift
    },
    {
      id: 2,
      title: "Annual Subscription Deal",
      subtitle: "Save 25% on Yearly Plans",
      description: "Commit to a year and save big! Get 25% off all packages with our annual subscription plan.",
      discount: "25%",
      originalPrice: "₹41,988",
      discountedPrice: "₹31,491",
      savings: "₹10,497",
      validUntil: "Ongoing",
      features: [
        "25% off entire year",
        "Priority maintenance",
        "Free seasonal updates",
        "Dedicated support",
        "Flexibility to upgrade"
      ],
      badge: "Best Value",
      color: "blue",
      icon: FaCalendarAlt
    },
    {
      id: 3,
      title: "Corporate Package",
      subtitle: "Bulk Discount for Large Offices",
      description: "Special pricing for offices with 100+ employees. Includes premium plants and enhanced services.",
      discount: "30%",
      originalPrice: "₹50,000+",
      discountedPrice: "₹35,000+",
      savings: "₹15,000+",
      validUntil: "Contact for Details",
      features: [
        "30% discount on large orders",
        "Premium plant selection",
        "Weekly maintenance",
        "Dedicated account manager",
        "Custom design consultation"
      ],
      badge: "Enterprise",
      color: "purple",
      icon: FaUsers
    }
  ];

  const seasonalOffers = [
    {
      title: "Monsoon Special",
      description: "Extra humidity-loving plants at no additional cost",
      icon: "🌧️",
      validity: "June - September",
      status: "active"
    },
    {
      title: "Festival Decor Package",
      description: "Decorative plants for Diwali, Christmas, and other celebrations",
      icon: "🎉",
      validity: "Seasonal",
      status: "upcoming"
    },
    {
      title: "Summer Air Purifier Boost",
      description: "Additional air-purifying plants during hot months",
      icon: "☀️",
      validity: "March - May",
      status: "upcoming"
    },
    {
      title: "New Year Fresh Start",
      description: "Complete plant refresh with 20% off all packages",
      icon: "🎆",
      validity: "January",
      status: "upcoming"
    }
  ];

  const referralProgram = {
    title: "Refer & Earn Program",
    description: "Share the green love and get rewarded",
    benefits: [
      "₹1000 credit for each successful referral",
      "Your friend gets 20% off their first package",
      "Unlimited referrals allowed",
      "Credits can be used for any service",
      "Bonus rewards for multiple referrals"
    ],
    howItWorks: [
      "Share your unique referral code",
      "Friend signs up using your code",
      "They get 20% off, you get ₹1000 credit",
      "Credits added to your account",
      "Use credits for future payments"
    ]
  };

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-green-500',
        light: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        gradient: 'from-green-500 to-green-600'
      },
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        gradient: 'from-blue-500 to-blue-600'
      },
      purple: {
        bg: 'bg-purple-500',
        light: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        gradient: 'from-purple-500 to-purple-600'
      }
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FaFire className="text-orange-300" />
              <span className="text-sm font-medium">Limited Time Offers</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Special Offers &
              <span className="block">Great Savings</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Transform your workspace for less! Discover our current promotions and 
              seasonal offers designed to bring nature to your office at unbeatable prices.
            </p>

            {/* Countdown Timer */}
            <div className="mt-12 max-w-md mx-auto">
              <p className="text-green-200 mb-4">Limited time offers end in:</p>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-green-200 uppercase">{unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Offers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Current Special Offers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Take advantage of these exclusive deals while they last
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {currentOffers.map((offer, index) => {
              const Icon = offer.icon;
              const colorClasses = getColorClasses(offer.color);
              
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative"
                >
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${colorClasses.gradient} text-white px-3 py-1 rounded-full text-xs font-semibold z-10`}>
                    {offer.badge}
                  </div>

                  {/* Header */}
                  <div className={`${colorClasses.light} p-8 text-center border-b ${colorClasses.border}`}>
                    <div className={`${colorClasses.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="text-2xl text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {offer.title}
                    </h3>
                    <p className={`text-lg ${colorClasses.text} font-semibold mb-4`}>
                      {offer.subtitle}
                    </p>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-gray-500 dark:text-gray-400 line-through text-lg">
                          {offer.originalPrice}
                        </span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {offer.discountedPrice}
                        </span>
                      </div>
                      <div className={`${colorClasses.bg} text-white px-4 py-2 rounded-full inline-block`}>
                        Save {offer.savings}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {offer.description}
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {offer.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <FaCheckCircle className={`${colorClasses.text} text-sm mt-1 flex-shrink-0`} />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-center">
                      <div className={`${colorClasses.text} text-sm mb-4`}>
                        Valid until: {offer.validUntil}
                      </div>
                      <Link
                        to="/contact"
                        className={`w-full bg-gradient-to-r ${colorClasses.gradient} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center space-x-2`}
                      >
                        <span>Claim This Offer</span>
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seasonal Offers */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Seasonal Promotions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Special offers that change with the seasons to give you the best plants for every time of year
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalOffers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 ${
                  offer.status === 'active' ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="text-4xl mb-4">{offer.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {offer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {offer.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {offer.validity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    offer.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {offer.status === 'active' ? 'Active' : 'Coming Soon'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Program */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <FaUsers className="text-green-300" />
                <span className="text-sm font-medium">Referral Rewards</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {referralProgram.title}
              </h2>
              <p className="text-xl text-green-100 mb-8">
                {referralProgram.description}
              </p>

              <div className="space-y-4 mb-8">
                {referralProgram.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <FaCheckCircle className="text-yellow-300 mt-1 flex-shrink-0" />
                    <span className="text-green-100">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              >
                <span>Start Referring</span>
                <FaArrowRight />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">How It Works</h3>
              <div className="space-y-4">
                {referralProgram.howItWorks.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-yellow-400 text-green-900 rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;
