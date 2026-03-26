/**
 * TypeScript interfaces for the SAM application.
 * Mirrors backend Pydantic schemas exactly.
 *
 * FUTURE COGNITO MIGRATION:
 * - AuthUser can be replaced with CognitoUser from @aws-amplify/auth
 * - LoginResponse will come from Amplify.Auth.signIn() result shape
 * - RefreshResponse handled internally by Amplify SDK
 */

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface LoginResponse {
  access_token?: string;
  require_password_change?: boolean;
  id?: string;
  is_admin?: boolean;
}

export interface RefreshResponse {
  access_token: string;
}

export interface MeResponse {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface ChangePasswordPayload {
  username_or_email?: string;
  old_password?: string;
  new_password: string;
}


export interface CreateUserPayload {
  username: string;
  email: string;
  full_name: string;
}

export interface CreateUserResponse {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  temp_password: string;
}

export interface UserRecord {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  must_change_password: boolean;
  is_active: boolean;
  created_by_admin_id: string | null;
  last_login_at: string | null;
  created_at: string | null;
}

export interface AuthEvent {
  auth_event_id: string;
  app_user_type: string;
  app_user_id: string;
  event_type: string;
  note: string | null;
  success: boolean;
  happened_at: string | null;
  session_id: string | null;
  related_event_id: string | null;
}


export interface AuthContextValue {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: AuthUser | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

export interface ChangePasswordFormProps {
  mode: "first-login" | "authenticated";
  usernameOrEmail?: string;
  onFirstLoginSuccess?: () => void;
  onSuccess?: () => void;
}


export interface CreateUserFormProps {
  /** Called after a user is successfully created */
  onUserCreated?: () => void;
}