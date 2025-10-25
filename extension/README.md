# 🧩 TrackRuit Chrome Extension

<div align="center">

![TrackRuit Logo](https://img.shields.io/badge/TrackRuit-AI%20Job%20Tracker-blue?style=for-the-badge&logo=google-chrome&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-critical?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge)

_Automate your job tracking — directly from LinkedIn, Internshala, and Unstop._

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage-guide) • [Development](#-development) • [Support](#-support--contact)

</div>

---

## 📘 Overview

The **TrackRuit Chrome Extension** is the automation bridge of the TrackRuit ecosystem.
It detects and syncs your job or internship applications from **LinkedIn**, **Internshala**, and **Unstop** to your TrackRuit dashboard — **no manual input needed**.

Whenever you apply to a job, the extension captures job details (title, company, location, status, platform) and sends them securely to your TrackRuit backend. It’s designed to be **fast**, **lightweight**, and **privacy-first**.

> “You apply — TrackRuit tracks.”

---

## 🚀 Features

### 🎯 Core Highlights

| Feature                      | Description                                     | Status  |
| ---------------------------- | ----------------------------------------------- | ------- |
| 🤖 **Auto Job Detection**    | Detects applications on supported sites         | ✅ Live |
| 🔄 **Instant Sync**          | Automatically syncs with your TrackRuit account | ✅ Live |
| 💾 **Offline Storage**       | Stores jobs locally if offline, syncs later     | ✅ Live |
| 🎨 **Manual Save Button**    | Quick-save jobs from any site manually          | ✅ Live |
| 🔒 **JWT Authentication**    | Uses TrackRuit login token for secure sync      | ✅ Live |
| 📊 **Analytics Integration** | Works seamlessly with TrackRuit dashboard       | ✅ Live |

### 🧠 Technical Advantages

- **Manifest V3 compliant**
- **Modular architecture**
- **Zero data collection beyond user intent**
- **Light on memory and performance**
- **Supports both auto and manual workflows**
- **Compatible with Chrome 88+ and Chromium-based browsers**

---

## 📂 Folder Structure

Your folder tree (`extension/`) looks like this:

```
extension/
├── icons/
│   ├── icon-active.png
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── utils/
│   ├── api.js           # Handles backend API requests
│   ├── constants.js     # URL endpoints and fixed values
│   └── storage.js       # Local storage operations (sync/restore)
│
├── background.js        # Background service worker
├── content.js           # Detects jobs from active job sites
├── manifest.json        # Chrome Extension configuration (Manifest V3)
├── popup.html           # Main popup UI
├── popup.js             # Popup behavior logic
├── popup.css            # Popup styling
├── options.html         # Settings / configuration page
├── options.js           # Settings logic and token management
├── options.css          # Styling for settings page
└── README.md            # This documentation
```

---

## ⚙️ Installation

### 🧭 Option 1: Manual Installation (Recommended for Developers)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/trackruit/trackruit-extension.git
   cd trackruit/extension
   ```

2. **Load into Chrome:**

   - Open Chrome → go to `chrome://extensions/`
   - Enable **Developer Mode** (top right corner)
   - Click **Load unpacked**
   - Select the `extension` folder

3. **Verify Installation:**

   - TrackRuit icon appears in Chrome toolbar
   - Click the icon → Popup loads successfully

### 🛍️ Option 2: Chrome Web Store (Coming Soon)

```bash
# Once published
Visit: chrome.google.com/webstore/detail/trackruit
```

---

## 🧭 Usage Guide

### 🔑 Initial Setup

1. **Sign up or log in** at [TrackRuit Web](https://trackruit.com)
2. Navigate to **Account Settings → API Token**
3. Copy your JWT token
4. Open **Extension Settings (Options Page)**
5. Paste token under “API Token”
6. Enable the job platforms you want to track

### 💡 Start Tracking

- Apply for jobs on supported platforms (LinkedIn, Internshala, Unstop)
- The extension will **auto-detect** the job and save it to your dashboard
- View tracked applications anytime on your TrackRuit web account

### 🧩 Manual Save

When auto-detection isn’t supported:

- Click the **TrackRuit icon** on toolbar
- Press “Save Current Job”
- Job info is extracted and sent to backend

---

## 🌐 Supported Platforms

| Platform    | Auto Detection | Manual Save |
| ----------- | -------------- | ----------- |
| LinkedIn    | ✅             | ✅          |
| Internshala | ✅             | ✅          |
| Unstop      | ✅             | ✅          |
| Naukri      | 🔄 Coming Soon | ✅          |
| Indeed      | 🔄 Coming Soon | ✅          |
| Other Sites | ❌             | ✅          |

---

## ⚙️ Configuration

All configuration happens within **options.html** and **manifest.json**.
The extension connects directly to the TrackRuit backend using secure JWT authentication.

```javascript
// Example configuration (in utils/constants.js)
export const CONFIG = {
  BACKEND_URL: "https://api.trackruit.com",
  ADD_JOB_ENDPOINT: "/api/jobs/add",
  VERIFY_TOKEN_ENDPOINT: "/api/auth/verify",
};
```

---

## 🧑‍💻 Development

### 🏗 Prerequisites

- Node.js (optional for running build scripts)
- Chrome browser v88+
- A TrackRuit account with valid JWT token

### 💻 Local Development Workflow

```bash
# 1. Clone repo
git clone https://github.com/trackruit/trackruit-extension.git

# 2. Move into extension directory
cd extension

# 3. (Optional) Install dependencies if build tools added later
npm install

# 4. Load unpacked extension
chrome://extensions → Load unpacked → Select "extension" folder
```

### 🔬 Testing New Platforms

To add a new job site:

1. Add the site to `manifest.json` under `content_scripts`
2. Extend `content.js` with platform-specific selectors
3. Test detection logs via Chrome DevTools console

Example snippet:

```javascript
// In content.js
if (window.location.hostname.includes("newjobsite.com")) {
  detectJob({
    title: document.querySelector(".job-title")?.innerText,
    company: document.querySelector(".company-name")?.innerText,
  });
}
```

---

## 🧩 Manifest Overview (Manifest V3)

```json
{
  "manifest_version": 3,
  "name": "TrackRuit",
  "version": "1.0.0",
  "description": "Automatically tracks your job applications from multiple platforms.",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": ["storage", "activeTab", "scripting", "tabs"],
  "host_permissions": [
    "https://www.linkedin.com/*",
    "https://internshala.com/*",
    "https://unstop.com/*"
  ],
  "background": { "service_worker": "background.js" },
  "action": { "default_popup": "popup.html" },
  "options_page": "options.html",
  "content_scripts": [
    {
      "matches": [
        "https://www.linkedin.com/*",
        "https://internshala.com/*",
        "https://unstop.com/*"
      ],
      "js": ["content.js"]
    }
  ]
}
```

---

## 🔒 Privacy & Security

| Data Type  | Storage       | Transmission | Purpose              |
| ---------- | ------------- | ------------ | -------------------- |
| Job Data   | Local + Cloud | Encrypted    | Tracking & analytics |
| User Token | Local Storage | Encrypted    | Authentication       |
| Settings   | Local Storage | None         | Custom configuration |

✅ **No browsing history** collected
✅ **No third-party analytics**
✅ **Secure HTTPS communication**
✅ **JWT-based authorization**

---

## 🧭 Troubleshooting

| Issue                 | Possible Fix                                        |
| --------------------- | --------------------------------------------------- |
| Extension not visible | Check `chrome://extensions` → Enable Developer Mode |
| No jobs detected      | Ensure platform is enabled in Settings              |
| Token invalid         | Re-authenticate via TrackRuit web                   |
| Popup not loading     | Reinstall extension or reload                       |
| API request failed    | Verify backend server URL in constants.js           |

---

## 🧩 Roadmap

### ✅ Completed

- LinkedIn, Internshala, Unstop integrations
- Offline support & manual save
- Secure token sync
- Popup & settings UI

### 🔄 In Progress

- Naukri & Indeed integration
- Enhanced error handling
- Chrome notifications

### 🔮 Planned (v2.0)

- Resume & interview tracking
- AI job match suggestions
- Multi-browser support
- Cloud-based auto backup

---

## 📄 License

**MIT License**

```
Copyright (c) 2024 TrackRuit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 👥 Team & Acknowledgments

**Lead Developer:** Mohammad Warish
**UI/UX Design:** TrackRuit Frontend Team
**QA & Testing:** TrackRuit Core Contributors
**Special Thanks:** Chrome DevTools community, open-source contributors, and beta testers.

---

## 📞 Support & Contact

| Type          | Channel                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| 📧 Email      | [support@trackruit.com](mailto:support@trackruit.com)                    |
| 🐛 Report Bug | [GitHub Issues](https://github.com/trackruit/trackruit-extension/issues) |
| 💬 Community  | [Discord Server](https://discord.gg/trackruit)                           |
| 📚 Docs       | [docs.trackruit.com](https://docs.trackruit.com)                         |

---

<div align="center">

## 🚀 Automate Your Job Search with TrackRuit

**Apply once — track everywhere.**
[**→ Get Started**](https://trackruit.com)

⭐ _Star this repo if you find it helpful._

</div>
