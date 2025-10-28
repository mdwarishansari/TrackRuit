import Job from '../models/Job.js';
import { logger } from '../utils/logger.js';

export const verifyExtension = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Extension authenticated successfully',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    logger.error('Extension verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Extension verification failed'
    });
  }
};

export const addJobFromExtension = async (req, res) => {
  try {
    const {
      title,
      company,
      platform,
      url,
      appliedAt,
      status = 'applied',
      location,
      description,
      salary
    } = req.body;

    const job = await Job.create({
      user: req.user.id,
      title,
      company,
      platform,
      url,
      appliedAt: appliedAt || new Date(),
      status,
      source: 'auto_detect',
      location,
      description,
      salary
    });

    res.status(201).json({
      success: true,
      message: 'Job added successfully from extension',
      data: { job }
    });
  } catch (error) {
    logger.error('Add job from extension error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add job from extension'
    });
  }
};

export const syncJobsFromExtension = async (req, res) => {
  try {
    const { pendingJobs = [] } = req.body;

    const createdJobs = await Promise.all(
      pendingJobs.map(jobData =>
        Job.create({
          ...jobData,
          user: req.user.id,
          source: 'auto_detect',
          appliedAt: jobData.appliedAt || new Date()
        })
      )
    );

    res.json({
      success: true,
      message: `${createdJobs.length} jobs synced successfully from extension`,
      data: {
        synced: createdJobs.length,
        jobs: createdJobs
      }
    });
  } catch (error) {
    logger.error('Sync jobs from extension error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync jobs from extension'
    });
  }
};

export const getExtensionConfig = async (req, res) => {
  try {
    const config = {
      version: '1.0.0',
      supportedPlatforms: ['linkedin', 'internshala', 'unstop', 'indeed'],
      autoCapture: true
    };

    res.json({
      success: true,
      data: { config }
    });
  } catch (error) {
    logger.error('Get extension config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get extension configuration'
    });
  }
};