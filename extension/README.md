# 🧩 TrackRuit Chrome Extension

![TrackRuit Logo](https://img.shields.io/badge/TrackRuit-AI%20Job%20Tracker-blue?style=for-the-badge&logo=google-chrome&logoColor=white)
![Version](https://img.shields.io/badge/version-1.1.0-green?style=for-the-badge)
![Manifest](https://img.shields.io/badge/Manifest-V3-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

---

## 🧠 Overview

**TrackRuit Chrome Extension** is a core component of the **TrackRuit Ecosystem**, designed to **automatically track and log job/internship applications** across multiple platforms like **LinkedIn, Internshala, Unstop, Indeed**, and more.

Once a user applies for a job while logged into their **TrackRuit account**, the extension automatically:

- Detects job submissions.
- Captures essential job data (title, company, URL, status, etc.).
- Syncs them securely to the user’s database via TrackRuit’s backend APIs.

---

## 🎯 Core Objectives

- **Zero manual input**: Auto-detect and capture job applications.
- **Secure synchronization**: Encrypted communication between extension and backend.
- **User-specific logging**: Only logged-in users can activate the auto-track feature.
- **Cross-platform compatibility**: Works seamlessly on job portals.
- **Privacy-first design**: No personal data stored locally beyond session scope.

---

## 💡 Problems Solved

- Avoids repetitive form-filling and manual tracking.
- Centralizes all applied job data into one dashboard.
- Eliminates human error in application tracking.
- Enables AI analytics (via TrackRuit ML backend).

---

## ✨ Key Features

- 🌐 Auto-detection of job application events.
- 🔐 Secure dual-layer verification (Auth + Extension Secret).
- 📡 Real-time data sync via REST APIs.
- 📦 Local caching for offline retries.
- 🧾 Manifest V3 compliant with background service workers.
- 🔍 Cross-domain permission control.
- 🧰 Simple configuration for developers and testers.

---

## 🛠️ Tech Stack

| Layer                   | Technology                                              |
| ----------------------- | ------------------------------------------------------- |
| **Frontend**            | HTML, CSS, JavaScript (ES6), Chrome Extension API       |
| **Communication**       | Fetch API, JWT-based Auth                               |
| **Backend Integration** | TrackRuit REST APIs                                     |
| **Security**            | HMAC Signature, Timestamp Validation, Encrypted Headers |
| **Manifest**            | Version 3                                               |

---

## 📡 API Integration Details

The extension interacts with the backend using **secure REST APIs**.  
Below are the **mandatory endpoints** required for backend implementation.

---

### 🔐 Authentication APIs

#### 1. **POST `/api/auth/verify`**

**Purpose:** Verify JWT token validity.

**Headers Required:**

```

Authorization: Bearer <jwt_token>
X-Extension-Secret: <your_secret_key>
X-Extension-Version: 1.1.0
X-Request-Timestamp: <timestamp>
Content-Type: application/json

```

**Request Body:**

```json
{}
```

**Response:**

```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

---

### 💼 Job Management APIs

#### 2. **POST `/api/jobs/add`**

**Purpose:** Add a single job application entry.

**Headers:**
Same as above +
`X-Signature: <request_signature>`

**Request Body:**

```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "platform": "linkedin",
  "url": "https://linkedin.com/jobs/view/123",
  "appliedAt": "2024-01-15T10:30:00.000Z",
  "status": "applied",
  "source": "auto_detect",
  "location": "Remote",
  "description": "Job description...",
  "salary": "$100,000 - $150,000"
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_123456",
  "message": "Job added successfully"
}
```

---

#### 3. **POST `/api/jobs/sync`** _(Future Recommended Endpoint)_

**Purpose:** Bulk sync multiple pending jobs.

**Request Body:**

```json
{
  "pendingJobs": [
    {
      "id": "local_job_id_1",
      "title": "Job 1",
      "company": "Company A",
      "platform": "linkedin",
      "url": "https://example.com/job1",
      "appliedAt": "2024-01-15T10:30:00.000Z",
      "status": "applied"
    },
    {
      "id": "local_job_id_2",
      "title": "Job 2",
      "company": "Company B",
      "platform": "indeed",
      "url": "https://example.com/job2",
      "appliedAt": "2024-01-15T11:00:00.000Z",
      "status": "applied"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "synced": 2,
  "failed": 0,
  "syncedJobs": ["job_123", "job_124"]
}
```

---

### 📋 Complete API Summary

| Method   | Endpoint           | Purpose          | Headers Required                             |
| -------- | ------------------ | ---------------- | -------------------------------------------- |
| **POST** | `/api/auth/verify` | Verify JWT token | Auth, Extension-Secret, Timestamp            |
| **POST** | `/api/jobs/add`    | Add single job   | Auth, Extension-Secret, Timestamp, Signature |
| **POST** | `/api/jobs/sync`   | Bulk sync jobs   | Auth, Extension-Secret, Timestamp, Signature |

---

## 🧱 Security Architecture

### 1. Dual Verification System

Each API request is verified using:

- **JWT Authentication** for user identity.
- **Extension Secret Key** to ensure request origin.
- **Timestamp Validation** to prevent replay attacks.
- **Optional HMAC Signature** for request integrity.

**Backend Validation Snippets:**

```js
// 1. Verify extension secret
if (req.headers["x-extension-secret"] !== process.env.EXTENSION_SECRET) {
  return res.status(401).json({ error: "Invalid extension secret" });
}

// 2. Verify request timestamp
const requestTime = parseInt(req.headers["x-request-timestamp"]);
if (Math.abs(Date.now() - requestTime) > 300000) {
  // 5 minutes
  return res.status(401).json({ error: "Request timestamp expired" });
}

// 3. Optional signature verification
// Compare X-Signature header against calculated HMAC
```

### 2. Secure Folder Structure

```
Here’s your **TrackRuit Chrome Extension folder tree**, rewritten with sharp, clean formatting, hand-picked emojis, and comments that explain *why each file exists and how it fits into the system.*
It’s developer-friendly, self-documenting, and ready to drop right into your README.

---


```

📁 extension # Root folder of the Chrome extension
│
├── 📁 icons # All extension icons and favicon assets
│ ├── 🖼️ icon-active.png # Shown when extension is active or tracking jobs
│ ├── 🖼️ icon128.png # 128x128 icon used for Chrome Web Store
│ ├── 🖼️ icon48.png # Toolbar icon (standard size)
│ └── 🖼️ icon16.png # Favicon for popup or small render
│
├── 📁 utils # Helper modules for API, constants & storage
│ ├── 📄 api.js # Centralized API handler with auth headers & error handling
│ ├── 📄 constants.js # Global constants (URLs, keys, environment flags)
│ ├── 📄 constants-nomodule.js # Fallback constants for non-module scripts (Manifest V3)
│ └── 📄 storage.js # Wrapper for Chrome local/session storage operations
│
├── 📝 README.md # Local extension-specific documentation
│
├── 📄 background.js # Service worker — listens for tab updates & job actions
│ # Handles auto-tracking and backend API calls
│
├── 📄 content.js # Injected into job portals (LinkedIn, Internshala, etc.)
│ # Detects "Apply" events and extracts job data
│
├── ⚙️ manifest.json # Manifest V3 definition — permissions, scripts, icons, etc.
│
├── 🌐 popup.html # Popup UI when user clicks the extension icon
├── 🎨 popup.css # Styling for popup interface
├── 📄 popup.js # Handles popup logic: auth check, user state, UI actions
│
├── 🌐 options.html # Extension settings page (optional configurations)
├── 🎨 options.css # Styling for options page
└── 📄 options.js # Logic for managing user preferences or extension behavior

```

---

### 🧭 Quick Notes
- **`background.js`** runs persistently as a service worker — it’s the brain that coordinates sync and event triggers.
- **`content.js`** acts as the eyes and ears inside job portals, detecting relevant DOM changes.
- **`utils/api.js`** ensures every API call includes authentication, security headers, and proper error fallback.
- **`storage.js`** abstracts away Chrome’s async storage API into cleaner Promises.
- **`manifest.json`** defines everything Chrome needs to understand and run your extension securely under **Manifest V3**.
- **`popup.*`** provides a clean user interface — login state, quick actions, and visual feedback.
- **`options.*`** is optional but powerful — used for toggling preferences like auto-sync delay or job-source filters.

---


```

### 3. Token Lifecycle

- Token stored only in Chrome’s secure storage.
- Auto-refresh when expired.
- Logout clears local cache instantly.

---

## ⚙️ Installation & Setup (For Developers)

1. Clone this repository:

   ```bash
   git clone https://github.com/<your-username>/trackruit-extension.git
   cd trackruit-extension
   ```

2. Open Chrome → `chrome://extensions/`

3. Enable **Developer Mode**.

4. Click **Load unpacked** → Select the project root folder.

5. The TrackRuit extension will appear in your browser toolbar.

---

## 🚀 Usage Guide

1. Log in to your **TrackRuit** account on the main web app.
2. Pin the **TrackRuit Extension** in Chrome.
3. Browse job portals like LinkedIn, Internshala, or Unstop.
4. When you apply for a job:

   - The extension auto-captures job data.
   - Sends it to your TrackRuit account using `/api/jobs/add`.

5. Check your dashboard — all applied jobs are tracked automatically.

---

## 🔐 Permissions Explained

| Permission         | Reason                                               |
| ------------------ | ---------------------------------------------------- |
| `activeTab`        | Detects user job application actions.                |
| `storage`          | Saves local sync and auth tokens.                    |
| `scripting`        | Injects content scripts into supported job sites.    |
| `host_permissions` | Access to job portal URLs for scraping job metadata. |

---

## 🧪 Testing & Debugging

- Open **Chrome Developer Tools → Console → Service Worker Logs**.
- Use `console.log()` for background events.
- Verify API responses with `Network → Fetch/XHR` tab.
- For local backend: set `BACKEND_URL=http://localhost:5000`.
- For production: update `BACKEND_URL=https://trackruit-backend.onrender.com`.

---

## 🔭 Future Enhancements

- AI-driven job relevance scoring (integration with ML backend).
- Multi-tab synchronization via Chrome Sync API.
- Advanced analytics on job application success trends.
- Offline queueing for unsent job logs.
- Role-based multi-user API access.

---

## 🤝 Contribution

Pull requests are welcome.
Ensure your code follows the project’s structure and passes linting checks.

---

## 📄 License

Licensed under the **MIT License**.
© 2025 **TrackRuit Technologies**. All rights reserved.

---

### 🧩 Summary

> The TrackRuit Chrome Extension bridges user actions across multiple job platforms with the central TrackRuit dashboard — automatically, securely, and intelligently. It’s the invisible connector that keeps every application accounted for.

```

```
