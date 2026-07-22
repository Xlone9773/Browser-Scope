import React, { useState, useCallback, useRef, useMemo, lazy } from 'react';

type ComponentLoader = () => Promise<{ default: React.ComponentType<any> }>;

const COMPONENT_LOADERS: Record<string, ComponentLoader> = {
  camera: () => import('../components/CameraModal').then(m => ({ default: m.CameraModal })),
  audio: () => import('../components/AudioRecorderModal').then(m => ({ default: m.AudioRecorderModal })),
  webgl: () => import('../components/WebGLExtensionsModal').then(m => ({ default: m.WebGLExtensionsModal })),
  canvas: () => import('../components/CanvasModal').then(m => ({ default: m.CanvasModal })),
  base64: () => import('../components/Base64Modal').then(m => ({ default: m.Base64Modal })),
  about: () => import('../components/AboutModal').then(m => ({ default: m.AboutModal })),
  attributions: () => import('../components/AttributionsModal').then(m => ({ default: m.AttributionsModal })),
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
  googleTranslate: () => import('../components/GoogleTranslateModal').then(m => ({ default: m.GoogleTranslateModal })),
  audioLatency: () => import('../components/AudioLatencyProbingModal').then(m => ({ default: m.AudioLatencyProbingModal })),
  poisoning: () => import('../components/CanvasPoisoningModal').then(m => ({ default: m.CanvasPoisoningModal })),
  ja3: () => import('../components/Ja3FingerprintModal').then(m => ({ default: m.Ja3FingerprintModal })),
  shortcuts: () => import('../components/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal })),
};

export const useModalManager = () => {
  // Visibility State for all modals
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set());
  const [moduleVersions, setModuleVersions] = useState<Record<string, number>>({});

  const lazyCacheRef = useRef<Record<string, React.LazyExoticComponent<any>>>({});

  const open = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: true }));
    setLoadedModules((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const close = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: false }));
  }, []);

  const closeAll = useCallback(() => {
    setVisibility({});
  }, []);

  const unload = useCallback((id: string) => {
    close(id);
    delete lazyCacheRef.current[id];
    setModuleVersions((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setLoadedModules((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [close]);

  const components = useMemo(() => {
    return new Proxy({} as Record<string, React.ComponentType<any>>, {
      get: (_target, id: string) => {
        if (typeof id !== 'string') return undefined;
        if (!lazyCacheRef.current[id]) {
          const loader = COMPONENT_LOADERS[id];
          if (!loader) return undefined;
          lazyCacheRef.current[id] = lazy(loader);
        }
        return lazyCacheRef.current[id];
      },
    });
  }, [moduleVersions]);

  React.useEffect(() => {
    const handleCloseAll = () => {
      closeAll();
    };
    const handleOpenHeatmap = () => open("heatmap");
    const handleOpenNetworkTools = () => open("networkTools");
    const handleOpenDisplayTools = () => open("displayTools");
    const handleOpenStorageBenchmark = () => open("storageBench");
    const handleOpenRayTracing = () => open("rayTracing");
    const handleOpenAudioLatency = () => open("audioLatency");
    const handleOpenAttributions = () => open("attributions");
    const handleOpenShortcuts = () => open("shortcuts");

    window.addEventListener("close-all-modals", handleCloseAll);
    window.addEventListener("open-heatmap", handleOpenHeatmap);
    window.addEventListener("open-network-tools", handleOpenNetworkTools);
    window.addEventListener("open-display-tools", handleOpenDisplayTools);
    window.addEventListener(
      "open-storage-benchmark",
      handleOpenStorageBenchmark,
    );
    window.addEventListener("open-ray-tracing", handleOpenRayTracing);
    window.addEventListener("open-audio-latency", handleOpenAudioLatency);
    window.addEventListener("open-attributions", handleOpenAttributions);
    window.addEventListener("open-shortcuts", handleOpenShortcuts);

    return () => {
      window.removeEventListener("close-all-modals", handleCloseAll);
      window.removeEventListener("open-heatmap", handleOpenHeatmap);
      window.removeEventListener("open-network-tools", handleOpenNetworkTools);
      window.removeEventListener("open-display-tools", handleOpenDisplayTools);
      window.removeEventListener(
        "open-storage-benchmark",
        handleOpenStorageBenchmark,
      );
      window.removeEventListener("open-ray-tracing", handleOpenRayTracing);
      window.removeEventListener("open-audio-latency", handleOpenAudioLatency);
      window.removeEventListener("open-attributions", handleOpenAttributions);
      window.removeEventListener("open-shortcuts", handleOpenShortcuts);
    };
  }, [closeAll, open]);

  return {
    visibility,
    open,
    close,
    closeAll,
    unload,
    loadedModules,
    Components: components,
  };
};
