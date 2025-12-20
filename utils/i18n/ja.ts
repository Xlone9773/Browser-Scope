
import { Translation } from './types';
import { en } from './en';

export const ja: Translation = {
  ...en, // Fallback to EN for any missing keys
  loading: "システム機能をスキャン中...",
  loading_steps: [
    "環境を初期化中...",
    "ハードウェアとGPUを検出中...",
    "ネットワーク状態を分析中...",
    "セキュリティとプライバシーを確認中...",
    "AI準備状況をベンチマーク中...",
    "レポートを作成中..."
  ],

  settingsModal: {
    title: "設定とツール",
    tab_general: "一般",
    tab_network: "ネットワーク",
    tab_display: "ディスプレイ",
    tab_storage: "ストレージ",
    tab_resources: "リソース",
    tab_developer: "開発者",
    simple_mode_title: "シンプルモード",
    simple_mode_desc: "不要な技術詳細を非表示にし、コアシステム情報のみを表示します。",
    scrollbar_title: "スクロールバーを隠す",
    scrollbar_desc: "画面領域を最大化するためにブラウザのスクロールバーを非表示にします。",
    time_format_title: "24時間表示",
    time_format_desc: "12時間形式（AM/PM）と24時間形式を切り替えます。",
    
    public_ip: "パブリックIPアドレス",
    fetch_ip: "IPを検出",
    ipv6_title: "IPv6 接続",
    check_ipv6: "IPv6を検出",
    ipv6_success: "IPv6 対応",
    ipv6_fail: "未検出 / IPv4のみ",
    ip_info: "IP情報",
    provider: "ISP / プロバイダー",
    location: "ロケーション",
    cdn_status: "CDN ステータス",
    latency: "レイテンシ",
    check_all: "すべて確認",
    url_placeholder: "URLを入力 (例: https://google.com)",
    test_conn: "接続テスト",
    test_result: "結果",

    display_test: "画面欠陥テスト",
    dead_pixel_title: "ドット抜けチェック",
    dead_pixel_desc: "色をクリックして全画面モードに入ります。色が変化しないピクセルがないか確認してください。",
    color_red: "赤",
    color_green: "緑",
    color_blue: "青",
    color_white: "白",
    color_black: "黒",
    gamut_test_title: "広色域ビジュアライザー (P3)",
    gamut_test_desc: "ディスプレイが広色域 (P3) をサポートしている場合、色付きの正方形の中に形状やテキストがうっすらと見えます。",
    hdr_test_title: "色深度とバンディング",
    hdr_test_desc: "滑らかなグラデーションを確認してください。バンディング（縞模様）が見える場合、8ビットの色深度または圧縮を示しています。",
    unsupported_p3: "ブラウザは color(display-p3) 構文をサポートしていません",

    storage_title: "ローカルデータ",
    clear_data: "サイトデータを消去",
    clear_btn: "ストレージを消去",
    sw_title: "Service Workers",
    sw_desc: "アクティブなService Workersを登録解除してPWAの状態をリセットします。",
    sw_btn: "登録解除",

    resource_list: "外部リソース",
    res_name: "リソース URL",
    res_type: "タイプ",
    res_duration: "所要時間",

    dev_events: "イベントモニター",
    dev_inspector: "オブジェクトインスペクター",
    dev_console: "JS コンソール",
    dev_console_placeholder: "JavaScriptコードを入力... ('\\' でプリセット)",
    dev_run: "実行",
    dev_clear: "ログを消去",
    dev_copy_log: "ログをコピー",
    dev_float: "フローティングウィンドウ",
    dev_warning_title: "開発者モードの警告",
    dev_warning_desc: "このツールを使用すると、任意のJavaScriptコードを実行し、ブラウザの内部オブジェクトを検査できます。悪意のあるコードの実行は、セキュリティを危険にさらす可能性があります。リスクを理解している場合のみ続行してください。",
    dev_warning_agree: "リスクを理解して続行",

    // New Developer Keys
    dev_quick_commands: "クイックコマンド",
    dev_result_placeholder: "結果はここに表示されます...",
    dev_events_placeholder: "ウィンドウイベントをリッスン中...",
    dev_input_clear: "入力をクリア",
    dev_output_copy: "結果をコピー",
    dev_output_download: "結果をダウンロード",
    dev_output_clear: "結果を消去",
    dev_dock_back: "ドッキングに戻す",
    dev_run_now: "即時実行",

    // Advanced Network
    network_adv_title: "高度な診断",
    network_webrtc_title: "WebRTC リークテスト",
    network_webrtc_desc: "ICE候補を分析して、ローカルIPリークとSTUN/TURN接続を確認します。",
    network_webrtc_btn: "WebRTC分析を開始",
    network_dns_title: "DNS リークテスト",
    network_dns_desc: "接続に使用されているDNSリゾルバーを特定して、潜在的なリークを確認します。",
    network_dns_btn: "DNSリゾルバーを確認",
    
    col_type: "タイプ",
    col_ip: "IPアドレス",
    col_protocol: "プロトコル",
    col_port: "ポート",
    
    lbl_resolution: "解決結果",
    lbl_dns_ip: "リゾルバーIP",
    lbl_dns_geo: "場所",
    
    proto_title: "プロトコルサポート",
    proto_desc: "最新のトランスポートプロトコル（HTTP/2、HTTP/3 QUIC）のサポートを確認します。",
    proto_check_btn: "プロトコルを確認",
    proto_http2: "HTTP/2",
    proto_http3: "HTTP/3 (QUIC)",

    // HDR
    hdr_status_title: "HDR 機能",
    hdr_support: "HDR サポート",
    hdr_dynamic_range: "ダイナミックレンジ",
    hdr_video_dynamic_range: "ビデオダイナミックレンジ",
    hdr_brightness_test: "ピーク輝度 (EDR) テスト",
    hdr_brightness_desc: "ディスプレイが拡張ダイナミックレンジ（HDR）をサポートしている場合、中央の正方形は周囲の「標準的な白」よりも明るく表示されます。",
    hdr_sdr_white: "SDR ホワイト (標準)",
    hdr_edr_white: "HDR ホワイト (高輝度)",

    close: "閉じる"
  },

  // ... (rest of file)
  
  labels: {
    ...en.labels,
    os: "オペレーティングシステム",
    platform: "プラットフォーム",
    browser: "ブラウザ",
    language: "言語",
    pref_langs: "優先言語",
    cookies: "Cookie 有効",
    dnt: "Do Not Track",
    
    cpu: "CPU コア数",
    cpu_model: "CPUモデル (推定)",
    memory: "デバイスメモリ",
    gpu_vendor: "GPU ベンダー",
    gpu_renderer: "GPU レンダラー",
    max_texture: "最大テクスチャサイズ",
    audio_rate: "オーディオサンプルレート",
    audio_latency: "オーディオレイテンシ",
    battery: "バッテリーレベル",
    charging: "充電状態",
    charging_time: "充電時間", 
    discharging_time: "放電時間", 
    touch: "最大タッチポイント",
    
    resolution: "画面解像度",
    refresh_rate: "リフレッシュレート",
    avail_size: "利用可能サイズ",
    window_size: "ウィンドウサイズ",
    pixel_ratio: "ピクセル比",
    color_depth: "色深度",
    orientation: "画面の向き",
    orientation_angle: "角度", 
    screen_extended: "拡張ディスプレイ",
    dark_mode: "ダークモード",
    color_gamut: "色域",
    hdr: "HDR サポート",
    display_mode: "表示モード",
    
    online: "オンライン状態",
    conn_type: "接続タイプ",
    net_type: "ネットワーク技術", 
    downlink: "ダウンリンク速度",
    downlink_max: "最大ダウンリンク", 
    rtt: "レイテンシ (RTT)",
    save_data: "データセーバー",
    
    timezone: "タイムゾーン",
    locale: "ロケール",
    calendar: "カレンダー",
    storage_quota: "ストレージクォータ",
    storage_usage: "使用済みストレージ",
    storage_persisted: "永続ストレージ",
    
    video_codecs: "ビデオコーデック",
    audio_codecs: "オーディオコーデック",
    image_formats: "画像フォーマット", 
    audio_channels: "チャンネル数", 

    camera_permission: "カメラアクセス",

    fp_score: "指紋スコア",
    canvas_hash: "Canvas ハッシュ",
    webgl_hash: "WebGL ハッシュ",

    perm_notif: "通知",
    perm_midi: "MIDI アクセス",
    perm_geo: "位置情報",
    geo_lat: "緯度",
    geo_long: "経度",
    geo_acc: "精度",
    media_devices: "メディアデバイス",
    perm_camera: "カメラ",
    perm_mic: "マイク",

    pwa_install_status: "インストール状態"
  },
  
  values: {
    connected: "接続済み",
    offline: "オフライン",
    supported: "サポート",
    not_supported: "非サポート",
    yes: "はい",
    no: "いいえ",
    unknown: "不明",
    installed: "インストール済み",
    not_installed: "未インストール",
    detected: "検出",
    none: "なし",
    hidden: "非表示"
  },

  actions: {
    check: "確認する",
    theme_light: "ライトモードへ切り替え",
    theme_dark: "ダークモードへ切り替え",
    about: "アプリについて",
    export_json: "JSONをエクスポート",
    open_sensors: "センサー",
    open_tools: "ハードウェアツール",
    run_benchmark: "ベンチマーク",
    view_details: "詳細を表示",
    view_base64: "Base64を表示",
    view_extensions: "拡張機能を表示",
    copy: "コピー",
    copied: "コピーしました!",
    open_map: "地図を開く"
  },

  status: {
    idle: "未確認",
    granted: "許可",
    denied: "拒否",
    prompt: "確認が必要",
    error: "エラー / 利用不可"
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
    wakeLock: "画面常時点灯 (Wake Lock)",
    fsAccess: "ファイルシステムアクセス",
    broadcast: "ブロードキャストチャンネル",
    webShare: "Web Share API",
    clipboard: "クリップボード API",
    pip: "ピクチャーインピクチャー",
    geo: "位置情報 (Geolocation)",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs",
    compression: "Compression Streams",
    webTransport: "Web Transport",
    eyeDropper: "スポイトツール (EyeDropper)",
    accelerometer: "加速度センサー",
    gyroscope: "ジャイロスコープ",
    ambientLight: "環境光センサー"
  },
  
  featureDescs: {
    serviceWorker: "オフライン機能とPWAサポート",
    bgSync: "接続が回復するまでアクションを延期",
    pushApi: "サーバーからのプッシュ通知を受信",
    notification: "システムレベルの通知",
    appBadges: "アプリアイコンにバッジを設定",
    webgpu: "次世代グラフィックスAPI",
    webxr: "VRおよびAR機能",
    webauthn: "パスワードレス認証",
    bluetooth: "Bluetoothデバイスへの接続",
    usb: "USBデバイスへの接続",
    payment: "ネイティブ決済処理",
    nfc: "近距離無線通信",
    wakeLock: "画面が暗くなるのを防ぐ",
    fsAccess: "ローカルファイルの読み書き",
    broadcast: "タブ間通信",
    webShare: "ネイティブ共有ダイアログ",
    clipboard: "非同期クリップボードアクセス",
    pip: "フローティングビデオプレーヤー",
    geo: "ユーザーの位置情報アクセス",
    wasm: "高性能バイナリコード",
    webCodecs: "低レベルメディア処理",
    compression: "ネイティブ GZIP/Deflate",
    webTransport: "低遅延双方向ストリーミング",
    eyeDropper: "システムカラーピッカー",
    accelerometer: "モーションセンサー",
    gyroscope: "オリエンテーションセンサー",
    ambientLight: "照度センサー"
  },

  cameraTool: {
    title: "カメラツール",
    btn_open: "カメラを開く",
    no_devices: "カメラデバイスが見つかりません",
    permission_denied: "カメラの権限が拒否されました",
    error_hardware: "カメラへのアクセス中にハードウェアエラーが発生しました",
    error_generic: "カメラへのアクセスエラー",
    error_mic: "マイクエラー",
    select_device: "デバイスを選択",
    current_res: "現在の解像度",
    max_res: "最大解像度",
    mirror: "ミラー",
    take_photo: "写真を撮る",
    start_record: "録画開始",
    stop_record: "録画停止",
    retake: "撮り直す",
    download_photo: "写真を保存",
    download_video: "動画を保存"
  },

  audioTool: {
    title: "オーディオレコーダー",
    btn_open: "レコーダーを開く",
    listening: "待機中...",
    start_record: "開始",
    stop_record: "停止",
    download: "保存",
    details_size: "サイズ",
    details_rate: "サンプルレート",
    details_type: "形式",
    close: "閉じる",
    error_mic: "マイクへのアクセスエラー"
  },

  webglTool: {
    title: "WebGL 拡張機能",
    count: "個の拡張機能をサポート",
    search_placeholder: "拡張機能を検索...",
    close: "閉じる",
    vendor: "ベンダー",
    spec_link: "仕様書"
  },

  base64Tool: {
    title: "Base64 データ",
    desc: "生成された指紋画像の生データ表現",
    copy: "クリップボードにコピー",
    close: "閉じる"
  },

  fingerprintModal: {
    title: "ブラウザフィンガープリント計算",
    desc: "様々なブラウザ属性を使用して一意の訪問者IDを生成します。以下のパラメータを調整して、ハッシュへの影響を確認できます。",
    tab_v4: "FingerprintJS v4 (最新)",
    tab_v2: "FingerprintJS v2 (レガシー)",
    tab_fonts: "フォント検出",
    btn_run: "フィンガープリントを計算",
    generating: "生成中...",
    visitor_id: "訪問者 ID",
    time_taken: "所要時間",
    params_title: "計算パラメータ",
    salt_label: "カスタムソルト (シード)",
    components_label: "含まれるコンポーネント",
    select_all: "すべて選択",
    deselect_all: "すべて解除",
    close: "閉じる",
    copy: "IDをコピー",
    copied: "コピーしました!",
    font_detect_desc: "特定のテキストのレンダリング幅を測定して、システムにインストールされているフォントを検出します。これは一般的なフィンガープリント手法です。",
    font_list_title: "検出されたフォント"
  },

  imageDetails: {
    dimensions: "寸法",
    size: "サイズ"
  },

  aboutModal: {
    title: "BrowserScope について",
    desc: "BrowserScopeは、システムの機能と指紋の一意性を検証するために設計された包括的なブラウザ分析ツールです。",
    version: "バージョン",
    changelog: "変更履歴",
    latest_update: "ハードウェアツールとストレージベンチマークを追加",
    close: "閉じる",
    history: "更新履歴",
    updates: [
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: [
                "ハードウェア対話ツール（振動およびマルチタッチテスト）を追加。",
                "ストレージ I/O ベンチマーク (IndexedDB) を追加。",
                "フォントフィンガープリント検出機能を追加。",
                "WebGL拡張機能ビューアを改善（ベンダー別グループ化と検索）。",
                "UIアニメーションとモーダルの対話を修正。"
            ]
        },
        {
            version: "1.1.0",
            date: "2024-02-28",
            changes: [
                "AIおよびコンピューティング機能検出 (WebNN, Gemini Nano) を導入。",
                "カメラおよびマイク診断ツールを追加。",
                "デバイスセンサーの視覚化を強化 (加速度計, ジャイロスコープ)。"
            ]
        },
        {
            version: "1.0.0",
            date: "2024-01-10",
            changes: [
                "コアシステム検出機能を備えた初期リリース。",
                "フィンガープリント分析 (Canvas, WebGL)。",
                "ネットワーク速度と遅延の推定。"
            ]
        }
    ]
  },

  sensorModal: {
    sensor_title: "デバイスセンサー",
    sensor_permission_desc: "モーションセンサーにアクセスするには権限が必要です。",
    sensor_allow: "アクセスを許可",
    accelerometer: "加速度センサー",
    gyroscope: "ジャイロスコープ",
    magnetometer: "磁力計",
    close: "閉じる"
  },
  
  scoreModal: {
    score_details_title: "指紋スコアの詳細",
    tracking_potential: "追跡の可能性",
    score_explanation: "スコアが高いほど、Webサイトで利用可能な一意の識別データが多くなり、追跡される可能性が高くなります。",
    contributing_factors: "寄与要因",
    close: "閉じる",

    factors: {
      canvas_hash: "Canvas フィンガープリント",
      webgl_hash: "WebGL フィンガープリント",
      hardware_concurrency: "ハードウェア (CPU/RAM)",
      user_agent: "ユーザーエージェント",
      resolution: "画面解像度",
      audio_context: "オーディオコンテキスト",
      battery_status: "バッテリーステータス",
      locale_time: "ロケールと時間"
    },
    values: {
      val_unique: "一意 / 特定",
      val_generic: "一般的",
      val_specific: "詳細",
      val_readable: "読み取り可能",
      val_protected: "保護済み",
      val_unknown: "不明"
    },
    descriptions: {
      desc_canvas_unique: "Canvas描画の差異により、GPUやドライバの情報が明らかになります。",
      desc_canvas_generic: "Canvasフィンガープリントは失敗したかブロックされました。",
      desc_webgl_unique: "WebGLレポートにより、特定のグラフィックスハードウェアが公開されます。",
      desc_webgl_generic: "WebGLフィンガープリントは失敗したかブロックされました。",
      desc_hardware_unique: "CPUコア数とデバイスメモリは重要な識別要因です。",
      desc_hardware_generic: "ハードウェアの詳細は部分的に隠されています。",
      desc_ua_unique: "詳細なユーザーエージェント文字列により、ブラウザとOSのバージョンがわかります。",
      desc_res_unique: "画面サイズとウィンドウサイズの組み合わせにより、一意のフットプリントが作成されます。",
      desc_audio_unique: "オーディオハードウェアのサンプルレートとレイテンシ。",
      desc_battery_unique: "バッテリーAPIにより、ブラウジングセッションを超えてユーザーを追跡できます。",
      desc_battery_generic: "バッテリーステータスは非表示または非対応です。",
      desc_locale_unique: "タイムゾーンと言語設定により、場所を絞り込むことができます。"
    }
  }
};