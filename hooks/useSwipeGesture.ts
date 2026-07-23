import { useRef, useCallback } from "react";

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minDistance?: number;
  minVelocity?: number;
  angleRatio?: number;
}

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchCancel: () => void;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export function useSwipeGesture(options: SwipeGestureOptions): SwipeHandlers {
  const {
    onSwipeLeft,
    onSwipeRight,
    minDistance = 40,
    minVelocity = 0.2,
    angleRatio = 1.5,
  } = options;

  const startPointRef = useRef<TouchPoint | null>(null);
  const lastPointRef = useRef<TouchPoint | null>(null);
  const isMultiTouchRef = useRef<boolean>(false);
  const isExcludedTargetRef = useRef<boolean>(false);

  const checkExcludedTarget = (element: HTMLElement | null): boolean => {
    let current = element;
    while (current && current !== document.body && current !== document.documentElement) {
      const tagName = current.tagName.toLowerCase();
      const id = current.id ? current.id.toLowerCase() : "";
      const className = typeof current.className === "string" ? current.className.toLowerCase() : "";
      const role = current.getAttribute ? current.getAttribute("role") : null;
      const ariaModal = current.getAttribute ? current.getAttribute("aria-modal") : null;

      if (
        id.includes("eruda") ||
        className.includes("eruda") ||
        role === "dialog" ||
        ariaModal === "true" ||
        role === "button" ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        tagName === "canvas" ||
        tagName === "video" ||
        tagName === "button" ||
        tagName === "a"
      ) {
        return true;
      }
      const style = window.getComputedStyle(current);
      const overflowX = style.overflowX;
      if (
        (overflowX === "auto" || overflowX === "scroll") &&
        current.scrollWidth > current.clientWidth
      ) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  };

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLElement>): void => {
    if (e.touches.length > 1) {
      isMultiTouchRef.current = true;
      startPointRef.current = null;
      lastPointRef.current = null;
      return;
    }

    isMultiTouchRef.current = false;
    const target = e.target as HTMLElement | null;
    isExcludedTargetRef.current = checkExcludedTarget(target);

    if (isExcludedTargetRef.current) {
      startPointRef.current = null;
      lastPointRef.current = null;
      return;
    }

    const touch = e.touches[0];
    const now = performance.now();
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
    };

    startPointRef.current = point;
    lastPointRef.current = point;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLElement>): void => {
    if (isMultiTouchRef.current || isExcludedTargetRef.current) {
      return;
    }

    if (e.touches.length > 1) {
      isMultiTouchRef.current = true;
      startPointRef.current = null;
      lastPointRef.current = null;
      return;
    }

    const touch = e.touches[0];
    const now = performance.now();
    lastPointRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
    };
  }, []);

  const onTouchEnd = useCallback((): void => {
    if (
      isMultiTouchRef.current ||
      isExcludedTargetRef.current ||
      !startPointRef.current ||
      !lastPointRef.current
    ) {
      startPointRef.current = null;
      lastPointRef.current = null;
      return;
    }

    const start = startPointRef.current;
    const last = lastPointRef.current;

    const deltaX = last.x - start.x;
    const deltaY = last.y - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const deltaTime = Math.max(last.time - start.time, 1);
    const velocity = absX / deltaTime;

    startPointRef.current = null;
    lastPointRef.current = null;

    // Check angle constraint: horizontal displacement must outweigh vertical displacement by ratio
    if (absX < absY * angleRatio) {
      return;
    }

    // Check threshold: either sufficient flick velocity & distance OR large drag distance
    const isFastFlick = absX >= minDistance && velocity >= minVelocity;
    const isLargeDrag = absX >= minDistance * 2;

    if (isFastFlick || isLargeDrag) {
      if (deltaX < 0) {
        onSwipeLeft ? onSwipeLeft() : null;
      } else {
        onSwipeRight ? onSwipeRight() : null;
      }
    }
  }, [angleRatio, minDistance, minVelocity, onSwipeLeft, onSwipeRight]);

  const onTouchCancel = useCallback((): void => {
    startPointRef.current = null;
    lastPointRef.current = null;
    isMultiTouchRef.current = false;
    isExcludedTargetRef.current = false;
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  };
}
