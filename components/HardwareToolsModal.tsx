
import React, { useState } from 'react';
import { Smartphone, Hand, Keyboard, MousePointer2, PenTool, Film } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { VibrateTab } from './hardware/VibrateTab';
import { TouchTab } from './hardware/TouchTab';
import { KeyboardTab } from './hardware/KeyboardTab';
import { MouseTab } from './hardware/MouseTab';
import { PointerTab } from './hardware/PointerTab';
import { VideoTab } from './hardware/VideoTab';
import { Modal } from './ui/Modal';

interface HardwareToolsModalProps {
  onClose: () => void;
  t: Translation['hardwareToolsModal'];
  values: Translation['values'];
  labels: Translation['labels'];
}

export const HardwareToolsModal: React.FC<HardwareToolsModalProps> = ({ onClose, t, values, labels }) => {
  const [activeTab, setActiveTab] = useState<'vibrate' | 'touch' | 'keyboard' | 'mouse' | 'pointer' | 'video'>('vibrate');

  return (
    <Modal
        title={t.title}
        icon={<Smartphone size={24} />}
        onClose={onClose}
        size="4xl"
        fullHeight
        noPadding
    >
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
            {activeTab === 'video' && <VideoTab t={t} values={values} labels={labels} />}
        </div>
    </Modal>
  );
};
