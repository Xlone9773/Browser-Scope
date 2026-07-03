
import React from 'react';
import { Fingerprint, Monitor, Wifi, Cpu, Layers, Globe, ShieldCheck } from 'lucide-react';
import { FingerprintScore } from '../types';
import { Modal } from './ui/Modal';

interface ScoreModalProps {
  scoreData: FingerprintScore;
  onClose: () => void;
  t: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({ scoreData, onClose, t }) => {
  const getScoreColor = (score: number) => {
      if (score > 80) return 'text-red-500';
      if (score > 60) return 'text-orange-500';
      if (score > 30) return 'text-yellow-500';
      return 'text-green-500';
  };

  const getScoreBg = (score: number) => {
      if (score > 80) return 'bg-red-500';
      if (score > 60) return 'bg-orange-500';
      if (score > 30) return 'bg-yellow-500';
      return 'bg-green-500';
  };

  // Helper to safely get translation
  const getFactorLabel = (id: string) => {
      return t.factors?.[id];
  };

  const getFactorValue = (val: string | number) => {
      if (typeof val === 'string' && val.startsWith('val_') && t.values?.[val]) {
          return t.values[val];
      }
      return val;
  };

  const getFactorDesc = (descKey: string) => {
      if (descKey && t.descriptions?.[descKey]) {
          return t.descriptions[descKey];
      }
      return descKey;
  };

  // --- SVG Radar Chart Logic ---
  const size = 180;
  const center = size / 2;
  const radius = 60; 
  const levels = 3;
  
  const axes = [
      { key: 'hardware', label: t.categories?.hardware, icon: Cpu, score: scoreData.categoryScores.hardware },
      { key: 'browser', label: t.categories?.browser, icon: Globe, score: scoreData.categoryScores.browser },
      { key: 'network', label: t.categories?.network, icon: Wifi, score: scoreData.categoryScores.network },
      { key: 'media', label: t.categories?.media, icon: Layers, score: scoreData.categoryScores.media },
      { key: 'screen', label: t.categories?.screen, icon: Monitor, score: scoreData.categoryScores.screen },
  ];

  const totalAxes = axes.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  const points = axes.map((axis, i) => {
      const value = axis.score / 100;
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + radius * value * Math.cos(angle);
      const y = center + radius * value * Math.sin(angle);
      return `${x},${y}`;
  }).join(' ');

  const webs = Array.from({ length: levels }).map((_, level) => {
      const levelFactor = (level + 1) / levels;
      const polyPoints = axes.map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const x = center + radius * levelFactor * Math.cos(angle);
          const y = center + radius * levelFactor * Math.sin(angle);
          return `${x},${y}`;
      }).join(' ');
      return <polygon key={level} points={polyPoints} fill="none" stroke="currentColor" strokeOpacity="0.1" />;
  });

  const axisLines = axes.map((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      const lx = center + (radius + 15) * Math.cos(angle);
      const ly = center + (radius + 15) * Math.sin(angle);

      const Anchor = i === 0 ? 'middle' : i < totalAxes/2 ? 'start' : 'end';
      const Baseline = i === 0 ? 'auto' : 'middle';

      return (
          <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.1" />
              <text x={lx} y={ly} textAnchor={Anchor} dominantBaseline={Baseline} fontSize="8" className="fill-slate-500 dark:fill-slate-400 font-bold uppercase tracking-wider">
                  {axis.label}
              </text>
          </g>
      );
  });

  return (
    <Modal
        title={t.score_details_title}
        icon={<Fingerprint size={24} />}
        onClose={onClose}
        size="3xl"
        fullHeight={true} 
        noPadding={true}
    >
        {({ close: _close }) => (
            <div className="flex flex-col lg:flex-row h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
                
                {/* Left Panel: Visuals (Fixed width on desktop) */}
                <div className="lg:w-[320px] xl:w-[360px] bg-white dark:bg-slate-800 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 overflow-y-auto">
                    
                    <div className="p-8 flex flex-col items-center justify-center gap-8 min-h-full lg:min-h-0">
                        {/* Score Circle */}
                        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-700" />
                                <circle 
                                    cx="50" cy="50" r="45" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="6" 
                                    strokeLinecap="round" 
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * scoreData.totalScore) / 100}
                                    className={`${getScoreColor(scoreData.totalScore)} transition-all duration-1000 ease-out`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-black ${getScoreColor(scoreData.totalScore)}`}>{scoreData.totalScore}</span>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{scoreData.rating}</span>
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div className="w-full flex justify-center shrink-0">
                            <svg width={size + 40} height={size + 20} viewBox={`0 0 ${size + 40} ${size + 20}`} className="text-slate-400">
                                <g transform={`translate(20, 10)`}>
                                    {webs}
                                    {axisLines}
                                    <polygon 
                                        points={points} 
                                        className="fill-indigo-500/20 stroke-indigo-500 dark:stroke-indigo-400 dark:fill-indigo-400/20" 
                                        strokeWidth="2" 
                                    />
                                    {axes.map((axis, i) => {
                                        const value = axis.score / 100;
                                        const angle = angleSlice * i - Math.PI / 2;
                                        const x = center + radius * value * Math.cos(angle);
                                        const y = center + radius * value * Math.sin(angle);
                                        return (
                                            <circle key={i} cx={x} cy={y} r="3" className="fill-indigo-600 dark:fill-indigo-300" />
                                        );
                                    })}
                                </g>
                            </svg>
                        </div>

                        {/* Explanation Text */}
                        <div className="text-center px-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {t.score_explanation}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Scrollable Grid List */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                    
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex justify-between items-center shrink-0">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck size={16} className="text-indigo-500" />
                            {t.contributing_factors}
                        </h4>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                            {scoreData.factors.length} Signals
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {scoreData.factors.map((factor) => (
                                <div key={factor.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex gap-3 items-start group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors h-full">
                                    
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                                        factor.score > 0 
                                        ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' 
                                        : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    }`}>
                                        {factor.category === 'hardware' && <Cpu size={16} />}
                                        {factor.category === 'browser' && <Globe size={16} />}
                                        {factor.category === 'network' && <Wifi size={16} />}
                                        {factor.category === 'media' && <Layers size={16} />}
                                        {factor.category === 'screen' && <Monitor size={16} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate pr-2">
                                                {getFactorLabel(factor.id)}
                                            </span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                                                factor.score > 0 
                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                                                : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                            }`}>
                                                +{factor.score}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded break-all">
                                                {getFactorValue(factor.value)}
                                            </span>
                                        </div>
                                        
                                        {factor.description && (
                                            <p className="text-[10px] text-slate-400 leading-tight">
                                                {getFactorDesc(factor.description)}
                                            </p>
                                        )}

                                        {/* Mini Impact Bar */}
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden mt-2">
                                            <div 
                                                className={`h-full ${getScoreBg( (factor.score / factor.maxScore) * 100 )}`} 
                                                style={{ width: `${Math.max((factor.score / factor.maxScore) * 100, 5)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Modal>
  );
};
