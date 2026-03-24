// src/constants/APIEndpoints.ts
export const ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    TABLE_HEADERS: (tableName: string) => `/table_headers/${tableName}`,
    ORGANIZATIONS: '/organizations',
    ORGANIZATION_DETAILS: (id: string) => `/organizations/${id}`,
};