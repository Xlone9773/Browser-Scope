import { useState, useCallback, useRef, useEffect } from "react";
import { BrowserData } from "../types";
import { getAllData } from "../services/detectionService";
import { runAiReadinessCheck } from "../services/detectors/hardware";

export function useAppData(steps: string[]) {
  const [data, setData] = useState<BrowserData | null>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(true);
  const [loadingText, setLoadingText] = useState("");

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

    setData(info);

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

  return {
    data,
    showLoader,
    fadeLoader,
    loadingText,
    fetchData,
    handleAiRetest,
  };
}
