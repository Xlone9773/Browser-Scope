
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
  lang?: string;
}

const LICENSE_TRANSLATIONS: Record<string, string> = {
  en: `MIT License

Copyright (c) 2026 BrowserScope Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

  'zh-CN': `MIT 许可证

版权所有 (c) 2026 BrowserScope 贡献者

特此免费授权任何获得本软件及相关文档文件（以下简称“软件”）副本的人在不受限制的情况下处理本软件的许可，包括但不限于使用、复制、修改、合并、发表、分发、再许可和/或销售本软件副本的权利，并允许向其提供本软件的人做出上述行为，但须符合以下条件：

上述版权声明和本许可声明应包含在本软件的所有副本或实质性部分中。

本软件按“原样”提供，不提供任何形式的明示或暗示保证，包括但不限于对适销性、特定用途适用性和非侵权性的保证。在任何情况下，作者或版权持有人均不对因本软件或本软件的使用或其他交易而引起的、由本软件引起的或与之相关的任何索赔、损害或其他责任（无论是合同诉讼、侵权诉讼还是其他诉讼）承担责任。`,

  'zh-TW': `MIT 許可證

版權所有 (c) 2026 BrowserScope 貢獻者

特此免費授權任何獲得本軟件及相關文檔文件（以下簡稱“軟件”）副本的人在不受限制的情況下處理本軟件的許可，包括但不限於使用、複製、修改、合併、發表、分發、再許可和/或銷售本軟件副本的權利，並允許向其提供本軟件的人做出上述行為，但須符合以下條件：

上述版權聲明和本許可聲明應包含在本軟件的所有副本或實質性部分中。

本軟件按“原樣”提供，不提供任何形式的明示或暗示保證，包括但不限於對適銷性、特定用途適用性和非侵權性的保證。在任何情況下，作者或版權持有人均不對因本軟件或本軟件的使用或其他交易而引起的、由本軟件引起的或與之相關的任何索賠、損害或其他責任（無論是合同訴訟、侵權訴訟還是其他訴訟）承擔責任。`,

  'zh-HK': `MIT 許可證

版權所有 (c) 2026 BrowserScope 貢獻者

特此免費授權任何獲得本軟件及相關文檔文件（以下簡稱“軟件”）副本的人在不受限制的情況下處理本軟件的許可，包括但不限於使用、複製、修改、合併、發表、分發、再許可和/或銷售本軟件副本的權利，並允許向其提供本软件的人做出上述行為，但須符合以下條件：

上述版權聲明和本許可聲明應包含在本軟件的所有副本或實質性部分中。

本軟件按“原樣”提供，不提供任何形式的明示或暗示保證，包括但不限於對適銷性、特定用途適用性和非侵權性的保證。在任何情況下，作者或版權持有人均不對因本軟件或本軟件的使用或其他交易而引起的、由本軟件引起的或與之相關的任何索賠、損害或其他責任（無論是合同訴訟、侵權訴訟還是其他訴訟）承擔責任。`,

  ja: `MIT ライセンス

Copyright (c) 2026 BrowserScope Contributors

以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を取得したすべての人に対し、ソフトウェアを無制限に扱う権利を無償で許諾します。これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に同じ行為を許可する権利が含まれますが、これらに限定されません。

上記の著作権表示および本許諾表示は、ソフトウェアのすべての複製または主要な部分に記載するものとします。

本ソフトウェアは「現状のまま」提供され、明示または黙示を問わず、商品性、特定の目的への適合性、および権利非侵害に関する保証を含むがこれらに限定されない、いかなる種類の保証も行いません。著作権者またはライセンス保持者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の取り扱いに起因するいかなる請求、損害、またはその他の責任に対しても責任を負わないものとします。`,

  ru: `Лицензия MIT

Copyright (c) 2026 BrowserScope Contributors

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемого «Программное обеспечение»), безвозмездно использовать Программное обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного обеспечения, а также право разрешать делать это лицам, которым предоставляется данное Программное обеспечение, при соблюдении следующих условий:

Указанное выше уведомление об авторских правах и данные условия лицензии должны быть включены во все копии или значимые части Программного обеспечения.

ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ ОГРАНИЧИВАЯСЬ ГАРАНТИЯМИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ КОНКРЕТНЫМ ЦЕЛЯМ И ОТСУТСТВИЯ НАРУШЕНИЙ ПРАВ. НИ В КОЕМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ОБЯЗАТЕЛЬСТВАМ, ВНЕ ЗАВИСИМОСТИ ОТ ДЕЙСТВИЯ ДОГОВОРА, ГРАЖДАНСКОГО ПРАВОНАРУШЕНИЯ ИЛИ ИНОГО СЛУЧАЯ, ВОЗНИКАЮЩИХ ИЗ-ЗА, ВНЕ ИЛИ В СВЯЗИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ ИЛИ ИСПОЛЬЗОВАНИЕМ ИЛИ ИНЫМИ ДЕЙСТВИЯМИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.`
};

const LICENSE_TITLE_MAP: Record<string, string> = {
  en: 'LICENSE (MIT)',
  'zh-CN': '软件许可证 (MIT)',
  'zh-TW': '軟件許可證 (MIT)',
  'zh-HK': '軟件許可證 (MIT)',
  ja: 'ソフトウェアライセンス (MIT)',
  ru: 'Лицензия на ПО (MIT)'
};

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, t, lang }) => {
  const currentVersion = t.updates && t.updates[0] ? t.updates[0].version : '1.6.0';
  const [showLicense, setShowLicense] = useState(false);

  const activeLang = lang && LICENSE_TRANSLATIONS[lang] ? lang : 'en';
  const currentLicenseText = LICENSE_TRANSLATIONS[activeLang];
  const currentLicenseTitle = LICENSE_TITLE_MAP[activeLang] || 'LICENSE (MIT)';

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
                
                {/* Scrollable Area containing both Hero and Content for seamless integration */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    
                    {/* Hero Header */}
                    <div className="relative pt-12 pb-20 px-8 overflow-hidden bg-slate-900 shrink-0">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
                        
                        {/* Animated Orbs */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

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
