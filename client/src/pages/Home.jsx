import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import plants from '../assets/folder/photo.jpg';

import { 
  FaLeaf, 
  FaHeart, 
  FaLightbulb, 
  FaWind, 
  
  FaArrowRight
} from 'react-icons/fa';

const Home = () => {
  const benefits = [
    {
      icon: FaHeart,
      title: 'Reduced Stress',
      description: 'Office plants have been shown to reduce stress levels, creating a more peaceful and relaxed work environment.',
      color: 'text-red-500'
    },
    {
      icon: FaLightbulb,
      title: 'Increased Productivity',
      description: 'Plants can improve focus and concentration, leading to greater productivity and better overall performance.',
      color: 'text-yellow-500'
    },
    {
      icon: FaWind,
      title: 'Improved Air Quality',
      description: 'Plants naturally purify the air by absorbing pollutants and releasing oxygen, contributing to a healthier indoor environment.',
      color: 'text-blue-500'
    },
    {
      icon: FaLeaf,
      title: 'Enhanced Aesthetics',
      description: 'Plants add a touch of natural beauty to any workspace, creating a more welcoming and inviting atmosphere.',
      color: 'text-green-500'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      company: 'Tech Solutions Ltd.',
      rating: 5,
      text: 'Mahaplants transformed our office environment completely. The plants are well-maintained and our employees love the fresh atmosphere.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Priya Patel',
      company: 'Creative Agency',
      rating: 5,
      text: 'The professional service and beautiful plant selection exceeded our expectations. Our workspace feels more alive and productive now.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Amit Singh',
      company: 'Finance Corp',
      rating: 5,
      text: 'Excellent rental packages and maintenance service. The team is very professional and responsive to our needs.',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  Transform Your
                  <span className="text-primary-600 dark:text-primary-400 block">
                    Workspace
                  </span>
                  with Nature
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  Mahaplants offers premium plant rental services for offices, 
                  showrooms, and hotels in Pune. Create a healthier, more productive environment 
                  with our carefully selected and maintained plants.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/packages"
                  className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  View Packages
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/contact"
                  className="group border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  Get Free Quote
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">22+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Plant Varieties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">5+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10">
                <img src={plants} alt="Modern office with plants" className="rounded-2xl shadow-2xl object-cover w-full h-96 lg:h-[500px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover the benefits of our office plant rental services.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              >
                <benefit.icon className={`text-4xl mb-4 ${benefit.color}`} />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
