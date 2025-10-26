import { api } from "./api";

export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  verifyToken: (token) => api.get("/api/auth/me"),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/api/auth/reset-password", { token, newPassword }),
  updateProfile: (userData) => api.put("/api/auth/profile", userData),
  changePassword: (passwordData) =>
    api.put("/api/auth/change-password", passwordData),
};
