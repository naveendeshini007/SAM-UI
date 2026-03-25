import React, { useEffect, useState } from "react";
import { downloadSamData } from "../services/SamDownloadService";
import type { SamApiResponse } from "../services/SamDownloadService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Month = {
  label: string;
  value: number;
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

const SamDownloadPage: React.FC = () => {
  const latest = getLatestSamDate();

  const [year, setYear] = useState<number>(latest.year);
  const [month, setMonth] = useState<number>(latest.month);
  const [availableMonths, setAvailableMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SamApiResponse | null>(null);

  const years: number[] = [];
  for (let y = latest.year; y >= 2018; y--) {
    years.push(y);
  }

  const allMonths: Month[] = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

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
    <div style={styles.page}>
      <ToastContainer position="top-right" />

      <div style={styles.card}>
        <h2 style={styles.title}>SAM Data</h2>
        <p style={styles.subtitle}>
          Download and extract SAM.gov monthly data
        </p>

        {/* Year */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={styles.select}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={styles.select}
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
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Processing..." : "Download & Extract"}
        </button>
      </div>
    </div>
  );
};

export default SamDownloadPage;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: "100vh",
    background: "linear-gradient(to right, #eef2ff, #f8fafc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#1e40af",
    marginBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: 500,
    marginBottom: "5px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
  },
};