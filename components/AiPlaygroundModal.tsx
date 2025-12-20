
import React, { useState, useEffect, useRef } from 'react';
import { X, Brain, Sparkles, Send, Download, Cpu, Activity } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface AiPlaygroundModalProps {
  onClose: () => void;
  t: Translation['aiPlayground'];
}

export const AiPlaygroundModal: React.FC<AiPlaygroundModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState<{status: string, progress?: number, file?: string} | null>(null);
  const [modelReady, setModelReady] = useState(false);
  
  const pipelineRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Load Model
  useEffect(() => {
    const loadModel = async () => {
        try {
            // Use import from existing script tag or dynamic import
            // @ts-ignore
            const { pipeline, env } = await import('@xenova/transformers');
            
            // Allow local models (skip checking cache if necessary, but CDN usually caches)
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            const pipe = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
                progress_callback: (data: any) => {
                    if (data.status === 'progress') {
                        setProgress(data);
                    }
                }
            });
            
            pipelineRef.current = pipe;
            setModelReady(true);
            setProgress(null);
        } catch (e) {
            console.error("Model load failed", e);
            setProgress({ status: 'error' });
        }
    };

    // Delay slightly to allow animation
    setTimeout(loadModel, 500);
  }, []);

  const runInference = async () => {
      if (!pipelineRef.current || !inputText.trim()) return;
      setLoading(true);
      setResult(null);
      
      try {
          // Artificial delay for UI feel if it's too fast
          const start = performance.now();
          const output = await pipelineRef.current(inputText);
          const end = performance.now();
          
          setResult({
              data: output[0],
              time: (end - start).toFixed(2)
          });
      } catch (e) {
          console.error(e);
      }
      setLoading(false);
  };

  const getSentimentColor = (label: string) => {
      return label === 'POSITIVE' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
      isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Brain className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-[300px] flex flex-col">
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {t.desc}
            </p>

            {/* Model Status Card */}
            <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{t.model_name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">distilbert-base-uncased...</span>
                </div>
                
                {!modelReady ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>{t.loading_model}</span>
                            <span>{progress?.progress ? Math.round(progress.progress) : 0}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 transition-all duration-200" 
                                style={{ width: `${progress?.progress || 5}%` }}
                            />
                        </div>
                        {progress?.file && <div className="text-[10px] text-slate-400 truncate">{progress.file}</div>}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Ready to Inference (WASM)
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="relative mb-4">
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.input_placeholder}
                    className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none h-24 text-sm text-slate-800 dark:text-slate-200 disabled:opacity-50"
                    disabled={!modelReady || loading}
                />
                <button 
                    onClick={runInference}
                    disabled={!modelReady || loading || !inputText}
                    className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                    {loading ? <Activity className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
            </div>

            {/* Result Area */}
            {result && (
                <div className="mt-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.result_label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{result.time} ms</span>
                    </div>
                    <div className="flex gap-3">
                        <div className={`flex-1 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2 ${getSentimentColor(result.data.label)}`}>
                            <Sparkles size={16} />
                            <span className="font-bold">{result.data.label}</span>
                        </div>
                        <div className="flex-1 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center text-center">
                            <span className="text-[10px] text-slate-400 uppercase">{t.confidence}</span>
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                                {(result.data.score * 100).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
