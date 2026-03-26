/**
 * Home page — primary landing page for all authenticated users.
 * NOTE: This page is being developed by another developer.
 * Only the top navigation bar was added here to support logout and
 * admin dashboard access during development/testing.
 * The nav bar can be extracted to a shared Layout component later.
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";

export default function Home() {
  const { user, logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Temporary Nav Bar ── remove or replace with shared Layout later ── */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">SAM</span>

          <div className="flex items-center gap-3">
            {/* Only admins see the Dashboard link */}
            {user?.is_admin && (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium transition-colors"
              >
                Admin Dashboard
              </button>
            )}

            <span className="text-sm text-gray-500 hidden sm:inline">
              {user?.full_name ?? user?.username}
            </span>

            <button
              onClick={async () => {
                showLoader("Signing out…");
                try { await logout(); } finally { hideLoader(); }
              }}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content — other developer's work below ── */}
      <main className="p-6">
        <h1 className="text-2xl font-bold">Home Page 🚀</h1>
      </main>
    </div>
  );
}
