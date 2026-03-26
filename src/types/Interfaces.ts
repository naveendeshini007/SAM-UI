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