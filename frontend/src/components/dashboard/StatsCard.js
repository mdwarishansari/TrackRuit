import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, description, icon, color = 'blue', change, index }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-600 dark:text-blue-400',
      change: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-600 dark:text-green-400',
      change: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-600 dark:text-purple-400',
      change: 'text-purple-600 dark:text-purple-400'
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900',
      text: 'text-orange-600 dark:text-orange-400',
      change: 'text-orange-600 dark:text-orange-400'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-600 dark:text-red-400',
      change: 'text-red-600 dark:text-red-400'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <span className={`text-sm font-medium ${currentColor.change}`}>
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {description}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${currentColor.bg}`}>
          {React.cloneElement(icon, {
            className: `w-6 h-6 ${currentColor.text}`
          })}
        </div>
      </div>

      {/* Progress bar for some stats */}
      {(title === 'Interview Rate' || title === 'Success Rate') && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{typeof value === 'string' ? value : `${value}%`}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: typeof value === 'string' ? '0%' : `${value}%`,
                backgroundColor: currentColor.text.replace('text-', 'bg-').split(' ')[0]
              }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;