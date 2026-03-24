// src/types/Interfaces.ts

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// src/types/Interfaces.ts

export interface TableHeader {
  table_header_id: number;
  table_name: string;
  column_name: string;
  display_name: string;
  order: number;
  is_visible: boolean;
}

export interface TableHeadersResponse {
  table_name: string;
  columns: TableHeader[];
}

// src/types/Interfaces.ts

export interface Organization {
  // We specify that the value can be a string, number, boolean, or null.
  // This satisfies the linter while still remaining flexible.
  [key: string]: string | number | boolean | null | undefined;
}

// src/types/Interfaces.ts

// ... (keep your existing interfaces)

export interface FilterParams {
  state: string;
  city: string;
  year: string;
  month: string;
}

export interface OrganizationDetail extends Organization {
  id: string;
  country: string;
  registration_date: string;
  last_updated: string;
}