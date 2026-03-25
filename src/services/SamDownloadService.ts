import axios from "axios";

export type SamApiResponse = {
  message: string;
  data: {
    file_date: string;
    zip_path: string;
    dat_path: string;
    status: string;
  };
};


export const downloadSamData = async (
  year: number,
  month: number
): Promise<SamApiResponse> => {
  try {
    const response = await axios.get<SamApiResponse>(
      "http://localhost:8000/api/v1/sam_data/download",
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