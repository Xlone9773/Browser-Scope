
import { Translation } from './types';
import { zhTW } from './zh-TW';

export const zhHK: Translation = {
  ...zhTW, // Fallback to TW
  
  sections: {
    ...zhTW.sections,
    hardware: "硬件與圖形",
    fingerprints: "指紋與追蹤",
  },
  
  labels: {
    ...zhTW.labels,
    resolution: "螢幕解像度",
    audio_rate: "音訊採樣率",
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
