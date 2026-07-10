import { useState } from "react";
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

  const checkPermissionStatus = async (key: PermissionKey, name: string) => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await Promise.race([
            navigator.permissions.query({ name: name as PermissionName }),
            new Promise<PermissionStatus>((_, reject) => setTimeout(() => reject(new Error('timeout')), 500))
        ]);
        updatePermStatus(key, result.state as PermissionStatusType);

        if (key === "geolocation" && result.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              setGeoData({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                altitude: pos.coords.altitude,
                altitudeAccuracy: pos.coords.altitudeAccuracy,
                heading: pos.coords.heading,
                speed: pos.coords.speed,
              }),
            (err) => console.error(err),
          );
        }

        result.onchange = () => {
          updatePermStatus(key, result.state as PermissionStatusType);
        };
      }
    } catch (e: unknown) {
      console.debug(`Permission query failed for ${name}`, getErrorMessage(e));
    }
  };

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
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            updatePermStatus("geolocation", "granted");
            setGeoData({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              altitude: pos.coords.altitude,
              altitudeAccuracy: pos.coords.altitudeAccuracy,
              heading: pos.coords.heading,
              speed: pos.coords.speed,
            });
          },
          (err) => {
            console.error(err);
            updatePermStatus("geolocation", "denied");
          },
        );
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
