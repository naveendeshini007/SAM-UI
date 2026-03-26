import React from 'react';
import { StatusBadge } from './StatusBadge';

export interface DetailField {
  label: string;
  value: string | null | undefined;
}

export interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface DetailCardProps {
  section: DetailSection;
}

const STATUS_LABELS = new Set(['Status']);


export const keyToLabel = (key: string): string =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());


export const groupFieldsIntoSections = (
  data: Record<string, unknown>,
  sectionMap: Array<{ title: string; keys: string[] }>,
): DetailSection[] => {
  const EXCLUDED_KEYS = new Set(['record_id']);
  const allKeys = Object.keys(data).filter((k) => !EXCLUDED_KEYS.has(k));
  const assignedKeys = new Set(sectionMap.flatMap((s) => s.keys));

  const sections: DetailSection[] = sectionMap.map(({ title, keys }) => ({
    title,
    fields: keys
      .filter((k) => allKeys.includes(k))
      .map((k) => ({
        label: keyToLabel(k),
        value: data[k] as string | null | undefined,
      })),
  }));

  const overflowKeys = allKeys.filter((k) => !assignedKeys.has(k));
  if (overflowKeys.length > 0) {
    sections.push({
      title: 'Other Information',
      fields: overflowKeys.map((k) => ({
        label: keyToLabel(k),
        value: data[k] as string | null | undefined,
      })),
    });
  }

  return sections.filter((s) => s.fields.length > 0);
};

const FieldValue: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => {
  const display = value !== null && value !== undefined && String(value).trim() !== '' ? String(value) : '—';

  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 truncate">
        {label}
      </p>
      {STATUS_LABELS.has(label) ? (
        <StatusBadge value={display} />
      ) : display.startsWith('http') ? (
        <a
          href={display}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-semibold text-blue-600 hover:underline break-all"
        >
          {display}
        </a>
      ) : (
        <p className="text-[15px] font-semibold text-slate-800 leading-snug break-words">{display}</p>
      )}
    </div>
  );
};

export const DetailCard: React.FC<DetailCardProps> = ({ section }) => (
  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all">
    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.18em] mb-6 pb-3 border-b border-gray-50">
      {section.title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-10">
      {section.fields.map((field) => (
        <FieldValue key={field.label} label={field.label} value={field.value} />
      ))}
    </div>
  </div>
);