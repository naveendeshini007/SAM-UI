import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from '../components/SideBar';
import { TopBar } from '../components/TopBar';
import { FilterBar } from '../components/FilterBar';
import { OrganizationsTable } from '../components/OrganizationsTable';
import { fetchTableHeaders, fetchOrganizations } from '../services/organizationService';
import type { TableHeader, Organization, FilterParams, PaginatedResponse } from '../types/Interfaces';

const TABLE_NAME = 'organizations';

const INITIAL_FILTERS: FilterParams = { state: '', city: '', year: '', month: '' };
const INITIAL_PAGE = 1;
const INITIAL_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 400;

export default function Organizations() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [headers, setHeaders] = useState<TableHeader[]>([]);
  const [isLoadingHeaders, setIsLoadingHeaders] = useState(true);
  const [response, setResponse] = useState<PaginatedResponse<Organization> | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');  
  const [searchTerm, setSearchTerm] = useState('');   
  const [filters, setFilters] = useState<FilterParams>(INITIAL_FILTERS);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(INITIAL_PAGE);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoadingHeaders(true);
        const res = await fetchTableHeaders(TABLE_NAME);
        if (!cancelled) {
          setHeaders(res.columns.slice().sort((a, b) => a.order - b.order));
        }
      } catch {
        if (!cancelled) setError('Failed to load table configuration.');
      } finally {
        if (!cancelled) setIsLoadingHeaders(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoadingData(true);
        setError(null);
        const result = await fetchOrganizations({
          search: searchTerm,
          state: filters.state,
          city: filters.city,
          year: filters.year,
          month: filters.month,
          page,
          limit,
        });
        console.log("API Response Data:", result);
        if (!cancelled) setResponse(result);
      } catch {
        if (!cancelled) setError('Failed to load organizations. Please try again.');
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    })();
    return () => { cancelled = true; };
  }, [searchTerm, filters, page, limit]);

  const handleFilterChange = useCallback((updated: FilterParams) => {
    setFilters(updated);
    setPage(INITIAL_PAGE);
  }, []);

  const handleReset = useCallback(() => {
    setSearchInput('');
    setSearchTerm('');
    setFilters(INITIAL_FILTERS);
    setPage(INITIAL_PAGE);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(INITIAL_PAGE);
  }, []);

  const isLoading = isLoadingHeaders || isLoadingData;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          userName="Pavani Aindla"
          userRole="User"
        />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-10 lg:py-8 space-y-5">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight text-center">
                Organizations
              </h1>
            </div>
            {!isLoading && response && (
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm self-start sm:self-auto shrink-0">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-xs font-black text-gray-600">
                  {response.total.toLocaleString()} result{response.total !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* ── Error Banner ─────────────────────────────────────────────── */}
          {error && (
            <div className="flex items-start sm:items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-5 py-3.5 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setFilters({ ...filters })}
                className="ml-auto text-xs font-bold underline hover:no-underline shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Search Bar ───────────────────────────────────────────────── */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search by name, DUNS, city, or state…"
              className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium text-gray-700 placeholder:text-gray-300"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search organizations"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Filter Bar ───────────────────────────────────────────────── */}
          <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

          {/* ── Table + Pagination ───────────────────────────────────────── */}
          <OrganizationsTable
            headers={headers}
            data={response?.data ?? []}
            isLoading={isLoading}
            page={page}
            totalPages={response?.total_pages ?? 1}
            total={response?.total ?? 0}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />

        </div>
      </main>
    </div>
  );
}