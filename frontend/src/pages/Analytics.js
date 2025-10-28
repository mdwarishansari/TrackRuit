import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon, // Fixed: Changed from TrendingUpIcon to ArrowTrendingUpIcon
  CalendarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import ProgressChart from '../components/analytics/ProgressChart';
import SkillGapAnalysis from '../components/analytics/SkillGapAnalysis';
import { analyticsAPI } from '../services/analytics';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getUserAnalytics({ timeRange });
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Please log in to view analytics
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-dark-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics & Insights 📊
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your job search performance and get AI-powered insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  label: 'Total Applications',
                  value: analytics.overview?.totalApplications || 0,
                  icon: DocumentChartBarIcon,
                  color: 'blue',
                  change: '+12%'
                },
                {
                  label: 'Interview Rate',
                  value: `${analytics.overview?.interviewRate || 0}%`,
                  icon: ArrowTrendingUpIcon, // Fixed icon
                  color: 'green',
                  change: '+5%'
                },
                {
                  label: 'Success Rate',
                  value: `${analytics.overview?.successRate || 0}%`,
                  icon: ChartBarIcon,
                  color: 'purple',
                  change: '+8%'
                },
                {
                  label: 'Active Days',
                  value: analytics.overview?.activeDays || 0,
                  icon: CalendarIcon,
                  color: 'orange',
                  change: '+3'
                }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="p-6 transition-all duration-300 bg-white shadow-lg dark:bg-dark-700 rounded-2xl hover:shadow-xl card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        {stat.change} from last period
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ProgressChart data={analytics.progress} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AnalyticsDashboard data={analytics} />
              </motion.div>
            </div>

            {/* Skill Gap Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SkillGapAnalysis data={analytics.skillGaps} />
            </motion.div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No analytics data yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start tracking your job applications to see insights here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;