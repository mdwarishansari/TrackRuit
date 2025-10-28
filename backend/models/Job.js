import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  platform: {
    type: String,
    required: [true, 'Please provide the job platform'],
    enum: ['linkedin', 'internshala', 'unstop', 'indeed', 'other', 'manual'],
    default: 'manual'
  },
  url: {
    type: String,
    trim: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [
      'applied',
      'under_review', 
      'interview',
      'rejected',
      'accepted',
      'offered',
      'withdrawn'
    ],
    default: 'applied'
  },
  source: {
    type: String,
    enum: ['auto_detect', 'manual'],
    default: 'manual'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  salary: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  deadline: {
    type: Date
  },
  contact: {
    name: String,
    email: String,
    phone: String
  },
  // ML Analysis Fields
  mlAnalysis: {
    matchScore: {
      type: Number,
      min: 0,
      max: 1
    },
    skillsMatch: [String],
    missingSkills: [String],
    predictedSuccess: {
      type: Number,
      min: 0,
      max: 1
    },
    analysisDate: Date,
    feedback: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ user: 1, appliedAt: -1 });
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ platform: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ appliedAt: -1 });

// Virtual for application age
jobSchema.virtual('daysSinceApplied').get(function() {
  return Math.floor((Date.now() - this.appliedAt) / (1000 * 60 * 60 * 24));
});

export default mongoose.model('Job', jobSchema);