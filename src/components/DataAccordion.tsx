import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, MapPin, ClipboardList, Globe } from 'lucide-react';

const AccordionItem: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void; 
    children: React.ReactNode 
}> = ({ title, icon, isOpen, onToggle, children }) => (
    <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {icon}
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-700">{title}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12 border-t border-slate-50 mt-2">
                {children}
            </div>
        </div>
    </div>
);

export const DynamicDetailAccordion: React.FC<{ data: any }> = ({ data }) => {
    const [openSections, setOpenSections] = useState<string[]>(['Basic Information']);

    const toggleSection = (title: string) => {
        setOpenSections(prev => 
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    // Logic: Define known groups. Anything else goes into "Supplemental"
    const SECTION_GROUPS = [
        {
            title: 'Basic Information',
            icon: <ShieldCheck className="w-5 h-5" />,
            keys: ['organization_name', 'legal_business_name', 'division_name', 'duns_number', 'entity_type']
        },
        {
            title: 'Location Details',
            icon: <MapPin className="w-5 h-5" />,
            keys: ['address_line1', 'address_line2', 'city', 'state', 'zip_code', 'country', 'congressional_district']
        },
        {
            title: 'Registry & Compliance',
            icon: <ClipboardList className="w-5 h-5" />,
            keys: ['status_code', 'registration_date', 'expiration_date', 'activation_date', 'last_update_date', 'fiscal_year_end']
        },
        {
            title: 'Web & Contact',
            icon: <Globe className="w-5 h-5" />,
            keys: ['website', 'email', 'phone']
        }
    ];

    const assignedKeys = new Set(SECTION_GROUPS.flatMap(g => g.keys));
    const supplementalKeys = Object.keys(data).filter(k => 
        !assignedKeys.has(k) && 
        k !== 'record_id' && 
        k !== 'sam_data_id' && 
        typeof data[k] !== 'object'
    );

    const renderField = (key: string, value: any) => (
        <div key={key} className="space-y-1 group">
            <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                {key.replace(/_/g, ' ')}
            </dt>
            <dd className="text-sm font-bold text-slate-700 leading-relaxed break-words">
                {value ? (
                    key.includes('website') ? (
                        <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {value}
                        </a>
                    ) : value
                ) : (
                    <span className="text-slate-300 font-normal">—</span>
                )}
            </dd>
        </div>
    );

    return (
        <div className="space-y-4">
            {SECTION_GROUPS.map(section => (
                <AccordionItem 
                    key={section.title} 
                    title={section.title} 
                    icon={section.icon}
                    isOpen={openSections.includes(section.title)}
                    onToggle={() => toggleSection(section.title)}
                >
                    {section.keys.map(k => renderField(k, data[k]))}
                </AccordionItem>
            ))}

            {supplementalKeys.length > 0 && (
                <AccordionItem 
                    title="Supplemental Data" 
                    icon={<ClipboardList className="w-5 h-5" />}
                    isOpen={openSections.includes('Supplemental Data')}
                    onToggle={() => toggleSection('Supplemental Data')}
                >
                    {supplementalKeys.map(k => renderField(k, data[k]))}
                </AccordionItem>
            )}
        </div>
    );
};