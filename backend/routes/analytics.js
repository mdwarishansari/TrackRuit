import express from 'express';
import {
  getUserAnalytics,
  getPlatformAnalytics,
  getStatusAnalytics,
  getSkillGaps,
  getSuccessRates,
  getEngagementMetrics,
  exportAnalytics
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/user', getUserAnalytics);
router.get('/platform', getPlatformAnalytics);
router.get('/status', getStatusAnalytics);
router.get('/skill-gaps', getSkillGaps);
router.get('/success-rates', getSuccessRates);
router.get('/engagement', getEngagementMetrics);
router.get('/export', exportAnalytics);

export default router;