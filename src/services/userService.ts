/**
 * User management service functions (admin-only).
 * Covers: create, list, get by ID, soft-delete, auth events.
 *
 * All endpoints require a valid admin Bearer token (auto-attached by interceptor).
 *
 * FUTURE COGNITO/MESSAGING MIGRATION:
 * - createUser: use Cognito admin_create_user + SES to email temp password
 *   instead of returning temp_password in the API response
 * - listUsers / getUser: can remain as-is or pull from Cognito user pool
 * - deleteUser: consider Cognito admin_disable_user / admin_delete_user
 */

import { apiClient } from "./axiosInstance";
import { USER_ENDPOINTS } from "../constants/APIEndpoints";
import type {
  CreateUserPayload,
  CreateUserResponse,
  UserRecord,
  AuthEvent,
  ListUsersParams,
  ListEventsParams,
} from "../types/Interfaces";


export async function createUser(
  payload: CreateUserPayload
): Promise<CreateUserResponse> {
  const { data } = await apiClient.post<CreateUserResponse>(
    USER_ENDPOINTS.CREATE,
    payload
  );
  return data;
}

export async function listUsers(params: ListUsersParams): Promise<UserRecord[]> {
  const { data } = await apiClient.get<UserRecord[]>(USER_ENDPOINTS.LIST, {
    params: {
      limit: params.limit,
      offset: params.offset,
      ...(params.search_query ? { search_query: params.search_query } : {}),
    },
  });
  return data;
}

export async function getUser(userId: string): Promise<UserRecord> {
  const { data } = await apiClient.get<UserRecord>(
    USER_ENDPOINTS.GET_BY_ID(userId)
  );
  return data;
}

export async function deleteUser(userId: string): Promise<{ ok: boolean }> {
  const { data } = await apiClient.delete<{ ok: boolean }>(
    USER_ENDPOINTS.DELETE(userId)
  );
  return data;
}

export async function getAuthEvents(params: ListEventsParams): Promise<AuthEvent[]> {
  const { data } = await apiClient.get<AuthEvent[]>(USER_ENDPOINTS.AUTH_EVENTS, {
    params: {
      limit: params.limit,
      offset: params.offset,
      ...(params.search_query ? { search_query: params.search_query } : {}),
    },
  });
  return data;
}
