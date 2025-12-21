
import React, { useState } from 'react';
import { Globe, Database, Activity, Sliders, Monitor, Terminal } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { GeneralTab } from './settings/GeneralTab';
import { NetworkTab } from './settings/NetworkTab';
import { DisplayTab } from './settings/DisplayTab';
import { StorageTab } from './settings/StorageTab';
import { ResourcesTab } from './settings/ResourcesTab';
import { DeveloperTab } from './settings/DeveloperTab';
import { Modal } from './ui/Modal';

interface SettingsModalProps {
  onClose: () => void;
  t: Translation['settingsModal'];
  simpleMode: boolean;
  toggleSimpleMode: (value: boolean) => void;
  hideScrollbar: boolean;
  toggleHideScrollbar: (value: boolean) => void;
  timeFormat: '12' | '24';
  setTimeFormat: (format: '12' | '24') => void;
  disableBlur: boolean;
  toggleDisableBlur: (value: boolean) => void;
  isDevToolsFloating: boolean;
  setDevToolsFloating: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    onClose, 
    t, 
    simpleMode, 
    toggleSimpleMode, 
    hideScrollbar, 
    toggleHideScrollbar,
    timeFormat,
    setTimeFormat,
    disableBlur,
    toggleDisableBlur,
    isDevToolsFloating, 
    setDevToolsFloating 
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'network' | 'display' | 'storage' | 'res' | 'dev'>('general');
  
  // Display Test State (Lifted up as it overlays everything)
  const [fullScreenColor, setFullScreenColor] = useState<string | null>(null);

  // Full Screen Color Overlay (Special case that overrides the Modal)
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
        title={t.title}
        icon={<Sliders size={24} />}
        onClose={onClose}
        size="3xl"
        fullHeight={true}
        noPadding={true}
    >
        {/* Layout Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-full">
            
            {/* Navigation Tabs */}
            <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 shrink-0 md:w-56 overflow-x-auto md:overflow-visible scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'general' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Sliders size={16} />
                    {t.tab_general}
                </button>
                <button 
                    onClick={() => setActiveTab('network')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'network' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Globe size={16} />
                    {t.tab_network}
                </button>
                <button 
                    onClick={() => setActiveTab('display')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'display' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Monitor size={16} />
                    {t.tab_display}
                </button>
                <button 
                    onClick={() => setActiveTab('storage')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'storage' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Database size={16} />
                    {t.tab_storage}
                </button>
                <button 
                    onClick={() => setActiveTab('res')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'res' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Activity size={16} />
                    {t.tab_resources}
                </button>
                <button 
                    onClick={() => setActiveTab('dev')}
                    className={`
                        flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                        flex-1 md:flex-none justify-center md:justify-start
                        border-b-2 md:border-b-0 md:border-l-[3px]
                        ${activeTab === 'dev' 
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    `}
                >
                    <Terminal size={16} />
                    {t.tab_developer}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
                
                {activeTab === 'general' && (
                    <GeneralTab 
                        t={t} 
                        simpleMode={simpleMode} 
                        toggleSimpleMode={toggleSimpleMode} 
                        hideScrollbar={hideScrollbar}
                        toggleHideScrollbar={toggleHideScrollbar}
                        timeFormat={timeFormat}
                        setTimeFormat={setTimeFormat}
                        disableBlur={disableBlur}
                        toggleDisableBlur={toggleDisableBlur}
                    />
                )}

                {activeTab === 'network' && (
                    <NetworkTab t={t} />
                )}

                {activeTab === 'display' && (
                    <DisplayTab t={t} onColorSelect={setFullScreenColor} />
                )}

                {activeTab === 'storage' && (
                    <StorageTab t={t} />
                )}

                {activeTab === 'res' && (
                    <ResourcesTab t={t} />
                )}

                {activeTab === 'dev' && (
                    <DeveloperTab 
                        t={t} 
                        isFloating={isDevToolsFloating}
                        toggleFloat={() => setDevToolsFloating(!isDevToolsFloating)}
                    />
                )}

            </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                {t.close}
            </button>
        </div>
    </Modal>
  );
};
