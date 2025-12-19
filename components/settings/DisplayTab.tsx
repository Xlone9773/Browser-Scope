
import React from 'react';
import { Monitor } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface DisplayTabProps {
    t: Translation['settingsModal'];
    onColorSelect: (color: string) => void;
}

export const DisplayTab: React.FC<DisplayTabProps> = ({ t, onColorSelect }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center mb-6">
                <Monitor size={48} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t.dead_pixel_title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.dead_pixel_desc}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <button onClick={() => onColorSelect('#ff0000')} className="h-16 rounded-lg bg-red-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_red}</button>
                    <button onClick={() => onColorSelect('#00ff00')} className="h-16 rounded-lg bg-green-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_green}</button>
                    <button onClick={() => onColorSelect('#0000ff')} className="h-16 rounded-lg bg-blue-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_blue}</button>
                    <button onClick={() => onColorSelect('#ffffff')} className="h-16 rounded-lg bg-white border border-slate-200 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-black font-bold text-xs">{t.color_white}</button>
                    <button onClick={() => onColorSelect('#000000')} className="h-16 rounded-lg bg-black hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_black}</button>
                </div>
            </div>
        </div>
    );
};
