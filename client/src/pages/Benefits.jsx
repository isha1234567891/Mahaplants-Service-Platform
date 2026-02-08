import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaLightbulb, 
  FaWind, 
  FaLeaf,
  FaChartLine,
  FaBrain,
  FaUsers,
  FaDollarSign,
  FaShieldAlt,
  FaEye,
  FaSmile,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

const Benefits = () => {
  const mainBenefits = [
    {
      id: 1,
      title: 'Reduced Stress',
      description: 'Office plants have been shown to reduce stress levels, creating a more peaceful and relaxed work environment.',
      icon: FaHeart,
      color: 'red',
      stats: '23% reduction in stress levels',
      details: [
        'Lower cortisol levels in office workers',
        'Decreased anxiety and tension',
        'Improved mental well-being',
        'Better work-life balance perception',
        'Reduced workplace conflicts'
      ],
      research: 'Studies from the University of Technology, Sydney show significant stress reduction in workplaces with plants.'
    },
    {
      id: 2,
      title: 'Increased Productivity',
      description: 'Plants can improve focus and concentration, leading to greater productivity and better overall performance.',
      icon: FaLightbulb,
      color: 'yellow',
      stats: '15% increase in productivity',
      details: [
        'Enhanced focus and concentration',
        'Improved cognitive function',
        'Better task completion rates',
        'Increased creativity and innovation',
        'Higher quality work output'
      ],
      research: 'Research by Dr. Chris Knight shows 15% productivity increase in offices with plants.'
    },
    {
      id: 3,
      title: 'Improved Air Quality',
      description: 'Plants naturally purify the air by absorbing pollutants and releasing oxygen, contributing to a healthier indoor environment.',
      icon: FaWind,
      color: 'blue',
      stats: '87% improvement in air quality',
      details: [
        'Removal of harmful toxins',
        'Increased oxygen levels',
        'Reduced carbon dioxide',
        'Natural air filtration',
        'Decreased sick building syndrome'
      ],
      research: 'NASA Clean Air Study identifies plants that remove indoor air pollutants effectively.'
    },
    {
      id: 4,
      title: 'Enhanced Aesthetics',
      description: 'Plants add a touch of natural beauty to any workspace, creating a more welcoming and inviting atmosphere.',
      icon: FaLeaf,
      color: 'green',
      stats: '91% improved visual appeal',
      details: [
        'Natural beauty and color',
        'Softened harsh office lines',
        'Increased visual interest',
        'Better brand image',
        'More welcoming environment'
      ],
      research: 'Environmental psychology studies confirm visual benefits of biophilic design elements.'
    }
  ];

  const additionalBenefits = [
    {
      icon: FaChartLine,
      title: 'Increased Employee Retention',
      description: 'Employees are 6% more productive and 15% more creative in offices with plants',
      color: 'text-blue-500'
    },
    {
      icon: FaBrain,
      title: 'Enhanced Memory & Focus',
      description: 'Plants improve memory retention by up to 20% and increase attention span',
      color: 'text-purple-500'
    },
    {
      icon: FaUsers,
      title: 'Better Team Collaboration',
      description: 'Natural elements promote social interaction and team bonding',
      color: 'text-green-500'
    },
    {
      icon: FaDollarSign,
      title: 'Reduced Absenteeism',
      description: 'Healthier air quality leads to fewer sick days and medical costs',
      color: 'text-yellow-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Noise Reduction',
      description: 'Plants act as natural sound barriers, reducing noise pollution by up to 5dB',
      color: 'text-indigo-500'
    },
    {
      icon: FaEye,
      title: 'Reduced Eye Strain',
      description: 'Green plants help relax eyes and reduce computer vision syndrome',
      color: 'text-teal-500'
    },
    {
      icon: FaSmile,
      title: 'Improved Mood',
      description: 'Natural elements boost serotonin levels and overall job satisfaction',
      color: 'text-pink-500'
    },
    {
      icon: FaWind,
      title: 'Humidity Regulation',
      description: 'Plants naturally regulate humidity levels, maintaining optimal comfort',
      color: 'text-cyan-500'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-500',
        light: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        gradient: 'from-red-500 to-red-600'
      },
      yellow: {
        bg: 'bg-yellow-500',
        light: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
        gradient: 'from-yellow-500 to-yellow-600'
      },
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        gradient: 'from-blue-500 to-blue-600'
      },
      green: {
        bg: 'bg-green-500',
        light: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        gradient: 'from-green-500 to-green-600'
      }
    };
    return colors[color] || colors.green;
  };

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
              Benefits of Having
              <span className="text-primary-600 dark:text-primary-400 block">
                Plants in Your Office
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the science-backed benefits of incorporating plants into your workspace. 
              From improved air quality to enhanced productivity, plants transform work environments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {mainBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const colorClasses = getColorClasses(benefit.color);
              
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Benefit Header */}
                  <div className={`${colorClasses.light} p-8 border-b ${colorClasses.border}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`${colorClasses.bg} p-4 rounded-xl flex-shrink-0`}>
                        <Icon className="text-2xl text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {benefit.description}
                        </p>
                        <div className={`inline-block ${colorClasses.bg} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                          {benefit.stats}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefit Content */}
                  <div className="p-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Key Benefits:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {benefit.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 ${colorClasses.bg} rounded-full mt-2 flex-shrink-0`}></div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className={`${colorClasses.light} rounded-lg p-4 border ${colorClasses.border}`}>
                      <h5 className={`${colorClasses.text} font-semibold mb-2 text-sm`}>
                        Research Insight:
                      </h5>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {benefit.research}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
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
              Additional Workplace Benefits
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Beyond the core benefits, plants provide numerous additional advantages 
              that contribute to a thriving workplace environment.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
                >
                  <Icon className={`text-4xl ${benefit.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-green-600 dark:bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              The Numbers Speak for Themselves
            </h2>
            <p className="text-xl text-green-100">
              Research-backed statistics on workplace plants
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '87%', label: 'Air Quality Improvement' },
              { number: '23%', label: 'Stress Reduction' },
              { number: '15%', label: 'Productivity Increase' },
              { number: '20%', label: 'Better Memory Retention' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Transform Your Workspace
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See the dramatic difference plants can make in your office environment
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-gray-100 dark:bg-gray-700 p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Without Plants
                </h3>
                <p className="text-red-600 dark:text-red-400">Traditional Office</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    'Poor air quality',
                    'High stress levels',
                    'Low productivity',
                    'Sterile environment',
                    'Higher absenteeism',
                    'Reduced creativity'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-green-100 dark:bg-green-700 p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  With Plants
                </h3>
                <p className="text-green-600 dark:text-green-400">Biophilic Office</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    'Clean, fresh air',
                    'Lower stress levels',
                    'Higher productivity',
                    'Inviting environment',
                    'Fewer sick days',
                    'Boosted creativity'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Benefits;