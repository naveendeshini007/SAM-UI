import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SamDownloadPage from "../pages/SamDataDownload";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sam-download" element={<SamDownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
}