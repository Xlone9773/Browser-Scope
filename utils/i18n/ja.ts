import { Translation } from './types';

export const ja: Translation = {
  loading: "システム機能をスキャン中...",
  title: "BrowserScope",
  subtitle: "ブラウザ環境、ハードウェア機能、およびサポートされているWeb APIの詳細な分析。",
  refresh: "再スキャン",
  footer: "データはブラウザ内でローカルに検出され、個人データは保存されません。",
  
  sections: {
    system: "システムとソフトウェア",
    hardware: "ハードウェアとグラフィックス",
    display: "ディスプレイと画面",
    network: "ネットワークと接続",
    storage_loc: "ストレージと地域設定",
    media_sup: "メディア機能",
    user_agent: "ユーザーエージェント",
    fingerprints: "デジタル指紋と追跡",
    features: "Web API 機能",
    pwa: "PWAとオフライン",
    permissions: "権限管理"
  },
  
  labels: {
    os: "オペレーティングシステム",
    platform: "プラットフォーム",
    browser: "ブラウザ",
    language: "言語",
    cookies: "Cookie 有効",
    dnt: "Do Not Track",
    
    cpu: "CPU コア数",
    memory: "デバイスメモリ (推定)",
    gpu_vendor: "GPU ベンダー",
    gpu_renderer: "GPU レンダラー",
    max_texture: "最大テクスチャサイズ",
    audio_rate: "音声サンプリングレート",
    battery: "バッテリーレベル",
    charging: "充電状態",
    touch: "最大タッチポイント",
    canvas_hash: "Canvas ハッシュ",
    webgl_hash: "WebGL ハッシュ",
    audio_latency: "音声レイテンシ",
    
    resolution: "画面解像度",
    avail_size: "利用可能サイズ",
    window_size: "ウィンドウサイズ",
    pixel_ratio: "ピクセル比 (DPR)",
    color_depth: "色深度",
    orientation: "画面の向き",
    dark_mode: "ダークモード",
    color_gamut: "色域",
    hdr: "HDR サポート",
    display_mode: "表示モード",
    
    online: "オンライン状態",
    conn_type: "接続タイプ",
    downlink: "ダウンリンク速度",
    rtt: "レイテンシ (RTT)",
    save_data: "データセーバー",
    
    timezone: "タイムゾーン",
    locale: "ロケール",
    calendar: "カレンダー",
    storage_quota: "ストレージ割り当て (推定)",
    storage_usage: "使用済みストレージ",
    
    video_codecs: "ビデオコーデック",
    audio_codecs: "オーディオコーデック",

    media_devices: "メディアデバイス",
    perm_camera: "カメラ",
    perm_mic: "マイク",
    perm_geo: "位置情報",
    perm_notif: "通知",
    perm_midi: "MIDI デバイス",

    geo_lat: "緯度",
    geo_long: "経度",
    geo_acc: "精度 (m)"
  },
  
  values: {
    connected: "接続済み",
    offline: "オフライン",
    supported: "サポート",
    not_supported: "非対応",
    yes: "はい",
    no: "いいえ",
    unknown: "不明"
  },

  actions: {
    check: "確認する",
    export_json: "JSONをエクスポート",
    view_extensions: "拡張機能を表示",
    view_base64: "Base64",
    copy: "コピー",
    copied: "コピーしました",
    zoom: "拡大",
    theme_dark: "ダーク",
    theme_light: "ライト",
    about: "アプリについて"
  },

  status: {
    idle: "未確認",
    granted: "許可済み",
    denied: "拒否済み",
    prompt: "確認が必要",
    error: "エラー"
  },

  cameraTool: {
    title: "カメラツール",
    btn_open: "カメラを開く",
    select_device: "デバイスを選択",
    no_devices: "ビデオデバイスが見つかりません",
    take_photo: "写真を撮る",
    start_record: "録画開始",
    stop_record: "録画停止",
    mirror: "左右反転",
    retake: "再撮影",
    download_photo: "写真をダウンロード",
    download_video: "動画をダウンロード",
    close: "閉じる",
    current_res: "現在の解像度",
    max_res: "ハードウェア最大解像度 (WebRTC)",
    permission_denied: "カメラの権限が拒否されました",
    error_hardware: "カメラが使用中かハードウェアエラーです",
    error_generic: "カメラにアクセスできません"
  },

  audioTool: {
    title: "オーディオレコーダー",
    btn_open: "レコーダーを開く",
    start_record: "録音開始",
    stop_record: "録音停止",
    download: "音声をダウンロード",
    close: "閉じる",
    listening: "聞き取り中...",
    error_mic: "マイクへのアクセスが拒否されたかエラーが発生しました",
    details_size: "ファイルサイズ",
    details_rate: "サンプルレート",
    details_type: "フォーマット"
  },

  webglTool: {
    title: "WebGL 拡張機能",
    count: "個の拡張機能",
    search_placeholder: "検索...",
    close: "閉じる"
  },

  base64Tool: {
    title: "Canvas Base64 データ",
    desc: "Canvas フィンガープリントの生データ表現。",
    copy: "Base64をコピー",
    close: "閉じる"
  },

  aboutModal: {
    title: "BrowserScopeについて",
    version: "バージョン",
    desc: "ブラウザ機能、ハードウェア情報、およびネットワークステータスをローカルでチェックする、軽量でプライバシーに配慮したツールです。",
    changelog: "更新履歴",
    latest_update: "PWA機能検出、Canvas Base64ツール、UI改善を追加。",
    close: "閉じる"
  },

  imageDetails: {
    dimensions: "画像サイズ",
    size: "ファイルサイズ"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "バックグラウンド同期",
    pushApi: "Push API",
    notification: "通知 API",
    appBadges: "アプリアイコンバッジ",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "Payment Request",
    nfc: "Web NFC",
    wakeLock: "画面ウェイクロック",
    fsAccess: "ファイルシステムアクセス",
    broadcast: "Broadcast Channel",
    webShare: "Web Share API",
    clipboard: "クリップボード API",
    pip: "ピクチャーインピクチャー",
    geo: "位置情報 (Geolocation)",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs",
    compression: "Compression Streams",
    webTransport: "Web Transport",
    eyeDropper: "スポイトツール (EyeDropper)",
  },
  
  featureDescs: {
    serviceWorker: "オフライン機能と PWA サポート",
    bgSync: "接続回復時にアクションを同期",
    pushApi: "サーバーからのプッシュ通知を受信",
    notification: "システムレベルの通知",
    appBadges: "アプリアイコンにバッジを設定",
    webgpu: "次世代グラフィックス API",
    webxr: "VR および AR 機能",
    webauthn: "パスワードレス認証",
    bluetooth: "Bluetooth デバイスへの接続",
    usb: "USB デバイスへの接続",
    payment: "ネイティブ支払い処理",
    nfc: "近距離無線通信",
    wakeLock: "画面の自動消灯を防止",
    fsAccess: "ローカルファイルの読み書き",
    broadcast: "タブ間通信",
    webShare: "ネイティブ共有ダイアログ",
    clipboard: "非同期クリップボードアクセス",
    pip: "フローティングビデオプレーヤー",
    geo: "ユーザーの位置情報アクセス",
    wasm: "高性能バイナリコード",
    webCodecs: "低レベルメディア処理",
    compression: "ネイティブ GZIP/Deflate 圧縮",
    webTransport: "低遅延双方向ストリーミング",
    eyeDropper: "システムカラーピッカー",
  }
};