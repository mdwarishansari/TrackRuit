// Options page script
document.addEventListener("DOMContentLoaded", loadSettings);

async function loadSettings() {
  try {
    const settings = await chrome.storage.local.get([
      "isEnabled",
      "autoTrack",
      "showNotifications",
      "trackLinkedIn",
      "trackInternshala",
      "trackUnstop",
      "userToken",
      "backendUrl",
    ]);

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

    document.getElementById("apiToken").value = settings.userToken || "";
    document.getElementById("backendUrl").value =
      settings.backendUrl || "http://localhost:3000";
  } catch (error) {
    console.error("Error loading settings:", error);
    showStatus("Error loading settings", "error");
  }
}

document.getElementById("saveButton").addEventListener("click", saveSettings);
document.getElementById("resetButton").addEventListener("click", resetSettings);

async function saveSettings() {
  try {
    const settings = {
      isEnabled: document.getElementById("enableExtension").checked,
      autoTrack: document.getElementById("autoTrack").checked,
      showNotifications: document.getElementById("showNotifications").checked,
      trackLinkedIn: document.getElementById("trackLinkedIn").checked,
      trackInternshala: document.getElementById("trackInternshala").checked,
      trackUnstop: document.getElementById("trackUnstop").checked,
      userToken: document.getElementById("apiToken").value.trim(),
      backendUrl: document.getElementById("backendUrl").value.trim(),
    };

    await chrome.storage.local.set(settings);
    showStatus("Settings saved successfully!", "success");

    // Close options page after successful save
    setTimeout(() => {
      window.close();
    }, 1500);
  } catch (error) {
    console.error("Error saving settings:", error);
    showStatus("Error saving settings", "error");
  }
}

async function resetSettings() {
  if (confirm("Are you sure you want to reset all settings to default?")) {
    await chrome.storage.local.clear();

    const defaultSettings = {
      isEnabled: true,
      autoTrack: true,
      showNotifications: true,
      trackLinkedIn: true,
      trackInternshala: true,
      trackUnstop: true,
      userToken: null,
      backendUrl: "http://localhost:3000",
      trackedJobs: [],
      pendingJobs: [],
    };

    await chrome.storage.local.set(defaultSettings);
    await loadSettings();
    showStatus("Settings reset to defaults", "success");
  }
}

function showStatus(message, type) {
  const statusElement = document.getElementById("statusMessage");
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;

  setTimeout(() => {
    statusElement.style.display = "none";
  }, 3000);
}
