// src/components/CanvasPoisoningModal.tsx

import React, { useState } from 'react';
import { ShieldAlert, Tv, Type, Video, Cpu, Activity } from 'lucide-react';
import { Modal } from './ui/Modal';
import { PoisoningTranslations } from './canvas-poisoning/types';

import { AllTab } from './canvas-poisoning/AllTab';
import { RenderAudioTab } from './canvas-poisoning/RenderAudioTab';
import { FontsTab } from './canvas-poisoning/FontsTab';
import { GeometryTab } from './canvas-poisoning/GeometryTab';
import { MediaTab } from './canvas-poisoning/MediaTab';
import { HardwareTab } from './canvas-poisoning/HardwareTab';

interface CanvasPoisoningModalProps {
  onClose: () => void;
  t: PoisoningTranslations;
}

export const CanvasPoisoningModal: React.FC<CanvasPoisoningModalProps> = React.memo(({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'render_audio' | 'fonts' | 'geometry' | 'media' | 'hardware'>('all');

  return (
    <Modal
      title={t.title || 'Noise & Poisoning Detection'}
      onClose={onClose}
      size="lg"
      noPadding
    >
      {/* Tab Navigation header */}
      <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px] ${
            activeTab === 'all'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Activity size={16} />
          <span>{t.tab_all || 'Run All'}</span>
        </button>
        <button
          onClick={() => setActiveTab('render_audio')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px] ${
            activeTab === 'render_audio'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Tv size={16} />
          <span>{t.tab_render_audio || 'Render & Audio'}</span>
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px] ${
            activeTab === 'fonts'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Type size={16} />
          <span>{t.tab_font_farbling || 'Fonts & Farbling'}</span>
        </button>
        <button
          onClick={() => setActiveTab('geometry')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px] ${
            activeTab === 'geometry'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert size={16} />
          <span>{t.tab_geometry || 'Geometry & Layout'}</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px] ${
            activeTab === 'media'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Video size={16} />
          <span>{t.tab_media || 'Media Devices'}</span>
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex-1 py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px] ${
            activeTab === 'hardware'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Cpu size={16} />
          <span>{t.tab_hardware || 'Hardware Config'}</span>
        </button>
      </div>

      {/* Content wrapper with generous negative space */}
      <div className="p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900/40">
        {/* All Tab */}
        <div style={{ display: activeTab === 'all' ? 'block' : 'none' }}>
          <AllTab t={t} />
        </div>

        {/* Render Audio Tab */}
        <div style={{ display: activeTab === 'render_audio' ? 'block' : 'none' }}>
          <RenderAudioTab t={t} />
        </div>

        {/* Fonts & Farbling Tab */}
        <div style={{ display: activeTab === 'fonts' ? 'block' : 'none' }}>
          <FontsTab t={t} />
        </div>

        {/* Geometry & Layout Tab */}
        <div style={{ display: activeTab === 'geometry' ? 'block' : 'none' }}>
          <GeometryTab t={t} />
        </div>

        {/* Media Devices Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <MediaTab t={t} />
        </div>

        {/* Hardware Config Tab */}
        <div style={{ display: activeTab === 'hardware' ? 'block' : 'none' }}>
          <HardwareTab t={t} />
        </div>
      </div>
    </Modal>
  );
});

CanvasPoisoningModal.displayName = 'CanvasPoisoningModal';
export type { PoisoningTranslations };
