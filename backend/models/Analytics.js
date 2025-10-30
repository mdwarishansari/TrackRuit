import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Application Metrics
  applications: {
    total: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    byStatus: {
      applied: { type: Number, default: 0 },
      under_review: { type: Number, default: 0 },
      interview: { type: Number, default: 0 },
      rejected: { type: Number, default: 0 },
      accepted: { type: Number, default: 0 },
      offered: { type: Number, default: 0 },
      withdrawn: { type: Number, default: 0 }
    },
    byPlatform: {
      linkedin: { type: Number, default: 0 },
      internshala: { type: Number, default: 0 },
      unstop: { type: Number, default: 0 },
      indeed: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
      manual: { type: Number, default: 0 }
    }
  },
  // Success Metrics
  successRate: {
    applicationToInterview: { type: Number, default: 0 },
    interviewToOffer: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  // Response Time Metrics
  responseTimes: {
    averageResponseTime: { type: Number, default: 0 }, // in days
    fastestResponse: { type: Number, default: 0 },
    slowestResponse: { type: Number, default: 0 }
  },
  // ML Insights
  mlInsights: {
    avgMatchScore: { type: Number, default: 0 },
    avgATSScore: { type: Number, default: 0 },
    skillGaps: [String],
    topMatchedSkills: [String],
    improvementAreas: [String]
  },
  // Engagement Metrics
  engagement: {
    logins: { type: Number, default: 0 },
    resumeUpdates: { type: Number, default: 0 },
    jobSearches: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 } // in minutes
  }
}, {
  timestamps: true
});

// Compound index for user and date queries
analyticsSchema.index({ user: 1, date: 1 });
analyticsSchema.index({ date: 1 });

// Static method to get user analytics for a period
analyticsSchema.statics.getUserAnalytics = async function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

export default mongoose.model('Analytics', analyticsSchema);