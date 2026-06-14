import React, { useState, useCallback } from 'react';
import { CameraModal } from '../components/CameraModal';
import { AudioRecorderModal } from '../components/AudioRecorderModal';
import { WebGLExtensionsModal } from '../components/WebGLExtensionsModal';
import { CanvasModal } from '../components/CanvasModal';
import { Base64Modal } from '../components/Base64Modal';
import { AboutModal } from '../components/AboutModal';
import { SensorModal } from '../components/SensorModal';
import { ScoreModal } from '../components/ScoreModal';
import { FingerprintModal } from '../components/FingerprintModal';
import { SettingsModal } from '../components/SettingsModal';
import { NetworkToolsModal } from '../components/NetworkToolsModal';
import { DisplayToolsModal } from '../components/DisplayToolsModal';
import { BenchmarkModal } from '../components/BenchmarkModal';
import { HardwareToolsModal } from '../components/HardwareToolsModal';
import { AiPlaygroundModal } from '../components/AiPlaygroundModal';
import { GamepadToolModal } from '../components/GamepadToolModal';
import { WebDeviceModal } from '../components/WebDeviceModal';
import { VisionModal } from '../components/VisionModal';
import { SpeedTestModal } from '../components/SpeedTestModal';
import { ComputeStressModal } from '../components/ComputeStressModal';
import { DeveloperTab } from '../components/settings/DeveloperTab';
import { VideoDecodeModal } from '../components/VideoDecodeModal';
import { GraphicsDebugModal } from '../components/GraphicsDebugModal';
import { SpeechExplorerModal } from '../components/SpeechExplorerModal';
import { MidiModal } from '../components/MidiModal';
import { StorageBenchmarkModal } from '../components/StorageBenchmarkModal';
import { NetworkHeatmapModal } from '../components/NetworkHeatmapModal';
import { RayTracingModal } from '../components/RayTracingModal';
import { ExtensionsModal } from '../components/ExtensionsModal';

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
};

export const useModalManager = () => {
  // Visibility State for all modals
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  const components = COMPONENTS;

  const open = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: true }));
  }, []);

  const close = useCallback((id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: false }));
  }, []);
  const closeAll = useCallback(() => {
    setVisibility({});
  }, []);

  React.useEffect(() => {
    

    const handleCloseAll = () => {
      closeAll();
    };
    const handleOpenHeatmap = () => open("heatmap");
    const handleOpenNetworkTools = () => open("networkTools");
    const handleOpenDisplayTools = () => open("displayTools");
    const handleOpenStorageBenchmark = () => open("storageBench");
    const handleOpenRayTracing = () => open("rayTracing");

    window.addEventListener("close-all-modals", handleCloseAll);
    window.addEventListener("open-heatmap", handleOpenHeatmap);
    window.addEventListener("open-network-tools", handleOpenNetworkTools);
    window.addEventListener("open-display-tools", handleOpenDisplayTools);
    window.addEventListener(
      "open-storage-benchmark",
      handleOpenStorageBenchmark,
    );
    window.addEventListener("open-ray-tracing", handleOpenRayTracing);

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
    };
  }, [closeAll, open]);

  return {
    visibility,
    open,
    close,
    closeAll,
    Components: components,
  };
};
