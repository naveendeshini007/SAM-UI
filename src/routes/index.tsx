import { BrowserRouter, Routes, Route } from "react-router-dom";
import Organizations from "../pages/Organizations";
import OrganizationDetails from "../pages/OrganizationDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/:id" element={<OrganizationDetails />} /> 
      </Routes>
    </BrowserRouter>
  );
}