import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, Compass, Move } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface SensorModalProps {
  onClose: () => void;
  t: any; // Using any for flexibility with new translations, ideally strongly typed
}

export const SensorModal: React.FC<SensorModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  const [gyro, setGyro] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [maxAccel, setMaxAccel] = useState(0);

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

  const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
          const { x, y, z } = event.accelerationIncludingGravity;
          setAccel({ 
              x: x || 0, 
              y: y || 0, 
              z: z || 0 
          });
          
          const total = Math.sqrt((x||0)**2 + (y||0)**2 + (z||0)**2);
          setMaxAccel(prev => Math.max(prev, total));
      }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
      setGyro({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0
      });
  };

  const requestPermission = async () => {
      // iOS 13+ requires permission for these events
      // @ts-ignore
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
          try {
              // @ts-ignore
              const response = await DeviceMotionEvent.requestPermission();
              if (response === 'granted') {
                  setPermissionStatus('granted');
                  window.addEventListener('devicemotion', handleMotion);
                  window.addEventListener('deviceorientation', handleOrientation);
              } else {
                  setPermissionStatus('denied');
              }
          } catch (e) {
              console.error(e);
          }
      } else {
          // Non-iOS or older devices usually don't need explicit permission prompt
          setPermissionStatus('granted');
          window.addEventListener('devicemotion', handleMotion);
          window.addEventListener('deviceorientation', handleOrientation);
      }
  };

  // Try to start immediately on non-iOS if possible
  useEffect(() => {
      // @ts-ignore
      if (typeof DeviceMotionEvent.requestPermission !== 'function') {
          setPermissionStatus('granted');
          window.addEventListener('devicemotion', handleMotion);
          window.addEventListener('deviceorientation', handleOrientation);
      }
      
      return () => {
          window.removeEventListener('devicemotion', handleMotion);
          window.removeEventListener('deviceorientation', handleOrientation);
      };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="text-indigo-600 dark:text-indigo-400" />
            {t.sensor_title}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto max-h-[70vh]">
            
            {/* iOS Permission Button */}
            {permissionStatus === 'prompt' && (
                // @ts-ignore
                typeof DeviceMotionEvent.requestPermission === 'function' && (
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{t.sensor_permission_desc}</p>
                        <button 
                            onClick={requestPermission}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            {t.sensor_allow}
                        </button>
                    </div>
                )
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accelerometer */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Move size={20} />
                        </div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{t.accelerometer}</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>X-Axis</span>
                                <span className="font-mono">{accel.x.toFixed(2)} m/s²</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-75" 
                                    style={{ width: `${Math.min(Math.abs(accel.x) * 5, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Y-Axis</span>
                                <span className="font-mono">{accel.y.toFixed(2)} m/s²</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-75" 
                                    style={{ width: `${Math.min(Math.abs(accel.y) * 5, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Z-Axis</span>
                                <span className="font-mono">{accel.z.toFixed(2)} m/s²</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-75" 
                                    style={{ width: `${Math.min(Math.abs(accel.z) * 5, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gyroscope */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <Compass size={20} />
                        </div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{t.gyroscope}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                            <div className="text-xs text-slate-400 mb-1">Alpha</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{gyro.alpha.toFixed(0)}°</div>
                            <div className="text-[10px] text-slate-400 mt-1">Z-Axis</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                            <div className="text-xs text-slate-400 mb-1">Beta</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{gyro.beta.toFixed(0)}°</div>
                            <div className="text-[10px] text-slate-400 mt-1">X-Axis</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                            <div className="text-xs text-slate-400 mb-1">Gamma</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{gyro.gamma.toFixed(0)}°</div>
                            <div className="text-[10px] text-slate-400 mt-1">Y-Axis</div>
                        </div>
                    </div>
                    
                    {/* Visual compass needle representation */}
                    <div className="mt-6 flex justify-center">
                        <div 
                            className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center transition-transform duration-200 ease-out"
                            style={{ transform: `rotate(${gyro.alpha}deg)` }}
                        >
                            <div className="w-1 h-8 bg-red-500 rounded-full absolute -top-1"></div>
                            <div className="w-2 h-2 bg-slate-800 dark:bg-slate-200 rounded-full z-10"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-slate-400">
                Data provided by DeviceMotion & DeviceOrientation APIs.
            </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end">
            <button 
                onClick={handleClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                {t.close}
            </button>
        </div>

      </div>
    </div>
  );
};
