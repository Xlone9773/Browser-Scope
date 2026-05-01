
import React, { useState } from 'react';
import { Globe, Database, Activity, Sliders, Monitor, Terminal, Package } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { GeneralTab } from './settings/GeneralTab';
import { NetworkTab } from './settings/NetworkTab';
import { DisplayTab } from './settings/DisplayTab';
import { StorageTab } from './settings/StorageTab';
import { ResourcesTab } from './settings/ResourcesTab';
import { DeveloperTab } from './settings/DeveloperTab';
import { ModulesTab, ModuleState } from './settings/ModulesTab';
import { Modal } from './ui/Modal';

interface SettingsModalProps {
  onClose: () => void;
  // Now accepts the root translation object to distribute to children
  t: Translation;
  simpleMode: boolean;
  toggleSimpleMode: (value: boolean) => void;
  hideScrollbar: boolean;
  toggleHideScrollbar: (value: boolean) => void;
  timeFormat: '12' | '24';
  setTimeFormat: (format: '12' | '24') => void;
  disableBlur: boolean;
  toggleDisableBlur: (value: boolean) => void;
  disableAnimations: boolean;
  toggleDisableAnimations: (value: boolean) => void;
  fastAnimations: boolean;
  toggleFastAnimations: (value: boolean) => void;
  collapseHeader: boolean;
  toggleCollapseHeader: (value: boolean) => void;
  hiddenCards: string[];
  setHiddenCards: (cards: string[]) => void;
  isDevToolsFloating: boolean;
  setDevToolsFloating: (val: boolean) => void;
  moduleStates?: ModuleState[];
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
    disableAnimations,
    toggleDisableAnimations,
    fastAnimations,
    toggleFastAnimations,
    collapseHeader,
    toggleCollapseHeader,
    hiddenCards,
    setHiddenCards,
    isDevToolsFloating, 
    setDevToolsFloating,
    moduleStates = [] 
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'network' | 'display' | 'storage' | 'res' | 'dev' | 'mod'>('general');
  
  // Display Test State (Lifted up as it overlays everything)
  const [fullScreenColor, setFullScreenColor] = useState<string | null>(null);

  // Access structured settings
  const settings = t.settings;
  
  // Helper for Nav Titles
  const getNavTitle = (key: keyof Translation['settings']['nav']) => {
      return settings.nav[key];
  };

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
        title={settings.title}
        icon={<Sliders size={24} />}
        onClose={onClose}
        size="3xl"
        fullHeight={true}
        noPadding={true}
    >
        {({ close }) => (
            <>
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
                            {getNavTitle('general')}
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
                            {getNavTitle('network')}
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
                            {getNavTitle('display')}
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
                            {getNavTitle('storage')}
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
                            {getNavTitle('resources')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('mod')}
                            className={`
                                flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                                flex-1 md:flex-none justify-center md:justify-start
                                border-b-2 md:border-b-0 md:border-l-[3px]
                                ${activeTab === 'mod' 
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                            `}
                        >
                            <Package size={16} />
                            {getNavTitle('modules')}
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
                            {getNavTitle('developer')}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
                        
                        {activeTab === 'general' && (
                            <GeneralTab 
                                t={settings.general} 
                                simpleMode={simpleMode} 
                                toggleSimpleMode={toggleSimpleMode} 
                                hideScrollbar={hideScrollbar}
                                toggleHideScrollbar={toggleHideScrollbar}
                                timeFormat={timeFormat}
                                setTimeFormat={setTimeFormat}
                                disableBlur={disableBlur}
                                toggleDisableBlur={toggleDisableBlur}
                                disableAnimations={disableAnimations}
                                toggleDisableAnimations={toggleDisableAnimations}
                                fastAnimations={fastAnimations}
                                toggleFastAnimations={toggleFastAnimations}
                                collapseHeader={collapseHeader}
                                toggleCollapseHeader={toggleCollapseHeader}
                                hiddenCards={hiddenCards}
                                setHiddenCards={setHiddenCards}
                                translationDict={t}
                            />
                        )}

                        {activeTab === 'network' && (
                            <NetworkTab t={settings.network} />
                        )}

                        {activeTab === 'display' && (
                            <DisplayTab t={settings.display} onColorSelect={setFullScreenColor} />
                        )}

                        {activeTab === 'storage' && (
                            <StorageTab t={settings.storage} />
                        )}

                        {activeTab === 'res' && (
                            <ResourcesTab t={settings.resources} />
                        )}

                        {activeTab === 'mod' && settings.modules && (
                            <ModulesTab t={settings.modules} modules={moduleStates} />
                        )}

                        {activeTab === 'dev' && settings.developer && (
                            isDevToolsFloating ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Terminal size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                                        Developer Tools is Floating
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                        The developer tools window has been detached from this modal for a better experience.
                                    </p>
                                    <button 
                                        onClick={() => setDevToolsFloating(false)}
                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                                    >
                                        <Monitor size={16} />
                                        Return to Modal
                                    </button>
                                </div>
                            ) : (
                                <DeveloperTab 
                                    t={settings.developer} 
                                    isFloating={isDevToolsFloating}
                                    toggleFloat={() => setDevToolsFloating(true)}
                                />
                            )
                        )}

                    </div>
                </div>
            </>
        )}
    </Modal>
  );
};
