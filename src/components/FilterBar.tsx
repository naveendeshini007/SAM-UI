import React, { useEffect, useRef, useState } from 'react';
import type { FilterParams } from '../types/Interfaces';
import { STATES, MONTHS, getYearOptions, CITIES_BY_STATE } from '../utils/filterHelpers';

interface FilterBarProps {
    filters: FilterParams;
    onChange: (updated: FilterParams) => void;
    onReset: () => void;
}

interface Option {
    value: string | number;
    label: string | number;
}

interface CustomSelectProps {
    value: string | number;
    onChange: (val: string) => void;
    options: Option[];
    placeholder: string;
    disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((option) => String(option.value) === String(value));

    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-sm font-medium outline-none transition-all ${disabled
                    ? 'opacity-40 cursor-not-allowed text-gray-500'
                    : 'cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
                    }`}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                {/* Chevron icon */}
                <svg className={`w-3.5 h-3.5 text-gray-400 shrink-0 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <ul className="max-h-48 overflow-y-auto py-1 text-sm text-gray-700">
                        <li
                            className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-gray-400"
                            onClick={() => { onChange(''); setIsOpen(false); }}
                        >
                            {placeholder}
                        </li>
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                className={`px-3 py-2 cursor-pointer transition-colors ${String(value) === String(opt.value)
                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                    : 'hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                                onClick={() => { onChange(String(opt.value)); setIsOpen(false); }}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onReset }) => {
    const yearOptions = getYearOptions().map(year => ({ label: year, value: year }));

    const cityOptions = filters.state && CITIES_BY_STATE[filters.state]
        ? CITIES_BY_STATE[filters.state].map(city => ({ label: city, value: city }))
        : [];

    return (
        <section className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h18M7 8h10M11 12h2" />
                    </svg>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.18em]">Refine Results</h3>
                </div>
                <button
                    onClick={onReset}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* State */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">State</label>
                    <div className="relative">
                        <CustomSelect
                            value={filters.state}
                            onChange={(val) => onChange({ ...filters, state: val, city: '' })}
                            options={STATES}
                            placeholder="All States"
                        />
                    </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">City</label>
                    <CustomSelect
                        value={filters.city}
                        onChange={(val) => onChange({ ...filters, city: val })}
                        options={cityOptions}
                        placeholder="All Cities"
                        disabled={!filters.state}
                    />
                </div>

                {/* Year */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">Year</label>
                    <CustomSelect
                        value={filters.year}
                        onChange={(val) => onChange({ ...filters, year: val, month: '' })}
                        options={yearOptions}
                        placeholder="All Years"
                    />
                </div>

                {/* Month */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">Month</label>
                    <CustomSelect
                        value={filters.month}
                        onChange={(val) => onChange({ ...filters, month: val })}
                        options={MONTHS}
                        placeholder="All Months"
                        disabled={!filters.year}
                    />
                </div>
            </div>
        </section>
    );
}