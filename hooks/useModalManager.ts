import React, { useState, useCallback, useRef, useMemo, lazy } from 'react';

type ModalComponent = React.ComponentType<Record<string, unknown>>;
type ComponentLoader = () => Promise<{ default: ModalComponent }>;

const COMPONENT_LOADERS: Record<string, ComponentLoader> = {
  camera: () => import('../components/CameraModal').then(m => ({ default: m.CameraModal as unknown as ModalComponent })),
  audio: () => import('../components/AudioRecorderModal').then(m => ({ default: m.AudioRecorderModal as unknown as ModalComponent })),
  webgl: () => import('../components/WebGLExtensionsModal').then(m => ({ default: m.WebGLExtensionsModal as unknown as ModalComponent })),
  canvas: () => import('../components/CanvasModal').then(m => ({ default: m.CanvasModal as unknown as ModalComponent })),
  base64: () => import('../components/Base64Modal').then(m => ({ default: m.Base64Modal as unknown as ModalComponent })),
  about: () => import('../components/AboutModal').then(m => ({ default: m.AboutModal as unknown as ModalComponent })),
  attributions: () => import('../components/AttributionsModal').then(m => ({ default: m.AttributionsModal as unknown as ModalComponent })),
  sensor: () => import('../components/SensorModal').then(m => ({ default: m.SensorModal as unknown as ModalComponent })),
  score: () => import('../components/ScoreModal').then(m => ({ default: m.ScoreModal as unknown as ModalComponent })),
  fingerprint: () => import('../components/FingerprintModal').then(m => ({ default: m.FingerprintModal as unknown as ModalComponent })),
  settings: () => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal as unknown as ModalComponent })),
  networkTools: () => import('../components/NetworkToolsModal').then(m => ({ default: m.NetworkToolsModal as unknown as ModalComponent })),
  displayTools: () => import('../components/DisplayToolsModal').then(m => ({ default: m.DisplayToolsModal as unknown as ModalComponent })),
  benchmark: () => import('../components/BenchmarkModal').then(m => ({ default: m.BenchmarkModal as unknown as ModalComponent })),
  tools: () => import('../components/HardwareToolsModal').then(m => ({ default: m.HardwareToolsModal as unknown as ModalComponent })),
  ai: () => import('../components/AiPlaygroundModal').then(m => ({ default: m.AiPlaygroundModal as unknown as ModalComponent })),
  gamepad: () => import('../components/GamepadToolModal').then(m => ({ default: m.GamepadToolModal as unknown as ModalComponent })),
  webDevice: () => import('../components/WebDeviceModal').then(m => ({ default: m.WebDeviceModal as unknown as ModalComponent })),
  vision: () => import('../components/VisionModal').then(m => ({ default: m.VisionModal as unknown as ModalComponent })),
  speed: () => import('../components/SpeedTestModal').then(m => ({ default: m.SpeedTestModal as unknown as ModalComponent })),
  compute: () => import('../components/ComputeStressModal').then(m => ({ default: m.ComputeStressModal as unknown as ModalComponent })),
  developer: () => import('../components/settings/DeveloperTab').then(m => ({ default: m.DeveloperTab as unknown as ModalComponent })),
  video: () => import('../components/VideoDecodeModal').then(m => ({ default: m.VideoDecodeModal as unknown as ModalComponent })),
  graphics: () => import('../components/GraphicsDebugModal').then(m => ({ default: m.GraphicsDebugModal as unknown as ModalComponent })),
  speech: () => import('../components/SpeechExplorerModal').then(m => ({ default: m.SpeechExplorerModal as unknown as ModalComponent })),
  midi: () => import('../components/MidiModal').then(m => ({ default: m.MidiModal as unknown as ModalComponent })),
  storageBench: () => import('../components/StorageBenchmarkModal').then(m => ({ default: m.StorageBenchmarkModal as unknown as ModalComponent })),
  heatmap: () => import('../components/NetworkHeatmapModal').then(m => ({ default: m.NetworkHeatmapModal as unknown as ModalComponent })),
  rayTracing: () => import('../components/RayTracingModal').then(m => ({ default: m.RayTracingModal as unknown as ModalComponent })),
  extensions: () => import('../components/ExtensionsModal').then(m => ({ default: m.ExtensionsModal as unknown as ModalComponent })),
  googleTranslate: () => import('../components/GoogleTranslateModal').then(m => ({ default: m.GoogleTranslateModal as unknown as ModalComponent })),
  audioLatency: () => import('../components/AudioLatencyProbingModal').then(m => ({ default: m.AudioLatencyProbingModal as unknown as ModalComponent })),
  poisoning: () => import('../components/CanvasPoisoningModal').then(m => ({ default: m.CanvasPoisoningModal as unknown as ModalComponent })),
  ja3: () => import('../components/Ja3FingerprintModal').then(m => ({ default: m.Ja3FingerprintModal as unknown as ModalComponent })),
  shortcuts: () => import('../components/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal as unknown as ModalComponent })),
};

interface ModalManagerOptions {
  disableCache?: boolean;
  disableLazyLoading?: boolean;
  alwaysShowLoading?: boolean;
}

export const useModalManager = (options?: ModalManagerOptions) => {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set());
  const [moduleVersions, setModuleVersions] = useState<Record<string, number>>({});

  const lazyCacheRef = useRef<Record<string, React.ElementType>>({});
  const unloadedModulesRef = useRef<Set<string>>(new Set());

  const open = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: true }));
    setLoadedModules((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unload = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: false }));
    unloadedModulesRef.current.add(id);
    delete lazyCacheRef.current[id];
    setModuleVersions((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setLoadedModules((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const close = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: false }));
    if (options?.disableCache && id !== "settings" && id !== "developer") {
      unload(id);
    }
  }, [options?.disableCache, unload]);

  const closeAll = useCallback(() => {
    setVisibility({});
  }, []);

  React.useEffect(() => {
    if (options?.disableLazyLoading) {
      Object.keys(COMPONENT_LOADERS).forEach((id) => {
        if (id !== "settings" && id !== "developer") {
          const loader = COMPONENT_LOADERS[id];
          if (loader) {
            loader().then(() => {
              setLoadedModules((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }).catch((err: unknown) => {
              console.error(`Failed to pre-cache module ${id}:`, err);
            });
          }
        }
      });
    }
  }, [options?.disableLazyLoading]);

  const components = useMemo(() => {
    return new Proxy({} as Record<string, React.ElementType>, {
      get: (_target, id: string) => {
        if (typeof id !== "string") return undefined;
        const loader = COMPONENT_LOADERS[id];
        if (!loader) return undefined;

        if (options?.alwaysShowLoading) {
          return lazy(() => loader());
        }

        if (!lazyCacheRef.current[id]) {
          lazyCacheRef.current[id] = lazy(() => {
            const wasUnloaded = unloadedModulesRef.current.has(id);
            if (wasUnloaded) {
              unloadedModulesRef.current.delete(id);
            }
            return loader();
          });
        }
        return lazyCacheRef.current[id];
      },
    });
  }, [moduleVersions, options?.alwaysShowLoading]);

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
    window.addEventListener("open-storage-benchmark", handleOpenStorageBenchmark);
    window.addEventListener("open-ray-tracing", handleOpenRayTracing);
    window.addEventListener("open-audio-latency", handleOpenAudioLatency);
    window.addEventListener("open-attributions", handleOpenAttributions);
    window.addEventListener("open-shortcuts", handleOpenShortcuts);

    return () => {
      window.removeEventListener("close-all-modals", handleCloseAll);
      window.removeEventListener("open-heatmap", handleOpenHeatmap);
      window.removeEventListener("open-network-tools", handleOpenNetworkTools);
      window.removeEventListener("open-display-tools", handleOpenDisplayTools);
      window.removeEventListener("open-storage-benchmark", handleOpenStorageBenchmark);
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
