import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected", "waiting"],
      default: "applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: [
        "linkedin",
        "internshala",
        "unstop",
        "manual",
        "extension",
        "other",
      ],
      default: "manual",
    },
    notes: {
      type: String,
    },
    salary: {
      type: String,
    },
    contact: {
      type: String,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "freelance"],
      default: "full-time",
    },
    platformData: {
      type: mongoose.Schema.Types.Mixed, // Store platform-specific data
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
jobSchema.index({ user: 1, appliedDate: -1 });
jobSchema.index({ user: 1, status: 1 });

export default mongoose.model("Job", jobSchema);
