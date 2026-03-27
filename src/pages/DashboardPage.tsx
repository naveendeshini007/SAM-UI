/**
 * DashboardPage (admin only)
 *
 * Sections:
 * 1. Profile card — current admin's info + logout button
 * 2. Create User — expandable form using CreateUserForm component
 * 3. Users table — searchable + paginated list, with soft-delete (deactivate) action
 * 4. Auth Events — searchable (event_type / success) + paginated table
 *
 * Access: Only admins can reach this page.
 * Non-admin authenticated users are redirected to / by AdminRoute.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";
// import CreateUserForm from "../components/CreateUserForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import Pagination from "../components/NewPagination";
import { listUsers, getAuthEvents, deleteUser } from "../services/userService";
import type { UserRecord, AuthEvent } from "../types/Interfaces";
import NewUserButton  from "../components/NewUserButton";

const DEFAULT_PAGE_SIZE = 10;

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function Badge({ success }: { success: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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

  // ── Users state ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventSearch, setEventSearch] = useState("");
  const [eventSearchInput, setEventSearchInput] = useState("");
  const [eventPage, setEventPage] = useState(1);
  const [eventPageSize, setEventPageSize] = useState(DEFAULT_PAGE_SIZE);

  // ── Deactivation state ────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const userDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUserSearchChange = (value: string) => {
    setUserSearchInput(value);
    if (userDebounceRef.current) clearTimeout(userDebounceRef.current);
    userDebounceRef.current = setTimeout(() => {
      setUserSearch(value);
      setUserPage(1);
    }, 400);
  };

  const handleEventSearchChange = (value: string) => {
    setEventSearchInput(value);
    if (eventDebounceRef.current) clearTimeout(eventDebounceRef.current);
    eventDebounceRef.current = setTimeout(() => {
      setEventSearch(value);
      setEventPage(1);
    }, 400);
  };

  // ── Fetch functions ───────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (
    page: number,
    pageSize: number,
    search: string,
    silent = false,
  ) => {
    setLoadingUsers(true);
    setUsersError(null);
    if (!silent) showLoader("Loading users…");
    try {
      const data = await listUsers({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search_query: search || undefined,
      });
      setUsers(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setUsersError(axiosErr.response?.data?.detail ?? "Failed to load users.");
    } finally {
      setLoadingUsers(false);
      if (!silent) hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchEvents = useCallback(async (
    page: number,
    pageSize: number,
    search: string,
    silent = false,
  ) => {
    setLoadingEvents(true);
    setEventsError(null);
    if (!silent) showLoader("Loading auth events…");
    try {
      const data = await getAuthEvents({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search_query: search || undefined,
      });
      setEvents(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setEventsError(axiosErr.response?.data?.detail ?? "Failed to load events.");
    } finally {
      setLoadingEvents(false);
      if (!silent) hideLoader();
    }
  }, [showLoader, hideLoader]);

  // Re-fetch whenever page / pageSize / search changes
  useEffect(() => {
    fetchUsers(userPage, userPageSize, userSearch);
  }, [userPage, userPageSize, userSearch, fetchUsers]);

  useEffect(() => {
    fetchEvents(eventPage, eventPageSize, eventSearch);
  }, [eventPage, eventPageSize, eventSearch, fetchEvents]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDeactivate = async (userId: string) => {
    setDeletingId(userId);
    showLoader("Deactivating user…");
    try {
      await deleteUser(userId);
      setDeleteConfirmId(null);
      // refresh current page silently (loader already shown above)
      await fetchUsers(userPage, userPageSize, userSearch, true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      alert(axiosErr.response?.data?.detail ?? "Failed to deactivate user.");
    } finally {
      setDeletingId(null);
      hideLoader();
    }
  };

  // const handleUserCreated = async () => {
  //   setShowCreateUser(false);
  //   await fetchUsers(userPage, userPageSize, userSearch, false);
  // };
  const handleUserCreated = async () => {
    // The modal handles its own open/close state.
    // Just silently refresh the users list.
    await fetchUsers(userPage, userPageSize, userSearch, false);
  };

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- Top nav ---- */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
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
      </header> */}

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
        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
        </div> */}

        <NewUserButton onUserCreated={handleUserCreated} />

        {/* ---- Tabs: Users | Events ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center border-b border-gray-200">
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
            {/* Refresh */}
            <div className="ml-auto pr-4 flex items-center">
              <button
                type="button"
                onClick={() => {
                  fetchUsers(userPage, userPageSize, userSearch);
                  fetchEvents(eventPage, eventPageSize, eventSearch);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          <div className="p-6">

            {/* ══════════════ USERS TAB ══════════════ */}
            {activeTab === "users" && (
              <>
                {/* Search bar */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      value={userSearchInput}
                      onChange={(e) => handleUserSearchChange(e.target.value)}
                      placeholder="Search by name, username or email…"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {userSearch && (
                    <button
                      type="button"
                      onClick={() => { setUserSearchInput(""); setUserSearch(""); setUserPage(1); }}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Table */}
                {loadingUsers && (
                  <p className="text-sm text-gray-500 text-center py-8">Loading users…</p>
                )}
                {usersError && (
                  <p className="text-sm text-red-500 text-center py-8">{usersError}</p>
                )}
                {!loadingUsers && !usersError && users.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    {userSearch ? `No users found matching "${userSearch}".` : "No users found."}
                  </p>
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
                          <th className="py-2 px-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                          <tr key={u.user_id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-gray-900">{u.username}</td>
                            <td className="py-2.5 px-3 text-gray-600">{u.email}</td>
                            <td className="py-2.5 px-3 text-gray-600">{u.full_name}</td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
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

                {/* Pagination */}
                <Pagination
                  pageSize={userPageSize}
                  currentCount={users.length}
                  currentPage={userPage}
                  onPageChange={setUserPage}
                  onPageSizeChange={(size) => { setUserPageSize(size); setUserPage(1); }}
                />
              </>
            )}

            {/* ══════════════ EVENTS TAB ══════════════ */}
            {activeTab === "events" && (
              <>
                {/* Search + filter bar */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      value={eventSearchInput}
                      onChange={(e) => handleEventSearchChange(e.target.value)}
                      placeholder="Search by event type or note…"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Quick-filter buttons for common event types */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {["login_success", "login_failure", "logout", "password_change", "user_created", "user_deactivated"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const next = eventSearch === type ? "" : type;
                          setEventSearchInput(next);
                          setEventSearch(next);
                          setEventPage(1);
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                          eventSearch === type
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {type.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>

                  {eventSearch && (
                    <button
                      type="button"
                      onClick={() => { setEventSearchInput(""); setEventSearch(""); setEventPage(1); }}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Table */}
                {loadingEvents && (
                  <p className="text-sm text-gray-500 text-center py-8">Loading events…</p>
                )}
                {eventsError && (
                  <p className="text-sm text-red-500 text-center py-8">{eventsError}</p>
                )}
                {!loadingEvents && !eventsError && events.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    {eventSearch ? `No events found matching "${eventSearch}".` : "No auth events found."}
                  </p>
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
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${e.app_user_type === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
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

                {/* Pagination */}
                <Pagination
                  pageSize={eventPageSize}
                  currentCount={events.length}
                  currentPage={eventPage}
                  onPageChange={setEventPage}
                  onPageSizeChange={(size) => { setEventPageSize(size); setEventPage(1); }}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
