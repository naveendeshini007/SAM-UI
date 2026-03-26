import { apiClient } from './apiClient';
import { TABLE_HEADERS, ORGANIZATIONS_SEARCH, ORGANIZATION_BY_ID, ORGANIZATION_EXPORT } from '../constants/APIEndpoints';
import type {
  TableHeadersResponse,
  Organization,
  OrganizationDetail,
  FilterParams,
  PaginationParams,
  PaginatedResponse,
} from '../types/Interfaces';


export const fetchTableHeaders = async (
  tableName: string,
): Promise<TableHeadersResponse> => {
  return apiClient.get<TableHeadersResponse>(TABLE_HEADERS(tableName));
};


export interface SearchParams extends FilterParams, PaginationParams {
  search: string;
}

export const fetchOrganizations = async (
  params: SearchParams,
): Promise<PaginatedResponse<Organization>> => {
  return apiClient.get<PaginatedResponse<Organization>>(ORGANIZATIONS_SEARCH, {
    params: {
      page:   params.page,
      limit:  params.limit,
      search: params.search  || undefined,
      state:  params.state   || undefined,
      year:   params.year    || undefined,
      month:  params.month   || undefined,
    },
  });
};


export const fetchOrganizationById = async (
  recordId: string,
): Promise<OrganizationDetail> => {
  return apiClient.get<OrganizationDetail>(ORGANIZATION_BY_ID(recordId));
};

export const downloadOrganization = async (recordId: string, format: 'csv' | 'excel') => {
  try {
    // 1. Request the file with responseType 'blob'
    const response = await apiClient.get<Blob>(ORGANIZATION_EXPORT(recordId), {
      params: { format },
      responseType: 'blob',
    });

    // 2. Create a local URL for the downloaded blob
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    
    // 3. Set proper extension
    const extension = format === 'excel' ? 'xlsx' : 'csv';
    link.setAttribute('download', `SAM_Record_${recordId}.${extension}`);
    
    // 4. Trigger click and cleanup
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Unable to download file. Please try again.");
  }
};