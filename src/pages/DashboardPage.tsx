/**
 * DashboardPage (admin only)
 *
 * Sections:
 * 1. Profile card — current admin's info + logout button
 * 2. Create User — expandable form using CreateUserForm component
 * 3. Users table — list all users, with soft-delete (deactivate) action
 * 4. Auth Events — recent authentication events table
 *
 * Access: Only admins can reach this page.
 * Non-admin authenticated users are redirected to / by AdminRoute.
 *
 * Data fetching: useEffect on mount for users + events.
 * Users list refreshes after a new user is created or one is deactivated.
 */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";
import CreateUserForm from "../components/CreateUserForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { listUsers, getAuthEvents, deleteUser } from "../services/userService";
import type { UserRecord, AuthEvent } from "../types/Interfaces";



function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function Badge({ success }: { success: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        success
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {success ? "Success" : "Failed"}
    </span>
  );
}


export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  // UI state
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "events">("users");

  // Data
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Deactivation state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);


  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError(null);
    showLoader("Loading users…");
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setUsersError(axiosErr.response?.data?.detail ?? "Failed to load users.");
    } finally {
      setLoadingUsers(false);
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    setEventsError(null);
    showLoader("Loading auth events…");
    try {
      const data = await getAuthEvents();
      setEvents(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setEventsError(axiosErr.response?.data?.detail ?? "Failed to load events.");
    } finally {
      setLoadingEvents(false);
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, [fetchUsers, fetchEvents]);


  const handleDeactivate = async (userId: string) => {
    setDeletingId(userId);
    showLoader("Deactivating user…");
    try {
      await deleteUser(userId);
      setDeleteConfirmId(null);
      await fetchUsers(); // refresh list — fetchUsers will show its own loader
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      alert(axiosErr.response?.data?.detail ?? "Failed to deactivate user.");
    } finally {
      setDeletingId(null);
      hideLoader();
    }
  };

  const handleUserCreated = async () => {
    setShowCreateUser(false);
    await fetchUsers();
  };

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- Top nav ---- */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-900">SAM Admin</span>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Home
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.full_name ?? user?.username}
            </span>
            <button
              onClick={() => setShowChangePassword((v) => !v)}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Change Password
            </button>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {showChangePassword && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ChangePasswordForm
              mode="authenticated"
              onSuccess={handlePasswordChanged}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            My Profile
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Username</dt>
              <dd className="text-sm text-gray-800 font-medium mt-0.5">{user?.username ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</dt>
              <dd className="text-sm text-gray-800 mt-0.5">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</dt>
              <dd className="text-sm text-gray-800 mt-0.5">{user?.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Role</dt>
              <dd className="mt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {user?.is_admin ? "Admin" : "User"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* ---- Create User ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Create New User</h2>
            <button
              type="button"
              onClick={() => setShowCreateUser((v) => !v)}
              className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {showCreateUser ? "Cancel" : "+ New User"}
            </button>
          </div>
          {showCreateUser && (
            <CreateUserForm onUserCreated={handleUserCreated} />
          )}
        </div>

        {/* ---- Tabs: Users | Events ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Users
              {users.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  {users.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "events"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Auth Events
              {events.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  {events.length}
                </span>
              )}
            </button>
            {/* Refresh button */}
            <div className="ml-auto pr-4 flex items-center">
              <button
                type="button"
                onClick={() => {
                  fetchUsers();
                  fetchEvents();
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Refresh
              </button>            </div>
          </div>

          <div className="p-6">
            {/* ---- Users Table ---- */}
            {activeTab === "users" && (
              <>
                {loadingUsers && (
                  <p className="text-sm text-gray-500 text-center py-8">Loading users…</p>
                )}
                {usersError && (
                  <p className="text-sm text-red-500 text-center py-8">{usersError}</p>
                )}
                {!loadingUsers && !usersError && users.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">No users found.</p>
                )}
                {!loadingUsers && !usersError && users.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Login</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                          <th className="py-2 px-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                          <tr key={u.user_id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-gray-900">{u.username}</td>
                            <td className="py-2.5 px-3 text-gray-600">{u.email}</td>
                            <td className="py-2.5 px-3 text-gray-600">{u.full_name}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  u.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {u.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-500 text-xs">{formatDate(u.last_login_at)}</td>
                            <td className="py-2.5 px-3 text-gray-500 text-xs">{formatDate(u.created_at)}</td>
                            <td className="py-2.5 px-3 text-right">
                              {u.is_active && (
                                <>
                                  {deleteConfirmId === u.user_id ? (
                                    <span className="inline-flex items-center gap-2">
                                      <span className="text-xs text-gray-600">Deactivate?</span>
                                      <button
                                        onClick={() => handleDeactivate(u.user_id)}
                                        disabled={deletingId === u.user_id}
                                        className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded transition-colors"
                                      >
                                        {deletingId === u.user_id ? "…" : "Yes"}
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                                      >
                                        No
                                      </button>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => setDeleteConfirmId(u.user_id)}
                                      className="text-xs text-red-500 hover:text-red-700 underline"
                                    >
                                      Deactivate
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* ---- Auth Events Table ---- */}
            {activeTab === "events" && (
              <>
                {loadingEvents && (
                  <p className="text-sm text-gray-500 text-center py-8">Loading events…</p>
                )}
                {eventsError && (
                  <p className="text-sm text-red-500 text-center py-8">{eventsError}</p>
                )}
                {!loadingEvents && !eventsError && events.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">No auth events found.</p>
                )}
                {!loadingEvents && !eventsError && events.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Result</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Note</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">When</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {events.map((e) => (
                          <tr key={e.auth_event_id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                e.app_user_type === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {e.app_user_type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-700 font-medium">{e.event_type}</td>
                            <td className="py-2.5 px-3"><Badge success={e.success} /></td>
                            <td className="py-2.5 px-3 text-gray-500 text-xs max-w-xs truncate">{e.note ?? "—"}</td>
                            <td className="py-2.5 px-3 text-gray-500 text-xs">{formatDate(e.happened_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
