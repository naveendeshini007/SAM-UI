import axios, { type AxiosRequestConfig, isAxiosError } from 'axios';


export class ApiError extends Error {
  public readonly status: number;
  public readonly detail: string;

  constructor(status: number, detail: string) {
    super(detail);

    this.status = status;
    this.detail = detail;
    this.name = 'ApiError';
  }
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise errors into ApiError
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const detail: string =
        error.response?.data?.detail ??
        error.message ??
        `HTTP ${status}`;
      return Promise.reject(new ApiError(status, detail));
    }
    return Promise.reject(error);
  },
);


type Params = Record<string, string | number | boolean | null | undefined>;

const cleanParams = (params?: Params): Params | undefined => {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined,
    ),
  );
};


export const apiClient = {
  get: <T>(path: string, config?: AxiosRequestConfig & { params?: Params }) =>
    axiosInstance
      .get<T>(path, { ...config, params: cleanParams(config?.params) })
      .then((res) => res.data),

  post: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    axiosInstance
      .post<T>(path, body, config)
      .then((res) => res.data),

  put: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    axiosInstance
      .put<T>(path, body, config)
      .then((res) => res.data),

  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    axiosInstance
      .delete<T>(path, config)
      .then((res) => res.data),
};