
import React from 'react';
import { Monitor, Eye, Layers } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface DisplayTabProps {
    t: Translation['settingsModal'];
    onColorSelect: (color: string) => void;
}

export const DisplayTab: React.FC<DisplayTabProps> = ({ t, onColorSelect }) => {
    // Check support for color(display-p3) syntax
    const isP3Supported = typeof CSS !== 'undefined' && CSS.supports('color', 'color(display-p3 1 0 0)');

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Dead Pixel Check */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <Monitor size={32} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t.dead_pixel_title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.dead_pixel_desc}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <button onClick={() => onColorSelect('#ff0000')} className="h-12 rounded-lg bg-red-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_red}</button>
                    <button onClick={() => onColorSelect('#00ff00')} className="h-12 rounded-lg bg-green-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_green}</button>
                    <button onClick={() => onColorSelect('#0000ff')} className="h-12 rounded-lg bg-blue-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_blue}</button>
                    <button onClick={() => onColorSelect('#ffffff')} className="h-12 rounded-lg bg-white border border-slate-200 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-black font-bold text-xs">{t.color_white}</button>
                    <button onClick={() => onColorSelect('#000000')} className="h-12 rounded-lg bg-black hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{t.color_black}</button>
                </div>
            </div>

            {/* Color Gamut Visualization */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                        <Eye size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.gamut_test_title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">{t.gamut_test_desc}</p>
                    </div>
                </div>

                {isP3Supported ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Red Test */}
                        <div 
                            className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden group"
                            style={{ backgroundColor: 'rgb(255, 0, 0)' }}
                        >
                            <span className="font-bold text-2xl opacity-100 transition-opacity" style={{ color: 'color(display-p3 1 0 0)' }}>P3</span>
                            <div className="absolute bottom-2 left-2 text-[10px] text-white/50 font-mono bg-black/20 px-1 rounded">RED</div>
                        </div>

                        {/* Green Test */}
                        <div 
                            className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden group"
                            style={{ backgroundColor: 'rgb(0, 255, 0)' }}
                        >
                            <span className="font-bold text-2xl opacity-100 transition-opacity" style={{ color: 'color(display-p3 0 1 0)' }}>P3</span>
                            <div className="absolute bottom-2 left-2 text-[10px] text-black/50 font-mono bg-white/20 px-1 rounded">GREEN</div>
                        </div>

                        {/* Blue Test */}
                        <div 
                            className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden group"
                            style={{ backgroundColor: 'rgb(0, 0, 255)' }}
                        >
                            <span className="font-bold text-2xl opacity-100 transition-opacity" style={{ color: 'color(display-p3 0 0 1)' }}>P3</span>
                            <div className="absolute bottom-2 left-2 text-[10px] text-white/50 font-mono bg-black/20 px-1 rounded">BLUE</div>
                        </div>

                        {/* Mixed / Purple Test */}
                        <div 
                            className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden group"
                            style={{ backgroundColor: 'rgb(255, 0, 255)' }}
                        >
                            <span className="font-bold text-2xl opacity-100 transition-opacity" style={{ color: 'color(display-p3 1 0 1)' }}>P3</span>
                            <div className="absolute bottom-2 left-2 text-[10px] text-white/50 font-mono bg-black/20 px-1 rounded">MAGENTA</div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-sm text-slate-500 text-center">
                        {t.unsupported_p3}
                    </div>
                )}
            </div>

            {/* HDR / Bit Depth Gradient */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.hdr_test_title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.hdr_test_desc}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Grayscale Gradient */}
                    <div className="h-16 w-full rounded-lg relative overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                        <div 
                            className="absolute inset-0" 
                            style={{ 
                                background: 'linear-gradient(to right, black, white)' 
                            }} 
                        />
                        <div className="absolute top-2 left-2 text-[10px] text-white/50 font-mono mix-blend-difference">Luma</div>
                    </div>

                    {/* Color Gradients */}
                    <div className="h-16 w-full rounded-lg relative overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                        <div 
                            className="absolute inset-0" 
                            style={{ 
                                background: 'linear-gradient(to right, rgb(20,0,0), rgb(255,0,0))' 
                            }} 
                        />
                        <div className="absolute top-2 left-2 text-[10px] text-white/50 font-mono">Red 8-bit+</div>
                    </div>
                    
                    {/* Dark Detail Test (Near Black) */}
                    <div className="grid grid-cols-8 h-12 w-full rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/10 text-[10px] text-white/30 font-mono text-center leading-[3rem]">
                        <div style={{backgroundColor: '#000000'}}>0</div>
                        <div style={{backgroundColor: '#030303'}}>3</div>
                        <div style={{backgroundColor: '#050505'}}>5</div>
                        <div style={{backgroundColor: '#080808'}}>8</div>
                        <div style={{backgroundColor: '#0A0A0A'}}>10</div>
                        <div style={{backgroundColor: '#0D0D0D'}}>13</div>
                        <div style={{backgroundColor: '#101010'}}>16</div>
                        <div style={{backgroundColor: '#151515'}}>21</div>
                    </div>
                    <div className="text-center text-[10px] text-slate-400">Near-black steps (0-21 RGB) - Check visibility of darker steps</div>
                </div>
            </div>

        </div>
    );
};
