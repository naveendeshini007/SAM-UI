import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationService } from '../services/api';
import type { TableHeader, Organization, FilterParams } from '../types/Interfaces';
import { STATES, MONTHS, getYearOptions, CITIES_BY_STATE } from '../utils/filterHelpers';

export default function Organizations() {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [headers, setHeaders] = useState<TableHeader[]>([]);
    const [allData, setAllData] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<FilterParams>({ 
        state: '', city: '', year: '', month: '' 
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const headerRes = await organizationService.getHeaders('organizations');
            setHeaders(headerRes.columns.filter(c => c.is_visible).sort((a, b) => a.order - b.order));
            
            const orgData = await organizationService.getOrganizations(filters);
            setAllData(orgData);
        } catch (err) {
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);
        }
    };

    // SEARCH & FILTER LOGIC
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const matchesSearch = searchTerm === '' || 
                String(item.org_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(item.duns).includes(searchTerm) ||
                String(item.cage).toLowerCase().includes(searchTerm.toLowerCase());

            const matchesState = filters.state === '' || item.state === filters.state;
            const matchesCity = filters.city === '' || item.city === filters.city;

            return matchesSearch && matchesState && matchesCity;
        });
    }, [allData, searchTerm, filters]);

    const handleReset = () => {
        setSearchTerm('');
        setFilters({ state: '', city: '', year: '', month: '' });
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar (Existing) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 bg-slate-950 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">S</div>
                        <span className="text-xl font-bold tracking-tight">SAM.gov</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">✕</button>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <div className="flex items-center p-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg cursor-pointer font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        Organizations
                    </div>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button onClick={() => navigate('/login')} className="flex items-center w-full p-3 text-gray-400 hover:text-white rounded-lg transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m4 4H7" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                    <div className="ml-auto flex items-center space-x-4">
                         <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 leading-none">Pavani Aindla</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">User</p>
                         </div>
                         <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">P</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-10">
                    <header className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Organizations</h1>
                        <p className="text-gray-500 font-medium mt-1">Search and manage organization details</p>
                    </header>

                    {/* NEW Search Bar */}
                    <div className="relative mb-6 max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, DUNS, CAGE code..."
                            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters Section */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Refine Results</h3>
                            <button onClick={handleReset} className="text-xs font-bold text-blue-600 hover:text-blue-700">Clear All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">State</label>
                                <select className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" value={filters.state} onChange={(e) => setFilters({...filters, state: e.target.value, city: ''})}>
                                    <option value="">All States</option>
                                    {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">City</label>
                                <select disabled={!filters.state} className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 transition-all cursor-pointer" value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})}>
                                    <option value="">All Cities</option>
                                    {filters.state && CITIES_BY_STATE[filters.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Year</label>
                                <select className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
                                    <option value="">Select Year</option>
                                    {getYearOptions().map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Month</label>
                                <select disabled={!filters.year} className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 transition-all cursor-pointer" value={filters.month} onChange={(e) => setFilters({...filters, month: e.target.value})}>
                                    <option value="">Select Month</option>
                                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-gray-100">
                                    <tr>
                                        {headers.map(h => (
                                            <th key={h.column_name} className="px-6 py-5 text-[11px] font-black text-slate-800 uppercase tracking-widest bg-slate-50">
                                                {h.display_name}
                                            </th>
                                        ))}
                                        <th className="px-6 py-5 text-[11px] font-black text-slate-800 uppercase tracking-widest bg-slate-50">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        <tr><td colSpan={headers.length + 1} className="p-20 text-center animate-pulse text-gray-400 font-bold">Fetching Data...</td></tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr><td colSpan={headers.length + 1} className="p-20 text-center text-gray-500 font-medium">No organizations found matching your search.</td></tr>
                                    ) : filteredData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                            {headers.map(h => (
                                                <td key={h.column_name} className="px-6 py-5 text-sm font-semibold text-gray-700 whitespace-nowrap">
                                                    {h.column_name === 'status' ? (
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item[h.column_name] === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {String(item[h.column_name])}
                                                        </span>
                                                    ) : String(item[h.column_name] ?? '-')}
                                                </td>
                                            ))}
                                            <td className="px-6 py-5">
                                                <button 
    onClick={() => navigate(`/organizations/${item.id || '1'}`)} // Pass the actual ID from data
    className="bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-sm border border-blue-100"
>
    View Details
</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

