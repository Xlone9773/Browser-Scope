
import React from 'react';
import { Fingerprint } from 'lucide-react';
import { FingerprintScore } from '../types';
import { Modal } from './ui/Modal';

interface ScoreModalProps {
  scoreData: FingerprintScore;
  onClose: () => void;
  t: any;
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
      return t.factors?.[id] || id.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getFactorValue = (val: string) => {
      // Check if it's a translation key (starts with val_)
      if (val && val.startsWith('val_') && t.values?.[val]) {
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

  return (
    <Modal
        title={t.score_details_title}
        icon={<Fingerprint size={24} />}
        onClose={onClose}
        size="lg"
    >
        {({ close }) => (
            <>
                {/* Content */}
                <div className="p-2">
                    
                    {/* Main Score Display */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle 
                                    cx="50" cy="50" r="45" 
                                    fill="none" 
                                    stroke="#e2e8f0" 
                                    strokeWidth="8" 
                                    className="dark:stroke-slate-700"
                                />
                                <circle 
                                    cx="50" cy="50" r="45" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="8" 
                                    strokeLinecap="round" 
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * scoreData.totalScore) / 100}
                                    className={`${getScoreColor(scoreData.totalScore)} transition-all duration-1000 ease-out transform -rotate-90 origin-center`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-bold ${getScoreColor(scoreData.totalScore)}`}>{scoreData.totalScore}</span>
                                <span className="text-xs text-slate-400 uppercase font-medium">/ 100</span>
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <h3 className={`text-lg font-bold ${getScoreColor(scoreData.totalScore)}`}>
                                {scoreData.rating} {t.tracking_potential}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto text-center">
                                {t.score_explanation}
                            </p>
                        </div>
                    </div>

                    {/* Factor List */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            {t.contributing_factors}
                        </h4>
                        
                        {scoreData.factors.map((factor) => (
                            <div key={factor.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        {getFactorLabel(factor.id)}
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${factor.score > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}>
                                        +{factor.score} pts
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 mb-2">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Value: {getFactorValue(factor.value)}
                                    </span>
                                    {factor.description && (
                                        <p className="text-[10px] text-slate-400 leading-tight">
                                            {getFactorDesc(factor.description)}
                                        </p>
                                    )}
                                </div>
                                {/* Progress bar for factor impact */}
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${getScoreBg( (factor.score / factor.maxScore) * 100 )}`} 
                                        style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end">
                    <button 
                        onClick={close}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </>
        )}
    </Modal>
  );
};
