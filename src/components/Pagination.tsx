import React, { useMemo } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const LIMIT_OPTIONS = [10, 25, 50, 100] as const;

function buildPageRange(current: number, total: number): (number | -1)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | -1)[] = [1];

  if (current > 3) pages.push(-1); 

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push(-1); 

  pages.push(total);
  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const pages = useMemo(() => buildPageRange(page, totalPages), [page, totalPages]);

  const rangeStart = Math.min((page - 1) * limit + 1, total);
  const rangeEnd   = Math.min(page * limit, total);

  if (totalPages <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 px-1">

      {/* Left: range info + rows-per-page */}
      <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
        <span className="hidden sm:inline">
          Showing <span className="font-bold text-gray-700">{rangeStart}–{rangeEnd}</span> of{' '}
          <span className="font-bold text-gray-700">{total.toLocaleString()}</span> results
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">
            Rows
          </label>
          <select
            id="rows-per-page"
            value={limit}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1); 
            }}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer hover:border-gray-300 transition-colors"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <NavButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </NavButton>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === -1 ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-gray-300 text-sm font-bold select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                p === page
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <NavButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </NavButton>
      </div>
    </div>
  );
};

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ children, disabled, ...rest }) => (
  <button
    {...rest}
    disabled={disabled}
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all font-bold ${
      disabled
        ? 'text-gray-200 cursor-not-allowed'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 active:scale-95'
    }`}
  >
    {children}
  </button>
);