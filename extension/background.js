// Background service worker - handles extension lifecycle
console.log("TrackRuit Extension background service worker started");

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("TrackRuit Extension installed");
  initializeStorage();
});

// Initialize storage with default values
async function initializeStorage() {
  const defaultSettings = {
    isEnabled: true,
    autoTrack: true,
    userToken: null,
    trackedJobs: [],
    lastSync: null,
  };

  await chrome.storage.local.set(defaultSettings);
  console.log("Storage initialized with default settings");
}

// Listen for tab updates to inject content scripts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const supportedSites = ["linkedin.com", "internshala.com", "unstop.com"];

    const isSupportedSite = supportedSites.some((site) =>
      tab.url.includes(site)
    );

    if (isSupportedSite) {
      console.log("Supported job site detected:", tab.url);
      // Content script will be automatically injected via manifest
    }
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);

  switch (request.action) {
    case "saveJob":
      handleSaveJob(request.data);
      break;

    case "getSettings":
      chrome.storage.local.get(["isEnabled", "autoTrack"]).then(sendResponse);
      return true; // Will respond asynchronously

    case "updateSettings":
      chrome.storage.local.set(request.settings).then(() => {
        sendResponse({ success: true });
      });
      return true;
  }
});

async function handleSaveJob(jobData) {
  try {
    // Get user token from storage
    const { userToken } = await chrome.storage.local.get("userToken");

    if (!userToken) {
      console.warn("No user token found. Please login to TrackRuit.");
      return;
    }

    // Send job data to backend
    const response = await fetch("http://localhost:3000/api/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(jobData),
    });

    if (response.ok) {
      console.log("Job successfully saved to TrackRuit");

      // Update local storage
      const { trackedJobs = [] } = await chrome.storage.local.get(
        "trackedJobs"
      );
      trackedJobs.push({
        ...jobData,
        syncedAt: new Date().toISOString(),
      });

      await chrome.storage.local.set({
        trackedJobs,
        lastSync: new Date().toISOString(),
      });
    } else {
      console.error("Failed to save job:", await response.text());
    }
  } catch (error) {
    console.error("Error saving job:", error);

    // Save job locally for later sync
    await saveJobOffline(jobData);
  }
}

async function saveJobOffline(jobData) {
  const { pendingJobs = [] } = await chrome.storage.local.get("pendingJobs");
  pendingJobs.push({
    ...jobData,
    savedAt: new Date().toISOString(),
  });

  await chrome.storage.local.set({ pendingJobs });
  console.log("Job saved offline for later sync");
}
