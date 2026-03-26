/**
 * Authentication service functions.
 * All auth-related API calls live here — login, change-password, refresh, me, logout.
 *
 * Note on login: backend uses Form(...) fields, so we send FormData not JSON.
 *
 * FUTURE COGNITO MIGRATION:
 * - login()          → Amplify.Auth.signIn(username, password)
 * - changePassword() → Amplify.Auth.changePassword(user, old, new)
 * - refreshToken()   → Amplify.Auth.currentSession() (auto-handled by SDK)
 * - getMe()          → Amplify.Auth.currentAuthenticatedUser()
 * - logout()         → Amplify.Auth.signOut()
 */

import { apiClient } from "./axiosInstance";
import { AUTH_ENDPOINTS } from "../constants/APIEndpoints";
import type {
  LoginResponse,
  ChangePasswordPayload,
  MeResponse,
  RefreshResponse,
} from "../types/Interfaces";


export async function login(
  usernameOrEmail: string,
  password: string
): Promise<LoginResponse> {
  const form = new FormData();
  form.append("username_or_email", usernameOrEmail);
  form.append("password", password);

  const { data } = await apiClient.post<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    form
  );
  return data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ ok: boolean }> {
  const { data } = await apiClient.post<{ ok: boolean }>(
    AUTH_ENDPOINTS.CHANGE_PASSWORD,
    payload
  );
  return data;
}

export async function refreshToken(): Promise<RefreshResponse> {
  const { data } = await apiClient.post<RefreshResponse>(
    AUTH_ENDPOINTS.REFRESH
  );
  return data;
}


export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>(AUTH_ENDPOINTS.ME);
  return data;
}


export async function logoutApi(): Promise<{ ok: boolean }> {
  const { data } = await apiClient.post<{ ok: boolean }>(AUTH_ENDPOINTS.LOGOUT);
  return data;
}
