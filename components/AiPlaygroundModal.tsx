
import React, { useState, useRef } from 'react';
import { Brain, Sparkles, Activity, MessageSquare, Type, Languages, RefreshCw, Zap, CloudDownload } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { getErrorMessage } from '../utils/error';

interface AiPlaygroundModalProps {
  onClose: () => void;
  t: Translation['aiPlayground'];
}

type TaskType = 'sentiment' | 'generation' | 'translation';

const MODELS = {
    sentiment: { id: 'sentiment-analysis', model: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', size: '~60MB' },
    generation: { id: 'text-generation', model: 'Xenova/distilgpt2', size: '~300MB' },
    translation: { id: 'translation', model: 'Xenova/t5-small', size: '~240MB' }
};

interface AiResultItem {
    label?: string;
    score?: number;
    generated_text?: string;
    translation_text?: string;
}

export const AiPlaygroundModal: React.FC<AiPlaygroundModalProps> = ({ onClose, t }) => {
  const [activeTask, setActiveTask] = useState<TaskType>('sentiment');
  const [inputText, setInputText] = useState('');
  
  // Model State
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [progress, setProgress] = useState<{status: string, progress?: number, file?: string} | null>(null);
  
  // Result State
  const [result, setResult] = useState<AiResultItem[] | null>(null);
  const [metrics, setMetrics] = useState<{ loadTime?: string, inferenceTime?: string, device?: string }>({});
  const [isComputing, setIsComputing] = useState(false);

  // Refs
  const pipelineRef = useRef<((text: string, options?: Record<string, unknown>) => Promise<AiResultItem[]>) | null>(null);
  const loadedTaskRef = useRef<TaskType | null>(null);

  // Load Model Logic
  const loadModel = async (task: TaskType) => {
      if (loadedTaskRef.current === task && pipelineRef.current) {
          setModelStatus('ready');
          return; // Already loaded
      }

      setModelStatus('loading');
      setResult(null);
      setMetrics({});
      
      const startTime = performance.now();

      try {
          
          const { pipeline, env } = await import('@xenova/transformers');
          
          env.allowLocalModels = false;
          env.useBrowserCache = true;

          const config = MODELS[task];
          // Explicit cast to avoid type mismatch with specific string literals expected by the library
          const pipe = await pipeline(config.id as Parameters<typeof pipeline>[0], config.model, {
              progress_callback: (data: { status: string; progress?: number; file?: string }) => {
                  if (data.status === 'progress' || data.status === 'initiate') {
                      setProgress(data);
                  }
              }
          });
          
          pipelineRef.current = pipe as ((text: string, options?: Record<string, unknown>) => Promise<AiResultItem[]>);
          loadedTaskRef.current = task;
          
          const endTime = performance.now();
          setMetrics(prev => ({ ...prev, loadTime: ((endTime - startTime) / 1000).toFixed(2) + 's' }));
          setModelStatus('ready');
          setProgress(null);

      } catch (e: unknown) {
          console.error("Model load failed", getErrorMessage(e));
          setProgress({ status: 'error' });
          setModelStatus('idle');
      }
  };

  const handleTaskChange = (task: TaskType) => {
      setActiveTask(task);
      setResult(null);
      setMetrics({});
      setProgress(null);
      if (loadedTaskRef.current === task && pipelineRef.current) {
          setModelStatus('ready');
      } else {
          setModelStatus('idle');
      }
  };

  const handleLoadClick = () => {
      loadModel(activeTask);
  };

  const runInference = async () => {
      if (!pipelineRef.current || !inputText.trim() || isComputing) return;
      
      setIsComputing(true);
      setResult(null);
      
      try {
          const start = performance.now();
          let output: AiResultItem[] | null = null;

          if (activeTask === 'sentiment') {
              output = await pipelineRef.current(inputText);
          } else if (activeTask === 'generation') {
              output = await pipelineRef.current(inputText, {
                  max_new_tokens: 50,
                  temperature: 0.7
              });
          } else if (activeTask === 'translation') {
              // T5 specific: prefix needed for task
              // Default to English -> German for demo if not specified
              const text = `translate English to German: ${inputText}`;
              output = await pipelineRef.current(text);
          }

          const end = performance.now();
          
          setResult(output);
          setMetrics(prev => ({ ...prev, inferenceTime: (end - start).toFixed(2) + ' ms' }));
      } catch (e: unknown) {
          console.error("Inference failed", getErrorMessage(e));
      }
      setIsComputing(false);
  };

  // UI Helpers
  const getTaskIcon = (task: TaskType) => {
      switch(task) {
          case 'sentiment': return <MessageSquare size={18} />;
          case 'generation': return <Type size={18} />;
          case 'translation': return <Languages size={18} />;
      }
  };

  // Safe translation access
  const getTaskTitle = (task: TaskType) => {
      
      return t.tasks?.[task]?.title;
  };
  const getTaskDesc = (task: TaskType) => {
      
      return t.tasks?.[task]?.desc;
  };
  const getTaskInputPlaceholder = (task: TaskType) => {
      
      return t.tasks?.[task]?.input;
  };
  const getTaskBtnText = (task: TaskType) => {
      
      return t.tasks?.[task]?.btn;
  };

  const getCurrentModelSize = () => {
      return MODELS[activeTask].size;
  };

  return (
    <Modal
        title={t.title}
        icon={<Brain size={24} />}
        onClose={onClose}
        size="4xl"
        fullHeight
        noPadding
    >
        <div className="flex flex-col md:flex-row h-full bg-slate-50 dark:bg-slate-900">
            
            {/* Sidebar / Tabs */}
            <div className="md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.select_task}</div>
                    <div className="flex flex-col gap-2">
                        {(['sentiment', 'generation', 'translation'] as TaskType[]).map(task => (
                            <button
                                key={task}
                                onClick={() => handleTaskChange(task)}
                                disabled={isComputing || modelStatus === 'loading'}
                                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                    activeTask === task 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                } ${isComputing || modelStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`p-2 rounded-md ${activeTask === task ? 'bg-white dark:bg-indigo-900/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                    {getTaskIcon(task)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold">{getTaskTitle(task)}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Stats Panel */}
                <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">{t.perf_metrics}</div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{t.metrics?.time_load}</span>
                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{metrics.loadTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{t.metrics?.time_inference}</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{metrics.inferenceTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">{t.metrics?.device}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">WASM / CPU</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                {getTaskTitle(activeTask)}
                                {modelStatus === 'loading' && <RefreshCw size={16} className="animate-spin text-indigo-500" />}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{getTaskDesc(activeTask)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${
                            modelStatus === 'ready' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                            : modelStatus === 'loading'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${modelStatus === 'ready' ? 'bg-emerald-500' : modelStatus === 'loading' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`}></div>
                            {modelStatus === 'ready' ? t.status?.ready : modelStatus === 'loading' ? t.status?.loading_model : t.status?.idle}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {modelStatus === 'loading' && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Downloading Weights...</span>
                                <span>{progress?.progress ? Math.round(progress.progress) : 0}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-200" 
                                    style={{ width: `${progress?.progress || 5}%` }}
                                />
                            </div>
                            {progress?.file && <div className="text-[10px] text-slate-400 mt-1 font-mono truncate">{progress.file}</div>}
                        </div>
                    )}
                </div>

                {/* Interaction Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                    
                    <div className="w-full max-w-3xl mx-auto space-y-6">
                        {/* Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input</label>
                            <div className="relative group">
                                <textarea 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={modelStatus === 'ready' ? getTaskInputPlaceholder(activeTask) : ""}
                                    className={`w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none h-32 text-sm text-slate-800 dark:text-slate-200 shadow-sm transition-shadow ${modelStatus !== 'ready' ? 'opacity-50 cursor-not-allowed select-none' : ''}`}
                                    disabled={modelStatus !== 'ready' || isComputing}
                                />
                                
                                {/* Overlay for Idle State - Manual Load Trigger */}
                                {modelStatus === 'idle' && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <button 
                                            onClick={handleLoadClick}
                                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 font-bold"
                                        >
                                            <CloudDownload size={20} />
                                            {t.btn_load} ({getCurrentModelSize()})
                                        </button>
                                    </div>
                                )}

                                {/* Main Action Button (Only visible if model is ready or loading) */}
                                {modelStatus !== 'idle' && (
                                    <button 
                                        onClick={runInference}
                                        disabled={modelStatus !== 'ready' || isComputing || !inputText}
                                        className={`absolute bottom-3 right-3 px-4 py-2 rounded-lg font-bold text-white shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isComputing ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        {isComputing ? <Activity className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                                        {isComputing ? t.status?.computing : getTaskBtnText(activeTask)}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Output */}
                        {result && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.result_label}</label>
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                                    
                                    {activeTask === 'sentiment' && (
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${result[0].label === 'POSITIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-slate-800 dark:text-white">{result[0].label}</div>
                                                <div className="text-sm text-slate-500">
                                                    {t.confidence}: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{((result[0].score ?? 0) * 100).toFixed(2)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(activeTask === 'generation' || activeTask === 'translation') && (
                                        <div>
                                            <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                                                {activeTask === 'generation' ? result[0].generated_text : result[0].translation_text}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </Modal>
  );
};
