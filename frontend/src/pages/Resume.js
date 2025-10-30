import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import ResumeUpload from '../components/resume/ResumeUpload';
import ResumeCard from '../components/resume/ResumeCard';
import ResumeAnalysis from '../components/resume/ResumeAnalysis';
import { resumesAPI } from '../services/resumes';
import toast from 'react-hot-toast';

const Resume = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumesAPI.getAll();
      if (response.data.success) {
        setResumes(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await resumesAPI.upload(formData);
      if (response.data.success) {
        toast.success('Resume uploaded successfully! 📄');
        setShowUpload(false);
        fetchResumes();
      }
    } catch (error) {
      toast.error('Failed to upload resume');
    }
  };

  const handleAnalyze = async (resumeId) => {
    try {
      const response = await resumesAPI.analyze(resumeId);
      if (response.data.success) {
        toast.success('Resume analysis completed! 🤖');
        fetchResumes();
        setSelectedResume(resumes.find(r => r._id === resumeId));
      }
    } catch (error) {
      toast.error('Failed to analyze resume');
    }
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const response = await resumesAPI.delete(resumeId);
        if (response.data.success) {
          toast.success('Resume deleted successfully! 🗑️');
          fetchResumes();
          if (selectedResume && selectedResume._id === resumeId) {
            setSelectedResume(null);
          }
        }
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleSetActive = async (resumeId) => {
    try {
      const response = await resumesAPI.setActive(resumeId);
      if (response.data.success) {
        toast.success('Resume set as active! ✅');
        fetchResumes();
      }
    } catch (error) {
      toast.error('Failed to set active resume');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to manage your resumes
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Resume Management 📄
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Upload and analyze your resumes with AI-powered insights
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CloudArrowUpIcon className="w-5 h-5 mr-2" />
              Upload Resume
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Resumes ({resumes.length})
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No resumes uploaded yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume, index) => (
                    <ResumeCard
                      key={resume._id}
                      resume={resume}
                      onAnalyze={handleAnalyze}
                      onDelete={handleDelete}
                      onSetActive={handleSetActive}
                      onSelect={setSelectedResume}
                      isSelected={selectedResume?._id === resume._id}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Resume Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedResume ? (
              <ResumeAnalysis resume={selectedResume} />
            ) : (
              <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-8 text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Resume
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a resume from the list to view its analysis and insights
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <ResumeUpload
            onClose={() => setShowUpload(false)}
            onUpload={handleUpload}
          />
        )}
      </div>
    </div>
  );
};

export default Resume;