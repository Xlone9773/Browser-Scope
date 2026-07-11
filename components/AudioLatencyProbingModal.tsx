import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Radio,
  Zap,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Translation } from "../utils/i18n/types";
import { Modal } from "./ui/Modal";
import { Slider } from "./ui/Slider";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";

interface AudioLatencyProbingModalProps {
  onClose: () => void;
  t: Translation;
}

interface Speaker {
  id: string;
  name: string;
  shortName: string;
  channelIndex: number;
  frequency: number;
  type: "high" | "mid" | "low" | "surround";
  x: number; // grid position x percentage (0 - 100)
  y: number; // grid position y percentage (0 - 100)
}

const layouts: Record<string, Speaker[]> = {
  stereo: [
    { id: "L", name: "Left Speaker", shortName: "L", channelIndex: 0, frequency: 1000, type: "high", x: 25, y: 15 },
    { id: "R", name: "Right Speaker", shortName: "R", channelIndex: 1, frequency: 1000, type: "high", x: 75, y: 15 },
  ],
  quad: [
    { id: "L", name: "Left Front", shortName: "L", channelIndex: 0, frequency: 1000, type: "high", x: 25, y: 15 },
    { id: "R", name: "Right Front", shortName: "R", channelIndex: 1, frequency: 1000, type: "high", x: 75, y: 15 },
    { id: "SL", name: "Left Surround", shortName: "SL", channelIndex: 2, frequency: 1500, type: "surround", x: 15, y: 70 },
    { id: "SR", name: "Right Surround", shortName: "SR", channelIndex: 3, frequency: 1500, type: "surround", x: 85, y: 70 },
  ],
  "5.1": [
    { id: "L", name: "Left Front", shortName: "L", channelIndex: 0, frequency: 1000, type: "high", x: 25, y: 15 },
    { id: "C", name: "Center Speaker", shortName: "C", channelIndex: 2, frequency: 600, type: "mid", x: 50, y: 10 },
    { id: "R", name: "Right Front", shortName: "R", channelIndex: 1, frequency: 1000, type: "high", x: 75, y: 15 },
    { id: "LFE", name: "Subwoofer (LFE)", shortName: "LFE", channelIndex: 3, frequency: 60, type: "low", x: 35, y: 35 },
    { id: "SL", name: "Left Surround", shortName: "SL", channelIndex: 4, frequency: 1500, type: "surround", x: 15, y: 70 },
    { id: "SR", name: "Right Surround", shortName: "SR", channelIndex: 5, frequency: 1500, type: "surround", x: 85, y: 70 },
  ],
  "7.1": [
    { id: "L", name: "Left Front", shortName: "L", channelIndex: 0, frequency: 1000, type: "high", x: 25, y: 15 },
    { id: "C", name: "Center Speaker", shortName: "C", channelIndex: 2, frequency: 600, type: "mid", x: 50, y: 10 },
    { id: "R", name: "Right Front", shortName: "R", channelIndex: 1, frequency: 1000, type: "high", x: 75, y: 15 },
    { id: "LFE", name: "Subwoofer (LFE)", shortName: "LFE", channelIndex: 3, frequency: 60, type: "low", x: 35, y: 35 },
    { id: "SL", name: "Left Side Surround", shortName: "SL", channelIndex: 6, frequency: 1500, type: "surround", x: 15, y: 50 },
    { id: "SR", name: "Right Side Surround", shortName: "SR", channelIndex: 7, frequency: 1500, type: "surround", x: 85, y: 50 },
    { id: "LB", name: "Left Back", shortName: "LB", channelIndex: 4, frequency: 1800, type: "surround", x: 30, y: 85 },
    { id: "RB", name: "Right Back", shortName: "RB", channelIndex: 5, frequency: 1800, type: "surround", x: 70, y: 85 },
  ],
};

export const AudioLatencyProbingModal: React.FC<AudioLatencyProbingModalProps> = ({ onClose, t }) => {
  const [activeLayout, setActiveLayout] = useState<string>("stereo");
  const [maxHardwareChannels, setMaxHardwareChannels] = useState<number>(2);
  const [outputLatency, setOutputLatency] = useState<number | null>(null);
  const [baseLatency, setBaseLatency] = useState<number | null>(null);
  const [isPlayingSyncTest, setIsPlayingSyncTest] = useState<boolean>(false);
  const [latencyOffset, setLatencyOffset] = useState<number>(0);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [isAutoProbing, setIsAutoProbing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const layoutOptions = [
    { id: "stereo", label: t.audioLatencyProbing?.layout_stereo },
    ...(maxHardwareChannels >= 4 ? [{ id: "quad", label: t.audioLatencyProbing?.layout_quad }] : []),
    ...(maxHardwareChannels >= 6 ? [{ id: "5.1", label: t.audioLatencyProbing?.layout_5_1 }] : []),
    ...(maxHardwareChannels >= 8 ? [{ id: "7.1", label: t.audioLatencyProbing?.layout_7_1 }] : [])
  ];

  // Audio nodes and references
  const audioContextRef = useRef<AudioContext | null>(null);
  const mergerNodeRef = useRef<ChannelMergerNode | null>(null);
  const syncTimerRef = useRef<number | null>(null);
  const activeOscillatorsRef = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map());
  const autoProbeTimerRef = useRef<number | null>(null);

  // For Visual Sync Flasher
  const [flashActive, setFlashActive] = useState<boolean>(false);

  const stopAllAudio = () => {
    // Clear sync loop
    if (syncTimerRef.current) {
      window.clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    setIsPlayingSyncTest(false);

    // Clear auto probe
    if (autoProbeTimerRef.current) {
      window.clearInterval(autoProbeTimerRef.current);
      autoProbeTimerRef.current = null;
    }
    setIsAutoProbing(false);

    // Stop active oscillators
    activeOscillatorsRef.current.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (_e) {}
    });
    activeOscillatorsRef.current.clear();
    setActiveSpeakerId(null);
  };

  const initContextIfNeeded = async (): Promise<AudioContext | null> => {
    if (!audioContextRef.current) return null;
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  };

  // Initialize Web Audio Context to get initial parameters
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          setErrorMsg("Web Audio API is not supported in this browser.");
          return;
        }
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Extract details
        const maxCh = ctx.destination.maxChannelCount || 2;
        setMaxHardwareChannels(maxCh);

        // Latency detection
        if (typeof ctx.outputLatency === "number") {
          setOutputLatency(ctx.outputLatency);
        } else if ('outputLatency' in ctx) {
          const outLatVal = (ctx as unknown as { outputLatency: unknown }).outputLatency;
          if (outLatVal !== undefined && outLatVal !== null) {
            setOutputLatency(typeof outLatVal === "number" ? outLatVal : parseFloat(String(outLatVal)));
          }
        }

        if (typeof ctx.baseLatency === "number") {
          setBaseLatency(ctx.baseLatency);
        }

        // Automatically switch layout based on hardware if possible
        if (maxCh >= 8) {
          setActiveLayout("7.1");
        } else if (maxCh >= 6) {
          setActiveLayout("5.1");
        } else if (maxCh >= 4) {
          setActiveLayout("quad");
        } else {
          setActiveLayout("stereo");
        }
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        setErrorMsg(`Failed to initialize Web Audio API: ${errMsg}`);
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      stopAllAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Build routing nodes (Merger) to target physical outputs
  const configureMerger = (ctx: AudioContext, channelCount: number) => {
    // Clean up old merger
    if (mergerNodeRef.current) {
      try {
        mergerNodeRef.current.disconnect();
      } catch (_e) {}
    }

    // Set destination channel parameters
    ctx.destination.channelCount = channelCount;
    ctx.destination.channelCountMode = "explicit";
    ctx.destination.channelInterpretation = "discrete";

    const merger = ctx.createChannelMerger(channelCount);
    merger.connect(ctx.destination);
    mergerNodeRef.current = merger;
    return merger;
  };

  // Play a test tone on a specific channel index
  const playChannelSound = async (speaker: Speaker, duration: number = 0.5) => {
    const ctx = await initContextIfNeeded();
    if (!ctx) return;

    // Stop any tone currently playing on this speaker
    stopSpeakerSound(speaker.id);

    const layoutList = layouts[activeLayout];
    const targetChannelCount = layoutList.reduce((max, spk) => Math.max(max, spk.channelIndex + 1), 2);

    // Make sure merger is set up with correct size
    let merger = mergerNodeRef.current;
    if (!merger || merger.numberOfInputs < targetChannelCount) {
      merger = configureMerger(ctx, targetChannelCount);
    }

    // Create oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (speaker.type === "low") {
      // Deep Subwoofer rumbling - sine wave
      osc.type = "sine";
      osc.frequency.setValueAtTime(speaker.frequency, ctx.currentTime);
      // Boost bass volume slightly since low freqs are hard to hear on tiny speakers
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
    } else if (speaker.type === "surround") {
      // High-mid chirp/frequency sweeps to check treble space routing
      osc.type = "triangle";
      osc.frequency.setValueAtTime(speaker.frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(speaker.frequency + 400, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
    } else {
      // Mid/Front speakers - clean pleasant sine
      osc.type = "sine";
      osc.frequency.setValueAtTime(speaker.frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
    }

    // Connect node to merger's corresponding input channel index
    osc.connect(gain);
    gain.connect(merger, 0, speaker.channelIndex);

    // Play & fade out
    osc.start();
    setActiveSpeakerId(speaker.id);

    // Linear fade out to prevent popping
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    osc.stop(ctx.currentTime + duration);

    // Clean up ref after play finishes
    window.setTimeout(() => {
      activeOscillatorsRef.current.delete(speaker.id);
      if (activeSpeakerId === speaker.id) {
        setActiveSpeakerId(null);
      }
    }, duration * 1000);

    activeOscillatorsRef.current.set(speaker.id, { osc, gain });
  };

  const stopSpeakerSound = (speakerId: string) => {
    const active = activeOscillatorsRef.current.get(speakerId);
    if (active) {
      try {
        active.osc.stop();
        active.osc.disconnect();
        active.gain.disconnect();
      } catch (_e) {}
      activeOscillatorsRef.current.delete(speakerId);
    }
  };

  // Start auto-probing cyclic test
  const toggleAutoProbing = () => {
    if (isAutoProbing) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    setIsAutoProbing(true);

    const speakers = layouts[activeLayout];
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= speakers.length) {
        currentIndex = 0;
      }
      const speaker = speakers[currentIndex];
      playChannelSound(speaker, 0.8);
      currentIndex++;
    };

    // Play first immediately
    playNext();

    // Loop
    autoProbeTimerRef.current = window.setInterval(playNext, 1200);
  };

  // Toggle visual sync and auditory click test
  const toggleSyncTest = async () => {
    if (isPlayingSyncTest) {
      stopAllAudio();
      return;
    }

    const ctx = await initContextIfNeeded();
    if (!ctx) return;

    stopAllAudio();
    setIsPlayingSyncTest(true);

    const intervalMs = 1000; // Click every 1 second

    const playClickAndFlash = () => {
      // 1. Trigger the visual flash immediately (representing t = 0)
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 120);

      // 2. Play the sound beep with a customizable user latency offset
      // If hardware has say, 120ms latency, the user can shift the offset to see visual-audio match
      const totalOffsetMs = (outputLatency ? outputLatency * 1000 : 80) + latencyOffset;
      const scheduledTime = ctx.currentTime + Math.max(0, totalOffsetMs / 1000);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, scheduledTime);
      gain.gain.setValueAtTime(0.5, scheduledTime);
      gain.gain.exponentialRampToValueAtTime(0.001, scheduledTime + 0.08);

      osc.connect(gain);
      osc.connect(ctx.destination);

      osc.start(scheduledTime);
      osc.stop(scheduledTime + 0.1);
    };

    playClickAndFlash();
    syncTimerRef.current = window.setInterval(playClickAndFlash, intervalMs);
  };

  const activeSpeakerList = layouts[activeLayout] || [];

  return (
    <Modal
      title={t.audioLatencyProbing?.title}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-6">
        {/* Top Info Banner */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl flex gap-3">
          <Volume2 className="text-indigo-500 shrink-0 w-5 h-5 mt-0.5" />
          <div className="text-sm space-y-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              {t.audioLatencyProbing?.desc_title}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              {t.audioLatencyProbing?.desc}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-lg text-xs flex gap-2 items-center">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Hardware Latency Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/30 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              {t.audioLatencyProbing?.output}
            </span>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {outputLatency !== null ? (outputLatency * 1000).toFixed(1) : "N/A"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ms</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {t.audioLatencyProbing?.output_desc}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/30 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              {t.audioLatencyProbing?.base}
            </span>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-2xl font-bold font-mono text-emerald-500 dark:text-emerald-400">
                {baseLatency !== null ? (baseLatency * 1000).toFixed(1) : "N/A"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ms</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {t.audioLatencyProbing?.base_desc}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/30 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              {t.audioLatencyProbing?.max_channels}
            </span>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-2xl font-bold font-mono text-violet-500 dark:text-violet-400">
                {maxHardwareChannels}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Ch</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {t.audioLatencyProbing?.max_channels_desc}
            </p>
          </div>
        </div>

        {/* 2. Sync Calibration & Latency Simulator */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-700/40 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-indigo-500 w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t.audioLatencyProbing?.sync_calib}
              </h3>
            </div>
            <Button
              onClick={toggleSyncTest}
              variant={isPlayingSyncTest ? "danger" : "primary"}
              size="sm"
              leftIcon={isPlayingSyncTest ? <Pause size={14} /> : <Play size={14} />}
            >
              {isPlayingSyncTest ? t.audioLatencyProbing?.stop_test : t.audioLatencyProbing?.start_sync_test}
            </Button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.audioLatencyProbing?.sync_calib_desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Flasher Display */}
            <div className="flex flex-col items-center justify-center h-28 border border-slate-200/60 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-900/40 rounded-xl relative overflow-hidden">
              <div
                className={`absolute inset-0 transition-all duration-75 flex items-center justify-center ${
                  flashActive
                    ? "bg-indigo-500/20 dark:bg-indigo-500/30 scale-100 shadow-[inset_0_0_20px_rgba(99,102,241,0.3)]"
                    : "scale-95"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-4 transition-all duration-75 ${
                    flashActive
                      ? "border-indigo-500 bg-indigo-400/80 scale-125 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                      : "border-slate-300 dark:border-slate-700 bg-transparent"
                  }`}
                />
              </div>
              <span className="absolute bottom-2 text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                {t.audioLatencyProbing?.visual_flash}
              </span>
            </div>

            {/* Manual Compensation Slider */}
            <div className="space-y-2">
              <Slider
                value={latencyOffset}
                onChange={setLatencyOffset}
                min={-300}
                max={300}
                step={5}
                label={t.audioLatencyProbing?.manual_compensation}
                color="indigo"
                formatValue={(val) => (val >= 0 ? `+${val} ms` : `${val} ms`)}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-300ms ({t.audioLatencyProbing?.early})</span>
                <span>0ms ({t.audioLatencyProbing?.no_offset})</span>
                <span>+300ms ({t.audioLatencyProbing?.late})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Surround Space & Channel Probing */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-700/40 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Radio className="text-emerald-500 w-4 h-4 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t.audioLatencyProbing?.discrete_probing}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleAutoProbing}
                variant={isAutoProbing ? "danger" : "soft"}
                size="sm"
                leftIcon={<RefreshCw size={12} className={isAutoProbing ? "animate-spin" : ""} />}
              >
                {isAutoProbing ? t.audioLatencyProbing?.stop_probe : t.audioLatencyProbing?.start_probe}
              </Button>

              <Select
                value={activeLayout}
                options={layoutOptions}
                onChange={(val) => {
                  stopAllAudio();
                  setActiveLayout(val as string);
                }}
                size="sm"
                fullWidth={false}
                className="w-40"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.audioLatencyProbing?.channel_probing_desc}
          </p>

          {/* Virtual Acoustic Room Arena */}
          <div className="h-64 border border-slate-200/60 dark:border-slate-700/50 bg-slate-100/40 dark:bg-slate-900/30 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Ambient Room Grid & Head position in center */}
            <div className="absolute inset-0 pointer-events-none border border-slate-200/20 grid grid-cols-4 grid-rows-4 opacity-50" />

            {/* Listener representation in middle */}
            <div className="absolute w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200/30 dark:bg-slate-800/40 flex flex-col items-center justify-center z-0">
              <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold font-mono">
                {t.audioLatencyProbing?.listener_center}
              </span>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 animate-ping" />
            </div>

            {/* Render Speakers */}
            {activeSpeakerList.map((speaker) => {
              const isActive = activeSpeakerId === speaker.id;
              return (
                <button
                  key={speaker.id}
                  onClick={() => playChannelSound(speaker, 0.6)}
                  style={{
                    left: `${speaker.x}%`,
                    top: `${speaker.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-200 z-10 ${
                    isActive ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  {/* Speaker Box Graphic */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/40 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500"
                    }`}
                  >
                    <Volume2 size={16} className={isActive ? "animate-bounce" : ""} />
                  </div>

                  {/* Speaker Label */}
                  <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-white text-[8px] font-bold font-mono uppercase tracking-wider text-center max-w-[80px] truncate">
                    {speaker.shortName}
                  </div>

                  {/* Frequency Descriptor */}
                  <div className="text-[7px] text-slate-400 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {speaker.frequency}Hz
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100/50 dark:bg-slate-900/30 rounded-lg border border-slate-200/20 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>{t.audioLatencyProbing?.legend_high_mid}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t.audioLatencyProbing?.legend_surround}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{t.audioLatencyProbing?.legend_lfe}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
