// Content script - runs on job sites to detect applications
console.log("TrackRuit content script loaded");

class JobTracker {
  constructor() {
    this.currentJob = null;
    this.init();
  }

  init() {
    this.detectPlatform();
    this.setupObservers();
    this.injectSaveButton();
  }

  detectPlatform() {
    const url = window.location.href;

    if (url.includes("linkedin.com")) {
      this.setupLinkedIn();
    } else if (url.includes("internshala.com")) {
      this.setupInternshala();
    } else if (url.includes("unstop.com")) {
      this.setupUnstop();
    }
  }

  setupObservers() {
    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          this.checkForApplicationButtons();
          this.extractJobInfo();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also check immediately
    setTimeout(() => {
      this.checkForApplicationButtons();
      this.extractJobInfo();
    }, 2000);
  }

  setupLinkedIn() {
    console.log("Setting up LinkedIn tracking");

    // LinkedIn specific selectors
    this.selectors = {
      jobTitle: ".jobs-details-top-card__job-title",
      companyName: ".jobs-details-top-card__company-url",
      applyButton: ".jobs-apply-button",
      easyApplyButton: 'button[aria-label*="Apply"]',
    };
  }

  setupInternshala() {
    console.log("Setting up Internshala tracking");

    this.selectors = {
      jobTitle: ".profile_on_detail_page h1",
      companyName: ".profile_on_detail_page .company_name",
      applyButton: "#apply_now_button",
    };
  }

  setupUnstop() {
    console.log("Setting up Unstop tracking");

    this.selectors = {
      jobTitle: ".contest-header-title",
      companyName: ".host-information",
      applyButton: ".apply-now-btn",
    };
  }

  checkForApplicationButtons() {
    const applyButtons = document.querySelectorAll(
      'button, a, [role="button"], input[type="submit"]'
    );

    applyButtons.forEach((button) => {
      const buttonText = button.textContent?.toLowerCase() || "";

      if (
        buttonText.includes("apply") ||
        buttonText.includes("submit") ||
        buttonText.includes("application")
      ) {
        if (!button.hasAttribute("data-trackruit-watched")) {
          button.setAttribute("data-trackruit-watched", "true");
          button.addEventListener("click", () => this.handleApplicationClick());
        }
      }
    });
  }

  extractJobInfo() {
    if (!this.selectors) return;

    try {
      const jobTitle = document
        .querySelector(this.selectors.jobTitle)
        ?.textContent?.trim();
      const companyName = document
        .querySelector(this.selectors.companyName)
        ?.textContent?.trim();

      if (jobTitle && companyName && !this.currentJob) {
        this.currentJob = {
          title: jobTitle,
          company: companyName,
          platform: this.getPlatformName(),
          url: window.location.href,
          appliedAt: new Date().toISOString(),
          status: "applied",
        };

        console.log("Job detected:", this.currentJob);
        this.showFloatingButton();
      }
    } catch (error) {
      console.error("Error extracting job info:", error);
    }
  }

  getPlatformName() {
    const url = window.location.href;
    if (url.includes("linkedin")) return "linkedin";
    if (url.includes("internshala")) return "internshala";
    if (url.includes("unstop")) return "unstop";
    return "other";
  }

  handleApplicationClick() {
    console.log("Application button clicked");

    if (this.currentJob) {
      // Wait a moment for the application to process
      setTimeout(() => {
        this.saveJobToTrackRuit();
      }, 1000);
    }
  }

  async saveJobToTrackRuit() {
    try {
      // Get settings to check if auto-track is enabled
      const { autoTrack } = await chrome.storage.local.get("autoTrack");

      if (autoTrack !== false) {
        // Default to true
        chrome.runtime.sendMessage({
          action: "saveJob",
          data: this.currentJob,
        });

        this.showNotification("Job application tracked successfully!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  }

  injectSaveButton() {
    // Create floating "Save to TrackRuit" button
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
    `;

    floatingBtn.addEventListener("click", () => {
      if (this.currentJob) {
        this.saveJobToTrackRuit();
      }
    });

    document.body.appendChild(floatingBtn);
    this.floatingButton = floatingBtn;
  }

  showFloatingButton() {
    if (this.floatingButton) {
      this.floatingButton.style.display = "block";
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10B981;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 10001;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}

// Initialize the tracker
const jobTracker = new JobTracker();
