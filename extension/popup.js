// Popup script - handles UI interactions
document.addEventListener("DOMContentLoaded", async function () {
  await loadSettings();
  await loadStats();
  setupEventListeners();
});

async function loadSettings() {
  try {
    const { isEnabled, autoTrack, userToken } = await chrome.storage.local.get([
      "isEnabled",
      "autoTrack",
      "userToken",
    ]);

    document.getElementById("toggleEnabled").checked = isEnabled !== false;
    document.getElementById("toggleAutoTrack").checked = autoTrack !== false;

    // Update status indicator
    const statusIndicator = document.getElementById("statusIndicator");
    if (isEnabled !== false) {
      statusIndicator.classList.add("active");
    }

    // Show/hide auth section
    const authSection = document.getElementById("authSection");
    if (!userToken) {
      authSection.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
}

async function loadStats() {
  try {
    const { trackedJobs = [], lastSync } = await chrome.storage.local.get([
      "trackedJobs",
      "lastSync",
    ]);

    const syncedJobs = trackedJobs.filter((job) => job.syncedAt).length;

    document.getElementById("trackedCount").textContent = trackedJobs.length;
    document.getElementById("syncedCount").textContent = syncedJobs;

    if (lastSync) {
      const lastSyncDate = new Date(lastSync);
      document.getElementById(
        "lastSync"
      ).textContent = `Last sync: ${lastSyncDate.toLocaleTimeString()}`;
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

function setupEventListeners() {
  // Toggle handlers
  document
    .getElementById("toggleEnabled")
    .addEventListener("change", async (e) => {
      await chrome.storage.local.set({ isEnabled: e.target.checked });

      const statusIndicator = document.getElementById("statusIndicator");
      if (e.target.checked) {
        statusIndicator.classList.add("active");
      } else {
        statusIndicator.classList.remove("active");
      }
    });

  document
    .getElementById("toggleAutoTrack")
    .addEventListener("change", async (e) => {
      await chrome.storage.local.set({ autoTrack: e.target.checked });
    });

  // Sync button
  document.getElementById("syncNow").addEventListener("click", async () => {
    await syncPendingJobs();
  });

  // Options link
  document.getElementById("optionsLink").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

async function syncPendingJobs() {
  const syncButton = document.getElementById("syncNow");
  const lastSyncElement = document.getElementById("lastSync");

  syncButton.disabled = true;
  syncButton.textContent = "Syncing...";

  try {
    const { pendingJobs = [], userToken } = await chrome.storage.local.get([
      "pendingJobs",
      "userToken",
    ]);

    if (!userToken) {
      alert("Please login to TrackRuit web app first");
      return;
    }

    if (pendingJobs.length === 0) {
      lastSyncElement.textContent = "No pending jobs to sync";
      return;
    }

    // Sync each pending job
    let successCount = 0;
    for (const job of pendingJobs) {
      try {
        const response = await fetch("http://localhost:3000/api/jobs/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(job),
        });

        if (response.ok) {
          successCount++;
        }
      } catch (error) {
        console.error("Error syncing job:", error);
      }
    }

    // Update storage
    if (successCount > 0) {
      const { trackedJobs = [] } = await chrome.storage.local.get(
        "trackedJobs"
      );
      const updatedTrackedJobs = [
        ...trackedJobs,
        ...pendingJobs.slice(0, successCount),
      ];
      const remainingPendingJobs = pendingJobs.slice(successCount);

      await chrome.storage.local.set({
        trackedJobs: updatedTrackedJobs,
        pendingJobs: remainingPendingJobs,
        lastSync: new Date().toISOString(),
      });

      lastSyncElement.textContent = `Synced ${successCount} jobs`;
      await loadStats(); // Refresh stats
    }
  } catch (error) {
    console.error("Sync failed:", error);
    lastSyncElement.textContent = "Sync failed";
  } finally {
    syncButton.disabled = false;
    syncButton.textContent = "Sync Now";
  }
}
