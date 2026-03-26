import { apiClient } from './apiClient';
import { TABLE_HEADERS, ORGANIZATIONS_SEARCH, ORGANIZATION_BY_ID } from '../constants/APIEndpoints';
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