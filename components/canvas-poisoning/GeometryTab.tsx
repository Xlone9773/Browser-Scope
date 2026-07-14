// src/components/canvas-poisoning/GeometryTab.tsx

import React, { useState, useCallback } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { isHooked } from './utils';

interface GeometryTabProps {
  t: PoisoningTranslations;
}

export const GeometryTab: React.FC<GeometryTabProps> = React.memo(({ t }) => {
  const [geomStatus, setGeomStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [geomProgress, setGeomProgress] = useState(0);
  const [geomLogs, setGeomLogs] = useState<string[]>([]);

  const addGeomLog = useCallback((msg: string) => {
    setGeomLogs((prev) => [...prev, msg]);
  }, []);

  const runGeometryTest = async () => {
    setGeomStatus('running');
    setGeomProgress(0);
    setGeomLogs([]);
    
    addGeomLog(t.testing_geometry || 'Testing high-frequency nested geometry measurements and poisoning...');
    
    let isPoisoned = false;

    // 1. Hook detection on Element.prototype.getBoundingClientRect and getClientRects
    try {
      const getBoundingClientRectHooked = isHooked(Element.prototype.getBoundingClientRect as unknown as (...args: never[]) => unknown);
      const getClientRectsHooked = isHooked(Element.prototype.getClientRects as unknown as (...args: never[]) => unknown);
      if (getBoundingClientRectHooked || getClientRectsHooked) {
        isPoisoned = true;
        addGeomLog(t.rects_hooked || '❌ Suspicious Proxy/Hook detected on getBoundingClientRect or getClientRects methods.');
      }
    } catch {
      // Ignore
    }
    
    setGeomProgress(30);
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    // 2. High-frequency boundary measurements on nested graphics and 3D CSS transformed elements
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 500px;
      height: 500px;
      perspective: 1000px;
      transform-style: preserve-3d;
      visibility: hidden;
      pointer-events: none;
    `;
    
    const nested3D = document.createElement('div');
    nested3D.style.cssText = `
      width: 100%;
      height: 100%;
      transform: rotateX(45deg) rotateY(30deg) translateZ(50px);
      transform-style: preserve-3d;
    `;
    
    const svgNS = "http://www.w3.org/2000/svg";
    const svgEl = document.createElementNS(svgNS, "svg");
    svgEl.setAttribute("width", "300");
    svgEl.setAttribute("height", "300");
    svgEl.style.cssText = "transform: scale(1.5) translate3d(10px, 20px, 30px);";
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M10 10 H 90 V 90 H 10 Z");
    path.setAttribute("fill", "blue");
    svgEl.appendChild(path);
    
    nested3D.appendChild(svgEl);
    container.appendChild(nested3D);
    document.body.appendChild(container);
    
    setGeomProgress(60);
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    const measurements: { left: number; top: number; width: number; height: number }[] = [];
    let rectsFarbled = false;
    
    for (let i = 0; i < 15; i++) {
      const r = path.getBoundingClientRect();
      measurements.push({ left: r.left, top: r.top, width: r.width, height: r.height });
      await new Promise<void>(resolve => setTimeout(resolve, 10));
    }
    
    const first = measurements[0];
    for (let i = 1; i < measurements.length; i++) {
      const cur = measurements[i];
      if (
        Math.abs(cur.left - first.left) > 0.00001 ||
        Math.abs(cur.top - first.top) > 0.00001 ||
        Math.abs(cur.width - first.width) > 0.00001 ||
        Math.abs(cur.height - first.height) > 0.00001
      ) {
        rectsFarbled = true;
        addGeomLog(`❌ Jitter detected at read ${i}: [${first.left.toFixed(6)}, ${first.top.toFixed(6)}] != [${cur.left.toFixed(6)}, ${cur.top.toFixed(6)}]`);
      }
    }
    
    if (rectsFarbled) {
      isPoisoned = true;
      addGeomLog(t.rect_farbling_detected || '❌ ClientRects/DOMRect Farbling detected (getBoundingClientRect measurements fluctuate dynamically in static state, typical of Brave or Cromite).');
    } else {
      addGeomLog('✅ High-precision consecutive getBoundingClientRect measurements are perfectly stable.');
    }
    
    try {
      const clientRectsList = path.getClientRects();
      if (clientRectsList.length > 0) {
        const clientRectsMeasurements: { left: number; top: number }[] = [];
        let clientRectsFarbled = false;
        for (let i = 0; i < 15; i++) {
          const list = path.getClientRects();
          if (list.length > 0) {
            clientRectsMeasurements.push({ left: list[0].left, top: list[0].top });
          }
          await new Promise<void>(resolve => setTimeout(resolve, 10));
        }
        
        const firstCR = clientRectsMeasurements[0];
        for (let i = 1; i < clientRectsMeasurements.length; i++) {
          const curCR = clientRectsMeasurements[i];
          if (Math.abs(curCR.left - firstCR.left) > 0.00001 || Math.abs(curCR.top - firstCR.top) > 0.00001) {
            clientRectsFarbled = true;
          }
        }
        if (clientRectsFarbled) {
          isPoisoned = true;
          addGeomLog('❌ getClientRects measurements fluctuate dynamically.');
        } else {
          addGeomLog('✅ High-precision getClientRects measurements are perfectly stable.');
        }
      }
    } catch {
      // Ignore
    }

    document.body.removeChild(container);
    setGeomProgress(100);

    if (isPoisoned) {
      setGeomStatus('poisoned');
      addGeomLog(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
    } else {
      setGeomStatus('clean');
      addGeomLog(t.geometry_stable || '✅ Geometry boundaries and DOMRect measurements are perfectly stable, no farbling detected.');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.geometry_detection_title || 'Geometry & DOMRect Poisoning Detection'}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.geometry_detection_desc}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
        {geomLogs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
            {log}
          </div>
        ))}
        {geomLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            geomStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            geomStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            geomStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {geomStatus === 'idle' ? t.status_idle : 
             geomStatus === 'running' ? t.status_running : 
             geomStatus === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runGeometryTest} disabled={geomStatus === 'running'} leftIcon={geomStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {geomStatus === 'running' ? `${t.testing} (${geomProgress}%)` : (t.run_geometry_test || 'Run Geometry Test')}
        </Button>
      </div>
    </div>
  );
});

GeometryTab.displayName = 'GeometryTab';
