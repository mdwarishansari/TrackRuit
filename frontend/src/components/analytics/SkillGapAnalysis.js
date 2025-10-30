import React from "react";
import { motion } from "framer-motion";

const SkillGapAnalysis = ({ data }) => {
  // Mock data - replace with actual data from props
  const skillData = [
    { skill: "React", demand: 85, proficiency: 70, gap: 15 },
    { skill: "Node.js", demand: 78, proficiency: 60, gap: 18 },
    { skill: "Python", demand: 82, proficiency: 55, gap: 27 },
    { skill: "AWS", demand: 75, proficiency: 40, gap: 35 },
    { skill: "Docker", demand: 70, proficiency: 35, gap: 35 },
    { skill: "TypeScript", demand: 80, proficiency: 65, gap: 15 },
    { skill: "GraphQL", demand: 65, proficiency: 30, gap: 35 },
    { skill: "Kubernetes", demand: 60, proficiency: 25, gap: 35 },
  ];

  const getGapColor = (gap) => {
    if (gap <= 15) return "text-green-600 dark:text-green-400";
    if (gap <= 25) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGapBgColor = (gap) => {
    if (gap <= 15) return "bg-green-100 dark:bg-green-900";
    if (gap <= 25) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  const prioritySkills = skillData
    .filter((skill) => skill.gap > 20)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Skill Gap Analysis 🎯
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Identify skills to improve based on job market demand
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {skillData.length} skills analyzed
        </div>
      </div>

      {/* Priority Skills */}
      {prioritySkills.length > 0 && (
        <div className="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <h4 className="flex items-center mb-3 font-medium text-blue-900 dark:text-blue-100">
            <span className="mr-2 text-lg">🚨</span>
            High Priority Skills to Learn
          </h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {prioritySkills.map((skill, index) => (
              <div
                key={skill.skill}
                className="p-3 bg-white border border-blue-200 rounded-lg dark:bg-dark-600 dark:border-blue-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {skill.skill}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${getGapBgColor(
                      skill.gap
                    )} ${getGapColor(skill.gap)}`}
                  >
                    {skill.gap}% gap
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Market Demand</span>
                    <span className="text-green-600 dark:text-green-400">
                      {skill.demand}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Your Proficiency</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {skill.proficiency}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Skill Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
          <thead>
            <tr>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Skill
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Market Demand
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Your Level
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Gap
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Priority
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
            {skillData.map((skill, index) => (
              <motion.tr
                key={skill.skill}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-dark-600"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">💻</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {skill.skill}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 h-2 mr-2 bg-gray-200 rounded-full dark:bg-dark-500">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${skill.demand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {skill.demand}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 h-2 mr-2 bg-gray-200 rounded-full dark:bg-dark-500">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {skill.proficiency}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${getGapColor(skill.gap)}`}
                  >
                    {skill.gap}%
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      skill.gap <= 15
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : skill.gap <= 25
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {skill.gap <= 15
                      ? "Low"
                      : skill.gap <= 25
                      ? "Medium"
                      : "High"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="p-4 mt-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <h4 className="flex items-center mb-3 font-medium text-purple-900 dark:text-purple-100">
          <span className="mr-2 text-lg">💡</span>
          Learning Recommendations
        </h4>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <h5 className="mb-2 font-medium text-gray-900 dark:text-white">
              Immediate Focus
            </h5>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Complete AWS Certified Cloud Practitioner</li>
              <li>• Build a project with Docker and Kubernetes</li>
              <li>• Practice GraphQL with React applications</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-2 font-medium text-gray-900 dark:text-white">
              Long-term Growth
            </h5>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Advanced Python for data science</li>
              <li>• Microservices architecture patterns</li>
              <li>• System design and scalability</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillGapAnalysis;
