
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Globe, CheckCircle, Search, User } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';

interface SpeechExplorerModalProps {
  onClose: () => void;
  t: Translation['speechModal'];
}

export const SpeechExplorerModal: React.FC<SpeechExplorerModalProps> = ({ onClose, t }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [languages, setLanguages] = useState<{id: string, label: string}[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingVoiceURI, setPlayingVoiceURI] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
        const vs = window.speechSynthesis.getVoices();
        // Sort: Default first, then by Lang, then Name
        vs.sort((a, b) => {
            if (a.default && !b.default) return -1;
            if (!a.default && b.default) return 1;
            return a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name);
        });
        setVoices(vs);
        
        // Extract unique langs
        const langMap = new Map<string, string>();
        vs.forEach(v => {
            // Only keep base lang code for grouping? No, keep full code for precision
            langMap.set(v.lang, v.lang); 
        });
        const langOpts = Array.from(langMap.keys()).sort().map(l => ({ id: l, label: l }));
        setLanguages([{ id: 'all', label: 'All Languages' }, ...langOpts]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
      let res = voices;
      if (selectedLang !== 'all') {
          res = res.filter(v => v.lang === selectedLang);
      }
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          res = res.filter(v => v.name.toLowerCase().includes(lower) || v.lang.toLowerCase().includes(lower));
      }
      setFilteredVoices(res);
  }, [voices, selectedLang, searchTerm]);

  const playSample = (voice: SpeechSynthesisVoice) => {
      window.speechSynthesis.cancel();
      const text = `Hello, my name is ${voice.name}. This is a voice test.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      
      utterance.onstart = () => setPlayingVoiceURI(voice.voiceURI);
      utterance.onend = () => setPlayingVoiceURI(null);
      utterance.onerror = () => setPlayingVoiceURI(null);
      
      window.speechSynthesis.speak(utterance);
  };

  return (
    <Modal
        title={t.title}
        icon={<Mic size={24} />}
        onClose={onClose}
        size="3xl"
        fullHeight
        noPadding
    >
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Controls */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search voices..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
                <Select 
                    value={selectedLang}
                    options={languages}
                    onChange={setSelectedLang}
                    color="indigo"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {voices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <p>{t.loading}</p>
                    </div>
                ) : filteredVoices.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        No voices match your filter.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredVoices.map((voice) => (
                            <div key={voice.voiceURI} className={`p-4 rounded-xl border transition-all hover:shadow-md flex flex-col gap-2 ${playingVoiceURI === voice.voiceURI ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{voice.name}</h3>
                                    </div>
                                    {voice.default && (
                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <CheckCircle size={10} /> {t.default}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                        <Globe size={12} /> {voice.lang}
                                    </span>
                                    <span>
                                        {voice.localService ? t.local : t.remote}
                                    </span>
                                </div>

                                <button 
                                    onClick={() => playSample(voice)}
                                    className={`mt-2 w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${playingVoiceURI === voice.voiceURI ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                >
                                    {playingVoiceURI === voice.voiceURI ? (
                                        <>Playing...</>
                                    ) : (
                                        <><Play size={12} /> {t.play}</>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs text-slate-400">
                Total Voices: {voices.length}
            </div>
        </div>
    </Modal>
  );
};
