import React from "react";
import { Keyboard, HelpCircle, Laptop, Settings, Compass, Sparkles, Download, RefreshCw, X, FileJson, FileText, Image, Grid } from "lucide-react";
import { Modal } from "./ui/Modal";

interface KeyboardShortcutsModalProps {
  onClose: () => void;
  lang: "en" | "zh-CN" | "zh-TW" | "zh-HK" | "ja" | "ru";
}

interface ShortcutItem {
  keys: string[];
  description: string;
  icon?: React.ReactNode;
}

interface ShortcutCategory {
  title: string;
  items: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose, lang }) => {
  // Multilingual content
  const content = {
    "zh-CN": {
      title: "键盘快捷键",
      desc: "使用全局键盘快捷键，大幅提升操作效率。",
      categories: {
        general: "全局与通用操作",
        navigation: "快捷导航与测试工具",
        export: "数据导出"
      },
      keys: {
        theme: "切换主题（深色 / 浅色）",
        refresh: "重新扫描并刷新数据",
        help: "打开 / 关闭此快捷键帮助",
        close: "关闭当前弹窗 / 返回",
        settings: "打开设置中心",
        benchmark: "运行系统性能跑分",
        ai: "进入 AI 实验室 / Playground",
        network: "网络工具（Ping/端口/UDP）",
        display: "显示器测试工具",
        hardware: "硬件高级测试",
        translate: "谷歌网页翻译",
        exportJson: "导出 JSON 诊断数据",
        exportPdf: "导出高保真 PDF 报告",
        exportImage: "导出仪表盘高清长图",
        esc: "Esc",
        alt: "Alt",
        shift: "Shift"
      }
    },
    "zh-TW": {
      title: "鍵盤快捷鍵",
      desc: "使用全域鍵盤快捷鍵，大幅提升操作效率。",
      categories: {
        general: "全域與通用操作",
        navigation: "快捷導航與測試工具",
        export: "數據匯出"
      },
      keys: {
        theme: "切換主題（深色 / 淺色）",
        refresh: "重新掃描並刷新數據",
        help: "打開 / 關閉此快捷鍵幫助",
        close: "關閉當前彈窗 / 返回",
        settings: "打開設置中心",
        benchmark: "運行系統性能跑分",
        ai: "進入 AI 實驗室 / Playground",
        network: "網絡工具（Ping/端口/UDP）",
        display: "顯示器測試工具",
        hardware: "硬體高級測試",
        translate: "Google 網頁翻譯",
        exportJson: "匯出 JSON 診斷數據",
        exportPdf: "匯出高保真 PDF 報告",
        exportImage: "匯出儀表板高清長圖",
        esc: "Esc",
        alt: "Alt",
        shift: "Shift"
      }
    },
    "zh-HK": {
      title: "鍵盤快捷鍵",
      desc: "使用全域鍵盤快捷鍵，大幅提升操作效率。",
      categories: {
        general: "全域與通用操作",
        navigation: "快捷導航與測試工具",
        export: "數據匯出"
      },
      keys: {
        theme: "切換主題（深色 / 淺色）",
        refresh: "重新掃描並刷新數據",
        help: "打開 / 關閉此快捷鍵幫助",
        close: "關閉當前彈窗 / 返回",
        settings: "打開設置中心",
        benchmark: "運行系統性能跑分",
        ai: "進入 AI 實驗室 / Playground",
        network: "網絡工具（Ping/端口/UDP）",
        display: "顯示器測試工具",
        hardware: "硬體高級測試",
        translate: "Google 網頁翻譯",
        exportJson: "匯出 JSON 診斷數據",
        exportPdf: "匯出高保真 PDF 報告",
        exportImage: "匯出儀表板高清長圖",
        esc: "Esc",
        alt: "Alt",
        shift: "Shift"
      }
    },
    "ja": {
      title: "キーボードショートカット",
      desc: "グローバルショートカットキーを使用して、操作効率を大幅に向上させます。",
      categories: {
        general: "全般・基本操作",
        navigation: "ナビゲーション・診断ツール",
        export: "データのエクスポート"
      },
      keys: {
        theme: "テーマの切り替え（ダーク / ライト）",
        refresh: "再スキャン・データの更新",
        help: "このヘルプ画面を開く / 閉じる",
        close: "現在のモーダルを閉じる",
        settings: "設定画面を開く",
        benchmark: "ベンチマークスコアの実行",
        ai: "AI プレイグラウンドを開く",
        network: "ネットワークツール（Ping/ポート）",
        display: "ディスプレイテストツール",
        hardware: "高度なハードウェアテスト",
        translate: "Google 翻訳ツール",
        exportJson: "JSONデータの書き出し",
        exportPdf: "PDF診断レポートの保存",
        exportImage: "ダッシュボード画像の保存",
        esc: "Esc",
        alt: "Alt",
        shift: "Shift"
      }
    },
    "ru": {
      title: "Горячие клавиши",
      desc: "Используйте глобальные горячие клавиши для значительного повышения эффективности работы.",
      categories: {
        general: "Общие действия",
        navigation: "Навигация и тесты",
        export: "Экспорт данных"
      },
      keys: {
        theme: "Переключение темы (Тёмная / Светлая)",
        refresh: "Пересканировать и обновить данные",
        help: "Открыть / закрыть справку",
        close: "Закрыть текущее окно",
        settings: "Открыть настройки",
        benchmark: "Запустить тест производительности",
        ai: "Войти в AI Лабораторию (Playground)",
        network: "Сетевые утилиты (Ping/Порты)",
        display: "Тесты монитора",
        hardware: "Расширенные тесты оборудования",
        translate: "Google Переводчик",
        exportJson: "Экспорт в JSON",
        exportPdf: "Экспорт отчёта в PDF",
        exportImage: "Экспорт скриншота панели",
        esc: "Esc",
        alt: "Alt",
        shift: "Shift"
      }
    },
    en: {
      title: "Keyboard Shortcuts",
      desc: "Boost your efficiency with global keyboard shortcuts.",
      categories: {
        general: "General & Universal Actions",
        navigation: "Quick Navigation & Diagnostics",
        export: "Data Exporting"
      },
      keys: {
        theme: "Toggle Dark / Light Theme",
        refresh: "Rescan & Refresh System Data",
        help: "Open / Close Shortcuts Help",
        close: "Close Current Modal / Back",
        settings: "Open Settings Panel",
        benchmark: "Run System Benchmarks",
        ai: "Enter AI Playground / Lab",
        network: "Network Diagnostics (Ping/UDP)",
        display: "Display Testing Tools",
        hardware: "Advanced Hardware Tools",
        translate: "Google Translate Panel",
        exportJson: "Export Diagnostic JSON Data",
        exportPdf: "Export High-Fidelity PDF Report",
        exportImage: "Export High-Res Dashboard Image",
        esc: "Esc",
        alt: "Alt",
        shift: "Shift"
      }
    }
  };

  const l = content[lang] || content.en;

  const shortcutData: ShortcutCategory[] = [
    {
      title: l.categories.general,
      items: [
        { keys: ["?"], description: l.keys.help, icon: <HelpCircle size={16} /> },
        { keys: [l.keys.esc], description: l.keys.close, icon: <X size={16} /> },
        { keys: [l.keys.alt, "G"], description: l.keys.theme, icon: <Laptop size={16} /> },
        { keys: [l.keys.alt, "R"], description: l.keys.refresh, icon: <RefreshCw size={16} /> }
      ]
    },
    {
      title: l.categories.navigation,
      items: [
        { keys: [l.keys.alt, "S"], description: l.keys.settings, icon: <Settings size={16} /> },
        { keys: [l.keys.alt, "B"], description: l.keys.benchmark, icon: <Compass size={16} /> },
        { keys: [l.keys.alt, "A"], description: l.keys.ai, icon: <Sparkles size={16} /> },
        { keys: [l.keys.alt, "N"], description: l.keys.network, icon: <Grid size={16} /> },
        { keys: [l.keys.alt, "D"], description: l.keys.display, icon: <Laptop size={16} /> },
        { keys: [l.keys.alt, "M"], description: l.keys.hardware, icon: <Grid size={16} /> },
        { keys: [l.keys.alt, "T"], description: l.keys.translate, icon: <HelpCircle size={16} /> }
      ]
    },
    {
      title: l.categories.export,
      items: [
        { keys: [l.keys.alt, "J"], description: l.keys.exportJson, icon: <FileJson size={16} /> },
        { keys: [l.keys.alt, "P"], description: l.keys.exportPdf, icon: <FileText size={16} /> },
        { keys: [l.keys.alt, "I"], description: l.keys.exportImage, icon: <Image size={16} /> }
      ]
    }
  ];

  return (
    <Modal
      title={l.title}
      onClose={onClose}
      size="2xl"
      icon={<Keyboard className="text-indigo-600 dark:text-indigo-400" size={24} />}
    >
      <div className="space-y-6 py-2">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {l.desc}
        </p>

        <div className="space-y-6">
          {shortcutData.map((category, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {item.description}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0 ml-4">
                      {item.keys.map((key, keyIdx) => (
                        <React.Fragment key={keyIdx}>
                          {keyIdx > 0 && (
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              +
                            </span>
                          )}
                          <kbd className="px-2 py-1 min-w-[24px] text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 shadow-[0_1.5px_0_rgba(0,0,0,0.1)] dark:shadow-[0_1.5px_0_rgba(255,255,255,0.05)] select-none">
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
