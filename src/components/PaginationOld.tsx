/**
 * Pagination — reusable page navigation + page-size selector.
 *
 * Because the backend does NOT return a total count, we detect the last page
 * by checking whether currentCount < pageSize (fewer rows than we asked for).
 *
 * Props: see PaginationProps in types/Interfaces.ts
 */

import type { PaginationProps } from "../types/Interfaces";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "../constants/Pagination";

export default function Pagination({
  pageSize,
  currentCount,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentCount < pageSize;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // reset to first page on size change
          }}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        {/* First */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          className="px-2 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          «
        </button>

        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ‹ Prev
        </button>

        {/* Current page badge */}
        <span className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-blue-600 min-w-[2.5rem] text-center select-none">
          {currentPage}
        </span>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
