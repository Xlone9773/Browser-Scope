import { useEffect } from "react";

interface KeyboardShortcutsProps {
  lang: "en" | "zh-CN" | "zh-TW" | "zh-HK" | "ja" | "ru";
  open: (id: string) => void;
  closeAll: () => void;
  toggleTheme: () => void;
  fetchData: () => void;
  handleExportJSON: () => void;
  handleExportPDF: () => void;
  handleExportImage: () => void;
  visibility: Record<string, boolean>;
}

export const useKeyboardShortcuts = ({
  lang,
  open,
  closeAll,
  toggleTheme,
  fetchData,
  handleExportJSON,
  handleExportPDF,
  handleExportImage,
  visibility,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in form controls
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        const isInput = tagName === "input" || tagName === "textarea" || tagName === "select";
        const isContentEditable =
          activeElement.hasAttribute("contenteditable") &&
          activeElement.getAttribute("contenteditable") !== "false";
        if (isInput || isContentEditable) {
          // Allow ESC to blur input
          if (e.key === "Escape") {
            (activeElement as HTMLElement).blur();
          }
          return;
        }
      }

      // 1. Esc: close all modals
      if (e.key === "Escape") {
        const hasOpenModal = document.querySelector('[role="dialog"]') !== null;
        if (hasOpenModal) {
          e.preventDefault();
          closeAll();
        }
        return;
      }

      // 2. '?' (Shift + '/') -> Help shortcuts modal
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        if (visibility.shortcuts) {
          closeAll();
        } else {
          open("shortcuts");
        }
        return;
      }

      // Shortcuts involving Alt key
      if (e.altKey) {
        const key = e.key.toLowerCase();
        switch (key) {
          case "g": // Alt + G: toggle theme
            e.preventDefault();
            toggleTheme();
            break;
          case "r": // Alt + R: refresh data
            e.preventDefault();
            fetchData();
            break;
          case "s": // Alt + S: open settings
            e.preventDefault();
            open("settings");
            break;
          case "b": // Alt + B: open benchmark
            e.preventDefault();
            open("benchmark");
            break;
          case "a": // Alt + A: open ai playground
            e.preventDefault();
            open("ai");
            break;
          case "n": // Alt + N: open network tools
            e.preventDefault();
            open("networkTools");
            break;
          case "d": // Alt + D: open display tools
            e.preventDefault();
            open("displayTools");
            break;
          case "m": // Alt + M: open hardware tools
            e.preventDefault();
            open("tools");
            break;
          case "t": // Alt + T: open translate tool
            e.preventDefault();
            open("googleTranslate");
            break;
          case "j": // Alt + J: export json
            e.preventDefault();
            handleExportJSON();
            break;
          case "p": // Alt + P: export pdf
            e.preventDefault();
            handleExportPDF();
            break;
          case "i": // Alt + I: export dashboard image
            e.preventDefault();
            handleExportImage();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    lang,
    open,
    closeAll,
    toggleTheme,
    fetchData,
    handleExportJSON,
    handleExportPDF,
    handleExportImage,
    visibility,
  ]);
};
