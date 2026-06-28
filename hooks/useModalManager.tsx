import React, { useState, useCallback, lazy, useEffect } from 'react';

// Lazy load components
const CameraModal = lazy(() => import('../components/CameraModal').then(m => ({ default: m.CameraModal })));
const AudioRecorderModal = lazy(() => import('../components/AudioRecorderModal').then(m => ({ default: m.AudioRecorderModal })));
const WebGLExtensionsModal = lazy(() => import('../components/WebGLExtensionsModal').then(m => ({ default: m.WebGLExtensionsModal })));
const CanvasModal = lazy(() => import('../components/CanvasModal').then(m => ({ default: m.CanvasModal })));
const Base64Modal = lazy(() => import('../components/Base64Modal').then(m => ({ default: m.Base64Modal })));
const AboutModal = lazy(() => import('../components/AboutModal').then(m => ({ default: m.AboutModal })));
const SensorModal = lazy(() => import('../components/SensorModal').then(m => ({ default: m.SensorModal })));
const ScoreModal = lazy(() => import('../components/ScoreModal').then(m => ({ default: m.ScoreModal })));
const FingerprintModal = lazy(() => import('../components/FingerprintModal').then(m => ({ default: m.FingerprintModal })));
const SettingsModal = lazy(() => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const NetworkToolsModal = lazy(() => import('../components/NetworkToolsModal').then(m => ({ default: m.NetworkToolsModal })));
const DisplayToolsModal = lazy(() => import('../components/DisplayToolsModal').then(m => ({ default: m.DisplayToolsModal })));
const BenchmarkModal = lazy(() => import('../components/BenchmarkModal').then(m => ({ default: m.BenchmarkModal })));
const HardwareToolsModal = lazy(() => import('../components/HardwareToolsModal').then(m => ({ default: m.HardwareToolsModal })));
const AiPlaygroundModal = lazy(() => import('../components/AiPlaygroundModal').then(m => ({ default: m.AiPlaygroundModal })));
const GamepadToolModal = lazy(() => import('../components/GamepadToolModal').then(m => ({ default: m.GamepadToolModal })));
const WebDeviceModal = lazy(() => import('../components/WebDeviceModal').then(m => ({ default: m.WebDeviceModal })));
const VisionModal = lazy(() => import('../components/VisionModal').then(m => ({ default: m.VisionModal })));
const SpeedTestModal = lazy(() => import('../components/SpeedTestModal').then(m => ({ default: m.SpeedTestModal })));
const ComputeStressModal = lazy(() => import('../components/ComputeStressModal').then(m => ({ default: m.ComputeStressModal })));
const DeveloperTab = lazy(() => import('../components/settings/DeveloperTab').then(m => ({ default: m.DeveloperTab })));
const VideoDecodeModal = lazy(() => import('../components/VideoDecodeModal').then(m => ({ default: m.VideoDecodeModal })));
const GraphicsDebugModal = lazy(() => import('../components/GraphicsDebugModal').then(m => ({ default: m.GraphicsDebugModal })));
const SpeechExplorerModal = lazy(() => import('../components/SpeechExplorerModal').then(m => ({ default: m.SpeechExplorerModal })));
const MidiModal = lazy(() => import('../components/MidiModal').then(m => ({ default: m.MidiModal })));
const StorageBenchmarkModal = lazy(() => import('../components/StorageBenchmarkModal').then(m => ({ default: m.StorageBenchmarkModal })));
const NetworkHeatmapModal = lazy(() => import('../components/NetworkHeatmapModal').then(m => ({ default: m.NetworkHeatmapModal })));
const RayTracingModal = lazy(() => import('../components/RayTracingModal').then(m => ({ default: m.RayTracingModal })));
const ExtensionsModal = lazy(() => import('../components/ExtensionsModal').then(m => ({ default: m.ExtensionsModal })));
const GoogleTranslateModal = lazy(() => import('../components/GoogleTranslateModal').then(m => ({ default: m.GoogleTranslateModal })));
const AudioLatencyProbingModal = lazy(() => import('../components/AudioLatencyProbingModal').then(m => ({ default: m.AudioLatencyProbingModal })));

const loadFunctions: Record<string, () => Promise<any>> = {
  camera: () => import('../components/CameraModal'),
  audio: () => import('../components/AudioRecorderModal'),
  webgl: () => import('../components/WebGLExtensionsModal'),
  canvas: () => import('../components/CanvasModal'),
  base64: () => import('../components/Base64Modal'),
  about: () => import('../components/AboutModal'),
  sensor: () => import('../components/SensorModal'),
  score: () => import('../components/ScoreModal'),
  fingerprint: () => import('../components/FingerprintModal'),
  settings: () => import('../components/SettingsModal'),
  networkTools: () => import('../components/NetworkToolsModal'),
  displayTools: () => import('../components/DisplayToolsModal'),
  benchmark: () => import('../components/BenchmarkModal'),
  tools: () => import('../components/HardwareToolsModal'),
  ai: () => import('../components/AiPlaygroundModal'),
  gamepad: () => import('../components/GamepadToolModal'),
  webDevice: () => import('../components/WebDeviceModal'),
  vision: () => import('../components/VisionModal'),
  speed: () => import('../components/SpeedTestModal'),
  compute: () => import('../components/ComputeStressModal'),
  developer: () => import('../components/settings/DeveloperTab'),
  video: () => import('../components/VideoDecodeModal'),
  graphics: () => import('../components/GraphicsDebugModal'),
  speech: () => import('../components/SpeechExplorerModal'),
  midi: () => import('../components/MidiModal'),
  storageBench: () => import('../components/StorageBenchmarkModal'),
  heatmap: () => import('../components/NetworkHeatmapModal'),
  rayTracing: () => import('../components/RayTracingModal'),
  extensions: () => import('../components/ExtensionsModal'),
  googleTranslate: () => import('../components/GoogleTranslateModal'),
  audioLatency: () => import('../components/AudioLatencyProbingModal'),
};

const COMPONENTS: Record<string, React.ComponentType<any>> = {
  camera: CameraModal,
  audio: AudioRecorderModal,
  webgl: WebGLExtensionsModal,
  canvas: CanvasModal,
  base64: Base64Modal,
  about: AboutModal,
  sensor: SensorModal,
  score: ScoreModal,
  fingerprint: FingerprintModal,
  settings: SettingsModal,
  networkTools: NetworkToolsModal,
  displayTools: DisplayToolsModal,
  benchmark: BenchmarkModal,
  tools: HardwareToolsModal,
  ai: AiPlaygroundModal,
  gamepad: GamepadToolModal,
  webDevice: WebDeviceModal,
  vision: VisionModal,
  speed: SpeedTestModal,
  compute: ComputeStressModal,
  developer: DeveloperTab,
  video: VideoDecodeModal,
  graphics: GraphicsDebugModal,
  speech: SpeechExplorerModal,
  midi: MidiModal,
  storageBench: StorageBenchmarkModal,
  heatmap: NetworkHeatmapModal,
  rayTracing: RayTracingModal,
  extensions: ExtensionsModal,
  googleTranslate: GoogleTranslateModal,
  audioLatency: AudioLatencyProbingModal,
};

export const useModalManager = () => {
  // Visibility State for all modals
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set());

  const components = COMPONENTS;

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
    setLoadedModules((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [close]);

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
