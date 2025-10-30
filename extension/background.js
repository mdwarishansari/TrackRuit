// TrackRuit Secure Background Service Worker
console.log("TrackRuit secure background service worker started");

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("TrackRuit Extension installed");
  initializeSecureStorage();
});

// Initialize storage with secure default values
async function initializeSecureStorage() {
  const defaultSettings = {
    isEnabled: true,
    autoTrack: true,
    userToken: null,
    trackedJobs: [],
    pendingJobs: [],
    lastSync: null,
    security: {
      lastVerified: null,
      encryptionEnabled: true,
    },
  };

  await chrome.storage.local.set({ settings: defaultSettings });
  console.log("Secure storage initialized");
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received secure message:", request);

  switch (request.action) {
    case "saveJob":
      handleSecureSaveJob(request.data).then(sendResponse);
      return true;

    case "getSettings":
      chrome.storage.local.get("settings").then((result) => {
        sendResponse(result.settings || {});
      });
      return true;

    case "updateSettings":
      handleUpdateSettings(request.settings).then(sendResponse);
      return true;

    case "syncJobs":
      handleSyncJobs().then(sendResponse);
      return true;

    case "verifyConnection":
      verifyBackendConnection().then(sendResponse);
      return true;
  }
});

async function handleSecureSaveJob(jobData) {
  try {
    const result = await chrome.storage.local.get("settings");
    const settings = result.settings || {};

    if (!settings.isEnabled) {
      return { success: false, error: "Extension is disabled" };
    }

    // Validate we have user token
    if (!settings.userToken) {
      // Save locally for later sync
      const jobId = await saveJobLocally(jobData);
      return {
        success: true,
        savedLocally: true,
        jobId: jobId,
        message: "Job saved locally - will sync when authenticated",
      };
    }

    // Try to send to backend with security headers
    const apiResult = await sendToBackend(
      jobData,
      settings.userToken,
      settings.backendUrl
    );

    if (apiResult.success) {
      // Also save locally for redundancy
      await saveJobLocally({
        ...jobData,
        syncedAt: new Date().toISOString(),
      });

      return apiResult;
    } else {
      // Backend failed, save locally
      const jobId = await saveJobLocally(jobData);
      return {
        success: true,
        savedLocally: true,
        jobId: jobId,
        error: "Backend sync failed, saved locally",
      };
    }
  } catch (error) {
    console.error("Error in secure job save:", error);

    // Final fallback to local storage
    try {
      const jobId = await saveJobLocally(jobData);
      return {
        success: true,
        savedLocally: true,
        jobId: jobId,
        error: "Backend sync failed, saved locally",
      };
    } catch (localError) {
      return {
        success: false,
        error: "Both backend and local save failed: " + error.message,
      };
    }
  }
}

async function sendToBackend(
  jobData,
  userToken,
  backendUrl = "http://localhost:3000"
) {
  try {
    const EXTENSION_SECRET =
      "4ca1c9ea616f61cdc324311fdeb2525c46c530a8155ff3c3893eb3d24fac8633694c3b9a4e00050b6b0b39327702229d1fac8fc92e853b419b5491f59f03ce2e";

    const response = await fetch(`${backendUrl}/api/jobs/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
        "X-Extension-Secret": EXTENSION_SECRET,
        "X-Extension-Version": "1.1.0",
        "X-Request-Timestamp": Date.now().toString(),
      },
      body: JSON.stringify(jobData),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function saveJobLocally(jobData) {
  const result = await chrome.storage.local.get(["pendingJobs", "trackedJobs"]);
  const pendingJobs = result.pendingJobs || [];
  const trackedJobs = result.trackedJobs || [];

  const jobWithMetadata = {
    ...jobData,
    id: "job_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
    localSaveTime: new Date().toISOString(),
    attempts: 0,
  };

  if (jobData.syncedAt) {
    trackedJobs.push(jobWithMetadata);
    await chrome.storage.local.set({ trackedJobs });
  } else {
    pendingJobs.push(jobWithMetadata);
    await chrome.storage.local.set({ pendingJobs });
  }

  // Update stats
  await updateStats();

  return jobWithMetadata.id;
}

async function handleUpdateSettings(newSettings) {
  try {
    const result = await chrome.storage.local.get("settings");
    const currentSettings = result.settings || {};
    const updatedSettings = { ...currentSettings, ...newSettings };

    await chrome.storage.local.set({ settings: updatedSettings });

    // If we just added a token, try to sync pending jobs
    if (newSettings.userToken && !currentSettings.userToken) {
      await handleSyncJobs();
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message };
  }
}

async function handleSyncJobs() {
  try {
    const result = await chrome.storage.local.get([
      "settings",
      "pendingJobs",
      "trackedJobs",
    ]);
    const settings = result.settings || {};
    const pendingJobs = result.pendingJobs || [];
    const trackedJobs = result.trackedJobs || [];

    if (!settings.userToken) {
      return { success: false, error: "No authentication token" };
    }

    if (pendingJobs.length === 0) {
      return { success: true, synced: 0, failed: 0, total: 0 };
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

        const apiResult = await sendToBackend(
          job,
          settings.userToken,
          settings.backendUrl
        );

        if (apiResult.success) {
          // Mark as synced
          trackedJobs.push({
            ...job,
            syncedAt: new Date().toISOString(),
          });
          successCount++;
        } else {
          failedJobs.push({
            ...job,
            attempts: (job.attempts || 0) + 1,
            lastError: apiResult.error,
          });
        }
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
    await chrome.storage.local.set({
      pendingJobs: failedJobs,
      trackedJobs: trackedJobs,
      lastSync: new Date().toISOString(),
    });

    await updateStats();

    return {
      success: true,
      synced: successCount,
      failed: failedJobs.length,
      total: pendingJobs.length,
    };
  } catch (error) {
    console.error("Error syncing pending jobs:", error);
    return { success: false, error: error.message };
  }
}

async function verifyBackendConnection() {
  try {
    const result = await chrome.storage.local.get("settings");
    const settings = result.settings || {};

    if (!settings.userToken) {
      return { success: false, error: "No authentication token" };
    }

    // Simple verification by trying to add a test job (which will be rejected by backend as test)
    const testResult = await sendToBackend(
      {
        title: "Test Connection",
        company: "TrackRuit",
        platform: "test",
        url: "https://trackruit.com",
        status: "test",
      },
      settings.userToken,
      settings.backendUrl
    );

    return {
      success: true,
      verified: !testResult.success, // Backend should reject test jobs
      message: testResult.success
        ? "Connected but test job was accepted (unexpected)"
        : "Connection verified successfully",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updateStats() {
  try {
    const result = await chrome.storage.local.get([
      "pendingJobs",
      "trackedJobs",
    ]);
    const pendingJobs = result.pendingJobs || [];
    const trackedJobs = result.trackedJobs || [];

    const stats = {
      totalTracked: trackedJobs.length,
      pendingSync: pendingJobs.length,
      lastUpdated: new Date().toISOString(),
    };

    await chrome.storage.local.set({ stats: stats });
    return stats;
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}

// Periodic sync every 5 minutes
chrome.alarms.create("periodicSync", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "periodicSync") {
    await handleSyncJobs();
  }
});

// Sync when browser starts
chrome.runtime.onStartup.addListener(async () => {
  await handleSyncJobs();
});
