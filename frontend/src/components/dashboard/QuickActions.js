import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusIcon,
  DocumentArrowUpIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const QuickActions = () => {
  const actions = [
    {
      title: "Add New Job",
      description: "Track a new job application",
      icon: PlusIcon,
      href: "/jobs/new",
      color: "blue",
      emoji: "💼",
    },
    {
      title: "Upload Resume",
      description: "Get AI-powered analysis",
      icon: DocumentArrowUpIcon,
      href: "/resume",
      color: "green",
      emoji: "📄",
    },
    {
      title: "View Analytics",
      description: "See your progress insights",
      icon: ChartBarIcon,
      href: "/analytics",
      color: "purple",
      emoji: "📊",
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      icon: Cog6ToothIcon,
      href: "/settings",
      color: "gray",
      emoji: "⚙️",
    },
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
      green:
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
      purple:
        "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
      gray: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
    };
    return classes[color] || classes.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions 🚀
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={action.href}
              className="flex items-center p-4 border border-gray-200 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 transition-all duration-300 group"
            >
              <div
                className={`p-3 rounded-lg ${getColorClasses(
                  action.color
                )} mr-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-lg">{action.emoji}</span>
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>

              <div className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <action.icon className="w-5 h-5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Extension CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔌</span>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Browser Extension
            </h4>
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
              Auto-track jobs from LinkedIn & Internshala
            </p>
          </div>
          <button className="ml-4 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
            Install
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;
