/**
 * API Endpoint constants for the SAM application.
 * All paths are relative to the baseURL (http://localhost:8000).
 *
 * FUTURE COGNITO MIGRATION:
 * - Replace AUTH.LOGIN with Amplify.Auth.signIn()
 * - Replace AUTH.REFRESH with Amplify.Auth.currentSession() (auto-handled)
 * - Replace AUTH.CHANGE_PASSWORD with Amplify.Auth.changePassword()
 * - AUTH.ME can be replaced with Amplify.Auth.currentAuthenticatedUser()
 */

const BASE = "/api/v1";

export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE}/auth/login`,
  CHANGE_PASSWORD: `${BASE}/auth/change-password`,
  REFRESH: `${BASE}/auth/refresh`,
  ME: `${BASE}/auth/me`,
  LOGOUT: `${BASE}/auth/logout`,
} as const;

export const USER_ENDPOINTS = {
  CREATE: `${BASE}/users/`,
  LIST: `${BASE}/users/`,
  GET_BY_ID: (userId: string) => `${BASE}/users/${userId}`,
  DELETE: (userId: string) => `${BASE}/users/${userId}`,
  AUTH_EVENTS: `${BASE}/users/events`,
} as const;

export const TABLE_HEADERS = (tableName: string) => `/table-headers/${tableName}`;
export const ORGANIZATIONS_SEARCH = '/sam-data/search';
export const ORGANIZATION_BY_ID = (recordId: string) => `/sam-data/${recordId}`;
export const ORGANIZATION_EXPORT = (recordId: string) => `/sam-data/${recordId}/export`;
