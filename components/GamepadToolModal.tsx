
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2 } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface GamepadToolModalProps {
  onClose: () => void;
  t: Translation['gamepadTool'];
}

export const GamepadToolModal: React.FC<GamepadToolModalProps> = ({ onClose, t }) => {
  // Gamepad State
  const [gamepads, setGamepads] = useState<(Gamepad | null)[]>([]);
  const requestRef = useRef<number | null>(null);

  // Gamepad Polling
  const warnedRef = useRef(false);

  useEffect(() => {
      const scanGamepads = () => {
          const pads: (Gamepad | null)[] = [];
          try {
              if (navigator.getGamepads) {
                  const rawPads = navigator.getGamepads();
                  if (rawPads && typeof rawPads.length === 'number') {
                      for (let i = 0; i < rawPads.length; i++) {
                          pads.push(rawPads[i]);
                      }
                  }
              }
          } catch (e) {
              if (!warnedRef.current) {
                  console.warn("Gamepad API not supported or disabled", e);
                  warnedRef.current = true;
              }
          }
          // Convert GamepadList to Array and filter out nulls for checking, but keep index structure
          setGamepads(pads);
          requestRef.current = requestAnimationFrame(scanGamepads);
      };

      requestRef.current = requestAnimationFrame(scanGamepads);

      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
  }, []);

  const activeGamepad = gamepads.find(gp => gp !== null);

  return (
    <Modal
        title={t.title}
        icon={<Gamepad2 size={24} />}
        onClose={onClose}
        size="3xl"
        fullHeight
    >
        <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            {!activeGamepad ? (
                <div className="text-center text-slate-400 flex flex-col items-center gap-4">
                    <Gamepad2 size={64} className="opacity-20" />
                    <p>{t.no_gamepad}</p>
                    <p className="text-xs opacity-70">{t.connect_instruction}</p>
                </div>
            ) : (
                <div className="w-full max-w-lg">
                    <div className="mb-6 text-center">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{activeGamepad.id}</h3>
                        <div className="text-xs text-slate-500 font-mono mt-1">
                            {activeGamepad.buttons.length} Buttons • {activeGamepad.axes.length} Axes
                        </div>
                    </div>

                    {/* Visualizer */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                        {/* Buttons Grid */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
                            {activeGamepad.buttons.map((btn, idx) => (
                                <div key={idx} className={`flex flex-col items-center p-2 rounded-lg border transition-all ${btn.pressed ? 'bg-indigo-500 border-indigo-600 text-white shadow-md scale-95' : 'bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-400'}`}>
                                    <span className="text-[10px] font-bold mb-1">B{idx}</span>
                                    <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-current opacity-50" style={{ width: `${btn.value * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Axes */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">Left Stick</div>
                                <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full relative border border-slate-200 dark:border-slate-600 shadow-inner">
                                    <div 
                                        className="w-8 h-8 bg-indigo-500 rounded-full absolute shadow-lg transition-transform duration-75"
                                        style={{
                                            top: '50%', left: '50%',
                                            marginTop: -16, marginLeft: -16,
                                            transform: `translate(${activeGamepad.axes[0] * 40}px, ${activeGamepad.axes[1] * 40}px)`
                                        }}
                                    />
                                </div>
                                <div className="text-center font-mono text-[10px] text-slate-400">
                                    {activeGamepad.axes[0]?.toFixed(2)}, {activeGamepad.axes[1]?.toFixed(2)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">Right Stick</div>
                                <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full relative border border-slate-200 dark:border-slate-600 shadow-inner">
                                    <div 
                                        className="w-8 h-8 bg-indigo-500 rounded-full absolute shadow-lg transition-transform duration-75"
                                        style={{
                                            top: '50%', left: '50%',
                                            marginTop: -16, marginLeft: -16,
                                            transform: `translate(${activeGamepad.axes[2] * 40}px, ${activeGamepad.axes[3] * 40}px)`
                                        }}
                                    />
                                </div>
                                <div className="text-center font-mono text-[10px] text-slate-400">
                                    {activeGamepad.axes[2]?.toFixed(2)}, {activeGamepad.axes[3]?.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Modal>
  );
};

