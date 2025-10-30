import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsDashboard = ({ data }) => {
  // Mock data - replace with actual data from props
  const statusData = [
    { name: "Applied", value: 45, color: "#3b82f6" },
    { name: "Interview", value: 15, color: "#8b5cf6" },
    { name: "Offer", value: 5, color: "#10b981" },
    { name: "Rejected", value: 20, color: "#ef4444" },
    { name: "No Response", value: 15, color: "#6b7280" },
  ];

  const platformData = [
    { name: "LinkedIn", applications: 25, interviews: 8 },
    { name: "Internshala", applications: 15, interviews: 4 },
    { name: "Indeed", applications: 12, interviews: 3 },
    { name: "Company Site", applications: 8, interviews: 2 },
    { name: "Other", applications: 5, interviews: 1 },
  ];

  const weeklyProgress = [
    { week: "Week 1", applications: 8, interviews: 2 },
    { week: "Week 2", applications: 12, interviews: 4 },
    { week: "Week 3", applications: 15, interviews: 6 },
    { week: "Week 4", applications: 10, interviews: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Application Status Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl"
      >
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Application Status Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} applications`, "Count"]}
                contentStyle={{
                  backgroundColor: "rgb(255, 255, 255)",
                  borderColor: "rgb(229, 231, 235)",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Platform Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl"
      >
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Platform Performance
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                className="text-sm"
                tick={{ fill: "currentColor" }}
              />
              <YAxis className="text-sm" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(255, 255, 255)",
                  borderColor: "rgb(229, 231, 235)",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar
                dataKey="applications"
                fill="#3b82f6"
                name="Applications"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="interviews"
                fill="#8b5cf6"
                name="Interviews"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl"
      >
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Progress Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="week"
                className="text-sm"
                tick={{ fill: "currentColor" }}
              />
              <YAxis className="text-sm" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(255, 255, 255)",
                  borderColor: "rgb(229, 231, 235)",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar
                dataKey="applications"
                fill="#10b981"
                name="Applications"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="interviews"
                fill="#f59e0b"
                name="Interviews"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
