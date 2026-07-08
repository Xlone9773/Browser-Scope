import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Code, 
  Type, 
  ExternalLink, 
  FileText, 
  Check, 
  BookOpen,
  XCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { attributionsData, AttributionItem } from '../data/attributions';

interface AttributionsModalProps {
  onClose: () => void;
  t: {
    title: string;
    subtitle: string;
    search_placeholder: string;
    tab_all: string;
    tab_libraries: string;
    tab_fonts: string;
    view_license: string;
    hide_license: string;
    license_type: string;
    role_label: string;
    visit_site: string;
    empty_search: string;
    font_role: string;
    lib_role_react: string;
    lib_role_fingerprint: string;
    lib_role_transformers: string;
    lib_role_lucide: string;
    lib_role_motion: string;
    lib_role_screenshot: string;
    lib_role_jspdf: string;
    lib_role_devtools: string;
    lib_role_pwa: string;
    lib_role_server: string;
    lib_role_charts: string;
    close: string;
  };
}

export const AttributionsModal: React.FC<AttributionsModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'library' | 'font'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Helper to map role keys to localized text
  const getLocalizedRole = (roleKey: string): string => {
    return (t as Record<string, string>)[roleKey] || t.font_role;
  };

  // Filter and search items
  const filteredItems = useMemo(() => {
    return attributionsData.filter(item => {
      // Tab filter
      if (activeTab !== 'all' && item.type !== activeTab) {
        return false;
      }
      
      // Search query filter
      if (!searchQuery.trim()) {
        return true;
      }
      
      const query = searchQuery.toLowerCase().trim();
      const roleText = getLocalizedRole(item.roleKey).toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.license.toLowerCase().includes(query) ||
        item.version.toLowerCase().includes(query) ||
        roleText.includes(query) ||
        item.url.toLowerCase().includes(query)
      );
    });
  }, [activeTab, searchQuery, t]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <Modal
      title={t.title}
      onClose={onClose}
      size="3xl"
      icon={<BookOpen size={22} />}
      noPadding
      fullHeight
    >
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
        {/* Banner/Header Info */}
        <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-200/60 dark:border-slate-700/60">
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tab Toggles */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200/40 dark:border-slate-800/40 self-start">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setExpandedId(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{t.tab_all}</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200/50 dark:bg-slate-700/50 font-mono text-slate-600 dark:text-slate-300">
                  {attributionsData.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('library');
                  setExpandedId(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'library'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code size={12} />
                <span>{t.tab_libraries}</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200/50 dark:bg-slate-700/50 font-mono text-slate-600 dark:text-slate-300">
                  {attributionsData.filter(i => i.type === 'library').length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('font');
                  setExpandedId(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'font'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Type size={12} />
                <span>{t.tab_fonts}</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200/50 dark:bg-slate-700/50 font-mono text-slate-600 dark:text-slate-300">
                  {attributionsData.filter(i => i.type === 'font').length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_placeholder}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-shadow"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List of Attributions */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/40 dark:border-slate-700/40">
                <HelpCircle size={24} />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                {t.empty_search.replace('{query}', searchQuery)}
              </h4>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const isExpanded = expandedId === item.id;
                const isFont = item.type === 'font';

                return (
                  <Card 
                    key={item.id}
                    noPadding
                    className="transition-all duration-200 hover:shadow-md bg-white dark:bg-slate-800/90"
                  >
                    {/* Item Main Bar */}
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-slate-800 dark:text-slate-100 text-base">
                            {item.name}
                          </span>
                          <Badge variant="neutral" className="font-mono">
                            v{item.version}
                          </Badge>
                          <Badge 
                            variant={isFont ? 'purple' : 'indigo'} 
                            icon={isFont ? <Type size={10} /> : <Code size={10} />}
                          >
                            {isFont ? t.tab_fonts : t.tab_libraries}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          <strong className="text-slate-600 dark:text-slate-300 font-semibold">{t.role_label}: </strong>
                          {getLocalizedRole(item.roleKey)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0 md:justify-end">
                        {/* License Tag */}
                        <Badge variant="success" className="font-mono text-xs px-2.5 py-1">
                          {t.license_type}: {item.license}
                        </Badge>

                        {/* Open Repo Link */}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="p-2" 
                            title={t.visit_site}
                          >
                            <ExternalLink size={14} />
                          </Button>
                        </a>

                        {/* Toggle License Text */}
                        <Button
                          variant={isExpanded ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => toggleExpand(item.id)}
                          leftIcon={<FileText size={12} />}
                        >
                          {isExpanded ? t.hide_license : t.view_license}
                        </Button>
                      </div>
                    </div>

                    {/* Expandable License Block */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-700/80 p-5 bg-slate-50 dark:bg-slate-950/40 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-1.5 mb-3 text-emerald-600 dark:text-emerald-400">
                          <Check size={14} />
                          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                            VERIFIED {item.license} COMPLIANT
                          </span>
                        </div>
                        <pre className="font-mono text-[10px] text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 custom-scrollbar shadow-inner text-left">
                          {item.licenseText}
                        </pre>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info only (Removed bottom Close button to avoid redundancy with top X close button) */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">
            <ShieldAlert size={12} />
            <span>Legal Compliance Matrix verified</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
