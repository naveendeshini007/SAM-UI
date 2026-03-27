import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { Pagination } from './PaginationOld';
import type { TableHeader, Organization } from '../types/Interfaces';

interface OrganizationsTableProps {
    headers: TableHeader[];
    data: Organization[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const STATUS_COLUMNS = new Set(['status_code']);

const SkeletonRow: React.FC<{ colCount: number }> = ({ colCount }) => (
    <tr>
        {Array.from({ length: colCount + 1 }).map((_, i) => (
            <td key={i} className="px-4 sm:px-6 py-4">
                <div
                    className="h-4 bg-gray-100 rounded-full animate-pulse"
                    style={{ width: i === 0 ? '60%' : i === colCount ? '40%' : '50%' }}
                />
            </td>
        ))}
    </tr>
);

const cellValue = (row: Organization, columnName: string): string => {
    const val = (row as unknown as Record<string, unknown>)[columnName];
    if (val === null || val === undefined || String(val).trim() === '') return '—';
    return String(val);
};

export const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
    headers,
    data,
    isLoading,
    page,
    totalPages,
    total,
    limit,
    onPageChange,
    onLimitChange,
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Scrollable table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[640px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {headers.map((h) => (
                                <th
                                    key={h.column_name}
                                    className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80 whitespace-nowrap"
                                >
                                    {h.display_name}
                                </th>
                            ))}
                            <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            Array.from({ length: limit > 10 ? 10 : limit }).map((_, i) => (
                                <SkeletonRow key={i} colCount={headers.length} />
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length + 1} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-400">No organizations found</p>
                                        <p className="text-xs text-gray-300">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.record_id}
                                    className="hover:bg-blue-50/20 transition-colors group"
                                >
                                    {headers.map((h) => (
                                        <td
                                            key={h.column_name}
                                            className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                                        >
                                            {STATUS_COLUMNS.has(h.column_name) ? (
                                                <StatusBadge value={cellValue(row, h.column_name)} />
                                            ) : (
                                                cellValue(row, h.column_name)
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 sm:px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/organizations/${row.record_id}`)}
                                            className="inline-flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm border border-blue-100 group-hover:border-blue-200 whitespace-nowrap"
                                        >
                                            View
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            {!isLoading && total > 0 && (
                <div className="px-4 sm:px-6 py-3 border-t border-gray-50 bg-slate-50/40">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        limit={limit}
                        onPageChange={onPageChange}
                        onLimitChange={onLimitChange}
                    />
                </div>
            )}
        </div>
    );
};