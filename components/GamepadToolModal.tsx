
import React, { useState, useEffect, useRef } from 'react';
import { X, Gamepad2, Bluetooth, Search, AlertCircle, Radio } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface GamepadToolModalProps {
  onClose: () => void;
  t: Translation['gamepadTool'];
}

export const GamepadToolModal: React.FC<GamepadToolModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'gamepad' | 'bluetooth'>('gamepad');
  
  // Gamepad State
  const [gamepads, setGamepads] = useState<(Gamepad | null)[]>([]);
  const requestRef = useRef<number | null>(null);

  // Bluetooth State
  const [btDevices, setBtDevices] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [btError, setBtError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Gamepad Polling
  useEffect(() => {
      if (activeTab !== 'gamepad') return;

      const scanGamepads = () => {
          const pads = navigator.getGamepads ? navigator.getGamepads() : [];
          // Convert GamepadList to Array and filter out nulls for checking, but keep index structure
          setGamepads(Array.from(pads));
          requestRef.current = requestAnimationFrame(scanGamepads);
      };

      requestRef.current = requestAnimationFrame(scanGamepads);

      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
  }, [activeTab]);

  // Bluetooth Scan
  const scanBluetooth = async () => {
      // @ts-ignore
      if (!navigator.bluetooth) {
          setBtError(t.bt_not_supported);
          return;
      }

      setScanning(true);
      setBtError(null);
      try {
          // @ts-ignore
          const device = await navigator.bluetooth.requestDevice({
              // We must provide at least one filter or acceptAllDevices
              // acceptAllDevices: true is often blocked by browsers for security without specific services
              // Let's try scanning for standard services or acceptAll
              acceptAllDevices: true,
              optionalServices: ['battery_service', 'device_information']
          });
          
          setBtDevices(prev => {
              if (prev.find(d => d.id === device.id)) return prev;
              return [...prev, device];
          });
      } catch (error: any) {
          if (error.name !== 'NotFoundError') { // User cancelled
             setBtError(error.message || 'Scan failed');
          }
      }
      setScanning(false);
  };

  const activeGamepad = gamepads.find(gp => gp !== null);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
      isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Gamepad2 className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <button onClick={() => setActiveTab('gamepad')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'gamepad' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Gamepad2 size={16} />
                {t.tab_gamepad}
            </button>
            <button onClick={() => setActiveTab('bluetooth')} className={`flex-1 py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'bluetooth' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Bluetooth size={16} />
                {t.tab_bluetooth}
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            
            {activeTab === 'gamepad' && (
                <div className="h-full flex flex-col items-center justify-center">
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
            )}

            {activeTab === 'bluetooth' && (
                <div className="flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                        <button 
                            onClick={scanBluetooth}
                            disabled={scanning}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {scanning ? <Radio className="animate-pulse" /> : <Search />}
                            {scanning ? t.bt_scanning : t.btn_scan_bt}
                        </button>
                    </div>

                    {btError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm mb-4">
                            <AlertCircle size={16} />
                            {btError}
                        </div>
                    )}

                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                            {t.bt_devices}
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {btDevices.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                    {t.bt_no_devices}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {btDevices.map((dev, idx) => (
                                        <div key={dev.id || idx} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-500">
                                                    <Bluetooth size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">{dev.name || 'Unknown Device'}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{dev.id}</div>
                                                </div>
                                            </div>
                                            {dev.gatt?.connected && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">Connected</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
