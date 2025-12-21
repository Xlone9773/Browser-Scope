
import React, { useState, useEffect } from 'react';
import { X, Smartphone, Hand, Keyboard, MousePointer2, PenTool, Film } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { VibrateTab } from './hardware/VibrateTab';
import { TouchTab } from './hardware/TouchTab';
import { KeyboardTab } from './hardware/KeyboardTab';
import { MouseTab } from './hardware/MouseTab';
import { PointerTab } from './hardware/PointerTab';
import { VideoTab } from './hardware/VideoTab';

interface HardwareToolsModalProps {
  onClose: () => void;
  t: Translation['hardwareToolsModal'];
}

export const HardwareToolsModal: React.FC<HardwareToolsModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'vibrate' | 'touch' | 'keyboard' | 'mouse' | 'pointer' | 'video'>('vibrate');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
        onClose();
    }, 300);
  };

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
            isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Smartphone className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('vibrate')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'vibrate' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Smartphone size={16} />
                <span className="hidden sm:inline">{t.tab_vibrate}</span>
            </button>
            <button onClick={() => setActiveTab('touch')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'touch' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Hand size={16} />
                <span className="hidden sm:inline">{t.tab_touch}</span>
            </button>
            <button onClick={() => setActiveTab('keyboard')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'keyboard' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Keyboard size={16} />
                <span className="hidden sm:inline">{t.tab_keyboard}</span>
            </button>
            <button onClick={() => setActiveTab('mouse')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'mouse' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <MousePointer2 size={16} />
                <span className="hidden sm:inline">{t.tab_mouse}</span>
            </button>
            <button onClick={() => setActiveTab('pointer')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'pointer' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <PenTool size={16} />
                <span className="hidden sm:inline">{t.tab_pointer}</span>
            </button>
            <button onClick={() => setActiveTab('video')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'video' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Film size={16} />
                <span className="hidden sm:inline">{t.tab_video}</span>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900">
            {activeTab === 'vibrate' && <VibrateTab t={t} />}
            {activeTab === 'touch' && <TouchTab t={t} />}
            {activeTab === 'keyboard' && <KeyboardTab t={t} />}
            {activeTab === 'mouse' && <MouseTab t={t} />}
            {activeTab === 'pointer' && <PointerTab t={t} />}
            {activeTab === 'video' && <VideoTab t={t} />}
        </div>

      </div>
    </div>
  );
};
