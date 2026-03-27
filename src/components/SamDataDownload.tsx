import React, { useEffect, useState } from "react";
import { downloadSamData } from "../services/SamDownloadService";
import { ToastContainer, toast } from "react-toastify";
import type { SamApiResponse, Month} from "../types/Interfaces";
import "react-toastify/dist/ReactToastify.css";
import { allMonths } from "../constants/months";
import "../styles/SamDataDownload.css";


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

export const SamDownload: React.FC = () => {
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
        toast.warning("File not available for selected month");
      }

    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <ToastContainer position="top-right" />

      <div className="card">
        <h2 className="title">SAM Data</h2>
        <p className="subtitle">
          Download and extract SAM.gov monthly data
        </p>

        {/* Year */}
        <div className="inputGroup">
          <label className="label">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="select"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="inputGroup">
          <label className="label">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="select"
          >
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleDownload}
          className="button"
          disabled={loading}
        >
          {loading ? "Processing..." : "Download & Extract"}
        </button>
      </div>
    </div>
  );
};