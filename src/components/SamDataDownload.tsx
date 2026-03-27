import React, { useEffect, useState } from "react";
import { downloadSamData } from "../services/SamDownloadService";
import { toast } from "react-toastify";
import type { SamApiResponse, Month } from "../types/Interfaces";
import { allMonths } from "../constants/months";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const getLatestSamDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);

  const firstSunday =
    firstDay.getDate() + ((7 - firstDay.getDay()) % 7);

  const firstSundayDate = new Date(year, month, firstSunday);

  if (today < firstSundayDate) {
    const prev = new Date(year, month - 1, 1);
    return {
      year: prev.getFullYear(),
      month: prev.getMonth() + 1,
    };
  }

  return {
    year,
    month: month + 1,
  };
};

export const SamDownload: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const latest = getLatestSamDate();

  const [year, setYear] = useState<number>(latest.year);
  const [month, setMonth] = useState<number>(latest.month);
  const [availableMonths, setAvailableMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SamApiResponse | null>(null);

  const years: number[] = [];
  for (let y = latest.year; y >= 2021; y--) {
    years.push(y);
  }

  useEffect(() => {
    if (year === latest.year) {
      setAvailableMonths(
        allMonths.filter((m) => m.value <= latest.month)
      );
    } else {
      setAvailableMonths(allMonths);
    }
  }, [year]);

  useEffect(() => {
    setData(null);
  }, [year, month]);

  const handleDownload = async (): Promise<void> => {
  try {
    setLoading(true);

    toast.info(
      "Download started. Running in background. You can continue working."
    );

    const response = await downloadSamData(year, month);

    setData(response);

    if (response.data.status === "already_exists") {
      toast.info("File already exists");
    }

    if (response.data.status === "downloaded") {
      toast.success("File downloaded successfully");
    }

    if (response.data.status === "extracted_existing_zip") {
      toast.success("File extracted successfully");
    }

    if (response.data.status === "file_not_available") {
      toast.warning("File not available");
    }

  } catch (err: any) {
    toast.error("Download failed");
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative">

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1">
          SAM Data Download
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Download and extract SAM monthly data
        </p>

        {/* Year */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Year
          </label>

          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">
            Month
          </label>

          <select
            value={month}
            onChange={(e) =>
              setMonth(Number(e.target.value))
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 text-blue-600 text-sm p-3 rounded-lg mb-4">
          Download & extract may take time. Process runs in background.
        </div>

        {/* Button */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          {loading
            ? "Processing..."
            : "Download & Extract"}
        </button>
      </div>
    </div>
  );
};