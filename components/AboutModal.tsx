
import React, { useState } from 'react';
import { 
    Sparkles, 
    ShieldCheck, 
    Cpu, 
    Zap, 
    Layers, 
    GitCommit, 
    Github,
    Fingerprint,
    Box,
    FileText,
    Download
} from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface AboutModalProps {
  onClose: () => void;
  t: Translation['aboutModal'];
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, t }) => {
  const currentVersion = t.updates && t.updates[0] ? t.updates[0].version : '1.6.0';
  const [showLicense, setShowLicense] = useState(false);

  const currentLicenseText = (t.features?.openSource as any)?.licenseText || '';
  const currentLicenseTitle = (t.features?.openSource as any)?.licenseTitle || 'LICENSE (MIT)';

  return (
    <Modal
        title=""
        onClose={onClose}
        size="3xl"
        className="!bg-transparent shadow-none" // Override default modal styles for custom look
        noPadding
    >
        {({ close: _close }) => (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                {/* Scoped style block for hardware-accelerated animations */}
                <style>{`
                  @keyframes float-slow-1 {
                    0%, 100% {
                      transform: translate3d(0, 0, 0) scale(1);
                      opacity: 0.6;
                    }
                    50% {
                      transform: translate3d(24px, -16px, 0) scale(1.1);
                      opacity: 0.85;
                    }
                  }
                  @keyframes float-slow-2 {
                    0%, 100% {
                      transform: translate3d(0, 0, 0) scale(1.05);
                      opacity: 0.5;
                    }
                    50% {
                      transform: translate3d(-16px, 24px, 0) scale(0.95);
                      opacity: 0.75;
                    }
                  }
                  @keyframes float-slow-3 {
                    0%, 100% {
                      transform: translate3d(0, 0, 0) scale(1);
                      opacity: 0.4;
                    }
                    50% {
                      transform: translate3d(16px, 16px, 0) scale(1.05);
                      opacity: 0.65;
                    }
                  }
                  .animate-float-1 {
                    animation: float-slow-1 12s ease-in-out infinite;
                  }
                  .animate-float-2 {
                    animation: float-slow-2 15s ease-in-out infinite;
                  }
                  .animate-float-3 {
                    animation: float-slow-3 18s ease-in-out infinite;
                  }
                `}</style>
                
                {/* Scrollable Area containing both Hero and Content for seamless integration */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    
                    {/* Hero Header */}
                    <div className="relative pt-12 pb-20 px-8 overflow-hidden bg-slate-900 shrink-0">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay pointer-events-none transform-gpu will-change-transform" />
                        
                        {/* Animated Orbs - Optimized using high-performance radial gradients and translate3d hardware acceleration */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] rounded-full animate-float-1 will-change-transform transform-gpu pointer-events-none" />
                        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-[radial-gradient(circle,rgba(168,85,247,0.25)_0%,transparent_70%)] rounded-full animate-float-2 will-change-transform transform-gpu pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] rounded-full animate-float-3 will-change-transform transform-gpu pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl mb-6 animate-in zoom-in duration-500 ring-1 ring-white/20">
                                <Box className="text-indigo-300" size={40} strokeWidth={1.5} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300 tracking-tight mb-3 drop-shadow-sm">
                                BrowserScope
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base max-w-lg font-medium leading-relaxed">
                                {t.desc}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-indigo-200/80 shadow-inner">
                                <GitCommit size={14} />
                                <span>v{currentVersion}</span>
                            </div>
                        </div>

                        {/* Gradient Fade to Content Background - This removes the hard line */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-0 pointer-events-none" />
                    </div>

                    {/* Bento Grid Content - Overlapping Hero */}
                    <div className="px-6 md:px-8 relative z-10 -mt-12 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            
                            {/* Card 1: Privacy */}
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{t.features?.privacy.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {t.features?.privacy.desc}
                                </p>
                            </div>

                            {/* Card 2: Frontier Tech */}
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                                    <Cpu size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{t.features?.tech.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {t.features?.tech.desc}
                                </p>
                            </div>

                            {/* Card 3: Deep Scan */}
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
                                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                                    <Fingerprint size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{t.features?.deepScan.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {t.features?.deepScan.desc}
                                </p>
                            </div>

                            {/* Card 4: Stack / Innovation (Wide) */}
                            <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                                        <Zap size={18} className="text-yellow-500 fill-yellow-500" />
                                        {t.features?.stack.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['WebGPU Compute', 'Transformer.js', 'WASM', 'WebCodecs', 'React 19', 'Tailwind', 'Intl API', 'WebRTC'].map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-mono text-slate-600 dark:text-slate-300 font-medium hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-default">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* Decorative background icon */}
                                <Layers className="absolute -bottom-6 -right-6 text-slate-100 dark:text-slate-800 transition-transform group-hover:scale-110 duration-500" size={140} />
                            </div>

                            {/* Card 5: Open Source */}
                            <div className="bg-slate-900 dark:bg-black p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between h-full min-h-[160px] group hover:shadow-xl transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-indigo-900/10 pointer-events-none" />
                                
                                <div className="relative z-10 flex items-start justify-between w-full">
                                    <div className="flex flex-col text-left">
                                        <h3 className="font-bold text-white text-base">{t.features?.openSource.title}</h3>
                                        <span className="text-xs font-mono text-indigo-400 mt-1 flex items-center gap-1">
                                            <FileText size={12} />
                                            {t.features?.openSource.license}
                                        </span>
                                    </div>
                                    <a 
                                        href="https://github.com/Xlone9773/Browser-Scope" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-slate-400 hover:text-white transition-colors"
                                        title="GitHub Repository"
                                    >
                                        <Github size={24} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>

                                <div className="relative z-10 mt-6 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setShowLicense(!showLicense)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-100 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    >
                                        <FileText size={12} className={showLicense ? "text-indigo-400" : "text-slate-400"} />
                                        {showLicense ? (t.features?.openSource as any).hideLicense : (t.features?.openSource as any).viewLicense}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([currentLicenseText], { type: 'text/plain;charset=utf-8' });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = 'LICENSE';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <Download size={12} />
                                        {(t.features?.openSource as any).downloadLicense}
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => {
                                            window.dispatchEvent(new CustomEvent('open-attributions'));
                                        }, 150);
                                    }}
                                    className="relative z-10 w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700/85 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <Layers size={12} className="text-indigo-400" />
                                    {t.desc && /[\u4e00-\u9fa5]/.test(t.desc) ? '查看第三方软件与字体归属声明' : 'View Third-Party Attributions & Fonts'}
                                </button>
                            </div>
                        </div>

                        {/* Collapsible Full LICENSE Viewer */}
                        {showLicense && (
                            <div className="mb-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-lg anim-slide-up duration-300 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-indigo-500" size={18} />
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{currentLicenseTitle}</h4>
                                    </div>
                                    <button 
                                        onClick={() => setShowLicense(false)}
                                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded-md"
                                    >
                                        {(t.features?.openSource as any).hideLicense}
                                    </button>
                                </div>
                                <pre className="font-mono text-[11px] text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 custom-scrollbar">
{currentLicenseText}
                                </pre>
                            </div>
                        )}

                        {/* Timeline / Changelog */}
                        <div className="bg-white/50 dark:bg-slate-900/30 rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <Sparkles size={18} className="text-indigo-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t.history}</h3>
                            </div>
                            
                            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10 pl-8 py-2">
                                {t.updates && t.updates.map((update, idx) => (
                                    <div key={idx} className="relative group">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center transition-colors shadow-sm ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                            {idx === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                            <span className={`text-lg font-bold tracking-tight ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                v{update.version} {(update as any  ).title ? ` - ${(update as any /* eslint-disable-line @typescript-eslint/no-explicit-any */ as Record<string, string>).title}` : ''}
                                            </span>
                                            <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                {update.date}
                                            </span>
                                        </div>
                                        
                                        <ul className="space-y-2.5">
                                            {update.changes.map((change, cIdx) => (
                                                <li key={cIdx} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2.5 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                                    <span className="mt-2 w-1 h-1 rounded-full bg-indigo-400/50 shrink-0"></span>
                                                    {change}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Modal>
  );
};
