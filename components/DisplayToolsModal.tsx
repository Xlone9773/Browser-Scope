
import React, { useState } from 'react';
import { Monitor, Eye, Layers, Sun } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface DisplayToolsModalProps {
    onClose: () => void;
    t: any; // Using any for simplicity since we don't know the exact type, or Translation['settings']['display'] if passed
}

export const DisplayToolsModal: React.FC<DisplayToolsModalProps> = ({ onClose, t }) => {
    const displayT = t.settings.display;
    const [fullScreenColor, setFullScreenColor] = useState<string | null>(null);

    // Check support for color(display-p3) syntax
    const isP3Supported = typeof CSS !== 'undefined' && CSS.supports('color', 'color(display-p3 1 0 0)');
    
    // HDR Capabilities
    const isHDR = typeof window !== 'undefined' && window.matchMedia('(dynamic-range: high)').matches;
    const isVideoHDR = typeof window !== 'undefined' && window.matchMedia('(video-dynamic-range: high)').matches;

    // Full screen color overlay for dead pixel testing
    if (fullScreenColor) {
        return (
            <div 
                className="fixed inset-0 z-[100] cursor-pointer flex items-center justify-center"
                style={{ backgroundColor: fullScreenColor }}
                onClick={() => setFullScreenColor(null)}
            >
                <div className="bg-black/50 text-white px-4 py-2 rounded-full text-xs pointer-events-none select-none backdrop-blur-sm opacity-50 hover:opacity-100 transition-opacity">
                    Click anywhere to exit
                </div>
            </div>
        );
    }

    return (
        <Modal 
            onClose={onClose} 
            title={t.settings.nav.display || "Display & Screen Tools"} 
            icon={<Monitor size={24} className="text-indigo-500" />}
            size="5xl"
            fullHeight
        >
            <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Dead Pixel Check */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <Monitor size={32} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{displayT.deadPixel.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{displayT.deadPixel.desc}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <button onClick={() => setFullScreenColor('#ff0000')} className="h-12 rounded-lg bg-red-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{displayT.deadPixel.colors.red}</button>
                    <button onClick={() => setFullScreenColor('#00ff00')} className="h-12 rounded-lg bg-green-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{displayT.deadPixel.colors.green}</button>
                    <button onClick={() => setFullScreenColor('#0000ff')} className="h-12 rounded-lg bg-blue-600 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{displayT.deadPixel.colors.blue}</button>
                    <button onClick={() => setFullScreenColor('#ffffff')} className="h-12 rounded-lg bg-white border border-slate-200 hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-black font-bold text-xs">{displayT.deadPixel.colors.white}</button>
                    <button onClick={() => setFullScreenColor('#000000')} className="h-12 rounded-lg bg-black hover:scale-105 transition-transform shadow-sm flex items-center justify-center text-white font-bold text-xs">{displayT.deadPixel.colors.black}</button>
                </div>
            </div>

            {/* HDR Capabilities */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                        <Sun size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{displayT.hdr.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{displayT.hdr.desc}</p>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{displayT.hdr.rangeScreen}</span>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${isHDR ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500'}`}>
                            {isHDR ? 'High' : 'Standard'}
                        </span>
                    </div>
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{displayT.hdr.rangeVideo}</span>
                        <span className={`text-xs px-2 py-1 rounded font-bold ${isVideoHDR ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500'}`}>
                            {isVideoHDR ? 'High' : 'Standard'}
                        </span>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">{displayT.hdr.brightnessTest}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{displayT.hdr.brightnessDesc}</p>
                
                {/* EDR Brightness Test Box */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    {/* Background is Standard White */}
                    <div className="absolute inset-0 bg-white flex items-start justify-start p-2">
                        <span className="text-[10px] font-mono text-black/50">{displayT.hdr.labelSdr} (sRGB 1.0)</span>
                    </div>
                    
                    {/* Center is P3 White (Potential EDR) */}
                    <div 
                        className="w-1/2 h-1/2 rounded-lg flex items-center justify-center shadow-sm relative z-10"
                        style={{ backgroundColor: 'color(display-p3 1 1 1)' }}
                    >
                        <span className="text-[10px] font-mono text-black/50 font-bold bg-white/20 px-2 py-1 rounded">{displayT.hdr.labelEdr} (P3 1.0)</span>
                    </div>
                </div>
            </div>

            {/* Color Gamut Visualization */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                        <Eye size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{displayT.gamut.title || "Color Gamut"}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">{displayT.gamut.desc || "Check wide gamut support"}</p>
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
                        {displayT.gamut.unsupported}
                    </div>
                )}
            </div>

            {/* Bit Depth Gradient */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{displayT.gradient.title || "Bit Depth / Banding"}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{displayT.gradient.desc || "Check for gradient banding"}</p>
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
            
            {/* Motion / Refresh Rate Test */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <style>{`
                    @keyframes slideTarget {
                        from { transform: translateX(0); }
                        to { transform: translateX(calc(100cqw - 48px)); }
                    }
                    .ufo-tester {
                        animation: slideTarget 3s linear infinite alternate;
                    }
                `}</style>
                <div className="flex items-center gap-3 mb-6 relative z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg inline-flex">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{displayT.motion?.title || "Motion Blur & Stutter Test"}</h3>
                </div>
                
                <div className="w-full relative h-16 bg-slate-900 rounded-lg overflow-hidden [container-type:inline-size]">
                    <div className="absolute inset-y-0 w-[48px] bg-white flex items-center justify-center font-bold text-slate-900 border-x-4 border-indigo-500 ufo-tester will-change-transform shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        960
                    </div>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">{displayT.motion?.desc || "Follow the moving block with your eyes. If motion is not smooth, your OS might be dropping frames, or your refresh rate is low."}</p>
            </div>
            
        </div>
        </Modal>
    );
};
