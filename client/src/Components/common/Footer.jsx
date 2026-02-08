import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaHeart 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Services', path: '/services' },
      { name: 'Benefits', path: '/benefits' },
      { name: 'Contact', path: '/contact' }
    ],
    services: [
      { name: 'Plant Packages', path: '/packages' },
      { name: 'Special Offers', path: '/offers' },
      { name: 'Consultation', path: '/contact' },
      { name: 'Maintenance', path: '/services' }
    ],
    support: [
      { name: 'FAQ', path: '/contact' },
      { name: 'Help Center', path: '/contact' },
      { name: 'Terms of Service', path: '/contact' },
      { name: 'Privacy Policy', path: '/contact' }
    ]
  };

  const socialLinks = [
    { icon: FaFacebook, href: '#', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: '#', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: '#', color: 'hover:text-pink-600' },
    { icon: FaLinkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 p-2 rounded-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold">Mahaplants</span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Transform your workspace with our premium plant rental services. 
              We bring nature indoors to create healthier, more productive environments.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-500 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Mauli Hitech Nursery</p>
                  <p>Gat No. 42, A/P - Solu</p>
                  <p>Alandi Markal Road, Tal - Khed</p>
                  <p>Dist - Pune, Pin 412105</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-500" />
                <a 
                  href="tel:09850928571" 
                  className="text-sm text-gray-300 hover:text-primary-400 transition-colors"
                >
                  09850928571
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-500" />
                <a 
                  href="mailto:dilipmhnpl@gmail.com" 
                  className="text-sm text-gray-300 hover:text-primary-400 transition-colors"
                >
                  dilipmhnpl@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-gray-400 ${social.color} transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700`}
                    >
                      <Icon size={16} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2 text-sm text-gray-400"
            >
              <span>&copy; {currentYear} Mahaplants. All rights reserved.</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center space-x-1 text-sm text-gray-400"
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaHeart className="text-red-500" />
              </motion.div>
              <span>for a greener world</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;