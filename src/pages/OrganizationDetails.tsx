import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/SideBar';
import { TopBar } from '../components/TopBar';
import { DetailCard, groupFieldsIntoSections } from '../components/DetailCard';
import { DownloadButton } from '../components/DownloadButton';
import { fetchOrganizationById } from '../services/organizationService';
import type { OrganizationDetail, DownloadFormat } from '../types/Interfaces';


const SECTION_MAP: Array<{ title: string; keys: string[] }> = [
    {
        title: 'Basic Information',
        keys: ['organization_name', 'legal_business_name', 'division_name', 'duns_number'],
    },
    {
        title: 'Address',
        keys: ['address_line1', 'address_line2', 'city', 'state', 'zip_code', 'country'],
    },
    {
        title: 'Registration',
        keys: ['status_code', 'registration_date', 'expiration_date'],
    },
    {
        title: 'Contact & Web',
        keys: ['website'],
    },
];

const LoadingState: React.FC = () => (
    <div className="max-w-5xl space-y-5 animate-pulse">
        <div className="h-9 bg-gray-200 rounded-xl w-72" />
        <div className="h-4 bg-gray-100 rounded-lg w-44" />
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100">
                <div className="h-3 bg-gray-100 rounded w-32 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="space-y-2">
                            <div className="h-2 bg-gray-100 rounded w-20" />
                            <div className="h-5 bg-gray-200 rounded w-36" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-base font-bold text-gray-700">{message}</p>
        <button onClick={onRetry} className="text-sm font-bold text-blue-600 hover:underline">
            Try again
        </button>
    </div>
);

export default function OrganizationDetails() {
    const { id } = useParams<{ id: string }>();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [data, setData] = useState<OrganizationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDetails = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const result = await fetchOrganizationById(id);
            setData(result);
        } catch {
            setError('Failed to load organization details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadDetails(); }, [id]);

    const handleDownload = (format: DownloadFormat) => {
        // TODO: call export endpoint
        console.log(`Export ${format} for record: ${id}`);
    };

    const sections = data
        ? groupFieldsIntoSections(data as unknown as Record<string, unknown>, SECTION_MAP)
        : [];

    const orgTitle = data?.organization_name ?? `Organization ${id}`;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                <TopBar
                    onMenuClick={() => setSidebarOpen(true)}
                    userName="Pavani Aindla"
                    userRole="User"
                />

                <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-10 lg:py-8">
                    {/* Back link */}
                    <div className="flex justify-start mb-6">
                        <Link
                            to="/organizations"
                            className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs -ml-3 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                            </svg>
                            BACK TO ORGANIZATIONS
                        </Link>
                    </div>

                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={loadDetails} />
                    ) : data ? (
                        <div className="max-w-5xl space-y-6">
                            {/* Page Header */}
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    {String(orgTitle)}
                                </h1>
                                <div className="shrink-0">
                                    <DownloadButton onDownload={handleDownload} />
                                </div>
                            </div>

                            {/* Dynamic detail cards */}
                            {sections.map((section) => (
                                <DetailCard key={section.title} section={section} />
                            ))}

                            {sections.length === 0 && (
                                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-sm font-semibold text-gray-400">
                                        No details available for this organization.
                                    </p>
                                </div>
                            )}

                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}