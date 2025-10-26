import React from "react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const ResumeAnalysis = ({ resume }) => {
  const { mlAnalysis } = resume;

  if (!mlAnalysis) {
    return (
      <div className="p-8 bg-white shadow-lg dark:bg-dark-700 rounded-2xl">
        <div className="text-center">
          <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No Analysis Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This resume hasn't been analyzed yet. Run AI analysis to get
            insights.
          </p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  const sections = [
    {
      title: "Structure & Formatting",
      score: mlAnalysis.structureScore || 0,
      feedback: mlAnalysis.structureFeedback || [],
      icon: "📋",
    },
    {
      title: "Skills & Keywords",
      score: mlAnalysis.skillsScore || 0,
      feedback: mlAnalysis.skillsFeedback || [],
      icon: "🔧",
    },
    {
      title: "Experience & Achievements",
      score: mlAnalysis.experienceScore || 0,
      feedback: mlAnalysis.experienceFeedback || [],
      icon: "💼",
    },
    {
      title: "ATS Compatibility",
      score: mlAnalysis.atsScore || 0,
      feedback: mlAnalysis.atsFeedback || [],
      icon: "🤖",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white shadow-lg dark:bg-dark-700 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Resume Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by machine learning insights
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full ${getScoreBgColor(
            mlAnalysis.overallScore
          )}`}
        >
          <span
            className={`text-lg font-bold ${getScoreColor(
              mlAnalysis.overallScore
            )}`}
          >
            {mlAnalysis.overallScore}/100
          </span>
        </div>
      </div>

      {/* Overall Feedback */}
      {mlAnalysis.overallFeedback && (
        <div className="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-start space-x-3">
            <LightBulbIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                AI Summary
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {mlAnalysis.overallFeedback}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Scores */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-50 dark:bg-dark-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{section.icon}</span>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              <span
                className={`text-sm font-bold ${getScoreColor(section.score)}`}
              >
                {section.score}/100
              </span>
            </div>

            <div className="w-full h-2 mb-3 bg-gray-200 rounded-full dark:bg-dark-500">
              <div
                className="h-2 transition-all duration-500 rounded-full"
                style={{
                  width: `${section.score}%`,
                  backgroundColor:
                    section.score >= 80
                      ? "#10b981"
                      : section.score >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Feedback */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Improvement Suggestions
        </h3>

        {sections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="p-4 border border-gray-200 rounded-lg dark:border-dark-600"
          >
            <h4 className="flex items-center mb-3 font-medium text-gray-900 dark:text-white">
              <span className="mr-2 text-lg">{section.icon}</span>
              {section.title}
            </h4>

            <div className="space-y-2">
              {section.feedback.length > 0 ? (
                section.feedback.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    {item.type === "positive" ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500 mt-0.5" />
                    )}
                    <p
                      className={`text-sm ${
                        item.type === "positive"
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {item.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm italic text-gray-500 dark:text-gray-400">
                  No specific feedback available for this section.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Match */}
      {mlAnalysis.skillMatches && mlAnalysis.skillMatches.length > 0 && (
        <div className="p-4 mt-6 rounded-lg bg-green-50 dark:bg-green-900/20">
          <h4 className="mb-2 font-medium text-green-900 dark:text-green-100">
            🎯 Strong Skill Matches
          </h4>
          <div className="flex flex-wrap gap-2">
            {mlAnalysis.skillMatches.slice(0, 10).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-800 dark:text-green-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {mlAnalysis.missingSkills && mlAnalysis.missingSkills.length > 0 && (
        <div className="p-4 mt-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <h4 className="mb-2 font-medium text-yellow-900 dark:text-yellow-100">
            📚 Recommended Skills to Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {mlAnalysis.missingSkills.slice(0, 8).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-800 dark:text-yellow-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeAnalysis;
