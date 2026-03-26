import React from 'react';

interface StatusBadgeProps {
  value: string;
}

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100',
  inactive: 'bg-red-50 text-red-600 border border-red-200 ring-1 ring-red-100',
  pending:  'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100',
  expired:  'bg-gray-100 text-gray-500 border border-gray-200',
};

const STATUS_DOTS: Record<string, string> = {
  active:   'bg-emerald-500',
  inactive: 'bg-red-500',
  pending:  'bg-amber-500',
  expired:  'bg-gray-400',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ value }) => {
  const key = value.toLowerCase();
  const badgeClass = STATUS_STYLES[key] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
  const dotClass   = STATUS_DOTS[key]  ?? 'bg-gray-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {value}
    </span>
  );
};