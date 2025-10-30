import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalyticsChart = ({ type = "line", data, title, height = 300 }) => {
  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={data}>
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
                color: "rgb(17, 24, 39)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={data}>
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
                color: "rgb(17, 24, 39)",
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line":
      default:
        return (
          <LineChart data={data}>
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
                color: "rgb(17, 24, 39)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
    }
  };

  // Default data if none provided
  const chartData = data || [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 900 },
  ];

  return (
    <div className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl">
      {title && (
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {chartData.reduce((sum, item) => sum + (item.value || 0), 0)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.max(...chartData.map((item) => item.value || 0))}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Peak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(
              chartData.reduce((sum, item) => sum + (item.value || 0), 0) /
                chartData.length
            )}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Average
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
