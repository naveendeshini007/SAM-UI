export interface ColumnDefinition {
  column_name:  string;
  display_name: string;
  order:        number;
  is_visible:   boolean;
}

export interface TableHeadersResponse {
  table_name: string;
  columns:    ColumnDefinition[];
}

export type TableHeader = ColumnDefinition;

export interface FilterParams {
  state: string;
  city:  string;
  year:  string;
  month: string;
}

export interface PaginationParams {
  page:  number;
  limit: number;
}

export interface PaginatedResponse<T> {
  total:       number;
  page:        number;
  limit:       number;
  total_pages: number;
  data:        T[];
}

export interface Organization {
  record_id:         string;
  organization_name: string | null;
  duns_number:       string | null;
  status_code:       string | null;
  city:              string | null;
  state:             string | null;
  country:           string | null;
  registration_date: string | null;
}

export interface OrganizationDetail {
  record_id:          string;
  duns_number:        string | null;
  organization_name:  string | null;
  status_code:        string | null;
  legal_business_name: string | null;
  division_name:      string | null;
  address_line1:      string | null;
  address_line2:      string | null;
  city:               string | null;
  state:              string | null;
  zip_code:           string | null;
  country:            string | null;
  registration_date:  string | null;
  expiration_date:    string | null;
  website:            string | null;
}

export type DownloadFormat = 'csv' | 'excel';

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
  onUserCreated?: () => void;
}

export interface SamApiResponse {
  message: string;
  data: {
    file_date: string;
    zip_path: string;
    dat_path: string;
    status: string;
  };
};

export interface Month {
  label: string;
  value: number;
};
