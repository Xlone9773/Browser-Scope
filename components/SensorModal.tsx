
import React, { useState, useEffect } from 'react';
import { Activity, Compass, Move, Navigation, Sun } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber } from '../utils/formatters';
import { Modal } from './ui/Modal';

interface SensorModalProps {
  onClose: () => void;
  t: Translation['sensorModal'];
}

export const SensorModal: React.FC<SensorModalProps> = ({ onClose, t }) => {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  const prevAlphaRef = React.useRef(0);
  const displayAlphaRef = React.useRef(0);
  const [gyro, setGyro] = useState({ alpha: 0, beta: 0, gamma: 0, displayAlpha: 0 });
  const [magnet, setMagnet] = useState<{ x: number, y: number, z: number } | null>(null);
  const [lux, setLux] = useState<number | null>(null);

  const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
          const { x, y, z } = event.accelerationIncludingGravity;
          setAccel({ 
              x: x || 0, 
              y: y || 0, 
              z: z || 0 
          });
      }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
      const currentAlpha = event.alpha || 0;
      let delta = currentAlpha - prevAlphaRef.current;
      
      // Calculate continuous rotation
      if (delta > 180) {
          delta -= 360;
      } else if (delta < -180) {
          delta += 360;
      }
      
      displayAlphaRef.current += delta;
      prevAlphaRef.current = currentAlpha;

      setGyro({
          alpha: currentAlpha,
          beta: event.beta || 0,
          gamma: event.gamma || 0,
          displayAlpha: displayAlphaRef.current
      });
  };

  // Setup Magnetometer & Ambient Light
  useEffect(() => {
      let magSensor: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = null;
      let lightSensor: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = null;

      // Magnetometer
      if ('Magnetometer' in window) {
          try {
              
                            // @ts-expect-error fixed implicitly typed external libraries
                            magSensor = new Magnetometer({ frequency: 10 });
              magSensor.addEventListener('reading', () => {
                  setMagnet({ x: magSensor.x, y: magSensor.y, z: magSensor.z });
              });
              magSensor.addEventListener('error', (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => console.debug('Magnetometer error', e));
              magSensor.start();
          } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
              console.debug("Magnetometer init error", error);
          }
      } 

      // Ambient Light Sensor
      if ('AmbientLightSensor' in window) {
          try {
              
                            // @ts-expect-error fixed implicitly typed external libraries
                            lightSensor = new AmbientLightSensor();
              lightSensor.addEventListener('reading', () => {
                  setLux(lightSensor.illuminance);
              });
              lightSensor.addEventListener('error', (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => console.debug('AmbientLightSensor error', e));
              lightSensor.start();
          } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
              console.debug("AmbientLightSensor init error", error);
          }
      }
      
      return () => {
          if (magSensor) magSensor.stop();
          if (lightSensor) lightSensor.stop();
      };
  }, []);

  const requestPermission = async () => {
      // iOS 13+ requires permission for these events
      
            // @ts-expect-error fixed implicitly typed external libraries
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
          try {
              
                            // @ts-expect-error fixed implicitly typed external libraries
                            const response = await DeviceMotionEvent.requestPermission();
              if (response === 'granted') {
                  setPermissionStatus('granted');
                  window.addEventListener('devicemotion', handleMotion);
                  window.addEventListener('deviceorientation', handleOrientation);
              } else {
                  setPermissionStatus('denied');
              }
          } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
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
      
            // @ts-expect-error fixed implicitly typed external libraries
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
    <Modal
        title={t.sensor_title}
        icon={<Activity size={24} />}
        onClose={onClose}
        size="3xl"
    >
        {({ close: _close }) => (
            <>
                {/* iOS Permission Button */}
                {permissionStatus === 'prompt' && (
                    
                                        // @ts-expect-error fixed implicitly typed external libraries
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
                                    <span className="font-mono">{formatNumber(accel.x, 2, 2)} m/s²</span>
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
                                    <span className="font-mono">{formatNumber(accel.y, 2, 2)} m/s²</span>
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
                                    <span className="font-mono">{formatNumber(accel.z, 2, 2)} m/s²</span>
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
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                <div className="text-[10px] text-slate-400 mb-1">Alpha</div>
                                <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{formatNumber(gyro.alpha, 0)}°</div>
                            </div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                <div className="text-[10px] text-slate-400 mb-1">Beta</div>
                                <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{formatNumber(gyro.beta, 0)}°</div>
                            </div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                <div className="text-[10px] text-slate-400 mb-1">Gamma</div>
                                <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">{formatNumber(gyro.gamma, 0)}°</div>
                            </div>
                        </div>
                        
                        {/* Visual compass needle */}
                        <div className="mt-6 flex justify-center">
                            <div 
                                className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center transition-transform duration-200 ease-out"
                                style={{ transform: `rotate(${gyro.displayAlpha}deg)` }}
                            >
                                <div className="w-1 h-8 bg-red-500 rounded-full absolute -top-1"></div>
                                <div className="w-2 h-2 bg-slate-800 dark:bg-slate-200 rounded-full z-10"></div>
                            </div>
                        </div>
                    </div>

                    {/* Magnetometer */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                <Navigation size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200">{t.magnetometer}</h3>
                            </div>
                        </div>
                        
                        {magnet ? (
                                <div className="grid grid-cols-3 gap-2">
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 mb-1">X (µT)</div>
                                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">{formatNumber(magnet.x, 1, 1)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 mb-1">Y (µT)</div>
                                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">{formatNumber(magnet.y, 1, 1)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 mb-1">Z (µT)</div>
                                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">{formatNumber(magnet.z, 1, 1)}</div>
                                </div>
                                </div>
                        ) : (
                            <div className="h-20 flex items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                                Sensor unavailable.
                            </div>
                        )}
                    </div>

                    {/* Ambient Light Sensor */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                                <Sun size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200">{t.ambient_light}</h3>
                            </div>
                        </div>
                        
                        {lux !== null ? (
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-2">
                                    {formatNumber(lux, 0)} <span className="text-sm text-slate-400 font-sans font-normal">lux</span>
                                </div>
                                {/* Visual Bar for Light Level (Logarithmic scale approx 0 to 50000) */}
                                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-700 to-amber-400 dark:from-slate-600 dark:to-amber-300 transition-all duration-300"
                                        style={{ width: `${Math.min((Math.log10(lux + 1) / 4.7) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between w-full text-[10px] text-slate-400 mt-1 px-1">
                                    <span>Dark</span>
                                    <span>Room</span>
                                    <span>Bright</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-20 flex items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                                Sensor unavailable.
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-4 text-center text-xs text-slate-400">
                    Data provided by DeviceMotion, DeviceOrientation & Generic Sensor APIs.
                </div>
            </>
        )}
    </Modal>
  );
};
