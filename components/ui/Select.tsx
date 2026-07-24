
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
    id: string | number;
    label: string;
    disabled?: boolean;
}

export type SelectColor = 'indigo' | 'purple' | 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'sky' | 'ice' | 'cherry';

export interface SelectProps {
    value: string | number;
    options: SelectOption[];
    onChange: (value: unknown) => void;
    color?: SelectColor;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
    size?: 'sm' | 'md';
}

export const Select: React.FC<SelectProps> = ({ 
    value, 
    options, 
    onChange, 
    color = 'indigo',
    disabled = false,
    className = '',
    fullWidth = true,
    size = 'md'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, minWidth: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const selectedLabel = options.find(o => o.id === value)?.label || value;

    const toggleOpen = () => {
        if (disabled) return;
        if (isOpen) close();
        else open();
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

    // Initialize focused index when select opens
    useEffect(() => {
        if (isOpen) {
            const index = options.findIndex(opt => opt.id === value);
            setFocusedIndex(index >= 0 ? index : 0);
        } else {
            setFocusedIndex(-1);
        }
    }, [isOpen, value, options]);

    // Handle global keyboard events to prevent modal-close / shortcuts and allow select navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Stop propagation for ALL key events to prevent global shortcuts (useKeyboardShortcuts) and modal close (Modal handleKeyDown)
            e.stopPropagation();

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1) % options.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < options.length) {
                    onChange(options[focusedIndex].id);
                    close();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        };

        // Add to capture phase so we intercept before any standard inputs / listeners handle it
        window.addEventListener('keydown', handleGlobalKeyDown, true);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown, true);
        };
    }, [isOpen, focusedIndex, options, onChange]);

    // Handle clicks outside and window events
    useEffect(() => {
        if (!isOpen) return;

        let active = true;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!active) return;
            // Check if click is on the button
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return;
            }
            // Check if click is inside the portal
            const portalEl = document.getElementById('select-portal-container');
            if (portalEl && portalEl.contains(event.target as Node)) {
                return;
            }
            close();
        };

        const handleResize = () => {
            if (isOpen) close();
        };

        const handleScroll = (event: Event) => {
            const portalEl = document.getElementById('select-portal-container');
            // If scrolling inside the dropdown content, do not close
            if (portalEl && portalEl.contains(event.target as Node)) {
                return;
            }
            // Close if scrolling anywhere else (page scroll, modal scroll) as position will drift
            if (isOpen) close();
        };

        // Defer attachment to prevent immediate close due to event bubbling/simulated events on touch screens
        const timer = setTimeout(() => {
            if (!active) return;
            window.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('touchstart', handleClickOutside);
        }, 50);

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true); 

        return () => {
            active = false;
            clearTimeout(timer);
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('touchstart', handleClickOutside);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Dynamic color maps
    const colorStyles = {
        indigo: { 
            active: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300', 
            ring: 'focus:ring-indigo-500/50' 
        },
        purple: { 
            active: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300', 
            ring: 'focus:ring-purple-500/50' 
        },
        blue: { 
            active: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300', 
            ring: 'focus:ring-blue-500/50' 
        },
        emerald: { 
            active: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300', 
            ring: 'focus:ring-emerald-500/50' 
        },
        rose: { 
            active: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300', 
            ring: 'focus:ring-rose-500/50' 
        },
        amber: { 
            active: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300', 
            ring: 'focus:ring-amber-500/50' 
        },
        violet: { 
            active: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300', 
            ring: 'focus:ring-violet-500/50' 
        },
        sky: { 
            active: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300', 
            ring: 'focus:ring-sky-500/50' 
        },
        ice: { 
            active: 'bg-blue-50/70 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300', 
            ring: 'focus:ring-blue-400/50' 
        },
        cherry: { 
            active: 'bg-rose-50/70 text-rose-500 dark:bg-rose-900/20 dark:text-rose-300', 
            ring: 'focus:ring-rose-400/50' 
        }
    };

    const sizeStyles = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm'
    };

    const currentStyle = colorStyles[color] || colorStyles.indigo;

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleOpen}
                disabled={disabled}
                className={`
                    relative flex items-center justify-between gap-2
                    bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg
                    text-slate-700 dark:text-slate-200
                    hover:border-slate-300 dark:hover:border-slate-500 transition-all shadow-sm
                    focus:outline-none focus:ring-2 ${currentStyle.ring}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isOpen ? 'border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-700' : ''}
                    ${fullWidth ? 'w-full' : ''}
                    ${sizeStyles[size]}
                    ${className}
                `}
                type="button"
            >
                <span className="truncate font-medium">{selectedLabel}</span>
                <ChevronDown size={size === 'sm' ? 12 : 14} className={`text-slate-400 transition-transform duration-200 ${isVisible ? 'rotate-180' : ''}`} />
            </button>

            {isOpen ? createPortal(
                <div 
                    id="select-portal-container"
                    className={`
                        fixed z-[9999] py-1.5
                        bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
                        border border-slate-200 dark:border-slate-700
                        rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10
                        origin-top transition-all duration-200 ease-out
                        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}
                    `}
                    style={{
                        top: coords.top,
                        left: coords.left,
                        minWidth: coords.minWidth,
                        maxWidth: Math.max(coords.minWidth, 300)
                    }}
                >
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map((opt, idx) => {
                            const isSelected = value === opt.id;
                            const isFocused = idx === focusedIndex;
                            const isDisabled = opt.disabled;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => { if (isDisabled) return; onChange(opt.id); close(); }}
                                    disabled={isDisabled}
                                    className={`
                                        w-full text-left flex items-center justify-between
                                        transition-colors
                                        ${sizeStyles[size]}
                                        ${isDisabled
                                            ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-500 bg-transparent'
                                            : isSelected 
                                                ? currentStyle.active + ' font-medium' 
                                                : `text-slate-700 dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-700/80 ${isFocused ? 'bg-slate-50/80 dark:bg-slate-700/80' : ''}`}
                                    `}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected ? <Check size={size === 'sm' ? 12 : 14} className="shrink-0 ml-2" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>,
                document.body
            ) : null}
        </>
    );
};
