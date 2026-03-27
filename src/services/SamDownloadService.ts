// import axios from "axios";
// import type { SamApiResponse} from "../types/Interfaces";


// export const downloadSamData = async (
//   year: number,
//   month: number
// ): Promise<SamApiResponse> => {
//   try {
//     const response = await axios.get<SamApiResponse>(
//       "http://localhost:8000/api/v1/sam_data/download",
//       {
//         params: {
//           year,
//           month,
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     throw (
//       error?.response?.data?.detail ||
//       error?.message ||
//       "Something went wrong"
//     );
//   }
// };


import { apiClient } from "./axiosInstance";
import type { SamApiResponse} from "../types/Interfaces";
import { SAM_DATA_DOWNLOAD } from "../constants/APIEndpoints";
 
 
export const downloadSamData = async (
  year: number,
  month: number
): Promise<SamApiResponse> => {
  try {
    const response = await apiClient.get<SamApiResponse>(
      SAM_DATA_DOWNLOAD,
      {
        params: {
          year,
          month,
        },
      }
    );
 
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.detail ||
      error?.message ||
      "Something went wrong"
    );
  }
};