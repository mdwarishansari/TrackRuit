import { secureAPI } from "./api.js";

export class SecureStorage {
  constructor() {
    this.storage = chrome.storage.local;
  }

  async get(key) {
    try {
      const result = await this.storage.get(key);
      return result[key];
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }

  async set(key, value) {
    try {
      await this.storage.set({ [key]: value });
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  }

  async saveJobLocally(jobData) {
    try {
      const pendingJobs = (await this.get("pendingJobs")) || [];
      const jobWithMetadata = {
        ...jobData,
        id: this.generateJobId(),
        localSaveTime: new Date().toISOString(),
        attempts: 0,
      };

      pendingJobs.push(jobWithMetadata);
      await this.set("pendingJobs", pendingJobs);

      // Update stats
      await this.updateStats();

      return jobWithMetadata.id;
    } catch (error) {
      console.error("Error saving job locally:", error);
      throw error;
    }
  }

  async syncPendingJobs(userToken) {
    try {
      const pendingJobs = (await this.get("pendingJobs")) || [];
      const syncedJobs = (await this.get("trackedJobs")) || [];

      if (pendingJobs.length === 0) {
        return { success: true, synced: 0 };
      }

      let successCount = 0;
      const failedJobs = [];

      for (const job of pendingJobs) {
        try {
          // Don't retry too many times
          if (job.attempts >= 3) {
            failedJobs.push(job);
            continue;
          }

          await secureAPI.addJob(job, userToken);

          // Mark as synced
          syncedJobs.push({
            ...job,
            syncedAt: new Date().toISOString(),
          });

          successCount++;

          // Update job attempts
          job.attempts = (job.attempts || 0) + 1;
        } catch (error) {
          console.error(`Failed to sync job ${job.id}:`, error);
          failedJobs.push({
            ...job,
            attempts: (job.attempts || 0) + 1,
            lastError: error.message,
          });
        }
      }

      // Update storage
      await this.set("pendingJobs", failedJobs);
      await this.set("trackedJobs", syncedJobs);
      await this.set("lastSync", new Date().toISOString());
      await this.updateStats();

      return {
        success: true,
        synced: successCount,
        failed: failedJobs.length,
        total: pendingJobs.length,
      };
    } catch (error) {
      console.error("Error syncing pending jobs:", error);
      return {
        success: false,
        error: error.message,
        synced: 0,
        failed: pendingJobs.length,
      };
    }
  }

  async updateStats() {
    try {
      const pendingJobs = (await this.get("pendingJobs")) || [];
      const trackedJobs = (await this.get("trackedJobs")) || [];

      const stats = {
        totalTracked: trackedJobs.length,
        pendingSync: pendingJobs.length,
        lastUpdated: new Date().toISOString(),
      };

      await this.set("stats", stats);
      return stats;
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  }

  async getStats() {
    const stats = (await this.get("stats")) || {
      totalTracked: 0,
      pendingSync: 0,
      lastUpdated: null,
    };

    // Ensure stats are up to date
    const pendingJobs = (await this.get("pendingJobs")) || [];
    const trackedJobs = (await this.get("trackedJobs")) || [];

    if (
      stats.pendingSync !== pendingJobs.length ||
      stats.totalTracked !== trackedJobs.length
    ) {
      return await this.updateStats();
    }

    return stats;
  }

  generateJobId() {
    return "job_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  async clearAllData() {
    try {
      await this.storage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  }

  async exportData() {
    try {
      const allData = await this.storage.get(null);
      return {
        ...allData,
        exportTime: new Date().toISOString(),
        version: "1.0",
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      return null;
    }
  }

  async importData(data) {
    try {
      // Validate imported data structure
      if (!this.validateImportedData(data)) {
        throw new Error("Invalid data format");
      }

      await this.storage.set(data);
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  validateImportedData(data) {
    // Basic validation - expand based on your needs
    return data && typeof data === "object" && data.version === "1.0";
  }
}

// Create singleton instance
export const secureStorage = new SecureStorage();
