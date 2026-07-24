import { useState, useCallback } from "react";
import { GeoPosition } from "../types";
import { getErrorMessage } from "../utils/error";

export type PermissionStatusType =
  | "idle"
  | "granted"
  | "denied"
  | "prompt"
  | "error";
export type PermissionKey =
  | "camera"
  | "microphone"
  | "geolocation"
  | "notifications"
  | "midi";

const getSecureGeolocation = (): Promise<GeoPosition> => {
  return new Promise((resolve, reject) => {
    let isMethodOverridden = false;
    let iframe: HTMLIFrameElement | null = null;
    
    try {
      if (typeof document !== "undefined") {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const cleanGeo = iframe.contentWindow?.navigator?.geolocation;
        if (cleanGeo) {
          if (navigator.geolocation.getCurrentPosition !== cleanGeo.getCurrentPosition) {
            isMethodOverridden = true;
          }
        }
      }
    } catch (e) {
      console.error("Method override detection error:", e);
    }

    const cleanup = () => {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (apparentPos) => {
        if (iframe && iframe.contentWindow?.navigator?.geolocation) {
          const cleanGeo = iframe.contentWindow.navigator.geolocation;
          cleanGeo.getCurrentPosition(
            (realPos) => {
              cleanup();
              const apparentLat = apparentPos.coords.latitude;
              const apparentLong = apparentPos.coords.longitude;
              const apparentAcc = apparentPos.coords.accuracy;

              const realLat = realPos.coords.latitude;
              const realLong = realPos.coords.longitude;
              const realAcc = realPos.coords.accuracy;

              // Check if the coordinates differ or if the method was overridden
              const coordsDiffer = 
                Math.abs(apparentLat - realLat) > 1e-7 || 
                Math.abs(apparentLong - realLong) > 1e-7 ||
                Math.abs(apparentAcc - realAcc) > 1e-4;

              const isSpoofed = isMethodOverridden || coordsDiffer;

              resolve({
                latitude: realLat,
                longitude: realLong,
                accuracy: realAcc,
                altitude: realPos.coords.altitude,
                altitudeAccuracy: realPos.coords.altitudeAccuracy,
                heading: realPos.coords.heading,
                speed: realPos.coords.speed,
                isSpoofed,
                apparentLat,
                apparentLong,
                apparentAcc,
                realLat,
                realLong,
                realAcc,
              });
            },
            (realErr) => {
              console.error("Real geolocation failed, falling back to apparent:", realErr);
              cleanup();
              resolve({
                latitude: apparentPos.coords.latitude,
                longitude: apparentPos.coords.longitude,
                accuracy: apparentPos.coords.accuracy,
                altitude: apparentPos.coords.altitude,
                altitudeAccuracy: apparentPos.coords.altitudeAccuracy,
                heading: apparentPos.coords.heading,
                speed: apparentPos.coords.speed,
                isSpoofed: isMethodOverridden,
                apparentLat: apparentPos.coords.latitude,
                apparentLong: apparentPos.coords.longitude,
                apparentAcc: apparentPos.coords.accuracy,
              });
            },
            { timeout: 10000, enableHighAccuracy: true }
          );
        } else {
          cleanup();
          resolve({
            latitude: apparentPos.coords.latitude,
            longitude: apparentPos.coords.longitude,
            accuracy: apparentPos.coords.accuracy,
            altitude: apparentPos.coords.altitude,
            altitudeAccuracy: apparentPos.coords.altitudeAccuracy,
            heading: apparentPos.coords.heading,
            speed: apparentPos.coords.speed,
            isSpoofed: isMethodOverridden,
          });
        }
      },
      (err) => {
        cleanup();
        reject(err);
      },
      { timeout: 15000, enableHighAccuracy: true }
    );
  });
};

export function useAppPermissions(openModal: (modalId: string) => void) {
  const [permStatus, setPermStatus] = useState<
    Record<PermissionKey, PermissionStatusType>
  >({
    camera: "idle",
    microphone: "idle",
    geolocation: "idle",
    notifications: "idle",
    midi: "idle",
  });

  const [geoData, setGeoData] = useState<GeoPosition | null>(null);

  const updatePermStatus = (
    key: PermissionKey,
    status: PermissionStatusType,
  ) => {
    setPermStatus((prev) => ({ ...prev, [key]: status }));
  };

  const checkPermissionStatus = useCallback(async (key: PermissionKey, name: string) => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await Promise.race([
            navigator.permissions.query({ name: name as PermissionName }),
            new Promise<PermissionStatus>((_, reject) => setTimeout(() => reject(new Error('timeout')), 500))
        ]);
        setPermStatus((prev) => ({ ...prev, [key]: result.state as PermissionStatusType }));

        if (key === "geolocation" && result.state === "granted") {
          getSecureGeolocation()
            .then((pos) => setGeoData(pos))
            .catch((err) => console.error("Secure check failed:", err));
        }

        result.onchange = () => {
          setPermStatus((prev) => ({ ...prev, [key]: result.state as PermissionStatusType }));
        };
      }
    } catch (e: unknown) {
      console.debug(`Permission query failed for ${name}`, getErrorMessage(e));
    }
  }, []);

  const requestPermission = async (type: PermissionKey) => {
    try {
      if (type === "camera") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        updatePermStatus("camera", "granted");
        stream.getTracks().forEach((t) => t.stop());
        openModal("camera");
      } else if (type === "microphone") {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        updatePermStatus("microphone", "granted");
        stream.getTracks().forEach((t) => t.stop());
        openModal("audio");
      } else if (type === "geolocation") {
        updatePermStatus("geolocation", "prompt");
        getSecureGeolocation()
          .then((pos) => {
            updatePermStatus("geolocation", "granted");
            setGeoData(pos);
          })
          .catch((err) => {
            console.error("Permission request failed:", err);
            updatePermStatus("geolocation", "denied");
          });
      } else if (type === "notifications") {
        const result = await Notification.requestPermission();
        updatePermStatus(
          "notifications",
          result === "default" ? "prompt" : result,
        );
      } else if (type === "midi") {
        if (navigator.requestMIDIAccess) {
          await navigator.requestMIDIAccess();
          updatePermStatus("midi", "granted");
          openModal("midi");
        } else {
          updatePermStatus("midi", "error");
        }
      }
    } catch (error: unknown) {
      console.error(`Error requesting permission for ${type}:`, getErrorMessage(error));
      const errName = error && typeof error === 'object' && 'name' in error ? String((error as Record<string, unknown>).name) : '';
      if (
        errName === "NotAllowedError" ||
        errName === "PermissionDeniedError"
      ) {
        updatePermStatus(type, "denied");
      } else {
        updatePermStatus(type, "error");
      }
    }
  };

  return {
    permStatus,
    geoData,
    checkPermissionStatus,
    requestPermission,
  };
}
