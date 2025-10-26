import React from "react";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const JobCard = ({ job, onEdit, onDelete, onView }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return <CheckCircleIcon className="w-4 h-4 text-blue-500" />;
      case "interview":
        return <ClockIcon className="w-4 h-4 text-purple-500" />;
      case "offer":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      interview:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      offer:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      accepted:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      linkedin: "💼",
      internshala: "🎓",
      indeed: "🔍",
      naukri: "💻",
      other: "📝",
    };
    return icons[platform] || "📝";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysAgo = (dateString) => {
    const today = new Date();
    const appliedDate = new Date(dateString);
    const diffTime = Math.abs(today - appliedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-dark-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-dark-600"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getPlatformIcon(job.platform)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {job.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {job.company}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                job.status
              )}`}
            >
              {getStatusIcon(job.status)}
              <span className="ml-1">
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </span>

            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {formatDate(job.appliedAt)}
            </div>
          </div>
        </div>

        {/* Location and Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
          {job.location && (
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {job.location}
            </div>
          )}
          <span className="text-xs">{getDaysAgo(job.appliedAt)}</span>
        </div>

        {/* Description Preview */}
        {job.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {job.description.substring(0, 100)}...
          </p>
        )}

        {/* ML Analysis Score */}
        {job.mlAnalysis && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-dark-600 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                AI Match Score
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-dark-500 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${(job.mlAnalysis.matchScore || 0) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-xs">
                  {Math.round((job.mlAnalysis.matchScore || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-600">
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(job)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              View Details
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(job)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Edit
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(job._id)}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
