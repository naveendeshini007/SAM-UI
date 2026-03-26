import React, { useState, useRef, useEffect } from 'react';
import type { DownloadFormat } from '../types/Interfaces';

interface DownloadButtonProps {
  onDownload: (format: DownloadFormat) => void;
  isLoading?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (format: DownloadFormat) => {
    onDownload(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isLoading}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1.5 overflow-hidden">
          {(['csv', 'excel'] as DownloadFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleSelect(fmt)}
              className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2.5"
            >
              <span className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-[10px] font-black text-gray-500">
                {fmt === 'csv' ? 'CSV' : 'XLS'}
              </span>
              Download as {fmt === 'csv' ? 'CSV' : 'Excel'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};