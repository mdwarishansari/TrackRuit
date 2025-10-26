import Resume from "../models/Resume.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import { mlService } from "../services/mlService.js";
import { logger } from "../utils/logger.js";

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { resumes },
    });
  } catch (error) {
    logger.error("Get resumes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      data: { resume },
    });
  } catch (error) {
    logger.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

// @desc    Upload resume
// @route   POST /api/resumes
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }

    const { title = "My Resume" } = req.body;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path, "resumes");

    // Create resume record
    const resume = await Resume.create({
      user: req.user.id,
      title,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });

    // Get ML analysis
    try {
      const analysis = await mlService.analyzeResume(resume.fileUrl);
      resume.mlAnalysis = analysis;
      await resume.save();
    } catch (mlError) {
      logger.error("ML analysis failed:", mlError);
      // Continue without ML analysis
    }

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: { resume },
    });
  } catch (error) {
    logger.error("Upload resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const { title, isPublic } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      { title, isPublic },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Resume updated successfully",
      data: { resume: updatedResume },
    });
  } catch (error) {
    logger.error("Update resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(resume.publicId);

    // Soft delete from database
    resume.isActive = false;
    await resume.save();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    logger.error("Delete resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

// @desc    Analyze resume with ML
// @route   POST /api/resumes/:id/analyze
// @access  Private
export const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Get ML analysis
    const analysis = await mlService.analyzeResume(resume.fileUrl);

    // Update resume with analysis
    resume.mlAnalysis = analysis;
    await resume.save();

    res.json({
      success: true,
      message: "Resume analysis completed",
      data: { analysis },
    });
  } catch (error) {
    logger.error("Analyze resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
    });
  }
};

// @desc    Get resume analysis
// @route   GET /api/resumes/:id/analysis
// @access  Private
export const getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (!resume.mlAnalysis) {
      return res.status(404).json({
        success: false,
        message: "No analysis available for this resume",
      });
    }

    res.json({
      success: true,
      data: { analysis: resume.mlAnalysis },
    });
  } catch (error) {
    logger.error("Get resume analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume analysis",
    });
  }
};

// @desc    Set active resume
// @route   PUT /api/resumes/:id/set-active
// @access  Private
export const setActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Set all resumes to inactive
    await Resume.updateMany({ user: req.user.id }, { isActive: false });

    // Set this resume as active
    resume.isActive = true;
    await resume.save();

    res.json({
      success: true,
      message: "Resume set as active",
      data: { resume },
    });
  } catch (error) {
    logger.error("Set active resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set active resume",
    });
  }
};
