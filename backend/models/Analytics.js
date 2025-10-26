import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
    applicationsThisMonth: {
      type: Number,
      default: 0,
    },
    interviewRate: {
      type: Number,
      default: 0,
    },
    offerRate: {
      type: Number,
      default: 0,
    },
    averageSalary: {
      type: Number,
      default: 0,
    },
    topSkills: [
      {
        type: String,
      },
    ],
    jobSources: {
      linkedin: { type: Number, default: 0 },
      internshala: { type: Number, default: 0 },
      unstop: { type: Number, default: 0 },
      manual: { type: Number, default: 0 },
      extension: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    statusDistribution: {
      applied: { type: Number, default: 0 },
      interview: { type: Number, default: 0 },
      offer: { type: Number, default: 0 },
      rejected: { type: Number, default: 0 },
      waiting: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analytics", analyticsSchema);
