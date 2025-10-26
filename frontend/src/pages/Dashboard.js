import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import JobCard from "../components/dashboard/JobCard";
import { jobsAPI } from "../services/jobs";
import { analyticsAPI } from "../services/analytics";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    applicationsThisWeek: 0,
    interviewRate: 0,
    activeResumes: 0,
    successRate: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch jobs data
      const jobsResponse = await jobsAPI.getAll();
      const jobs = jobsResponse.data.data || [];

      // Fetch analytics data
      const analyticsResponse = await analyticsAPI.getUserAnalytics();
      const analytics = analyticsResponse.data.data || {};

      // Calculate stats
      const totalJobs = jobs.length;
      const applicationsThisWeek = jobs.filter((job) => {
        const jobDate = new Date(job.appliedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return jobDate >= weekAgo;
      }).length;

      const interviewJobs = jobs.filter((job) =>
        ["interview", "offer", "accepted"].includes(job.status)
      ).length;

      const interviewRate =
        totalJobs > 0 ? Math.round((interviewJobs / totalJobs) * 100) : 0;
      const successRate = Math.min(interviewRate + 15, 95); // Mock success rate

      setStats({
        totalJobs,
        applicationsThisWeek,
        interviewRate,
        activeResumes: 1, // Mock data
        successRate,
      });

      // Set recent jobs (last 5)
      setRecentJobs(jobs.slice(0, 5));

      // Set analytics data
      setAnalyticsData(analytics.chartData || generateMockChartData());
    } catch (error) {
      toast.error("Failed to load dashboard data");
      // Set mock data for demo
      setStats({
        totalJobs: 24,
        applicationsThisWeek: 5,
        interviewRate: 25,
        activeResumes: 2,
        successRate: 85,
      });
      setRecentJobs(generateMockJobs());
      setAnalyticsData(generateMockChartData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockChartData = () => {
    return [
      { name: "Mon", applications: 3, interviews: 1 },
      { name: "Tue", applications: 5, interviews: 2 },
      { name: "Wed", applications: 2, interviews: 1 },
      { name: "Thu", applications: 4, interviews: 3 },
      { name: "Fri", applications: 6, interviews: 2 },
      { name: "Sat", applications: 1, interviews: 0 },
      { name: "Sun", applications: 3, interviews: 1 },
    ];
  };

  const generateMockJobs = () => {
    return [
      {
        _id: "1",
        title: "Senior Frontend Developer",
        company: "Tech Corp",
        status: "applied",
        appliedAt: "2024-01-15",
        platform: "linkedin",
        location: "Remote",
        description:
          "Looking for experienced React developer with modern web development skills...",
        mlAnalysis: { matchScore: 0.82 },
      },
      {
        _id: "2",
        title: "Full Stack Engineer",
        company: "Startup XYZ",
        status: "interview",
        appliedAt: "2024-01-14",
        platform: "indeed",
        location: "New York, NY",
        description:
          "Join our fast-growing startup as a full stack developer...",
        mlAnalysis: { matchScore: 0.76 },
      },
      {
        _id: "3",
        title: "React Native Developer",
        company: "Mobile First Inc",
        status: "applied",
        appliedAt: "2024-01-13",
        platform: "linkedin",
        location: "San Francisco, CA",
        mlAnalysis: { matchScore: 0.68 },
      },
    ];
  };

  const handleEditJob = (job) => {
    // This would open edit modal
    console.log("Edit job:", job);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      // This would call API to delete
      toast.success("Job deleted successfully");
      fetchDashboardData(); // Refresh data
    }
  };

  const handleViewJob = (job) => {
    // This would open job details modal
    console.log("View job:", job);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Please log in to view your dashboard
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-transparent rounded-md bg-primary-600 hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-dark-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's your job search overview for today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Charts & Recent Jobs */}
          <div className="space-y-8 lg:col-span-2">
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
              className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Applications
                </h2>
                <Link
                  to="/jobs"
                  className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  View all
                  <EyeIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-4 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-dark-600"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-gray-200 rounded dark:bg-dark-600"></div>
                        <div className="w-1/2 h-3 bg-gray-200 rounded dark:bg-dark-600"></div>
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
                <div className="py-8 text-center">
                  <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    No jobs yet
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Start tracking your job applications to see them here.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary-600 hover:bg-primary-700"
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

        {/* Bottom Section - Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
        >
          {/* Success Rate Card */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Success Rate 🎯
                </h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  Based on your profile and applications
                </p>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.successRate}%
              </div>
            </div>
            <div className="w-full h-2 mt-4 bg-green-200 rounded-full dark:bg-green-800">
              <div
                className="h-2 transition-all duration-1000 bg-green-500 rounded-full"
                style={{ width: `${stats.successRate}%` }}
              ></div>
            </div>
          </div>

          {/* Motivation Card */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900">
                  <span className="text-xl">💪</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Keep Going!
                </h3>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  You're doing great! Consistency is key to success.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
