import React from "react";
import { Skull } from "lucide-react";
import { Translation } from "../../../utils/i18n/types";

interface WarningOverlayProps {
  t: Translation["settings"]["developer"];
  countdown: number;
  isOverlayFading: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export const WarningOverlay: React.FC<WarningOverlayProps> = ({
  t,
  countdown,
  isOverlayFading,
  onAccept,
  onCancel,
}) => {
  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center p-6 bg-red-950/95 backdrop-blur-xl transition-all duration-300 ease-out ${isOverlayFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 border-2 border-red-600 flex flex-col items-center text-center transition-all duration-300 ease-out transform ${isOverlayFading ? "scale-95 translate-y-4 opacity-0" : "scale-100 translate-y-0 opacity-100"}`}
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-500 animate-bounce">
          <Skull size={40} strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-black text-red-600 dark:text-red-500 mb-4 uppercase tracking-tight">
          {t.warning.title}
        </h3>
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30 mb-6">
          <p className="text-sm font-medium text-slate-700 dark:text-red-200 leading-relaxed whitespace-pre-wrap">
            {t.warning.desc}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onCancel}
            className="w-full py-4 font-bold rounded-lg transition-all text-base tracking-wide bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            {t.warning.cancel}
          </button>
          <button
            onClick={onAccept}
            disabled={countdown > 0}
            className={`w-full py-4 font-bold rounded-lg shadow-lg transition-all text-base tracking-wide
                            ${
                              countdown > 0
                                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 active:scale-95"
                            }`}
          >
            {countdown > 0 ? `Wait ${countdown}s...` : t.warning.agree}
          </button>
        </div>
      </div>
    </div>
  );
};
