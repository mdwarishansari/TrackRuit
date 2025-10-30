// Import secure modules
import { secureStorage } from "./utils/storage.js";
import { secureAPI } from "./utils/api.js";

document.addEventListener("DOMContentLoaded", async function () {
  await loadSecureSettings();
  await loadSecureStats();
  setupSecureEventListeners();
});

async function loadSecureSettings() {
  try {
    const settings = (await secureStorage.get("settings")) || {};

    document.getElementById("toggleEnabled").checked =
      settings.isEnabled !== false;
    document.getElementById("toggleAutoTrack").checked =
      settings.autoTrack !== false;

    // Update status indicator
    const statusIndicator = document.getElementById("statusIndicator");
    if (settings.isEnabled !== false) {
      statusIndicator.classList.add("active");
    }

    // Show/hide auth section
    const authSection = document.getElementById("authSection");
    if (!settings.userToken) {
      authSection.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading secure settings:", error);
  }
}

async function loadSecureStats() {
  try {
    const stats = await secureStorage.getStats();

    document.getElementById("trackedCount").textContent = stats.totalTracked;
    document.getElementById("syncedCount").textContent =
      stats.totalTracked - stats.pendingSync;

    const lastSync = await secureStorage.get("lastSync");
    if (lastSync) {
      const lastSyncDate = new Date(lastSync);
      document.getElementById(
        "lastSync"
      ).textContent = `Last sync: ${lastSyncDate.toLocaleTimeString()}`;
    }
  } catch (error) {
    console.error("Error loading secure stats:", error);
  }
}

function setupSecureEventListeners() {
  // Toggle handlers
  document
    .getElementById("toggleEnabled")
    .addEventListener("change", async (e) => {
      const settings = (await secureStorage.get("settings")) || {};
      await secureStorage.set("settings", {
        ...settings,
        isEnabled: e.target.checked,
      });

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
      const settings = (await secureStorage.get("settings")) || {};
      await secureStorage.set("settings", {
        ...settings,
        autoTrack: e.target.checked,
      });
    });

  // Sync button
  document.getElementById("syncNow").addEventListener("click", async () => {
    await secureSyncJobs();
  });

  // Options link
  document.getElementById("optionsLink").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

async function secureSyncJobs() {
  const syncButton = document.getElementById("syncNow");
  const lastSyncElement = document.getElementById("lastSync");

  syncButton.disabled = true;
  syncButton.textContent = "Syncing...";

  try {
    const result = await chrome.runtime.sendMessage({ action: "syncJobs" });

    if (result.success) {
      lastSyncElement.textContent = `Synced ${result.synced} jobs`;
      if (result.failed > 0) {
        lastSyncElement.textContent += ` (${result.failed} failed)`;
      }
    } else {
      lastSyncElement.textContent = "Sync failed: " + result.error;
    }

    await loadSecureStats(); // Refresh stats
  } catch (error) {
    console.error("Secure sync failed:", error);
    lastSyncElement.textContent = "Sync failed";
  } finally {
    syncButton.disabled = false;
    syncButton.textContent = "Sync Now";
  }
}
