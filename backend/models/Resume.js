import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a resume title'],
    trim: true,
    maxlength: [100, 'Resume title cannot be more than 100 characters']
  },
  fileUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  // Parsed Resume Data
  parsedData: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    education: [{
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
      grade: String
    }],
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
      achievements: [String]
    }],
    skills: [{
      category: String,
      items: [String]
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      startDate: Date,
      endDate: Date,
      current: Boolean,
      url: String,
      highlights: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      url: String,
      credentialId: String
    }],
    languages: [{
      language: String,
      proficiency: String
    }]
  },
  // ML Analysis Results
  mlAnalysis: {
    atsScore: {
      type: Number,
      min: 0,
      max: 1
    },
    feedback: [{
      section: String,
      score: Number,
      comments: [String],
      suggestions: [String]
    }],
    overallScore: Number,
    analysisDate: Date,
    keywords: [String],
    improvementAreas: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes
resumeSchema.index({ user: 1, isActive: 1 });
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ 'parsedData.skills.items': 1 });

export default mongoose.model('Resume', resumeSchema);