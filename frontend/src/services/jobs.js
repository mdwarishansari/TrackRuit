import { api } from "./api";

export const jobsAPI = {
  getAll: () => api.get("/api/jobs"),
  getById: (id) => api.get(`/api/jobs/${id}`),
  create: (jobData) => api.post("/api/jobs", jobData),
  update: (id, jobData) => api.put(`/api/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/api/jobs/${id}`),
  getStats: () => api.get("/api/jobs/stats"),
  getAnalytics: () => api.get("/api/jobs/analytics"),
  bulkUpdate: (updates) => api.put("/api/jobs/bulk-update", updates),
};
