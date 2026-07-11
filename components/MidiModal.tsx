
import React, { useState, useEffect, useRef } from 'react';
import { Music, Activity, Terminal, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';


interface MidiModalProps {
  onClose: () => void;
  t: Translation['midiModal'];
}

type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface MIDIPort {
  id: string;
  name?: string;
  manufacturer?: string;
  state: 'connected' | 'disconnected';
  type: 'input' | 'output';
}

interface MIDIInput extends MIDIPort {
  onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

interface MIDIOutput extends MIDIPort {
  send(data: number[] | Uint8Array, timestamp?: number): void;
}

interface MIDIMessageEvent extends Event {
  data: Uint8Array;
}

interface MIDIAccess extends EventTarget {
  inputs: Map<string, MIDIInput>;
  outputs: Map<string, MIDIOutput>;
  onstatechange: ((event: Event) => void) | null;
}

interface CustomOscillatorNode extends OscillatorNode {
  gainNode?: GainNode;
}

export const MidiModal: React.FC<MidiModalProps> = ({ onClose, t }) => {
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [_outputs, setOutputs] = useState<MIDIOutput[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Audio Config
  const [waveform, setWaveform] = useState<Waveform>('triangle');
  const [octaveShift, setOctaveShift] = useState(0);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  // Refs for audio context to persist
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<number, CustomOscillatorNode>>(new Map());
  const logContainerRef = useRef<HTMLDivElement>(null);
  const handleMidiMessageRef = useRef(handleMidiMessage);
  handleMidiMessageRef.current = handleMidiMessage;

  // Initialize Web Audio
  useEffect(() => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
          audioContextRef.current = new AudioContext();
      }
      return () => {
          audioContextRef.current?.close();
      };
  }, []);

  // Initialize Web MIDI
  useEffect(() => {
      const initMIDI = async () => {
          try {
              const nav = navigator as unknown as { requestMIDIAccess?: () => Promise<MIDIAccess> };
              if (nav.requestMIDIAccess) {
                  const midiAccess = await nav.requestMIDIAccess();
                  
                  const updateDevices = () => {
                      setInputs(Array.from(midiAccess.inputs.values()));
                      setOutputs(Array.from(midiAccess.outputs.values()));
                  };

                  updateDevices();
                  midiAccess.onstatechange = updateDevices;

                  // Attach listeners to all inputs
                  midiAccess.inputs.forEach((input: MIDIInput) => {
                      input.onmidimessage = (e) => handleMidiMessageRef.current(e);
                  });
              } else {
                  addLog("Web MIDI API not supported in this browser.");
              }
          } catch (e: unknown) {
              addLog(`MIDI Access Failed: ${e}`);
          }
      };
      initMIDI();
  }, []);

  // Auto-scroll logs
  useEffect(() => {
      if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
  }, [logs]);

  function addLog(msg: string) {
      const time = new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 } as Intl.DateTimeFormatOptions);
      setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
  };

  function handleMidiMessage(event: MIDIMessageEvent) {
      const [status, data1, data2] = event.data;
      const command = status & 0xf0;
      // const channel = status & 0x0f;
      
      if (command === 144 && data2 > 0) { // Note On
          playNote(data1, data2);
          addLog(`${t.note} On: ${data1} (${getNoteName(data1)}) ${t.velocity}: ${data2}`);
      } else if (command === 128 || (command === 144 && data2 === 0)) { // Note Off
          stopNote(data1);
          addLog(`${t.note} Off: ${data1}`);
      } else {
          // Other messages (CC, Pitch Bend, etc)
          addLog(`CC/Sys: ${status} ${data1} ${data2}`);
      }
  };

  const playNote = (midiNote: number, velocity: number = 100) => {
      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Stop existing note if playing (re-trigger)
      if (oscillatorsRef.current.has(midiNote)) {
          stopNote(midiNote);
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = waveform;
      // Convert MIDI note to frequency: f = 440 * 2^((n-69)/12)
      const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Velocity gain
      const vol = (velocity / 127) * 0.3; // Max volume 0.3 to avoid clipping
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01); // Attack

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();

      oscillatorsRef.current.set(midiNote, osc);
      // Store gain node on osc object safely via interface
      (osc as CustomOscillatorNode).gainNode = gainNode;

      setActiveNotes(prev => new Set(prev).add(midiNote));
  };

  const stopNote = (midiNote: number) => {
      const osc = oscillatorsRef.current.get(midiNote);
      if (osc) {
          const ctx = audioContextRef.current;
          if (ctx) {
              const gainNode = (osc as CustomOscillatorNode).gainNode;
              if (gainNode) {
                  // Release envelope
                  gainNode.gain.cancelScheduledValues(ctx.currentTime);
                  gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                  osc.stop(ctx.currentTime + 0.1);
              }
          } else {
              osc.stop();
          }
          oscillatorsRef.current.delete(midiNote);
          setActiveNotes(prev => {
              const next = new Set(prev);
              next.delete(midiNote);
              return next;
          });
      }
  };

  const handleKeyEnter = (e: React.MouseEvent, note: number) => {
      if (e.buttons === 1) { // Primary button pressed
          playNote(note);
      }
  };

  const getNoteName = (midiNote: number) => {
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const octave = Math.floor(midiNote / 12) - 1;
      const note = notes[midiNote % 12];
      return `${note}${octave}`;
  };

  // Virtual Keyboard Render Logic
  // Render range: C2 (36) to C6 (84). 4 Octaves.
  const startKey = 36 + (octaveShift * 12);
  const endKey = 84 + (octaveShift * 12); 
  const _keys = [];
  
  // Pre-calculate visual layout
  // White keys are basic units. Black keys overlay.
  const whiteKeyWidth = 40;
  const blackKeyWidth = 24;
  const whiteKeyHeight = 160;
  const blackKeyHeight = 100;

  // Track white key positions
  let xPos = 0;
  const keyElements: React.JSX.Element[] = [];
  
  // Render White Keys First
  for (let i = startKey; i <= endKey; i++) {
      const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
      if (!isBlack) {
          const isActive = activeNotes.has(i);
          keyElements.push(
              <div
                  key={i}
                  onMouseDown={() => playNote(i)}
                  onMouseUp={() => stopNote(i)}
                  onMouseEnter={(e) => handleKeyEnter(e, i)}
                  onMouseLeave={() => stopNote(i)} 
                  className={`absolute top-0 border border-slate-300 dark:border-slate-600 rounded-b-md cursor-pointer transition-colors active:scale-[0.99] origin-top select-none ${isActive ? 'bg-indigo-400 !border-indigo-500 shadow-[0_0_10px_rgba(129,140,248,0.5)] z-10' : 'bg-white dark:bg-slate-300 hover:bg-slate-100'}`}
                  style={{ 
                      left: xPos, 
                      width: whiteKeyWidth, 
                      height: whiteKeyHeight,
                      zIndex: 1
                  }}
              >
                  <div className="absolute bottom-2 w-full text-center text-[10px] text-slate-400 font-medium pointer-events-none select-none">
                      {i % 12 === 0 ? `C${Math.floor(i/12)-1}` : ''}
                  </div>
              </div>
          );
          xPos += whiteKeyWidth;
      }
  }

  // Render Black Keys on top
  xPos = 0; // Reset to track position based on white keys
  for (let i = startKey; i <= endKey; i++) {
      const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
      if (!isBlack) {
          xPos += whiteKeyWidth;
      } else {
          // Black key is positioned at xPos (end of previous white key) minus half black width
          const isActive = activeNotes.has(i);
          keyElements.push(
              <div
                  key={i}
                  onMouseDown={() => playNote(i)}
                  onMouseUp={() => stopNote(i)}
                  onMouseEnter={(e) => handleKeyEnter(e, i)}
                  onMouseLeave={() => stopNote(i)}
                  className={`absolute top-0 border border-black rounded-b-sm cursor-pointer transition-colors active:scale-[0.98] origin-top select-none ${isActive ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]' : 'bg-slate-900 hover:bg-slate-800'}`}
                  style={{ 
                      left: xPos - (blackKeyWidth / 2), 
                      width: blackKeyWidth, 
                      height: blackKeyHeight,
                      zIndex: 20
                  }}
              />
          );
      }
  }

  const containerWidth = xPos;

  return (
    <Modal
        title={t.title}
        icon={<Music size={24} />}
        onClose={onClose}
        size="4xl"
        fullHeight
        noPadding
    >
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Top Bar: Devices & Config */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                
                {/* Inputs */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                        <ArrowRightLeft size={12} /> {t.inputs}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {inputs.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">{t.no_inputs}</span>
                        ) : (
                            inputs.map(input => (
                                <span key={input.id} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded border border-green-100 dark:border-green-800 flex items-center gap-1">
                                    <Activity size={10} className="animate-pulse" />
                                    {input.name}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                {/* Synth Controls */}
                <div className="space-y-1 md:col-span-2 flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">{t.waveform}</label>
                        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                            {(['sine', 'square', 'sawtooth', 'triangle'] as Waveform[]).map(w => (
                                <button
                                    key={w}
                                    onClick={() => setWaveform(w)}
                                    className={`flex-1 py-1 text-[10px] font-medium rounded transition-all ${waveform === w ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {t[w]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-32">
                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">{t.octave}</label>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setOctaveShift(Math.max(-2, octaveShift - 1))} className="p-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">-</button>
                            <span className="flex-1 text-center font-mono text-sm dark:text-white">{octaveShift > 0 ? '+' : ''}{octaveShift}</span>
                            <button onClick={() => setOctaveShift(Math.min(2, octaveShift + 1))} className="p-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300">+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area: Piano */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-100 dark:bg-slate-950 relative shadow-inner flex items-center justify-center custom-scrollbar select-none">
                <div className="relative h-[180px] my-auto shadow-2xl rounded-b-lg origin-center" style={{ width: containerWidth }}>
                    {keyElements}
                    {/* Synth Line Decoration */}
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-30" />
                </div>
                
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Log Console */}
            <div className="h-48 bg-slate-900 border-t border-slate-700 flex flex-col font-mono text-xs">
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-2 font-bold uppercase tracking-wider">
                        <Terminal size={14} /> {t.log}
                    </span>
                    <button 
                        onClick={() => setLogs([])}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                    >
                        <RefreshCw size={12} /> {t.clear}
                    </button>
                </div>
                <div ref={logContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1 text-green-400/90 scrollbar-thin scrollbar-thumb-slate-700 select-text">
                    {logs.length === 0 && <span className="text-slate-600 italic">Waiting for MIDI signals...</span>}
                    {logs.slice().reverse().map((log, i) => (
                        <div key={i} className="border-b border-slate-800/50 pb-0.5 last:border-0 hover:bg-slate-800/50 transition-colors">
                            <span className="opacity-50 mr-2">&gt;</span>{log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </Modal>
  );
};
