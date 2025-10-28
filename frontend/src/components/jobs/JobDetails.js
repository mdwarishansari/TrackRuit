import React from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';

const JobDetails = ({ job, onClose, onUpdate }) => {
  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      accepted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      linkedin: '💼',
      internshala: '🎓',
      indeed: '🔍',
      naukri: '💻',
      other: '📝'
    };
    return icons[platform] || '📝';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">
              {getPlatformIcon(job.platform)}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {job.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                <p className="font-medium text-gray-900 dark:text-white">{job.company}</p>
              </div>
            </div>

            {job.location && (
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Applied</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(job.appliedAt)}
                </p>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.salary}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
            </div>

            {job.url && (
              <div className="flex items-center space-x-3">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Job Posting</p>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View Original
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ML Analysis */}
          {job.mlAnalysis && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                AI Match Analysis 🤖
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {Math.round((job.mlAnalysis.matchScore || 0) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {job.mlAnalysis.skillMatch || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skills Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {job.mlAnalysis.experienceMatch || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Experience Fit</div>
                </div>
              </div>

              {/* Skills Analysis */}
              {(job.mlAnalysis.matchedSkills || job.mlAnalysis.missingSkills) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.mlAnalysis.matchedSkills && job.mlAnalysis.matchedSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                        ✅ Strong Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {job.mlAnalysis.matchedSkills.slice(0, 8).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.mlAnalysis.missingSkills && job.mlAnalysis.missingSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                        📚 Skills to Highlight
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {job.mlAnalysis.missingSkills.slice(0, 6).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Job Description */}
          {job.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Job Description
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Notes & Follow-ups
            </h3>
            <textarea
              placeholder="Add notes about this application, interview details, or follow-up actions..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white min-h-[100px]"
              defaultValue={job.notes || ''}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-dark-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Handle save notes
              onClose();
            }}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            Save Notes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobDetails;