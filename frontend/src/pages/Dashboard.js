import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BriefcaseIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import JobCard from '../components/dashboard/JobCard';
import { jobsAPI } from '../services/jobs';
import { analyticsAPI } from '../services/analytics';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    applicationsThisWeek: 0,
    interviewRate: 0,
    activeResumes: 0,
    successRate: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - replace with actual API calls
      const mockStats = {
        totalJobs: 24,
        applicationsThisWeek: 5,
        interviewRate: 25,
        activeResumes: 2,
        successRate: 85
      };

      const mockJobs = [
        {
          _id: '1',
          title: 'Senior Frontend Developer',
          company: 'Tech Corp',
          status: 'applied',
          appliedAt: '2024-01-15',
          platform: 'linkedin',
          location: 'Remote',
          description: 'Looking for experienced React developer with modern web development skills...',
          mlAnalysis: { matchScore: 0.82 }
        },
        {
          _id: '2',
          title: 'Full Stack Engineer',
          company: 'Startup XYZ',
          status: 'interview',
          appliedAt: '2024-01-14',
          platform: 'indeed',
          location: 'New York, NY',
          description: 'Join our fast-growing startup as a full stack developer...',
          mlAnalysis: { matchScore: 0.76 }
        }
      ];

      const mockChartData = [
        { name: 'Mon', applications: 3, interviews: 1 },
        { name: 'Tue', applications: 5, interviews: 2 },
        { name: 'Wed', applications: 2, interviews: 1 },
        { name: 'Thu', applications: 4, interviews: 3 },
        { name: 'Fri', applications: 6, interviews: 2 },
        { name: 'Sat', applications: 1, interviews: 0 },
        { name: 'Sun', applications: 3, interviews: 1 }
      ];

      setStats(mockStats);
      setRecentJobs(mockJobs);
      setAnalyticsData(mockChartData);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const handleEditJob = (job) => {
    console.log('Edit job:', job);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      toast.success('Job deleted successfully');
      fetchDashboardData();
    }
  };

  const handleViewJob = (job) => {
    console.log('View job:', job);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your dashboard
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your job search overview for today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            description="All tracked applications"
            icon={<BriefcaseIcon />}
            color="blue"
            change="+12%"
            index={0}
          />
          <StatsCard
            title="This Week"
            value={stats.applicationsThisWeek}
            description="New applications"
            icon={<ArrowTrendingUpIcon />}
            color="green"
            change="+5"
            index={1}
          />
          <StatsCard
            title="Interview Rate"
            value={`${stats.interviewRate}%`}
            description="Application to interview"
            icon={<ChartBarIcon />}
            color="purple"
            change="+8%"
            index={2}
          />
          <StatsCard
            title="Active Resumes"
            value={stats.activeResumes}
            description="Uploaded & analyzed"
            icon={<DocumentTextIcon />}
            color="orange"
            index={3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Recent Jobs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnalyticsChart
                type="line"
                data={analyticsData}
                title="Weekly Application Trend"
                height={300}
              />
            </motion.div>

            {/* Recent Jobs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Applications
                </h2>
                <Link
                  to="/jobs"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  View all
                  <EyeIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-200 dark:bg-dark-600 h-12 w-12"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job, index) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                      onView={handleViewJob}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No jobs yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start tracking your job applications to see them here.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Add Your First Job
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QuickActions />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;