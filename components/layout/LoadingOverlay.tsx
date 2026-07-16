import React from "react";
import { Monitor, Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  showLoader: boolean;
  fadeLoader: boolean;
  loadingText: string;
  isExportingPdf: boolean;
  isExportingImage: boolean;
  lang: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  showLoader,
  fadeLoader,
  loadingText,
  isExportingPdf,
  isExportingImage,
  lang,
}) => {
  return (
    <>
      {/* Loading Overlay */}
      {showLoader ? (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ease-out backdrop-blur-xl bg-slate-50/80 dark:bg-slate-950/85 ${
            fadeLoader ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
          }}
        >
          <div
            className={`bg-white/80 dark:bg-slate-800/80 p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col items-center gap-6 max-w-sm w-full mx-4 backdrop-blur-md transition-all duration-500 ease-out transform ${
              fadeLoader ? "scale-95 translate-y-4" : "scale-100 translate-y-0"
            }`}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Monitor className="text-indigo-500" size={24} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                BrowserScope
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse font-mono">
                {loadingText}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* PDF Exporting Loader Overlay */}
      {isExportingPdf ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex items-center gap-4 max-w-sm w-full mx-4 transform animate-in fade-in zoom-in duration-200">
            <Loader2 className="animate-spin text-indigo-500 shrink-0" size={28} />
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                {lang === "zh-CN"
                  ? "正在生成 PDF 诊断报告..."
                  : lang === "zh-TW" || lang === "zh-HK"
                  ? "正在生成 PDF 診斷報告..."
                  : lang === "ja"
                  ? "PDF診断レポートを作成中..."
                  : lang === "ru"
                  ? "Создание PDF-отчета..."
                  : "Generating PDF Diagnostic Report..."}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                {lang === "zh-CN"
                  ? "正在使用后台 Worker 线程渲染报告"
                  : lang === "zh-TW" || lang === "zh-HK"
                  ? "正在使用後台 Worker 線程渲染報告"
                  : lang === "ja"
                  ? "バックグラウンドの Worker 経由で処理中"
                  : lang === "ru"
                  ? "Используется фоновый поток"
                  : "Rendering report using background Worker thread"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Image Exporting Loader Overlay */}
      {isExportingImage ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex items-center gap-4 max-w-sm w-full mx-4 transform animate-in fade-in zoom-in duration-200">
            <Loader2 className="animate-spin text-indigo-500 shrink-0" size={28} />
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                {lang === "zh-CN"
                  ? "正在导出仪表盘图片..."
                  : lang === "zh-TW" || lang === "zh-HK"
                  ? "正在匯出儀表板圖片..."
                  : lang === "ja"
                  ? "ダッシュボード画像をエクスポート中..."
                  : lang === "ru"
                  ? "Экспорт изображения..."
                  : "Exporting Dashboard Image..."}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                {lang === "zh-CN"
                  ? "正在使用 html2canvas 渲染高清晰度 PNG"
                  : lang === "zh-TW" || lang === "zh-HK"
                  ? "正在使用 html2canvas 渲染高清晰度 PNG"
                  : lang === "ja"
                  ? "html2canvas で高解像度PNGをレンダリング中"
                  : lang === "ru"
                  ? "Рендеринг PNG высокого разрешения..."
                  : "Rendering high-resolution PNG using html2canvas"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
