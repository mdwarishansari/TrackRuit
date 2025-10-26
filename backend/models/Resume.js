import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    originalName: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    parsedData: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: Number,
        },
      ],
      parsedAt: Date,
    },
    mlAnalysis: {
      atsScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      suggestions: [String],
      strengths: [String],
      weaknesses: [String],
      analyzedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ user: 1, isActive: 1 });
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ "parsedData.skills": 1 });

// Instance method to set as active
resumeSchema.methods.setAsActive = async function () {
  // Deactivate all other resumes for this user
  await this.constructor.updateMany(
    { user: this.user, _id: { $ne: this._id } },
    { isActive: false }
  );

  this.isActive = true;
  return this.save();
};

// Static method to get active resume
resumeSchema.statics.getActiveResume = async function (userId) {
  return this.findOne({ user: userId, isActive: true });
};

export default mongoose.model("Resume", resumeSchema);
