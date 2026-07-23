import React from "react";
import { Search, Settings2 } from "lucide-react";
import { Select, SelectColor } from "../ui/Select";
import { Translation } from "../../utils/i18n/types";

interface TabItem {
  id: "all" | "browser" | "environment" | "system" | "network" | "advanced";
  label: string;
  icon: React.ReactNode;
}

interface SearchBarAndTabsProps {
  showSearch: boolean;
  showTabs: boolean;
  showSearchSettings: boolean;
  setShowSearchSettings: (show: boolean) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchScope: "all" | "category" | "title" | "value";
  updateSearchScope: (scope: "all" | "category" | "title" | "value") => void;
  searchMode: "fuzzy" | "exact";
  updateSearchMode: (mode: "fuzzy" | "exact") => void;
  availableTabs: TabItem[];
  activeTab: "all" | "browser" | "environment" | "system" | "network" | "advanced";
  setActiveTab: (tab: "all" | "browser" | "environment" | "system" | "network" | "advanced") => void;
  setSlideDirection: (dir: number) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  activeTabRef: React.RefObject<HTMLButtonElement | null>;
  themeColor: string;
  t: Translation;
}

export const SearchBarAndTabs: React.FC<SearchBarAndTabsProps> = React.memo(({
  showSearch,
  showTabs,
  showSearchSettings,
  setShowSearchSettings,
  handleSearch,
  searchScope,
  updateSearchScope,
  searchMode,
  updateSearchMode,
  availableTabs,
  activeTab,
  setActiveTab,
  setSlideDirection,
  tabsContainerRef,
  activeTabRef,
  themeColor,
  t,
}) => {
  if (!showTabs && !showSearch) return null;
  if (availableTabs.length <= 1 && !showSearch) return null;

  return (
    <div className="sticky top-0 z-20 pt-4 -mt-4 bg-[#f8fafc]/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col space-y-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
      {showSearch ? (
        <div className="relative px-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              onChange={handleSearch}
              placeholder={t.search?.placeholder || "Search categories or keywords..."}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-slate-700 dark:text-slate-100 transition-shadow"
            />
          </div>
          <button
            onClick={() => setShowSearchSettings(!showSearchSettings)}
            title={t.search?.settingsTooltip || "Search Settings"}
            aria-label={t.search?.settingsTooltip || "Search Settings"}
            className={`p-2 rounded-xl border transition-colors flex-shrink-0 ${
              showSearchSettings
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            <Settings2 size={20} />
            <span className="sr-only">{t.search?.settingsTooltip || "Search Settings"}</span>
          </button>
        </div>
      ) : null}

      {showSearch && showSearchSettings ? (
        <div className="px-1 mt-1 mb-2">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t.settings?.general?.searchScope?.title || "Search Scope"}
              </label>
              <Select
                value={searchScope}
                onChange={(val) =>
                  updateSearchScope(val as "all" | "category" | "title" | "value")
                }
                options={[
                  { id: "all", label: t.settings?.general?.searchScope?.options?.all || "All Text" },
                  { id: "category", label: t.settings?.general?.searchScope?.options?.category || "Category" },
                  { id: "title", label: t.settings?.general?.searchScope?.options?.title || "Title" },
                  { id: "value", label: t.settings?.general?.searchScope?.options?.value || "Value" },
                ]}
                color={themeColor as SelectColor}
                size="sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t.settings?.general?.searchMode?.title || "Search Mode"}
              </label>
              <Select
                value={searchMode}
                onChange={(val) => updateSearchMode(val as "fuzzy" | "exact")}
                options={[
                  { id: "fuzzy", label: t.settings?.general?.searchMode?.options?.fuzzy || "Fuzzy" },
                  { id: "exact", label: t.settings?.general?.searchMode?.options?.exact || "Exact" },
                ]}
                color={themeColor as SelectColor}
                size="sm"
              />
            </div>
          </div>
        </div>
      ) : null}

      {showTabs && availableTabs.length > 1 ? (
        <div
          className="flex space-x-2 overflow-x-auto scrollbar-hide px-1"
          ref={tabsContainerRef as React.RefObject<HTMLDivElement>}
        >
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              ref={activeTab === tab.id ? (activeTabRef as React.RefObject<HTMLButtonElement>) : null}
              onClick={() => {
                const newIndex = availableTabs.findIndex((t) => t.id === tab.id);
                const oldIndex = availableTabs.findIndex((t) => t.id === activeTab);
                setSlideDirection(newIndex > oldIndex ? 1 : -1);
                setActiveTab(tab.id);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
});
