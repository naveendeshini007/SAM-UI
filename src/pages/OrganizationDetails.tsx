import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/SideBar';
import { TopBar } from '../components/TopBar';
import { DynamicDetailAccordion } from '../components/DataAccordion';
import { DownloadButton } from '../components/DownloadButton';
import { downloadOrganization, fetchOrganizationById } from '../services/organizationService';
import type { OrganizationDetail, DownloadFormat } from '../types/Interfaces';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';


const LoadingState: React.FC = () => (
    <div className="w-full space-y-6 animate-pulse px-8">
        <div className="flex justify-between items-center">
            <div className="space-y-3">
                <div className="h-10 bg-slate-200 rounded-xl w-96" />
                <div className="h-4 bg-slate-100 rounded-lg w-48" />
            </div>
            <div className="h-12 bg-slate-200 rounded-xl w-32" />
        </div>
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-white border border-slate-100 rounded-xl w-full" />
            ))}
        </div>
    </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="p-4 bg-red-50 rounded-full border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900">Unable to load record</h3>
            <p className="text-slate-500 mt-1">{message}</p>
        </div>
        <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
            Try Again
        </button>
    </div>
);

export default function OrganizationDetails() {
    const { id } = useParams<{ id: string }>();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [data, setData] = useState<OrganizationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

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

    const handleDownload = async (format: DownloadFormat) => {
        if (!id) return;
        try {
            setIsDownloading(true);
            await downloadOrganization(id, format);
        } catch (err) {
            alert("Failed to generate download. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const orgTitle = data?.organization_name ?? `Organization ${id}`;

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                <TopBar
                    onMenuClick={() => setSidebarOpen(true)}
                    userName="Pavani Aindla"
                    userRole="User"
                />

                <div className="flex-1 overflow-y-auto px-8 py-10">

                    {/* 1. Back Link */}
                    <div className="flex justify-start mb-8">
                        <Link
                            to="/organizations"
                            className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] tracking-[0.2em] transition-all -ml-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                            BACK TO DIRECTORY
                        </Link>
                    </div>

                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={loadDetails} />
                    ) : data ? (
                        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">

                            {/* 2. Hero Row: Title + Download in one line */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                        {orgTitle}
                                    </h1>
                                </div>

                                <div className="flex items-center gap-5 shrink-0">
                                    {isDownloading && (
                                        <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black tracking-widest">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            PREPARING...
                                        </div>
                                    )}
                                    <DownloadButton onDownload={handleDownload} />
                                </div>
                            </div>

                            {/* 3. Dynamic Accordion Content */}
                            <div className="w-full">
                                <DynamicDetailAccordion data={data} />
                            </div>

                            {/* Simple Footer */}
                            <footer className="pt-12 border-t border-slate-100">
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.25em]">
                                    Last Synchronized: {new Date().toLocaleDateString()}
                                </p>
                            </footer>
                        </div>
                    ) : null}
                </div>
            </main >
        </div >
    );
}