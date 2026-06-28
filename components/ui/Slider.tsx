import React, { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    subLabel?: string;
    min?: number;
    max?: number;
    step?: number;
    color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue' | 'violet';
    formatValue?: (val: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    label,
    subLabel,
    min = 0,
    max = 100,
    step = 1,
    color = 'indigo',
    formatValue,
    className = '',
    disabled = false,
    ...props
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const colorMaps = {
        indigo: {
            track: 'bg-indigo-600 dark:bg-indigo-500',
            thumb: 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:ring-indigo-500/50',
            text: 'text-indigo-600 dark:text-indigo-400'
        },
        emerald: {
            track: 'bg-emerald-500 dark:bg-emerald-400',
            thumb: 'bg-emerald-500 dark:bg-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-300 focus:ring-emerald-500/50',
            text: 'text-emerald-500 dark:text-emerald-400'
        },
        rose: {
            track: 'bg-rose-500 dark:bg-rose-400',
            thumb: 'bg-rose-500 dark:bg-rose-400 hover:bg-rose-600 dark:hover:bg-rose-300 focus:ring-rose-500/50',
            text: 'text-rose-500 dark:text-rose-400'
        },
        amber: {
            track: 'bg-amber-500 dark:bg-amber-400',
            thumb: 'bg-amber-500 dark:bg-amber-400 hover:bg-amber-600 dark:hover:bg-amber-300 focus:ring-amber-500/50',
            text: 'text-amber-500 dark:text-amber-400'
        },
        blue: {
            track: 'bg-blue-600 dark:bg-blue-500',
            thumb: 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 focus:ring-blue-500/50',
            text: 'text-blue-600 dark:text-blue-400'
        },
        violet: {
            track: 'bg-violet-600 dark:bg-violet-500',
            thumb: 'bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-400 focus:ring-violet-500/50',
            text: 'text-violet-600 dark:text-violet-400'
        }
    };

    const currentStyle = colorMaps[color] || colorMaps.indigo;

    return (
        <div className={`flex flex-col gap-1.5 w-full ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
            {/* Header info */}
            {Boolean(label || subLabel || value !== undefined) && (
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {Boolean(label) && (
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                {label}
                            </span>
                        )}
                        {Boolean(subLabel) && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                {subLabel}
                            </span>
                        )}
                    </div>
                    <span className={`text-xs font-mono font-semibold ${currentStyle.text}`}>
                        {formatValue ? formatValue(value) : value}
                    </span>
                </div>
            )}

            {/* Range Track and Thumb */}
            <div className="relative flex items-center h-5 select-none touch-none">
                {/* Visual Track */}
                <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${currentStyle.track} transition-all duration-75`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Real Range Input Overlay */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    disabled={disabled}
                    className={`
                        absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-10
                        disabled:cursor-not-allowed
                    `}
                    {...props}
                />

                {/* Styled Handle Thumb */}
                <div 
                    className={`
                        absolute w-4 h-4 rounded-full ${currentStyle.thumb} border border-white dark:border-slate-900 shadow-md pointer-events-none
                        -translate-x-1/2 left-[calc(var(--pct)*1%)] transition-all duration-75
                        focus:ring-2 focus:ring-offset-1 focus:outline-none dark:focus:ring-offset-slate-800
                    `}
                    style={{ 
                        left: `${percentage}%`,
                        ['--pct' as any]: percentage
                    }}
                />
            </div>
        </div>
    );
};
