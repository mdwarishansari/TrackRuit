import { CONFIG } from './constants.js';

export class SecureAPI {
  constructor() {
    this.baseURL = CONFIG.BACKEND_URL;
    this.secret = CONFIG.EXTENSION_SECRET;
  }

  async makeSecureRequest(endpoint, data, userToken = null) {
    try {
      const headers = {
        ...CONFIG.SECURITY_HEADERS,
        'X-Request-Timestamp': Date.now().toString(),
        'X-Request-ID': this.generateRequestId()
      };

      // Add user authentication if available
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      // Add request signature for additional security
      const signature = await this.generateSignature(data, headers['X-Request-Timestamp']);
      headers['X-Signature'] = signature;

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        credentials: 'omit' // Don't send cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Verify response signature (if implemented on backend)
      if (result.signature) {
        const isValid = await this.verifyResponseSignature(result);
        if (!isValid) {
          throw new Error('Invalid response signature');
        }
      }

      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async addJob(jobData, userToken) {
    // Validate job data before sending
    const validatedData = this.validateJobData(jobData);
    if (!validatedData.valid) {
      throw new Error(`Invalid job data: ${validatedData.errors.join(', ')}`);
    }

    return await this.makeSecureRequest(CONFIG.ADD_JOB_ENDPOINT, validatedData.data, userToken);
  }

  async verifyToken(userToken) {
    return await this.makeSecureRequest(CONFIG.VERIFY_TOKEN_ENDPOINT, {}, userToken);
  }

  generateRequestId() {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async generateSignature(data, timestamp) {
    // Create a simple HMAC-like signature using the secret key
    const payload = JSON.stringify(data) + timestamp + this.secret;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(payload);
    
    // Use subtle crypto for better security (available in extension context)
    if (window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for environments without subtle crypto
      let hash = 0;
      for (let i = 0; i < payload.length; i++) {
        const char = payload.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16);
    }
  }

  async verifyResponseSignature(response) {
    // Implement response signature verification if backend supports it
    // This is an additional security layer to prevent MITM attacks
    return true; // Placeholder - implement based on backend capability
  }

  validateJobData(jobData) {
    const errors = [];
    const requiredFields = ['title', 'company', 'platform', 'url'];

    for (const field of requiredFields) {
      if (!jobData[field] || jobData[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    }

    // Validate URL format
    if (jobData.url && !this.isValidUrl(jobData.url)) {
      errors.push('Invalid URL format');
    }

    // Sanitize data
    const sanitizedData = {
      ...jobData,
      title: this.sanitizeString(jobData.title),
      company: this.sanitizeString(jobData.company),
      platform: this.sanitizeString(jobData.platform),
      url: jobData.url,
      appliedAt: jobData.appliedAt || new Date().toISOString(),
      status: jobData.status || 'applied'
    };

    return {
      valid: errors.length === 0,
      data: sanitizedData,
      errors: errors
    };
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  sanitizeString(str) {
    return str
      .replace(/[<>]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 500); // Limit length
  }
}

// Create singleton instance
export const secureAPI = new SecureAPI();