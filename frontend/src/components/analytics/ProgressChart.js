import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ data }) => {
  // Mock data - replace with actual data from props
  const chartData = [
    { date: 'Jan 1', applications: 2, interviews: 0 },
    { date: 'Jan 2', applications: 1, interviews: 1 },
    { date: 'Jan 3', applications: 3, interviews: 0 },
    { date: 'Jan 4', applications: 2, interviews: 1 },
    { date: 'Jan 5', applications: 4, interviews: 2 },
    { date: 'Jan 6', applications: 1, interviews: 0 },
    { date: 'Jan 7', applications: 3, interviews: 1 },
  ];

  return (
    <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Application Progress
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-sm"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className="text-sm" tick={{ fill: 'currentColor' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(255, 255, 255)',
                borderColor: 'rgb(229, 231, 235)',
                borderRadius: '0.5rem',
                color: 'rgb(17, 24, 39)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="interviews" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;