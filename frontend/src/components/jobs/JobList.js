import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import JobDetails from './JobDetails';

const JobList = ({ jobs, loading, onUpdateJob, onDeleteJob }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">💼</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No jobs found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start by adding your first job application!
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        <AnimatePresence>
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {getPlatformIcon(job.platform)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <BuildingOfficeIcon className="w-4 h-4" />
                            {job.company}
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {job.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(job.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {job.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setViewJob(job)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedJob(job)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteJob(job._id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {job.mlAnalysis && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">AI Match Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-dark-500 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(job.mlAnalysis.matchScore || 0) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round((job.mlAnalysis.matchScore || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {viewJob && (
          <JobDetails
            job={viewJob}
            onClose={() => setViewJob(null)}
            onUpdate={onUpdateJob}
          />
        )}
      </AnimatePresence>

      {/* Edit Job Modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobForm
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSubmit={(data) => onUpdateJob(selectedJob._id, data)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default JobList;