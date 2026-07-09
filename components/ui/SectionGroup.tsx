import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionGroupProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

export const SectionGroup: React.FC<SectionGroupProps> = ({ title, icon, children, defaultExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="mb-8">
            <div 
                className="flex items-center mb-4 cursor-pointer group select-none" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {icon}
                    <h2>{title}</h2>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-4 transition-colors group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50"></div>
                <button 
                    className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                    aria-label={isExpanded ? "Collapse section" : "Expand section"}
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
            
            <div className={`transition-all duration-500 ease-in-out origin-top ${isExpanded ? 'opacity-100 scale-y-100 max-h-[20000px]' : 'opacity-0 scale-y-0 max-h-0 overflow-hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
