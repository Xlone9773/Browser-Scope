
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface BackendDropdownProps {
    value: string;
    options: {id: string, name: string}[];
    onChange: (id: string) => void;
    colorClass: string; // e.g., 'indigo' or 'purple'
}

export const BackendDropdown: React.FC<BackendDropdownProps> = ({ 
    value, 
    options, 
    onChange, 
    colorClass 
}) => {
    const [isOpen, setIsOpen] = useState(false); // Controls DOM mounting
    const [isVisible, setIsVisible] = useState(false); // Controls CSS opacity/transform
    const [coords, setCoords] = useState({ top: 0, left: 0, minWidth: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selectedName = options.find(o => o.id === value)?.name || value;

    const toggleOpen = () => {
        if (isOpen) {
            close();
        } else {
            open();
        }
    };

    const open = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 6,
                left: rect.left,
                minWidth: rect.width
            });
            setIsOpen(true);
            // Slight delay to allow DOM render before transitioning in
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        }
    };

    const close = () => {
        setIsVisible(false);
        // Wait for animation to finish before unmounting
        setTimeout(() => setIsOpen(false), 200);
    };

    // Handle clicks outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is on the button
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return;
            }
            // Check if click is inside the portal
            const portalEl = document.getElementById('dropdown-portal-container');
            if (portalEl && portalEl.contains(event.target as Node)) {
                return;
            }
            close();
        };

        const handleResizeOrScroll = () => {
            if (isOpen) close();
        };

        window.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResizeOrScroll);
        window.addEventListener('scroll', handleResizeOrScroll, true); 

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResizeOrScroll);
            window.removeEventListener('scroll', handleResizeOrScroll, true);
        };
    }, [isOpen]);

    // Dynamic color maps
    const activeBgMap: Record<string, string> = {
        indigo: 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300',
        purple: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300'
    };
    
    const ringMap: Record<string, string> = {
        indigo: 'focus:ring-indigo-500/50',
        purple: 'focus:ring-purple-500/50'
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleOpen}
                className={`
                    relative flex items-center justify-between gap-2 px-3 py-1.5 min-w-[140px]
                    bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg
                    text-xs font-medium text-slate-600 dark:text-slate-300
                    hover:border-slate-300 dark:hover:border-slate-500 transition-all shadow-sm
                    focus:outline-none focus:ring-2 ${ringMap[colorClass] || ringMap.indigo}
                    ${isOpen ? 'border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-700' : ''}
                `}
            >
                <span className="truncate">{selectedName}</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && createPortal(
                <div 
                    id="dropdown-portal-container"
                    className={`
                        fixed z-[9999] py-1.5
                        bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
                        border border-white/20 dark:border-slate-700/50
                        rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10
                        origin-top transition-all duration-200 ease-out
                        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}
                    `}
                    style={{
                        top: coords.top,
                        left: coords.left,
                        minWidth: coords.minWidth,
                        maxWidth: '300px'
                    }}
                >
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { onChange(opt.id); close(); }}
                            className={`
                                w-full text-left px-3 py-2.5 text-xs flex items-center justify-between
                                transition-colors group
                                ${value === opt.id 
                                    ? (activeBgMap[colorClass] || activeBgMap.indigo) + ' font-semibold' 
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}
                            `}
                        >
                            <span>{opt.name}</span>
                            {value === opt.id && <Check size={12} className="shrink-0 ml-2" />}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
};
