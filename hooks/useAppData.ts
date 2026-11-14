import { useState, useCallback, useRef, useEffect } from "react";
import { BrowserData } from "../types";
import { getAllData } from "../services/detectionService";
import {
  BatteryInfo,
  isBatteryValueReadable,
  runAiReadinessCheck,
  subscribeBatteryUpdates,
} from "../services/detectors/hardware";

export function useAppData(steps: string[]) {
  const [data, setData] = useState<BrowserData | null>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const latestBatteryRef = useRef<BatteryInfo | null>(null);

  const stepsRef = useRef(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const fetchData = useCallback(async () => {
    setFadeLoader(true);
    setShowLoader(true);

    await new Promise((r) => setTimeout(r, 50));
    setFadeLoader(false);

    let stepIndex = 0;
    const validSteps =
      stepsRef.current && stepsRef.current.length > 0
        ? stepsRef.current
        : ["Loading..."];
    setLoadingText(validSteps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < validSteps.length) {
        setLoadingText(validSteps[validSteps.length - 1]);
      }
    }, 250);

    const info = await getAllData();
    clearInterval(interval);

    if (validSteps.length > 0) {
      setLoadingText(validSteps[validSteps.length - 1]);
    }

    const cachedBattery = latestBatteryRef.current;
    const mergedInfo =
      cachedBattery && !isBatteryValueReadable(info.hardware.batteryLevel)
        ? {
            ...info,
            hardware: {
              ...info.hardware,
              batteryLevel: cachedBattery.level,
              isCharging: cachedBattery.charging,
              chargingTime: cachedBattery.chargingTime,
              dischargingTime: cachedBattery.dischargingTime,
            },
          }
        : info;

    setData(mergedInfo);

    setFadeLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 500);
  }, []);

  const handleAiRetest = useCallback(() => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ai: {
          ...prev.ai,
          readiness: runAiReadinessCheck(),
        },
      };
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeBatteryUpdates((battery) => {
      latestBatteryRef.current = battery;
      setData((prev) => {
        if (!prev) return prev;
        if (
          prev.hardware.batteryLevel === battery.level &&
          prev.hardware.isCharging === battery.charging &&
          prev.hardware.chargingTime === battery.chargingTime &&
          prev.hardware.dischargingTime === battery.dischargingTime
        ) {
          return prev;
        }
        return {
          ...prev,
          hardware: {
            ...prev.hardware,
            batteryLevel: battery.level,
            isCharging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          },
        };
      });
    });

    return unsubscribe;
  }, []);

  return {
    data,
    showLoader,
    fadeLoader,
    loadingText,
    fetchData,
    handleAiRetest,
  };
}
