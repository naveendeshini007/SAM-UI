/**
 * Route guard components.
 *
 * ProtectedRoute — requires any authenticated user (valid accessToken in context).
 *   Redirects to /login if not authenticated.
 *   Shows a loading spinner while AuthContext is resolving the session.
 *
 * AdminRoute — extends ProtectedRoute by also requiring is_admin === true.
 *   Redirects non-admin authenticated users to / (Home).
 *
 * Usage in routes/index.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/" element={<Home />} />
 *   </Route>
 *   <Route element={<AdminRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}


export function ProtectedRoute() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!accessToken) return <Navigate to="/login" replace />;

  return <Outlet />;
}



export function AdminRoute() {
  const { accessToken, user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  // Not authenticated at all
  if (!accessToken) return <Navigate to="/login" replace />;

  // Authenticated but not admin — send to home
  if (!user?.is_admin) return <Navigate to="/" replace />;

  return <Outlet />;
}
