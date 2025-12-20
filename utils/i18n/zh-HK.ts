
import { Translation } from './types';
import { zhTW } from './zh-TW';

export const zhHK: Translation = {
  ...zhTW, // Fallback to TW
  loading: "正在掃描系統能力...",
  loading_steps: [
    "正在初始化環境...",
    "檢測硬件與 GPU...",
    "分析網絡狀態...",
    "檢查安全與私隱...",
    "評估 AI 效能...",
    "即將完成報告..."
  ],
  
  sections: {
    ...zhTW.sections,
    hardware: "硬件與圖形",
    fingerprints: "指紋與追蹤",
  },
  
  settingsModal: {
    ...zhTW.settingsModal,
    tab_developer: "開發者",
    dev_events: "事件監聽器",
    dev_inspector: "對象透視 (Inspector)",
    dev_console: "JS 控制台",
    dev_console_placeholder: "輸入 JavaScript 代碼...",
    dev_run: "執行",
    dev_clear: "清空日誌",
    dev_copy_log: "複製日誌",
    dev_float: "懸浮視窗",
    dev_warning_title: "開發者模式風險提示",
    dev_warning_desc: "此工具允許執行任意 JavaScript 代碼並檢查瀏覽器內部對象。執行惡意代碼可能會危及您的安全。請確保您了解相關風險後再繼續。",
    dev_warning_agree: "我了解風險並繼續",
  },

  labels: {
    ...zhTW.labels,
    resolution: "螢幕解像度",
    audio_rate: "音訊採樣率",
    charging_time: "充電時間",
    discharging_time: "放電時間",
    net_type: "網絡制式",
    downlink_max: "最大下載",
    image_formats: "圖片格式支援",
    audio_channels: "聲道數",
    pwa_install_status: "安裝狀態"
  },
  
  values: {
    ...zhTW.values,
    installed: "已安裝",
    not_installed: "未安裝"
  },
  
  fingerprintModal: {
    ...zhTW.fingerprintModal,
    title: "瀏覽器指紋計算",
    desc: "使用各種瀏覽器屬性生成唯一的訪客識別碼。您可以調整以下參數來觀察雜湊值的變化。",
    tab_v4: "FingerprintJS v4 (現代)",
    tab_v2: "FingerprintJS v2 (傳統)",
    tab_fonts: "字型檢測",
    btn_run: "計算指紋",
    generating: "生成中...",
    visitor_id: "訪客 ID",
    time_taken: "耗時",
    params_title: "計算參數配置",
    salt_label: "自訂 Salt (種子)",
    components_label: "包含的組件",
    select_all: "全選",
    deselect_all: "全不選",
    close: "關閉",
    copy: "複製 ID",
    copied: "已複製!",
    font_detect_desc: "通過測量特定文本的渲染寬度來檢測系統中安裝的字型。這是一種常見的指紋追蹤技術。",
    font_list_title: "已檢測到的字型"
  },
  
  scoreModal: {
    score_details_title: "指紋評分詳情",
    tracking_potential: "追蹤風險",
    score_explanation: "分數越高表示暴露給網站的唯一識別數據越多，被追蹤的風險越大。",
    contributing_factors: "影響因素",
    close: "關閉",

    factors: {
      canvas_hash: "Canvas 指紋",
      webgl_hash: "WebGL 指紋",
      hardware_concurrency: "硬件併發 (CPU/記憶體)",
      user_agent: "用戶代理 (User Agent)",
      resolution: "螢幕解像度",
      audio_context: "音訊上下文",
      battery_status: "電池狀態 API",
      locale_time: "區域與時間"
    },
    values: {
      val_unique: "唯一 / 高辨識度",
      val_generic: "通用 / 混淆",
      val_specific: "特定",
      val_readable: "可讀取",
      val_protected: "受保護",
      val_unknown: "未知"
    },
    descriptions: {
      desc_canvas_unique: "Canvas 渲染差異暴露了您的 GPU 和驅動程式特徵。",
      desc_canvas_generic: "Canvas 指紋提取失敗或已被封鎖。",
      desc_webgl_unique: "WebGL 報告暴露了具體的顯卡硬件型號。",
      desc_webgl_generic: "WebGL 指紋提取失敗或已被封鎖。",
      desc_hardware_unique: "CPU 核心數和裝置記憶體大小是重要的識別特徵。",
      desc_hardware_generic: "硬件詳細資訊被部分隱藏。",
      desc_ua_unique: "詳細的 User Agent 字串暴露了瀏覽器和作業系統版本。",
      desc_res_unique: "螢幕尺寸結合視窗大小會產生獨特的指紋。",
      desc_audio_unique: "音訊硬件的採樣率和延遲參數。",
      desc_battery_unique: "電池 API 允許網站跨瀏覽會話追蹤用戶。",
      desc_battery_generic: "電池狀態已被隱藏或不支援。",
      desc_locale_unique: "時區和語言設定可縮小用戶的位置範圍。"
    }
  }
};