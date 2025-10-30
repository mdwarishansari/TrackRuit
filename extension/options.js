// Import secure modules
import { secureStorage } from "./utils/storage.js";
import { secureAPI } from "./utils/api.js";

document.addEventListener("DOMContentLoaded", loadSecureSettings);

async function loadSecureSettings() {
  try {
    const settings = (await secureStorage.get("settings")) || {};

    // Set checkbox values
    document.getElementById("enableExtension").checked =
      settings.isEnabled !== false;
    document.getElementById("autoTrack").checked = settings.autoTrack !== false;
    document.getElementById("showNotifications").checked =
      settings.showNotifications || false;

    document.getElementById("trackLinkedIn").checked =
      settings.trackLinkedIn !== false;
    document.getElementById("trackInternshala").checked =
      settings.trackInternshala !== false;
    document.getElementById("trackUnstop").checked =
      settings.trackUnstop !== false;
    document.getElementById("trackIndeed").checked =
      settings.trackIndeed !== false;

    document.getElementById("apiToken").value = settings.userToken || "";
    document.getElementById("backendUrl").value =
      settings.backendUrl || "http://localhost:3000";
  } catch (error) {
    console.error("Error loading secure settings:", error);
    showStatus("Error loading settings", "error");
  }
}

document
  .getElementById("saveButton")
  .addEventListener("click", saveSecureSettings);
document
  .getElementById("resetButton")
  .addEventListener("click", resetSecureSettings);
document
  .getElementById("verifyConnection")
  .addEventListener("click", verifySecureConnection);

async function saveSecureSettings() {
  try {
    const currentSettings = (await secureStorage.get("settings")) || {};

    const newSettings = {
      ...currentSettings,
      isEnabled: document.getElementById("enableExtension").checked,
      autoTrack: document.getElementById("autoTrack").checked,
      showNotifications: document.getElementById("showNotifications").checked,
      trackLinkedIn: document.getElementById("trackLinkedIn").checked,
      trackInternshala: document.getElementById("trackInternshala").checked,
      trackUnstop: document.getElementById("trackUnstop").checked,
      trackIndeed: document.getElementById("trackIndeed").checked,
      userToken: document.getElementById("apiToken").value.trim(),
      backendUrl: document.getElementById("backendUrl").value.trim(),
    };

    await secureStorage.set("settings", newSettings);
    showStatus("Settings saved securely!", "success");

    // Close options page after successful save
    setTimeout(() => {
      window.close();
    }, 1500);
  } catch (error) {
    console.error("Error saving secure settings:", error);
    showStatus("Error saving settings", "error");
  }
}

async function resetSecureSettings() {
  if (
    confirm(
      "Are you sure you want to reset all settings to default? This will clear all local data."
    )
  ) {
    await secureStorage.clearAllData();

    const defaultSettings = {
      isEnabled: true,
      autoTrack: true,
      showNotifications: true,
      trackLinkedIn: true,
      trackInternshala: true,
      trackUnstop: true,
      trackIndeed: true,
      userToken: null,
      backendUrl: "http://localhost:3000",
      security: {
        lastVerified: null,
        encryptionEnabled: true,
      },
    };

    await secureStorage.set("settings", defaultSettings);
    await loadSecureSettings();
    showStatus("Settings reset to secure defaults", "success");
  }
}

async function verifySecureConnection() {
  const verifyButton = document.getElementById("verifyConnection");
  const statusElement = document.getElementById("statusMessage");

  verifyButton.disabled = true;
  verifyButton.textContent = "Verifying...";

  try {
    const result = await chrome.runtime.sendMessage({
      action: "verifyConnection",
    });

    if (result.success && result.verified) {
      showStatus("Secure connection verified successfully!", "success");
    } else {
      showStatus(
        "Connection failed: " + (result.error || "Invalid token"),
        "error"
      );
    }
  } catch (error) {
    showStatus("Verification failed: " + error.message, "error");
  } finally {
    verifyButton.disabled = false;
    verifyButton.textContent = "Verify Connection";
  }
}

function showStatus(message, type) {
  const statusElement = document.getElementById("statusMessage");
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
  statusElement.style.display = "block";

  setTimeout(() => {
    statusElement.style.display = "none";
  }, 5000);
}
