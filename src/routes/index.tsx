/**
 * Application route definitions.
 *
 * Route structure:
 *
 *  /login              → LoginPage        (public — redirects to / if already authenticated)
 *
 *  [ProtectedRoute]    → requires any valid accessToken
 *    /                 → Home             (in-progress by other dev — do not modify)
 *
 *  [AdminRoute]        → requires accessToken AND is_admin === true
 *    /dashboard        → DashboardPage    (admin: create users, manage, view events)
 *
 *  *                   → redirect to /
 *
 * Note: BrowserRouter lives in App.tsx (wrapping AuthProvider which needs navigate).
 */

import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import Home from "../pages/Home";
import SamDownloadPage from "../pages/SamDataDownload";
import DashboardPage from "../pages/DashboardPage";
import { ProtectedRoute, AdminRoute } from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected: any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/sam-download" element={<SamDownloadPage />} />
      </Route>

      {/* Admin only */}
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
