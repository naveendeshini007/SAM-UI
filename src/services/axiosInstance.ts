/**
 * Shared Axios instance for all API calls.
 *
 * Design decisions:
 * - baseURL is hardcoded to http://localhost:8000 (not env var) per requirements
 * - withCredentials: true so the httpOnly refresh_token cookie is sent automatically
 * - Access token is stored ONLY in memory (React Context), never in localStorage
 * - On 401: attempt /refresh once, update in-memory token, retry original request
 * - If refresh fails: clear token via injected setter and redirect to /login
 *
 * Token injection pattern:
 * - AuthContext calls `injectTokenAccessor(getter, setter)` after mount
 * - The interceptor reads the current token via the getter and updates via setter
 * - This avoids circular imports between Context and this module
 *
 * FUTURE COGNITO MIGRATION:
 * - Replace manual Bearer token injection with Amplify.Auth.currentSession()
 *   which returns tokens automatically — no manual header injection needed
 * - Remove the /refresh interceptor; Amplify handles token refresh internally
 * - withCredentials can be removed if switching to Cognito Hosted UI / PKCE
 */

import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { AUTH_ENDPOINTS } from "../constants/APIEndpoints";
import type { RefreshResponse } from "../types/Interfaces";


export const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
});


let _getToken: () => string | null = () => null;
let _setToken: (token: string | null) => void = () => {};
let _appReady = false;
export function injectTokenAccessor(
  getter: () => string | null,
  setter: (token: string | null) => void
): void {
  _getToken = getter;
  _setToken = setter;
}

export function markAppReady(): void {
  _appReady = true;
}


apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = _getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function drainQueue(token: string): void {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
}

function rejectQueue(error: unknown): void {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
}


apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      _skipRefresh?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest._skipRefresh ||
      originalRequest.url === AUTH_ENDPOINTS.REFRESH
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await apiClient.post<RefreshResponse>(
        AUTH_ENDPOINTS.REFRESH
      );
      const newToken = data.access_token;
      _setToken(newToken);
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      drainQueue(newToken);
      isRefreshing = false;

      return apiClient(originalRequest);
    } catch (refreshError) {
      _setToken(null);
      rejectQueue(refreshError);
      isRefreshing = false;

      if (_appReady) {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);
