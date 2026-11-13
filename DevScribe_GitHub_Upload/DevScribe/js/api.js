/**
 * DevScribe by Kanak - Frontend REST API Client (api.js)
 * Connects the frontend user interface to the Node.js / Express.js REST API.
 * Includes friendly connection diagnosis, OTP verification APIs, and zero-crash fallback.
 */

const API_CONFIG = {
  // If served directly from Express on :5000, use relative '/api', else absolute URL
  baseUrl: window.location.origin.includes(':5000') 
    ? '/api' 
    : 'http://localhost:5000/api',
  tokenKey: 'devscribe_jwt_token',
  isBackendAvailable: null
};

const Api = {
  // --- Token Management ---
  getToken() {
    return localStorage.getItem(API_CONFIG.tokenKey) || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(API_CONFIG.tokenKey, token);
    } else {
      localStorage.removeItem(API_CONFIG.tokenKey);
    }
  },

  clearToken() {
    localStorage.removeItem(API_CONFIG.tokenKey);
  },

  // --- Health Check & Status ---
  async checkHealth() {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      const data = await res.json();
      API_CONFIG.isBackendAvailable = data.status === 'ok';
      this.updateBackendIndicator(true);
      return true;
    } catch (err) {
      API_CONFIG.isBackendAvailable = false;
      this.updateBackendIndicator(false);
      return false;
    }
  },

  updateBackendIndicator(isOnline) {
    let badge = document.getElementById('api-status-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'api-status-badge';
      badge.style.position = 'fixed';
      badge.style.bottom = '1rem';
      badge.style.left = '1rem';
      badge.style.zIndex = '999';
      badge.style.padding = '0.35rem 0.75rem';
      badge.style.borderRadius = '9999px';
      badge.style.fontSize = '0.74rem';
      badge.style.fontWeight = '700';
      badge.style.display = 'inline-flex';
      badge.style.alignItems = 'center';
      badge.style.gap = '0.45rem';
      badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      badge.style.backdropFilter = 'blur(8px)';
      badge.style.transition = 'all 0.3s ease';
      document.body.appendChild(badge);
    }

    if (isOnline) {
      badge.style.background = 'rgba(16, 185, 129, 0.15)';
      badge.style.color = '#10b981';
      badge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
      badge.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px #10b981;"></span> Express API Connected (Port 5000)`;
    } else {
      badge.style.background = 'rgba(245, 158, 11, 0.15)';
      badge.style.color = '#f59e0b';
      badge.style.border = '1px solid rgba(245, 158, 11, 0.4)';
      badge.title = 'Run start.bat or "npm start" in terminal to launch the Express backend';
      badge.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:#f59e0b;"></span> Backend Server Offline (Run start.bat)`;
    }
  },

  // Helper for HTTP requests with friendly diagnostic error handling
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(8000)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Server responded with status ${response.status}`);
      }

      return data;
    } catch (err) {
      // Diagnostic check: If server is offline / connection refused
      const isNetworkErr = 
        err.name === 'TypeError' || 
        err.message.includes('fetch') || 
        err.message.includes('network') || 
        err.message.includes('Failed to fetch') ||
        err.name === 'TimeoutError';

      if (isNetworkErr) {
        const diagnosticErr = new Error(
          `Cannot reach Node.js server at http://localhost:5000. Please start the server by double-clicking 'start.bat' or running 'npm start'.`
        );
        diagnosticErr.isOffline = true;
        console.warn(`[DevScribe API] Server offline at ${url}:`, err.message);
        throw diagnosticErr;
      }

      console.warn(`[DevScribe API] Call to ${endpoint} returned error:`, err.message);
      throw err;
    }
  },

  // ==========================================================================
  // 1. OTP Verification APIs
  // ==========================================================================
  async sendOtp(name, email, password) {
    return await this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  async verifyOtp(payload) {
    const result = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  // ==========================================================================
  // 2. User Registration API
  // ==========================================================================
  async register(name, email, password, avatar = null, bio = null) {
    try {
      const result = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, avatar, bio })
      });

      if (result.token) {
        this.setToken(result.token);
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 3. User Login API
  // ==========================================================================
  async login(email, password) {
    try {
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (result.token) {
        this.setToken(result.token);
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 4. Create Blog API
  // ==========================================================================
  async createPost(postData) {
    try {
      const result = await this.request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 5. Get Posts API
  // ==========================================================================
  async getPosts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = query ? `/posts?${query}` : '/posts';
      const result = await this.request(endpoint, { method: 'GET' });
      return result.posts || [];
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 6. Update Post API
  // ==========================================================================
  async updatePost(id, postData) {
    try {
      const result = await this.request(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData)
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 7. Delete Post API
  // ==========================================================================
  async deletePost(id) {
    try {
      const result = await this.request(`/posts/${id}`, {
        method: 'DELETE'
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 8. Add Reaction API
  // ==========================================================================
  async reactToPost(id, reaction) {
    try {
      const result = await this.request(`/posts/${id}/react`, {
        method: 'POST',
        body: JSON.stringify({ reaction })
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  // ==========================================================================
  // 9. Add Comment API
  // ==========================================================================
  async addComment(id, author, text) {
    try {
      const result = await this.request(`/posts/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ author, text })
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
};

// Check backend health on page load
document.addEventListener('DOMContentLoaded', () => {
  Api.checkHealth();
});
