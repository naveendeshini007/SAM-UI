// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { organizationService } from '../services/api';
// import type { OrganizationDetail } from '../types/Interfaces';

// export default function OrganizationDetails() {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [data, setData] = useState<OrganizationDetail | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (id) fetchDetails(id);
//     }, [id]);

//     const fetchDetails = async (orgId: string) => {
//         try {
//             const result = await organizationService.getOrganizationById(orgId);
//             setData(result);
//         } catch (error) {
//             console.error("Error fetching details", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (isLoading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse">Loading Details...</div>;
//     if (!data) return <div className="p-20 text-center text-red-500">Organization not found.</div>;

//     return (
//         <div className="flex h-screen bg-gray-50 overflow-hidden">
//             {/* Sidebar (Reusable Component logic) */}
//             <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col">
//                 <div className="p-6 bg-slate-950 font-bold text-xl border-b border-slate-800">SAM</div>
//                 <nav className="mt-6 px-4 flex-1">
//                     <div className="p-3 bg-blue-600 rounded-lg cursor-pointer">Organizations</div>
//                 </nav>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 flex flex-col overflow-hidden">
//                 <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
//                     <div className="flex items-center space-x-3">
//                         <div className="text-right">
//                             <p className="text-sm font-bold text-gray-900">Pavani Aindla</p>
//                             <p className="text-[10px] uppercase text-gray-400 font-bold">User</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">P</div>
//                     </div>
//                 </header>

//                 <div className="flex-1 overflow-y-auto p-6 lg:p-12">
//                     {/* Navigation Back */}
//                     <Link to="/organizations" className="flex items-center text-blue-600 font-bold text-sm mb-6 hover:underline">
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
//                         Back to Organizations
//                     </Link>

//                     <h1 className="text-3xl font-black text-slate-900">{data.org_name}</h1>
//                     <p className="text-gray-500 font-bold mt-1 mb-10">Organization ID: {id}</p>

//                     <div className="max-w-4xl space-y-6">
//                         {/* Basic Information Card */}
//                         <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//                             <h3 className="text-lg font-black text-slate-800 mb-6">Basic Information</h3>
//                             <div className="grid grid-cols-2 gap-y-8">
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Organization Name</p>
//                                     <p className="font-bold text-slate-700">{data.org_name}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">DUNS Number</p>
//                                     <p className="font-bold text-slate-700">{data.duns}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">CAGE Code</p>
//                                     <p className="font-bold text-slate-700">{data.cage}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business Type</p>
//                                     <p className="font-bold text-slate-700">{data.type}</p>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Address Card */}
//                         <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//                             <h3 className="text-lg font-black text-slate-800 mb-6">Address</h3>
//                             <div className="grid grid-cols-2 gap-y-8">
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</p>
//                                     <p className="font-bold text-slate-700">{data.city}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">State</p>
//                                     <p className="font-bold text-slate-700">{data.state}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Country</p>
//                                     <p className="font-bold text-slate-700">{data.country}</p>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Registration Information Card */}
//                         <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//                             <h3 className="text-lg font-black text-slate-800 mb-6">Registration Information</h3>
//                             <div className="grid grid-cols-2 gap-y-8">
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
//                                     <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
//                                         {data.status}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registration Date</p>
//                                     <p className="font-bold text-slate-700">{data.registration_date}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Updated</p>
//                                     <p className="font-bold text-slate-700">{data.last_updated}</p>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Download Section */}
//                         <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//                             <h3 className="text-lg font-black text-slate-800 mb-6">Download</h3>
//                             <div className="flex space-x-4">
//                                 <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-blue-700 transition-all">
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
//                                     Download as CSV
//                                 </button>
//                                 <button className="border border-gray-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-gray-50 transition-all">
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
//                                     Download as JSON
//                                 </button>
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { organizationService } from '../services/api';
// import type { OrganizationDetail } from '../types/Interfaces';

// export default function OrganizationDetails() {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [data, setData] = useState<OrganizationDetail | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
    
//     // Dropdown State
//     const [isDownloadOpen, setIsDownloadOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsDownloadOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     useEffect(() => {
//         if (id) fetchDetails(id);
//     }, [id]);

//     const fetchDetails = async (orgId: string) => {
//         try {
//             const result = await organizationService.getOrganizationById(orgId);
//             setData(result);
//         } catch (error) {
//             console.error("Error fetching details", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDownload = (type: 'csv' | 'excel') => {
//         console.log(`Downloading ${type} for ID: ${id}`);
//         setIsDownloadOpen(false);
//         // Backend integration point for downloads
//     };

//     if (isLoading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse uppercase tracking-widest">Loading Organization Details...</div>;
//     if (!data) return <div className="p-20 text-center text-red-500 font-bold">Organization not found.</div>;

//     return (
//         <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
//             {/* Sidebar (Existing logic) */}
//             <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col shrink-0 shadow-2xl">
//                 <div className="p-6 bg-slate-950 flex items-center space-x-3 border-b border-slate-800">
//                     <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">S</div>
//                     <span className="text-xl font-bold tracking-tight">SAM.gov</span>
//                 </div>
//                 <nav className="mt-6 px-4 flex-1">
//                     <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg cursor-pointer font-bold text-sm">
//                         Organizations
//                     </div>
//                 </nav>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 flex flex-col overflow-hidden">
//                 {/* Navbar */}
//                 <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shrink-0">
//                     <div className="flex items-center space-x-4">
//                         <div className="text-right">
//                             <p className="text-sm font-bold text-gray-900 leading-none">Pavani Aindla</p>
//                             <p className="text-[10px] uppercase text-gray-400 font-black tracking-wider mt-1">User</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">P</div>
//                     </div>
//                 </header>

//                 <div className="flex-1 overflow-y-auto p-6 lg:p-12">
//                     {/* Back Link */}
//                     <Link to="/organizations" className="inline-flex items-center text-blue-600 font-bold text-xs mb-8 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
//                         BACK TO ORGANIZATIONS
//                     </Link>

//                     {/* Header with Top-Right Download */}
//                     <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
//                         <div>
//                             <h1 className="text-4xl font-black text-slate-900 tracking-tight">{data.org_name}</h1>
//                             <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-wider">Organization ID: <span className="text-slate-800">{id}</span></p>
//                         </div>

//                         {/* DOWNLOAD DROPDOWN */}
//                         <div className="relative" ref={dropdownRef}>
//                             <button 
//                                 onClick={() => setIsDownloadOpen(!isDownloadOpen)}
//                                 className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
//                             >
//                                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
//                                 Download
//                                 <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDownloadOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
//                             </button>

//                             {/* Dropdown Menu */}
//                             {isDownloadOpen && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
//                                     <button 
//                                         onClick={() => handleDownload('csv')}
//                                         className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors"
//                                     >
//                                         <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
//                                         Download as CSV
//                                     </button>
//                                     <button 
//                                         onClick={() => handleDownload('excel')}
//                                         className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors border-t border-gray-50"
//                                     >
//                                         <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                                         Download as Excel
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="max-w-5xl space-y-6">
//                         {/* Information Cards (Consistent with previous design) */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             {/* Card 1: Basic Info */}
//                             <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
//                                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-2">Basic Information</h3>
//                                 <div className="grid grid-cols-2 gap-y-10">
//                                     <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</p><p className="font-bold text-slate-800">{data.org_name}</p></div>
//                                     <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">DUNS</p><p className="font-bold text-slate-800">{data.duns}</p></div>
//                                     <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CAGE</p><p className="font-bold text-slate-800">{data.cage}</p></div>
//                                     <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Type</p><p className="font-bold text-slate-800">{data.type}</p></div>
//                                 </div>
//                             </section>

//                             {/* Card 2: Address */}
//                             <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
//                                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-2">Location Details</h3>
//                                 <div className="grid grid-cols-2 gap-y-10">
//                                     <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">City</p><p className="font-bold text-slate-800">{data.city}</p></div>
//                                     <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">State</p><p className="font-bold text-slate-800">{data.state}</p></div>
//                                     <div className="col-span-2"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Country</p><p className="font-bold text-slate-800">{data.country}</p></div>
//                                 </div>
//                             </section>
//                         </div>
                        

//                         {/* Registration Card (Full Width) */}
//                         <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//                             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-2">Registration Status</h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-6">
//                                 <div>
//                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Status</p>
//                                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${data.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
//                                         {data.status}
//                                     </span>
//                                 </div>
//                                 <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registered On</p><p className="font-bold text-slate-800">{data.registration_date}</p></div>
//                                 <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Sync</p><p className="font-bold text-slate-800">{data.last_updated}</p></div>
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { organizationService } from '../services/api';
import type { OrganizationDetail } from '../types/Interfaces';

export default function OrganizationDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<OrganizationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Dropdown State
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDownloadOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (id) fetchDetails(id);
    }, [id]);

    const fetchDetails = async (orgId: string) => {
        try {
            const result = await organizationService.getOrganizationById(orgId);
            setData(result);
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (type: 'csv' | 'excel') => {
        console.log(`Downloading ${type} for ID: ${id}`);
        setIsDownloadOpen(false);
    };

    if (isLoading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse uppercase tracking-widest">Loading Organization Details...</div>;
    if (!data) return <div className="p-20 text-center text-red-500 font-bold">Organization not found.</div>;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col shrink-0 shadow-2xl">
                <div className="p-6 bg-slate-950 flex items-center space-x-3 border-b border-slate-800">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">S</div>
                    <span className="text-xl font-bold tracking-tight">SAM.gov</span>
                </div>
                <nav className="mt-6 px-4 flex-1">
                    <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg cursor-pointer font-bold text-sm">
                        Organizations
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shrink-0">
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 leading-none">Pavani Aindla</p>
                            <p className="text-[10px] uppercase text-gray-400 font-black tracking-wider mt-1">User</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">P</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12">
                    {/* Back Link */}
                    <Link to="/organizations" className="inline-flex items-center text-blue-600 font-bold text-xs mb-8 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        BACK TO ORGANIZATIONS
                    </Link>

                    {/* Header with Top-Right Download */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{data.org_name}</h1>
                            <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-wider">Organization ID: <span className="text-slate-800">{id}</span></p>
                        </div>

                        {/* DOWNLOAD DROPDOWN */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                                <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDownloadOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDownloadOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                                    <button onClick={() => handleDownload('csv')} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors">
                                        Download as CSV
                                    </button>
                                    <button onClick={() => handleDownload('excel')} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors border-t border-gray-50">
                                        Download as Excel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-5xl space-y-8">
                        {/* 1. Basic Information Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Organization Name</p><p className="font-bold text-slate-800 text-lg">{data.org_name}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">DUNS Number</p><p className="font-bold text-slate-800 text-lg">{data.duns}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CAGE Code</p><p className="font-bold text-slate-800 text-lg">{data.cage}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Type</p><p className="font-bold text-slate-800 text-lg">{data.type}</p></div>
                            </div>
                        </div>

                        {/* 2. Address Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-2">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">City</p><p className="font-bold text-slate-800 text-lg">{data.city}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">State</p><p className="font-bold text-slate-800 text-lg">{data.state}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Country</p><p className="font-bold text-slate-800 text-lg">{data.country}</p></div>
                            </div>
                        </div>

                        {/* 3. Registration Information Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-2">Registration Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${data.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                        {data.status}
                                    </span>
                                </div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Registration Date</p><p className="font-bold text-slate-800 text-lg">{data.registration_date}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Updated</p><p className="font-bold text-slate-800 text-lg">{data.last_updated}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}