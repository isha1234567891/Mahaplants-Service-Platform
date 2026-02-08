import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaCheck, FaPlus } from 'react-icons/fa';

const ServiceScheduler = ({ orderId, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceType, setServiceType] = useState('Weekly');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    const scheduleData = {
      orderId,
      serviceType,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      specialInstructions,
      status: 'scheduled'
    };

    onSchedule(scheduleData);
    
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSpecialInstructions('');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <FaPlus className="text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Schedule Maintenance Service
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maintenance Service Type
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="Weekly">Weekly Maintenance</option>
            <option value="Bi-weekly">Bi-weekly Deep Care</option>
            <option value="Monthly">Monthly Health Check</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Note: Plant delivery is automatically scheduled when you place an order
          </p>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaCalendar className="inline mr-1" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getMinDate()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FaClock className="inline mr-1" />
          Select Time Slot
        </label>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTime === time
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Any specific requirements or areas of concern..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
          rows="3"
        />
      </div>

      {/* Schedule Button */}
      <button
        onClick={handleSchedule}
        disabled={!selectedDate || !selectedTime}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedDate && selectedTime
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        <FaCheck />
        <span>Schedule Maintenance</span>
      </button>
    </motion.div>
  );
};

export default ServiceScheduler;