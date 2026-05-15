
import React, { useState, lazy, useCallback } from 'react';

// Dynamic Import Helper
const lazyWithoutDelay = (importFunc: () => Promise<any>) => {
  return lazy(() => importFunc());
};

// Module Factories Definition
const MODULE_FACTORIES: Record<string, () => Promise<any>> = {
    camera: () => import('../components/CameraModal').then(m => ({ default: m.CameraModal })),
    audio: () => import('../components/AudioRecorderModal').then(m => ({ default: m.AudioRecorderModal })),
    webgl: () => import('../components/WebGLExtensionsModal').then(m => ({ default: m.WebGLExtensionsModal })),
    canvas: () => import('../components/CanvasModal').then(m => ({ default: m.CanvasModal })),
    base64: () => import('../components/Base64Modal').then(m => ({ default: m.Base64Modal })),
    about: () => import('../components/AboutModal').then(m => ({ default: m.AboutModal })),
    sensor: () => import('../components/SensorModal').then(m => ({ default: m.SensorModal })),
    score: () => import('../components/ScoreModal').then(m => ({ default: m.ScoreModal })),
    fingerprint: () => import('../components/FingerprintModal').then(m => ({ default: m.FingerprintModal })),
    settings: () => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal })),
    networkTools: () => import('../components/NetworkToolsModal').then(m => ({ default: m.NetworkToolsModal })),
    displayTools: () => import('../components/DisplayToolsModal').then(m => ({ default: m.DisplayToolsModal })),
    benchmark: () => import('../components/BenchmarkModal').then(m => ({ default: m.BenchmarkModal })),
    tools: () => import('../components/HardwareToolsModal').then(m => ({ default: m.HardwareToolsModal })),
    ai: () => import('../components/AiPlaygroundModal').then(m => ({ default: m.AiPlaygroundModal })),
    gamepad: () => import('../components/GamepadToolModal').then(m => ({ default: m.GamepadToolModal })),
    webDevice: () => import('../components/WebDeviceModal').then(m => ({ default: m.WebDeviceModal })),
    vision: () => import('../components/VisionModal').then(m => ({ default: m.VisionModal })),
    speed: () => import('../components/SpeedTestModal').then(m => ({ default: m.SpeedTestModal })),
    compute: () => import('../components/ComputeStressModal').then(m => ({ default: m.ComputeStressModal })),
    developer: () => import('../components/settings/DeveloperTab').then(m => ({ default: m.DeveloperTab })),
    video: () => import('../components/VideoDecodeModal').then(m => ({ default: m.VideoDecodeModal })),
    graphics: () => import('../components/GraphicsDebugModal').then(m => ({ default: m.GraphicsDebugModal })),
    speech: () => import('../components/SpeechExplorerModal').then(m => ({ default: m.SpeechExplorerModal })),
    midi: () => import('../components/MidiModal').then(m => ({ default: m.MidiModal })),
    storageBench: () => import('../components/StorageBenchmarkModal').then(m => ({ default: m.StorageBenchmarkModal })),
    heatmap: () => import('../components/NetworkHeatmapModal').then(m => ({ default: m.NetworkHeatmapModal })),
    rayTracing: () => import('../components/RayTracingModal').then(m => ({ default: m.RayTracingModal })),
    extensions: () => import('../components/ExtensionsModal').then(m => ({ default: m.ExtensionsModal })),
};

export const useModalManager = () => {
    // Visibility State for all modals
    const [visibility, setVisibility] = useState<Record<string, boolean>>({});
    
    // Track which modules have been loaded at least once
    const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set(['settings']));

    // Lazy Components Registry (allows resetting/unloading)
    const [components, setComponents] = useState<Record<string, React.ComponentType<any>>>(() => {
        const initial: Record<string, React.ComponentType<any>> = {};
        Object.keys(MODULE_FACTORIES).forEach(key => {
            // Initial load uses standard lazy (or delay if preferred, but usually standard)
            initial[key] = lazy(MODULE_FACTORIES[key]);
        });
        return initial;
    });

    // Actions
    const open = useCallback((id: string) => {
        setVisibility(prev => ({ ...prev, [id]: true }));
        setLoadedSet(id);
    }, []);

    const close = useCallback((id: string) => {
        setVisibility(prev => ({ ...prev, [id]: false }));
    }, []);

    const setLoadedSet = (id: string) => {
        setLoadedModules(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    const unload = useCallback((id: string) => {
        // 1. Close
        close(id);
        
        // 2. Remove from loaded set
        setLoadedModules(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

        // 3. Reset lazy component with delay wrapper to show loading state on next open
        if (MODULE_FACTORIES[id]) {
            setComponents(prev => ({
                ...prev,
                [id]: lazyWithoutDelay(MODULE_FACTORIES[id])
            }));
        }
    }, [close]);

    return {
        visibility,
        open,
        close,
        unload,
        loadedModules,
        Components: components
    };
};
