/**
 * API client for communicating with the Python BFF
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface ApiPermission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface UserPermissionUpdate {
  user_id: string;
  permission_ids: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get the session token from NextAuth
    const { getToken } = await import('next-auth/react');
    const token = await getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token.accessToken}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<ApiUser> {
    return this.request<ApiUser>('/api/me');
  }

  async getUsers(): Promise<ApiUser[]> {
    return this.request<ApiUser[]>('/api/users');
  }

  async getPermissions(): Promise<ApiPermission[]> {
    return this.request<ApiPermission[]>('/api/permissions');
  }

  async getUserPermissions(userId: string): Promise<ApiPermission[]> {
    return this.request<ApiPermission[]>(`/api/users/${userId}/permissions`);
  }

  async updateUserPermissions(
    userId: string,
    permissionIds: string[]
  ): Promise<ApiUser> {
    return this.request<ApiUser>(`/api/users/${userId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, permission_ids: permissionIds }),
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
