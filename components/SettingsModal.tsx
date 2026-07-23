
import React, { useState, Suspense, useTransition } from 'react';
import { Database, Activity, Sliders, Monitor, Terminal, Loader2, Package, Layers, Palette } from 'lucide-react';
import { Translation, Language } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

import { SelectColor } from './ui/Select';
import type { ModuleState } from './settings/ModulesTab';

const GeneralTab = React.lazy(() => import('./settings/GeneralTab').then(m => ({ default: m.GeneralTab })));
const AppearanceTab = React.lazy(() => import('./settings/AppearanceTab').then(m => ({ default: m.AppearanceTab })));
const StorageTab = React.lazy(() => import('./settings/StorageTab').then(m => ({ default: m.StorageTab })));
const ResourcesTab = React.lazy(() => import('./settings/ResourcesTab').then(m => ({ default: m.ResourcesTab })));
const DeveloperTab = React.lazy(() => import('./settings/DeveloperTab').then(m => ({ default: m.DeveloperTab })));
const ModulesTab = React.lazy(() => import('./settings/ModulesTab').then(m => ({ default: m.ModulesTab })));
const VersionsTab = React.lazy(() => import('./settings/VersionsTab').then(m => ({ default: m.VersionsTab })));

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
  enableUdp?: boolean;
  toggleEnableUdp?: (value: boolean) => void;
  showTabs: boolean;
  toggleShowTabs: (value: boolean) => void;
  showSearch: boolean;
  toggleShowSearch: (value: boolean) => void;
  imageExportScale: number;
  updateImageExportScale: (value: number) => void;
  pdfExportFormat: 'a4' | 'letter' | 'legal';
  updatePdfExportFormat: (value: 'a4' | 'letter' | 'legal') => void;
  pdfExportFont: 'auto' | 'helvetica' | 'times' | 'courier';
  updatePdfExportFont: (value: 'auto' | 'helvetica' | 'times' | 'courier') => void;
  searchScope: 'all' | 'category' | 'title' | 'value';
  updateSearchScope: (scope: 'all' | 'category' | 'title' | 'value') => void;
  searchMode: 'fuzzy' | 'exact';
  updateSearchMode: (mode: 'fuzzy' | 'exact') => void;
  hiddenCards: string[];
  setHiddenCards: (cards: string[]) => void;
  restoreAllNotifications: () => void;
  dismissedNotificationsCount: number;
  showQuickSummary: boolean;
  toggleShowQuickSummary: (val: boolean) => void;
  lang: string;
  bodyFont: string;
  updateBodyFont: (font: string) => void;
  modalTitleFont: string;
  updateModalTitleFont: (font: string) => void;
  codeFont: string;
  updateCodeFont: (font: string) => void;
  fontFix?: boolean;
  toggleFontFix?: (value: boolean) => void;
  isDevToolsFloating: boolean;
  setDevToolsFloating: (val: boolean) => void;
  moduleStates?: ModuleState[];
  appVersion?: string;
  updateServiceWorker?: (reloadPage?: boolean) => Promise<void>;
  manualCheckUpdate?: () => Promise<string>;
  lastCheckTime?: number;
  isCheckingUpdate?: boolean;
  needRefresh?: boolean;
  changeLang?: (lang: Language) => void;
  disableCache?: boolean;
  toggleDisableCache?: (val: boolean) => void;
  disableLazyLoading?: boolean;
  toggleDisableLazyLoading?: (val: boolean) => void;
  alwaysShowLoading?: boolean;
  toggleAlwaysShowLoading?: (val: boolean) => void;
  lazyTabChange?: boolean;
  toggleLazyTabChange?: (val: boolean) => void;
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
    enableUdp,
    toggleEnableUdp,
    showTabs,
    toggleShowTabs,
    showSearch,
    toggleShowSearch,
    imageExportScale,
    updateImageExportScale,
    pdfExportFormat,
    updatePdfExportFormat,
    pdfExportFont,
    updatePdfExportFont,
    searchScope: _searchScope,
    updateSearchScope: _updateSearchScope,
    searchMode: _searchMode,
    updateSearchMode: _updateSearchMode,
    hiddenCards,
    setHiddenCards,
    restoreAllNotifications,
    dismissedNotificationsCount,
    showQuickSummary,
    toggleShowQuickSummary,
    lang,
    isDevToolsFloating, 
    setDevToolsFloating,
    moduleStates = [],
    appVersion,
    updateServiceWorker,
    manualCheckUpdate,
    lastCheckTime,
    isCheckingUpdate,
    needRefresh,
    changeLang,
    bodyFont,
    updateBodyFont,
    modalTitleFont,
    updateModalTitleFont,
    codeFont,
    updateCodeFont,
    fontFix,
    toggleFontFix,
    disableCache = false,
    toggleDisableCache = () => {},
    disableLazyLoading = false,
    toggleDisableLazyLoading = () => {},
    alwaysShowLoading = false,
    toggleAlwaysShowLoading = () => {},
    lazyTabChange = false,
    toggleLazyTabChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'storage' | 'res' | 'dev' | 'mod' | 'ver'>(() => {
    try {
      const saved = sessionStorage.getItem('browserscope_settings_last_tab');
      if (saved && ['general', 'appearance', 'storage', 'res', 'dev', 'mod', 'ver'].includes(saved)) {
        return saved as 'general' | 'appearance' | 'storage' | 'res' | 'dev' | 'mod' | 'ver';
      }
    } catch {
      // Ignored
    }
    return 'appearance';
  });

  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: 'general' | 'appearance' | 'storage' | 'res' | 'dev' | 'mod' | 'ver') => {
      if (tab === activeTab) {
          return;
      }

      if (lazyTabChange) {
          startTransition(() => {
              setActiveTab(tab);
              try {
                 sessionStorage.setItem('browserscope_settings_last_tab', tab);
              } catch {}
          });
      } else {
          setActiveTab(tab);
          try {
             sessionStorage.setItem('browserscope_settings_last_tab', tab);
          } catch {}
      }
  };

  const isTabLoading = isPending;

  // Access structured settings
  const settings = t.settings;
  
  // Helper for Nav Titles
  const getNavTitle = (key: keyof Translation['settings']['nav']) => {
      return settings.nav[key];
  };

  return (
      <Modal
          title={settings.title}
          icon={<Sliders size={24} />}
          onClose={onClose}
          size="3xl"
          fullHeight={true}
          noPadding={true}
      >
          {({ close: _close }) => (
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
                              onClick={() => handleTabChange('appearance')}
                              className={`
                                  flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                                  flex-1 md:flex-none justify-center md:justify-start
                                  border-b-2 md:border-b-0 md:border-l-[3px]
                                  ${activeTab === 'appearance' 
                                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                              `}
                          >
                              <Palette size={16} />
                              {settings.nav?.appearance}
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
                              onClick={() => handleTabChange('ver')}
                              className={`
                                  flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                                  flex-1 md:flex-none justify-center md:justify-start
                                  border-b-2 md:border-b-0 md:border-l-[3px]
                                  ${activeTab === 'ver' 
                                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm md:shadow-none' 
                                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}
                              `}
                          >
                              <Layers size={16} />
                              {getNavTitle('versions') || 'Versions'}
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
                          {isTabLoading ? (
                              <div 
                                  className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200"
                                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                  }}
                                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                  }}
                              >
                                  <div className="flex flex-col items-center gap-3">
                                      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                  </div>
                              </div>
                          ) : null}
                          <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>}>
                          
                           {activeTab === 'appearance' ? (<AppearanceTab 
                              t={settings.general} 
                              themeColor={themeColor as SelectColor}
                              setThemeColor={setThemeColor}
                              animationStyle={animationStyle}
                              setAnimationStyle={setAnimationStyle}
                              simpleMode={simpleMode} 
                              toggleSimpleMode={toggleSimpleMode} 
                              hideScrollbar={hideScrollbar}
                              toggleHideScrollbar={toggleHideScrollbar}
                              globalHideScrollbar={globalHideScrollbar}
                              toggleGlobalHideScrollbar={toggleGlobalHideScrollbar}
                              disableBlur={disableBlur}
                              toggleDisableBlur={toggleDisableBlur}
                              disableAnimations={disableAnimations}
                              toggleDisableAnimations={toggleDisableAnimations}
                              fastAnimations={fastAnimations}
                              toggleFastAnimations={toggleFastAnimations}
                              collapseHeader={collapseHeader}
                              toggleCollapseHeader={toggleCollapseHeader}
                              showTabs={showTabs}
                              toggleShowTabs={toggleShowTabs}
                              showSearch={showSearch}
                              toggleShowSearch={toggleShowSearch}
                              translationDict={t}
                              hiddenCards={hiddenCards}
                              setHiddenCards={setHiddenCards}
                              restoreAllNotifications={restoreAllNotifications}
                              dismissedNotificationsCount={dismissedNotificationsCount}
                              showQuickSummary={showQuickSummary}
                              toggleShowQuickSummary={toggleShowQuickSummary}
                              bodyFont={bodyFont}
                              updateBodyFont={updateBodyFont}
                              modalTitleFont={modalTitleFont}
                              updateModalTitleFont={updateModalTitleFont}
                              codeFont={codeFont}
                              updateCodeFont={updateCodeFont}
                              lang={lang}
                              fontFix={fontFix}
                              toggleFontFix={toggleFontFix}
                          />) : null}

                          {activeTab === 'general' ? (<GeneralTab 
                              t={settings.general} 
                              timeFormat={timeFormat}
                              setTimeFormat={setTimeFormat}
                              enableUdp={enableUdp}
                              toggleEnableUdp={toggleEnableUdp}
                              hiddenCards={hiddenCards}
                              setHiddenCards={setHiddenCards}
                              restoreAllNotifications={restoreAllNotifications}
                              dismissedNotificationsCount={dismissedNotificationsCount}
                              translationDict={t}
                              showQuickSummary={showQuickSummary}
                              toggleShowQuickSummary={toggleShowQuickSummary}
                              lang={lang}
                              imageExportScale={imageExportScale}
                              updateImageExportScale={updateImageExportScale}
                              pdfExportFormat={pdfExportFormat}
                              updatePdfExportFormat={updatePdfExportFormat}
                              pdfExportFont={pdfExportFont}
                              updatePdfExportFont={updatePdfExportFont}
                          />) : null}

                          {activeTab === 'storage' ? (<StorageTab t={settings.storage} lang={lang} changeLang={changeLang} />) : null}

                          {activeTab === 'res' ? (<ResourcesTab t={settings.resources} />) : null}

                          {(activeTab === 'mod' && settings.modules) ? (
                              <ModulesTab 
                                  t={settings.modules} 
                                  modules={moduleStates} 
                                  disableCache={disableCache}
                                  toggleDisableCache={toggleDisableCache}
                                  disableLazyLoading={disableLazyLoading}
                                  toggleDisableLazyLoading={toggleDisableLazyLoading}
                                  alwaysShowLoading={alwaysShowLoading}
                                  toggleAlwaysShowLoading={toggleAlwaysShowLoading}
                                  lazyTabChange={lazyTabChange}
                                  toggleLazyTabChange={toggleLazyTabChange}
                              />
                          ) : null}

                          {activeTab === 'ver' && settings.versions ? (<VersionsTab 
                              t={settings.versions} 
                              appVersion={appVersion}
                              modules={moduleStates}
                              updateServiceWorker={updateServiceWorker}
                              manualCheckUpdate={manualCheckUpdate}
                              lastCheckTime={lastCheckTime}
                              isCheckingUpdate={isCheckingUpdate}
                              needRefresh={needRefresh}
                          />) : null}

                          {activeTab === 'dev' && settings.developer ? (isDevToolsFloating ? (<div className="flex flex-col items-center justify-center h-full text-center">
                              <Terminal size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                                  {settings.developer.floating_state?.title}
                              </h3>
                              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                  {settings.developer.floating_state?.desc}
                              </p>
                              <button 
                                  onClick={() => setDevToolsFloating(false)}
                                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                              >
                                  <Monitor size={16} />
                                  {settings.developer.floating_state?.return}
                              </button>
                          </div>) : (<DeveloperTab 
                              t={settings.developer} 
                              isFloating={isDevToolsFloating}
                              toggleFloat={() => setDevToolsFloating(true)}
                          />)) : null}
                          </Suspense>

                      </div>
                  </div>
              </>
          )}
      </Modal>
  );
};
