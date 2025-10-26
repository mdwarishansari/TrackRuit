import Job from "../models/Job.js";
import { mlService } from "../services/mlService.js";
import { logger } from "../utils/logger.js";

// @desc    Verify extension authentication
// @route   GET /api/extension/verify
// @access  Private (Extension)
export const verifyExtension = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Extension authenticated successfully",
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
        config: {
          supportedPlatforms: ["linkedin", "internshala", "unstop", "indeed"],
          autoSync: true,
          version: "1.0.0",
        },
      },
    });
  } catch (error) {
    logger.error("Extension verification error:", error);
    res.status(500).json({
      success: false,
      message: "Extension verification failed",
    });
  }
};

// @desc    Add job from extension
// @route   POST /api/extension/jobs/add
// @access  Private (Extension)
export const addJobFromExtension = async (req, res) => {
  try {
    const {
      title,
      company,
      platform,
      url,
      appliedAt,
      status = "applied",
      location,
      description,
      salary,
    } = req.body;

    // Create job
    const job = await Job.create({
      user: req.user.id,
      title,
      company,
      platform,
      url,
      appliedAt: appliedAt || new Date(),
      status,
      source: "auto_detect",
      location,
      description,
      salary,
    });

    // Get ML analysis if active resume exists
    try {
      const activeResume = await Resume.findOne({
        user: req.user.id,
        isActive: true,
      });

      if (activeResume) {
        const analysis = await mlService.analyzeJobMatch(activeResume._id, {
          title,
          company,
          description,
        });
        job.mlAnalysis = analysis;
        await job.save();
      }
    } catch (mlError) {
      logger.error("ML analysis failed for extension job:", mlError);
      // Continue without ML analysis
    }

    res.status(201).json({
      success: true,
      message: "Job added successfully from extension",
      data: { job },
    });
  } catch (error) {
    logger.error("Add job from extension error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add job from extension",
    });
  }
};

// @desc    Sync multiple jobs from extension
// @route   POST /api/extension/jobs/sync
// @access  Private (Extension)
export const syncJobsFromExtension = async (req, res) => {
  try {
    const { pendingJobs = [] } = req.body;

    const createdJobs = await Promise.all(
      pendingJobs.map((jobData) =>
        Job.create({
          ...jobData,
          user: req.user.id,
          source: "auto_detect",
          appliedAt: jobData.appliedAt || new Date(),
        })
      )
    );

    res.json({
      success: true,
      message: `${createdJobs.length} jobs synced successfully from extension`,
      data: {
        synced: createdJobs.length,
        jobs: createdJobs,
      },
    });
  } catch (error) {
    logger.error("Sync jobs from extension error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync jobs from extension",
    });
  }
};

// @desc    Get extension configuration
// @route   GET /api/extension/config
// @access  Private (Extension)
export const getExtensionConfig = async (req, res) => {
  try {
    const config = {
      version: "1.0.0",
      supportedPlatforms: [
        {
          name: "LinkedIn",
          domain: "linkedin.com",
          selectors: {
            jobTitle: ".job-details-jobs-unified-top-card__job-title",
            company: ".job-details-jobs-unified-top-card__company-name",
            location: ".job-details-jobs-unified-top-card__bullet",
            description: ".jobs-description__content",
          },
        },
        {
          name: "Internshala",
          domain: "internshala.com",
          selectors: {
            jobTitle: ".profile_on_detail_page .profile_name",
            company: ".profile_on_detail_page .company_name",
            location: ".profile_on_detail_page .location_link",
            description: "#internship_details_container",
          },
        },
        {
          name: "Unstop",
          domain: "unstop.com",
          selectors: {
            jobTitle: ".opportunity-header__title",
            company: ".opportunity-header__organization",
            location: ".opportunity-header__location",
            description: ".opportunity-body",
          },
        },
      ],
      features: {
        autoCapture: true,
        manualCapture: true,
        offlineSupport: true,
        realTimeSync: true,
      },
      limits: {
        maxPendingJobs: 50,
        syncInterval: 30000, // 30 seconds
        maxRetries: 3,
      },
    };

    res.json({
      success: true,
      data: { config },
    });
  } catch (error) {
    logger.error("Get extension config error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get extension configuration",
    });
  }
};
