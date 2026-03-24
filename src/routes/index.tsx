// src/routes/index.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Organizations from "../pages/Organizations";
import OrganizationDetails from "../pages/OrganizationDetails"; // We will create this next

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/organizations" element={<Organizations />} />
        {/* Dynamic Route for ID */}
        <Route path="/organizations/:id" element={<OrganizationDetails />} /> 
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}