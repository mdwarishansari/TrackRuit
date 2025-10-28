// Extension configuration and constants
export const CONFIG = {
  // Backend API endpoints
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
  ADD_JOB_ENDPOINT: "/api/jobs/add",
  VERIFY_TOKEN_ENDPOINT: "/api/auth/verify",
  
  // Extension secret key for secure communication
  EXTENSION_SECRET: process.env.EXTENSION_SECRET || "4ca1c9ea616f61cdc324311fdeb2525c46c530a8155ff3c3893eb3d24fac8633694c3b9a4e00050b6b0b39327702229d1fac8fc92e853b419b5491f59f03ce2e",
  
  // Platform configurations
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
  },
  
  // Security headers
  SECURITY_HEADERS: {
    'Content-Type': 'application/json',
    'X-Extension-Secret': process.env.EXTENSION_SECRET || "4ca1c9ea616f61cdc324311fdeb2525c46c530a8155ff3c3893eb3d24fac8633694c3b9a4e00050b6b0b39327702229d1fac8fc92e853b419b5491f59f03ce2e",
    'X-Extension-Version': '1.0.0'
  }
};

// Environment variables (in a real extension, these would be set during build)
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEBUG: process.env.DEBUG || false
};