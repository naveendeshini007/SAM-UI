import axios from "axios";
import type { AuthResponse, TableHeadersResponse, Organization, FilterParams, OrganizationDetail} from "../types/Interfaces";
import { ENDPOINTS } from "../constants/APIEndpoints";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH SERVICE ---
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulate Backend Delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Mock Success Response
    return {
      token: "mock-jwt-token-123",
      user: {
        id: "1",
        email: email,
        name: "Pavani Aindla", // Match your screenshot
        role: "admin"
      }
    };
  },
};

// --- ORGANIZATION SERVICE ---
export const organizationService = {
  // 1. Fetch dynamic headers from your Python backend
  getHeaders: async (tableName: string): Promise<TableHeadersResponse> => {
    // REAL CALL (Uncomment when backend is ready):
    // const response = await API.get(ENDPOINTS.TABLE_HEADERS(tableName));
    // return response.data;

    await new Promise(r => setTimeout(r, 500));
    return {
      table_name: tableName,
      columns: [
        { table_header_id: 1, table_name: 'organizations', column_name: 'org_name', display_name: 'Organization Name', order: 1, is_visible: true },
        { table_header_id: 2, table_name: 'organizations', column_name: 'duns', display_name: 'DUNS Number', order: 2, is_visible: true },
        { table_header_id: 3, table_name: 'organizations', column_name: 'cage', display_name: 'CAGE Code', order: 3, is_visible: true },
        { table_header_id: 4, table_name: 'organizations', column_name: 'city', display_name: 'City', order: 4, is_visible: true },
        { table_header_id: 5, table_name: 'organizations', column_name: 'state', display_name: 'State', order: 5, is_visible: true },
        { table_header_id: 6, table_name: 'organizations', column_name: 'type', display_name: 'Business Type', order: 6, is_visible: true },
        { table_header_id: 7, table_name: 'organizations', column_name: 'status', display_name: 'Status', order: 7, is_visible: true },
      ]
    };
  },

  // 2. Fetch the actual list of organizations based on selected filters
  getOrganizations: async (filters: FilterParams): Promise<Organization[]> => {
    // REAL CALL:
    // const response = await API.get(ENDPOINTS.ORGANIZATIONS, { params: filters });
    // return response.data;

    await new Promise(r => setTimeout(r, 800));
    return [
      { org_name: "TechCorp Solutions Inc.", duns: "123456789", cage: "3BT45", city: "San Francisco", state: "CA", type: "Small Business", status: "Active" },
      { org_name: "Global Industries Ltd.", duns: "987654321", cage: "5KL29", city: "New York", state: "NY", type: "Large Business", status: "Active" },
      { org_name: "Infrastructure Partners", duns: "456789012", cage: "7HM34", city: "Austin", state: "TX", type: "Government Contractor", status: "Active" },
      { org_name: "Digital Innovations Corp", duns: "321654987", cage: "2WX89", city: "Seattle", state: "WA", type: "Small Business", status: "Pending" },
      { org_name: "Enterprise Solutions LLC", duns: "789012345", cage: "4QR67", city: "Boston", state: "MA", type: "Large Business", status: "Active" },
    ];
  },

  getOrganizationById: async (id: string): Promise<OrganizationDetail> => {
    // REAL CALL: const response = await API.get(ENDPOINTS.ORGANIZATION_DETAILS(id));
    // return response.data;

    await new Promise(r => setTimeout(r, 600));
    return {
      id: id,
      org_name: "TechCorp Solutions Inc.",
      duns: "123456789",
      cage: "3BT45",
      type: "Small Business",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      status: "Active",
      registration_date: "January 15, 2023",
      last_updated: "March 10, 2024"
    };
  }

};

export default API;