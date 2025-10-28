import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  TrashIcon, 
  StarIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';

const ResumeCard = ({ 
  resume, 
  onAnalyze, 
  onDelete, 
  onSetActive, 
  onSelect, 
  isSelected 
}) => {
  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word')) return '📝';
    return '📋';
  };

  const getAnalysisColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-dark-700 rounded-xl p-4 shadow-lg border-2 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
          : 'border-transparent hover:border-gray-300 dark:hover:border-dark-600'
      }`}
      onClick={() => onSelect(resume)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getFileTypeIcon(resume.fileType)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {resume.title || 'Untitled Resume'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(resume.createdAt)}
            </p>
          </div>
        </div>

        {resume.isActive && (
          <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
            <StarIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-700 dark:text-green-300">Active</span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>{resume.fileType?.split('/')[1]?.toUpperCase() || 'PDF'}</span>
        <span>{(resume.fileSize / 1024 / 1024).toFixed(2)} MB</span>
      </div>

      {/* Analysis Status */}
      {resume.mlAnalysis ? (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-dark-600 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              AI Score
            </span>
            <span className={`text-xs font-bold ${getAnalysisColor(resume.mlAnalysis.overallScore)}`}>
              {resume.mlAnalysis.overallScore || 0}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-500 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${resume.mlAnalysis.overallScore || 0}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
            🤖 Ready for AI Analysis
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze(resume._id);
            }}
            disabled={!resume.mlAnalysis}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Analyze with AI"
          >
            <ChartBarIcon className="w-4 h-4" />
          </motion.button>

          {!resume.isActive && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onSetActive(resume._id);
              }}
              className="p-1 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              title="Set as Active"
            >
              <StarIcon className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(resume._id);
          }}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Delete Resume"
        >
          <TrashIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResumeCard;