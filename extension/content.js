// TrackRuit Secure Content Script
console.log("TrackRuit secure content script loaded");

class SecureJobTracker {
  constructor() {
    this.currentJob = null;
    this.isTracking = false;
    this.config = {
      BACKEND_URL: "http://localhost:3000",
      EXTENSION_SECRET: "4ca1c9ea616f61cdc324311fdeb2525c46c530a8155ff3c3893eb3d24fac8633694c3b9a4e00050b6b0b39327702229d1fac8fc92e853b419b5491f59f03ce2e",
      PLATFORMS: {
        LINKEDIN: {
          name: "linkedin",
          selectors: {
            jobTitle: ".jobs-details-top-card__job-title, .job-details-jobs-unified-top-card__job-title",
            companyName: ".jobs-details-top-card__company-url, .job-details-jobs-unified-top-card__company-name",
            applyButton: ".jobs-apply-button, button[aria-label*='Apply']"
          }
        },
        INTERNSHALA: {
          name: "internshala", 
          selectors: {
            jobTitle: ".profile_on_detail_page h1",
            companyName: ".profile_on_detail_page .company_name",
            applyButton: "#apply_now_button"
          }
        },
        UNSTOP: {
          name: "unstop",
          selectors: {
            jobTitle: ".contest-header-title",
            companyName: ".host-information",
            applyButton: ".apply-now-btn"
          }
        },
        INDEED: {
          name: "indeed",
          selectors: {
            jobTitle: ".jobsearch-JobInfoHeader-title",
            companyName: "[data-company-name]",
            applyButton: "#indeed-apply-button, .ia-IndeedApplyButton"
          }
        }
      }
    };
    
    this.init();
  }

  async init() {
    // Check if tracking is enabled
    const settings = await this.getSettings();
    if (!settings.isEnabled) {
      console.log("TrackRuit: Extension is disabled");
      return;
    }

    this.isTracking = true;
    this.detectPlatform();
    this.setupObservers();
    this.injectSecureSaveButton();
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get('settings', (result) => {
        resolve(result.settings || { isEnabled: true, autoTrack: true });
      });
    });
  }

  detectPlatform() {
    const url = window.location.href;

    if (url.includes("linkedin.com")) {
      this.platformConfig = this.config.PLATFORMS.LINKEDIN;
    } else if (url.includes("internshala.com")) {
      this.platformConfig = this.config.PLATFORMS.INTERNSHALA;
    } else if (url.includes("unstop.com")) {
      this.platformConfig = this.config.PLATFORMS.UNSTOP;
    } else if (url.includes("indeed.com")) {
      this.platformConfig = this.config.PLATFORMS.INDEED;
    } else {
      this.platformConfig = null;
    }

    if (this.platformConfig) {
      console.log(`TrackRuit: ${this.platformConfig.name} tracking enabled`);
    }
  }

  setupObservers() {
    if (!this.platformConfig) return;

    const observer = new MutationObserver((mutations) => {
      if (!this.isTracking) return;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          this.checkForApplicationButtons();
          this.extractSecureJobInfo();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      this.checkForApplicationButtons();
      this.extractSecureJobInfo();
    }, 2000);

    window.addEventListener('beforeunload', () => {
      if (this.currentJob) {
        this.saveJobIfApplied();
      }
    });
  }

  async checkForApplicationButtons() {
    if (!this.platformConfig) return;

    const applyButtons = document.querySelectorAll(
      'button, a, [role="button"], input[type="submit"]'
    );

    applyButtons.forEach((button) => {
      const buttonText = button.textContent?.toLowerCase() || "";
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || "";

      if (
        buttonText.includes("apply") ||
        buttonText.includes("submit") ||
        buttonText.includes("application") ||
        ariaLabel.includes('apply')
      ) {
        if (!button.hasAttribute("data-trackruit-secure-watched")) {
          button.setAttribute("data-trackruit-secure-watched", "true");
          button.addEventListener("click", () => this.handleSecureApplicationClick());
        }
      }
    });
  }

  extractSecureJobInfo() {
    if (!this.platformConfig) return;

    try {
      const jobTitle = this.findElement(this.platformConfig.selectors.jobTitle);
      const companyName = this.findElement(this.platformConfig.selectors.companyName);

      if (jobTitle && companyName && !this.currentJob) {
        this.currentJob = {
          title: jobTitle,
          company: companyName,
          platform: this.platformConfig.name,
          url: this.sanitizeUrl(window.location.href),
          appliedAt: new Date().toISOString(),
          status: "detected",
          source: "auto_detect"
        };

        console.log("Secure job detected:", this.currentJob);
        this.showSecureFloatingButton();
      }
    } catch (error) {
      console.error("Error extracting secure job info:", error);
    }
  }

  findElement(selectors) {
    if (typeof selectors === 'string') {
      return document.querySelector(selectors)?.textContent?.trim();
    } else if (Array.isArray(selectors)) {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element.textContent?.trim();
      }
    }
    return null;
  }

  sanitizeUrl(url) {
    try {
      const urlObj = new URL(url);
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'auth', 'token'];
      paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  async handleSecureApplicationClick() {
    console.log("Secure application button clicked");

    if (this.currentJob) {
      this.currentJob.status = "applied";
      this.currentJob.appliedAt = new Date().toISOString();

      setTimeout(async () => {
        await this.saveSecureJobToTrackRuit();
      }, 1500);
    }
  }

  async saveSecureJobToTrackRuit() {
    try {
      const settings = await this.getSettings();

      if (settings.autoTrack !== false) {
        const response = await chrome.runtime.sendMessage({
          action: "saveJob",
          data: this.currentJob
        });

        if (response.success) {
          this.showSecureNotification("Job application securely tracked!");
          
          if (response.savedLocally) {
            this.showSecureNotification("Saved locally - will sync when online");
          }
        } else {
          this.showSecureNotification("Failed to track job: " + response.error, true);
        }
      }
    } catch (error) {
      console.error("Error in secure job save:", error);
      this.showSecureNotification("Error tracking job", true);
    }
  }

  async saveJobIfApplied() {
    if (this.currentJob && this.currentJob.status === "applied") {
      try {
        await chrome.runtime.sendMessage({
          action: "saveJob",
          data: this.currentJob
        });
      } catch (error) {
        console.error("Final save attempt failed:", error);
      }
    }
  }

  injectSecureSaveButton() {
    const floatingBtn = document.createElement("button");
    floatingBtn.innerHTML = "💼 Save to TrackRuit";
    floatingBtn.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      background: #4F46E5;
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: none;
      border: 2px solid #3730A3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    floatingBtn.addEventListener("click", async () => {
      if (this.currentJob) {
        this.currentJob.status = "manual_save";
        this.currentJob.source = "manual";
        await this.saveSecureJobToTrackRuit();
      } else {
        this.showSecureNotification("No job detected on this page", true);
      }
    });

    document.body.appendChild(floatingBtn);
    this.floatingButton = floatingBtn;
  }

  showSecureFloatingButton() {
    if (this.floatingButton) {
      this.floatingButton.style.display = "block";
      
      setTimeout(() => {
        if (this.floatingButton) {
          this.floatingButton.style.display = "none";
        }
      }, 30000);
    }
  }

  showSecureNotification(message, isError = false) {
    // Remove existing notifications
    document.querySelectorAll('.trackruit-notification').forEach(el => el.remove());

    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = 'trackruit-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? '#EF4444' : '#10B981'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 10001;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border-left: 4px solid ${isError ? '#DC2626' : '#059669'};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  }
}

// Initialize the secure tracker
const secureJobTracker = new SecureJobTracker();