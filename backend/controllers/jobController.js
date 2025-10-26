import Job from "../models/Job.js";
import { logger } from "../utils/logger.js";

// @desc    Get all jobs for user
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      platform,
      company,
      sortBy = "appliedAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { user: req.user.id, isActive: true };
    if (status) filter.status = status;
    if (platform) filter.platform = platform;
    if (company) filter.company = { $regex: company, $options: "i" };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const jobs = await Job.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    logger.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: { job },
    });
  } catch (error) {
    logger.error("Get job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      user: req.user.id,
      source: "manual",
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: { job },
    });
  } catch (error) {
    logger.error("Create job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Job updated successfully",
      data: { job },
    });
  } catch (error) {
    logger.error("Update job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Soft delete
    job.isActive = false;
    await job.save();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    logger.error("Delete job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private
export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $match: {
          user: req.user._id,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          applied: {
            $sum: { $cond: [{ $eq: ["$status", "applied"] }, 1, 0] },
          },
          interview: {
            $sum: { $cond: [{ $eq: ["$status", "interview"] }, 1, 0] },
          },
          offered: {
            $sum: { $cond: [{ $eq: ["$status", "offered"] }, 1, 0] },
          },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
    ]);

    const platformStats = await Job.aggregate([
      {
        $match: {
          user: req.user._id,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: stats[0]?.total || 0,
      byStatus: {
        applied: stats[0]?.applied || 0,
        interview: stats[0]?.interview || 0,
        offered: stats[0]?.offered || 0,
        accepted: stats[0]?.accepted || 0,
        rejected: stats[0]?.rejected || 0,
      },
      byPlatform: platformStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Get job stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job statistics",
    });
  }
};

// @desc    Get job analytics
// @route   GET /api/jobs/analytics
// @access  Private
export const getJobAnalytics = async (req, res) => {
  try {
    const { period = "30d" } = req.query;
    let days;

    switch (period) {
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      default:
        days = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const timelineData = await Job.aggregate([
      {
        $match: {
          user: req.user._id,
          isActive: true,
          appliedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const successRate = await calculateSuccessRate(req.user._id);

    res.json({
      success: true,
      data: {
        timeline: timelineData,
        successRate,
        period: days,
      },
    });
  } catch (error) {
    logger.error("Get job analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job analytics",
    });
  }
};

// @desc    Sync jobs from extension
// @route   POST /api/jobs/sync
// @access  Private
export const syncJobs = async (req, res) => {
  try {
    const { jobs } = req.body;

    const createdJobs = await Promise.all(
      jobs.map((jobData) =>
        Job.create({
          ...jobData,
          user: req.user.id,
          source: "auto_detect",
        })
      )
    );

    res.json({
      success: true,
      message: `${createdJobs.length} jobs synced successfully`,
      data: { jobs: createdJobs },
    });
  } catch (error) {
    logger.error("Sync jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync jobs",
    });
  }
};

// @desc    Bulk update jobs
// @route   PUT /api/jobs/bulk-update
// @access  Private
export const bulkUpdateJobs = async (req, res) => {
  try {
    const { jobIds, updates } = req.body;

    const result = await Job.updateMany(
      {
        _id: { $in: jobIds },
        user: req.user.id,
      },
      updates
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} jobs updated successfully`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    logger.error("Bulk update jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update jobs",
    });
  }
};

// Helper function to calculate success rate
const calculateSuccessRate = async (userId) => {
  const stats = await Job.aggregate([
    {
      $match: {
        user: userId,
        isActive: true,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        interviews: {
          $sum: {
            $cond: [
              { $in: ["$status", ["interview", "offered", "accepted"]] },
              1,
              0,
            ],
          },
        },
        offers: {
          $sum: {
            $cond: [{ $in: ["$status", ["offered", "accepted"]] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (!stats[0])
    return { applicationToInterview: 0, interviewToOffer: 0, overall: 0 };

  const total = stats[0].total;
  const interviews = stats[0].interviews;
  const offers = stats[0].offers;

  return {
    applicationToInterview: total > 0 ? (interviews / total) * 100 : 0,
    interviewToOffer: interviews > 0 ? (offers / interviews) * 100 : 0,
    overall: total > 0 ? (offers / total) * 100 : 0,
  };
};
