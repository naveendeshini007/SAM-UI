import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoader } from '../context/LoaderContext';
import CreateUserForm from './CreateUserForm';
import ChangePasswordForm from './ChangePasswordForm';
import Pagination from './NewPagination';
import { listUsers, getAuthEvents, deleteUser } from '../services/userService';
import type { UserRecord, AuthEvent } from '../types/Interfaces';
import NewUserButton from './NewUserButton';

const DEFAULT_PAGE_SIZE = 10;

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export default function AdminUsersPanel() {
  const { showLoader, hideLoader } = useLoader();

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');

  // Users
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Events
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventSearch, setEventSearch] = useState('');
  const [eventPage, setEventPage] = useState(1);
  const [eventPageSize, setEventPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const userDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  const handleUserSearchChange = (value: string) => {
    setUserSearchInput(value);
    if (userDebounceRef.current) clearTimeout(userDebounceRef.current);
    userDebounceRef.current = setTimeout(() => {
      setUserSearch(value);
      setUserPage(1);
    }, 400);
  };

  // eventSearch is set directly by the dropdown in the Events tab

  const fetchUsers = useCallback(async (page: number, pageSize: number, search: string, silent = false) => {
    setLoadingUsers(true);
    setUsersError(null);
    if (!silent) showLoader('Loading users…');
    try {
      const data = await listUsers({ limit: pageSize, offset: (page - 1) * pageSize, search_query: search || undefined });
      setUsers(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setUsersError(axiosErr.response?.data?.detail ?? 'Failed to load users.');
    } finally {
      setLoadingUsers(false);
      if (!silent) hideLoader();
    }
  }, [showLoader, hideLoader]);

  const fetchEvents = useCallback(async (page: number, pageSize: number, search: string, silent = false) => {
    setLoadingEvents(true);
    setEventsError(null);
    if (!silent) showLoader('Loading auth events…');
    try {
      const data = await getAuthEvents({ limit: pageSize, offset: (page - 1) * pageSize, search_query: search || undefined });
      setEvents(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setEventsError(axiosErr.response?.data?.detail ?? 'Failed to load events.');
    } finally {
      setLoadingEvents(false);
      if (!silent) hideLoader();
    }
  }, [showLoader, hideLoader]);

  useEffect(() => { fetchUsers(userPage, userPageSize, userSearch); }, [userPage, userPageSize, userSearch, fetchUsers]);
  useEffect(() => { fetchEvents(eventPage, eventPageSize, eventSearch); }, [eventPage, eventPageSize, eventSearch, fetchEvents]);

  const handleDeactivate = async (userId: string) => {
    setDeletingId(userId);
    showLoader('Deactivating user…');
    try {
      await deleteUser(userId);
      setDeleteConfirmId(null);
      await fetchUsers(userPage, userPageSize, userSearch, true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      alert(axiosErr.response?.data?.detail ?? 'Failed to deactivate user.');
    } finally {
      setDeletingId(null);
      hideLoader();
    }
  };

  const handleUserCreated = async () => {
    setShowCreateUser(false);
    await fetchUsers(userPage, userPageSize, userSearch, false);
  };

  const handlePasswordChanged = () => setShowChangePassword(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {showCreateUser && <CreateUserForm onUserCreated={handleUserCreated} />}
      {showChangePassword && (
        <div className="mb-4">
          <ChangePasswordForm mode="authenticated" onSuccess={handlePasswordChanged} />
        </div>
      )}

      {/* Errors */}
      {activeTab === 'users' && usersError && (
        <div className="mb-4 flex items-start sm:items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-5 py-3.5 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1">{usersError}</span>
        </div>
      )}
      {activeTab === 'events' && eventsError && (
        <div className="mb-4 flex items-start sm:items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-5 py-3.5 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1">{eventsError}</span>
        </div>
      )}

      {/* Search area moved below tabs so it changes per-tab (users vs events) */}

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'events' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Auth Events
          </button>
        </div>

        <div className="ml-4">
          <NewUserButton onUserCreated={handleUserCreated} />
        </div>
      </div>


      {activeTab === 'users' && (
        <>
          {/* Users search (search by name / username / email) */}
          <div className="mb-4">
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search users by name, username or email…"
                className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium text-gray-700 placeholder:text-gray-300"
                value={userSearchInput}
                onChange={(e) => handleUserSearchChange(e.target.value)}
                aria-label="Search users"
              />
            </div>
          </div>
          {/* Users table */}
          {!loadingUsers && users.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No users found.</p>
          )}

          {!loadingUsers && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Username</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Email</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Full Name</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Status</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Last Login</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Created</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.user_id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{u.username}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600">{u.full_name}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs">{formatDate(u.last_login_at)}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs">{formatDate(u.created_at)}</td>
                      <td className="px-4 sm:px-6 py-4">
                        {u.is_active ? (
                          deleteConfirmId === u.user_id ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs text-gray-600">Deactivate?</span>
                              <button onClick={() => handleDeactivate(u.user_id)} disabled={deletingId === u.user_id} className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded">{deletingId === u.user_id ? '…' : 'Yes'}</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">No</button>
                            </span>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(u.user_id)} className="text-xs text-red-500 hover:text-red-700 underline">Deactivate</button>
                          )
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4">
            <Pagination
              pageSize={userPageSize}
              currentCount={users.length}
              currentPage={userPage}
              onPageChange={setUserPage}
              onPageSizeChange={(size) => { setUserPageSize(size); setUserPage(1); }}
            />
          </div>
        </>
      )}

      {activeTab === 'events' && (
        <>
          {/* Events filter dropdown */}
          <div className="mb-4 max-w-xs">
            <label className="block text-xs font-medium text-gray-600 mb-1">Event type</label>
            <select
              value={eventSearch}
              onChange={(e) => { setEventSearch(e.target.value); setEventPage(1); }}
              className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All events</option>
              <option value="login_success">Login success</option>
              <option value="login_failure">Login failure</option>
              <option value="logout">Logout</option>
              <option value="password_change">Password change</option>
              <option value="user_created">User created</option>
              <option value="user_deactivated">User deactivated</option>
            </select>
          </div>

          {/* Events table */}
          {!loadingEvents && events.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No auth events found.</p>
          )}

          {!loadingEvents && events.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Type</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Event</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Result</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">Note</th>
                    <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map((e) => (
                    <tr key={e.auth_event_id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 sm:px-6 py-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${e.app_user_type === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{e.app_user_type}</span></td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 font-medium">{e.event_type}</td>
                      <td className="px-4 sm:px-6 py-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${e.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.success ? 'Success' : 'Failed'}</span></td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs max-w-xs truncate">{e.note ?? '—'}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs">{formatDate(e.happened_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4">
            <Pagination
              pageSize={eventPageSize}
              currentCount={events.length}
              currentPage={eventPage}
              onPageChange={setEventPage}
              onPageSizeChange={(size) => { setEventPageSize(size); setEventPage(1); }}
            />
          </div>
        </>
      )}
    </div>
  );
}
