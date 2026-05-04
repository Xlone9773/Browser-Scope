
import React, { useState, useTransition, Suspense, lazy } from 'react';
import { Globe, Database, Activity, Sliders, Monitor, Terminal, Package, Loader2 } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { ModuleState } from './settings/ModulesTab';
import { Modal } from './ui/Modal';

const GeneralTab = lazy(() => import('./settings/GeneralTab').then(m => ({ default: m.GeneralTab })));
const NetworkTab = lazy(() => import('./settings/NetworkTab').then(m => ({ default: m.NetworkTab })));
const DisplayTab = lazy(() => import('./settings/DisplayTab').then(m => ({ default: m.DisplayTab })));
const StorageTab = lazy(() => import('./settings/StorageTab').then(m => ({ default: m.StorageTab })));
const ResourcesTab = lazy(() => import('./settings/ResourcesTab').then(m => ({ default: m.ResourcesTab })));
const DeveloperTab = lazy(() => import('./settings/DeveloperTab').then(m => ({ default: m.DeveloperTab })));
const ModulesTab = lazy(() => import('./settings/ModulesTab').then(m => ({ default: m.ModulesTab })));

interface SettingsModalProps {
  onClose: () => void;
  // Now accepts the root translation object to distribute to children
  t: Translation;
  themeColor: string;
  setThemeColor: (color: string) => void;
  animationStyle: string;
  setAnimationStyle: (style: string) => void;
  simpleMode: boolean;
  toggleSimpleMode: (value: boolean) => void;
  hideScrollbar: boolean;
  toggleHideScrollbar: (value: boolean) => void;
  globalHideScrollbar: boolean;
  toggleGlobalHideScrollbar: (value: boolean) => void;
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
    themeColor,
    setThemeColor,
    animationStyle,
    setAnimationStyle,
    simpleMode, 
    toggleSimpleMode, 
    hideScrollbar, 
    toggleHideScrollbar,
    globalHideScrollbar,
    toggleGlobalHideScrollbar,
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
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: 'general' | 'network' | 'display' | 'storage' | 'res' | 'dev' | 'mod') => {
      startTransition(() => {
          setActiveTab(tab);
      });
  };

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
                            onClick={() => handleTabChange('general')}
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
                            onClick={() => handleTabChange('network')}
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
                            onClick={() => handleTabChange('display')}
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
                            onClick={() => handleTabChange('storage')}
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
                            onClick={() => handleTabChange('res')}
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
                            onClick={() => handleTabChange('mod')}
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
                            onClick={() => handleTabChange('dev')}
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
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 custom-scrollbar relative">
                        {isPending && (
                            <div className="absolute inset-0 z-10 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-center items-center backdrop-blur-sm">
                                <Loader2 className="animate-spin text-indigo-500 mb-2" size={24} />
                            </div>
                        )}
                        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>}>
                        
                        {activeTab === 'general' && (
                            <GeneralTab 
                                t={settings.general} 
                                themeColor={themeColor}
                                setThemeColor={setThemeColor}
                                animationStyle={animationStyle}
                                setAnimationStyle={setAnimationStyle}
                                simpleMode={simpleMode} 
                                toggleSimpleMode={toggleSimpleMode} 
                                hideScrollbar={hideScrollbar}
                                toggleHideScrollbar={toggleHideScrollbar}
                                globalHideScrollbar={globalHideScrollbar}
                                toggleGlobalHideScrollbar={toggleGlobalHideScrollbar}
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
                                        {settings.developer.floating_state?.title || "Developer Tools is Floating"}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                        {settings.developer.floating_state?.desc || "The developer tools window has been detached from this modal for a better experience."}
                                    </p>
                                    <button 
                                        onClick={() => setDevToolsFloating(false)}
                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                                    >
                                        <Monitor size={16} />
                                        {settings.developer.floating_state?.return || "Return to Modal"}
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
                        </Suspense>

                    </div>
                </div>
            </>
        )}
    </Modal>
  );
};
