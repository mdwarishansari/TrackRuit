import { api } from './api';

export const resumesAPI = {
  getAll: () => api.get('/api/resumes'),
  getById: (id) => api.get(`/api/resumes/${id}`),
  upload: (formData) => api.post('/api/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, resumeData) => api.put(`/api/resumes/${id}`, resumeData),
  delete: (id) => api.delete(`/api/resumes/${id}`),
  analyze: (id) => api.post(`/api/resumes/${id}/analyze`),
  getAnalysis: (id) => api.get(`/api/resumes/${id}/analysis`),
  setActive: (id) => api.put(`/api/resumes/${id}/set-active`),
};