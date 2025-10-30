import { api } from "./api";

export const analyticsAPI = {
  getUserAnalytics: (params) => api.get("/api/analytics/user", { params }),
  getPlatformAnalytics: () => api.get("/api/analytics/platform"),
  getStatusAnalytics: () => api.get("/api/analytics/status"),
  getSkillGaps: () => api.get("/api/analytics/skill-gaps"),
  getSuccessRates: () => api.get("/api/analytics/success-rates"),
  getEngagement: () => api.get("/api/analytics/engagement"),
  exportData: () => api.get("/api/analytics/export"),
};
