/**
 * Re-export the shared axios instance.
 * This file exists for backwards compatibility — all API calls should
 * import from the specific service files (authService, userService).
 */
import { apiClient } from "./axiosInstance";
export default apiClient;