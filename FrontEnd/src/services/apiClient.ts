/**
 * API Client Service
 * Centralized HTTP client for all backend API calls
 * Handles authentication, error handling, and request/response formatting
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    user_id: string;
    email: string;
    name: string;
  };
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData: any;

      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: response.statusText };
      }

      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/pdf')) {
      return response.blob() as Promise<T>;
    }

    return response.json();
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 403) {
        this.removeAuthToken();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      return await this.handleResponse<ApiResponse<T>>(response);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async requestBlob(endpoint: string, options: RequestInit = {}): Promise<Blob> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      ...options.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.blob();
  }

  // Auth Endpoints
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.removeAuthToken();
  }

  // Skills Endpoints
  async getSkills() {
    return this.request('/api/v1/skills', { method: 'GET' });
  }

  async addSkill(skillName: string, skillLevel: number, description?: string) {
    return this.request('/api/v1/skills', {
      method: 'POST',
      body: JSON.stringify({ skill_name: skillName, skill_level: skillLevel, description }),
    });
  }

  async updateSkill(skillId: string, skillLevel: number, description?: string) {
    return this.request(`/api/v1/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify({ skill_level: skillLevel, description }),
    });
  }

  async deleteSkill(skillId: string) {
    return this.request(`/api/v1/skills/${skillId}`, { method: 'DELETE' });
  }

  // Records (Internships/Certifications) Endpoints
  async getRecords() {
    return this.request('/api/v1/records', { method: 'GET' });
  }

  async addRecord(recordData: any) {
    return this.request('/api/v1/records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  async updateRecord(recordId: string, recordData: any) {
    return this.request(`/api/v1/records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(recordData),
    });
  }

  async deleteRecord(recordId: string) {
    return this.request(`/api/v1/records/${recordId}`, { method: 'DELETE' });
  }

  // Evidence Endpoints
  async uploadEvidence(formData: FormData) {
    const headers: HeadersInit = {};
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/api/v1/evidence`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Analytics Endpoints
  async getAnalytics() {
    return this.request('/api/v1/analytics', { method: 'GET' });
  }

  // Portfolio Endpoints
  async exportPortfolioPDF(): Promise<Blob> {
    return this.requestBlob('/api/v1/portfolio/export', { method: 'GET' });
  }

  // Health Check
  async healthCheck() {
    return this.request('/api/v1/health', { method: 'GET' });
  }
}

export const apiClient = new ApiClient();
