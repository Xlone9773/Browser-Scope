
// ... existing imports
import { Translation } from './types';

export const ja: Translation = {
  // ... existing code ...
  meta: {
    title: "BrowserScope",
    subtitle: "現代のブラウザフィンガープリントと機能検出のための包括的ツール",
    footer: "BrowserScope - ブラウザ能力検出ツール",
  },
  // ... existing common ...
  common: {
    loading: "システム機能をスキャン中...",
    loading_steps: [
        "環境を初期化中...",
        "ハードウェアとGPUを検出中...",
        "ネットワーク状態を分析中...",
        "セキュリティとプライバシーを確認中...",
        "AIパフォーマンスを評価中...",
        "レポートを作成中..."
    ],
    refresh: "再検出",
    actions: {
        start: "開始",
        stop: "停止",
        close: "閉じる",
        copy: "コピー",
        copied: "コピー完了",
        download: "ダウンロード",
        view_details: "詳細を表示",
        check: "確認",
        open: "開く",
        reset: "リセット",
        export: "JSONエクスポート"
    }
  },
  // ... existing settings ...
  settings: {
    title: "設定",
    nav: {
        general: "一般",
        network: "ネットワークツール",
        display: "画面テスト",
        storage: "ストレージ管理",
        resources: "リソース監視",
        developer: "開発者",
        modules: "モジュール管理"
    },
    general: {
        simpleMode: {
            title: "シンプルモード",
            desc: "複雑な技術的詳細を隠し、核心情報のみを表示します。"
        },
        scrollbar: {
            title: "スクロールバーを隠す",
            desc: "システムのデフォルトスクロールバーを強制的に非表示にします。"
        },
        timeFormat: {
            title: "時間形式",
            desc: "12時間制と24時間制を切り替えます。"
        },
        performance: {
            title: "高パフォーマンスモード",
            desc: "背景のぼかしと透明効果を無効にしてGPU負荷を軽減します。"
        }
    },
    network: {
        ip: {
            title: "IP 情報",
            ipv4: "IPv4",
            ipv4_desc: "標準インターネットプロトコル",
            ipv6: "IPv6",
            ipv6_desc: "次世代インターネットプロトコル",
            fetch: "IPを取得",
            check_v6: "IPv6を確認",
            success_v6: "IPv6 対応",
            fail_v6: "IPv6 非対応"
        },
        diagnostics: {
            title: "高度なネットワーク診断",
            webrtc: {
                title: "WebRTC リーク検出",
                desc: "STUNサーバーを通じて実際のLANまたはWAN IPの取得を試みます。",
                btn: "検出開始",
                columns: { type: "タイプ", ip: "IPアドレス", proto: "プロトコル", port: "ポート" }
            },
            dns: {
                title: "DNS リーク検出",
                desc: "現在使用しているDNSリゾルバサーバーの検出を試みます。",
                btn: "DNSを検出",
                label_ip: "DNSサーバー IP",
                label_geo: "DNS 地理位置"
            },
            proto: {
                title: "プロトコルサポート",
                desc: "HTTP/2 および HTTP/3 (QUIC) のサポート状況を検出します。",
                btn: "プロトコルを確認",
                h2: "HTTP/2 サポート",
                h3: "HTTP/3 サポート"
            }
        },
        connectivity: {
            title: "接続テスト",
            placeholder: "URLを入力 (例: google.com)",
            btn: "テスト"
        },
        cdn: {
            title: "CDN ステータス",
            check_all: "すべて確認"
        }
    },
    display: {
        deadPixel: {
            title: "ドット抜け検出",
            desc: "全画面で単色背景を表示し、画面上のドット抜けや輝点を探すのを助けます。クリックで終了。",
            colors: { red: "赤", green: "緑", blue: "青", white: "白", black: "黒" }
        },
        hdr: {
            title: "HDR ステータス",
            desc: "現在のディスプレイとブラウザのハイダイナミックレンジ対応を検出します。",
            rangeScreen: "画面ダイナミックレンジ",
            rangeVideo: "動画ダイナミックレンジ",
            brightnessTest: "EDR 輝度テスト",
            brightnessDesc: "HDR/EDRが有効な場合、中央の四角形は白い背景よりも明るく表示されるはずです。",
            labelSdr: "SDR 白",
            labelEdr: "EDR 高輝度白"
        },
        gamut: {
            title: "広色域テスト (P3)",
            desc: "赤い四角形の中にロゴが見える場合、お使いのデバイスはP3広色域をサポートしています。",
            unsupported: "お使いのブラウザはDisplay-P3色域検出をサポートしていません。"
        },
        gradient: {
            title: "色深度と階調",
            desc: "色の遷移が滑らかか（バンディングがないか）、暗部のディテールを確認します。"
        }
    },
    storage: {
        local: {
            title: "ローカルデータ",
            clearDesc: "すべてのサイトデータを消去",
            clearBtn: "消去"
        },
        sw: {
            title: "Service Workers",
            desc: "バックグラウンドで実行中のService Workerスクリプトを管理します。",
            unregisterBtn: "すべて登録解除"
        },
        usageLabel: "ストレージ使用率"
    },
    resources: {
        title: "外部リソース読み込みリスト",
        columns: { name: "リソース名", type: "タイプ", duration: "所要時間" }
    },
    developer: {
        warning: {
            title: "操作は極めて危険です！",
            desc: "ここは開発者向けのデバッグエリアです。何をしているのか理解していない場合は、直ちにウィンドウを閉じてください！\n\nここでコードを貼り付けるよう誘導する人物は詐欺師です。不明なコードを実行すると、プライバシーの漏洩、アカウントの乗っ取り、またはデバイスが悪意を持って制御される可能性があります。",
            agree: "リスクを理解して続行"
        },
        nav: {
            events: "イベント",
            inspector: "オブジェクト検査",
            console: "コンソール"
        },
        actions: {
            float: "フロート表示",
            dock: "下部に戻す"
        },
        events: {
            placeholder: "システムイベントを待機中...",
            copy: "ログをコピー",
            clear: "クリア"
        },
        console: {
            placeholder: "JSコードを入力 (プリセットは '\\' を入力)...",
            clearInput: "入力をクリア",
            resultPlaceholder: "実行結果がここに表示されます...",
            copy: "結果をコピー",
            download: "結果をDL",
            clear: "結果をクリア",
            quickCommands: "クイックコマンド",
            run: "即時実行"
        }
    },
    modules: {
        title: "モジュール管理",
        desc: "ロードされたモーダルコンポーネントを監視および管理します。未使用のモジュールをアンロードすると、メモリとGPUリソースを解放できます。",
        headers: {
            name: "モジュール名",
            status: "ステータス",
            impact: "リソース影響",
            action: "アクション"
        },
        status: {
            active: "実行中",
            inactive: "アイドル",
            cached: "キャッシュ済み",
            system: "システム"
        },
        impact: {
            low: "低",
            med: "中",
            high: "高"
        },
        actions: {
            unload: "強制終了",
            unloadAll: "全モジュールをアンロード"
        }
    }
  },
  // ... existing speedTest ...
  speedTest: {
    title: "ネットワーク速度テスト",
    action: {
        start: "テスト開始",
        stop: "停止"
    },
    metrics: {
        ping: "Ping",
        jitter: "ジッター",
        download: "ダウンロード",
        upload: "アップロード",
        latency: "レイテンシ",
        mbps: "Mbps"
    },
    status: {
        idle: "準備完了",
        ping: "Ping測定中...",
        download: "ダウンロード速度測定中...",
        upload: "アップロード速度測定中...",
        done: "テスト完了",
        error: "接続失敗"
    },
    settings: {
        server: "サーバー",
        test_size: "テストサイズ",
        backend: "測定サーバー",
        custom_url: "カスタムダウンロードURL",
        custom_placeholder: "https://example.com/large-file.zip",
        cors_note: "注：URLはCORSをサポートする必要があります。アップロードテストはスキップされます。"
    },
    preset_names: {
        cloudflare: "Cloudflare (グローバル)",
        cachefly: "CacheFly (グローバル CDN)",
        ustc_cn: "USTC ミラー (中国/合肥)",
        nju_cn: "NJU ミラー (中国/南京)",
        selectel_ru: "Selectel (ロシア/サンクトペテルブルク)",
        tele2_kz: "Tele2 (カザフスタン/アルマトイ)",
        hetzner_de: "Hetzner (ドイツ/ファルケンシュタイン)",
        hetzner_fi: "Hetzner (フィンランド/ヘルシンキ)",
        scaleway_fr: "Scaleway (フランス/パリ)",
        vultr_nj: "Vultr (米国東部/ニュージャージー)",
        vultr_la: "Vultr (米国西部/ロサンゼルス)",
        vultr_sg: "Vultr (シンガポール)",
        vultr_tokyo: "Vultr (日本/東京)",
        vultr_sydney: "Vultr (オーストラリア/シドニー)",
        custom: "カスタムURL"
    }
  },
  // ... existing legacy mappings ...
  title: "BrowserScope",
  subtitle: "現代のブラウザフィンガープリントと機能検出のための包括的ツール",
  loading: "システム機能をスキャン中...",
  loading_steps: [
    "環境を初期化中...",
    "ハードウェアとGPUを検出中...",
    "ネットワーク状態を分析中...",
    "セキュリティとプライバシーを確認中...",
    "AIパフォーマンスを評価中...",
    "レポートを作成中..."
  ],
  footer: "BrowserScope - ブラウザ能力検出ツール",
  refresh: "再検出",
  
  sections: {
    system: "システム環境",
    hardware: "ハードウェア情報",
    display: "ディスプレイと画面",
    network: "ネットワーク接続",
    security: "プライバシーとセキュリティ",
    ai_compute: "AIと計算処理",
    fingerprints: "デバイス指紋",
    location: "位置情報",
    permissions: "権限ステータス",
    media_sup: "メディア機能",
    user_agent: "User Agent",
    pwa: "PWAサポート",
    features: "高度な機能",
    storage: "ストレージ状態"
  },

  labels: {
    os: "オペレーティングシステム",
    platform: "プラットフォーム",
    browser: "ブラウザ",
    language: "主要言語",
    pref_langs: "優先言語",
    cookies: "Cookie",
    dnt: "Do Not Track",
    cpu: "CPUコア数",
    cpu_model: "CPUモデル (推定)",
    memory: "デバイスメモリ",
    gpu_renderer: "GPUレンダラー",
    battery: "バッテリー状態",
    gamepads: "ゲームパッド",
    resolution: "画面解像度",
    refresh_rate: "リフレッシュレート",
    avail_size: "利用可能サイズ",
    pixel_ratio: "ピクセル比 (DPR)",
    color_depth: "色深度",
    screen_extended: "マルチディスプレイ",
    orientation: "画面の向き",
    hdr: "HDRサポート",
    display_mode: "表示モード",
    dark_mode: "ダークモード",
    online: "オンライン状態",
    conn_type: "接続タイプ",
    net_type: "ネットワークタイプ",
    downlink: "下り速度",
    downlink_max: "最大下り速度",
    rtt: "レイテンシ (RTT)",
    save_data: "データ節約モード",
    is_bot: "自動化ボット",
    ad_block: "広告ブロッカー",
    secure_context: "安全なコンテキスト (HTTPS)",
    webrtc_ip: "WebRTC リアルIP",
    gpc_enabled: "グローバルプライバシーコントロール (GPC)",
    pdf_viewer: "内蔵PDFビューア",
    ai_readiness: "AI準備状態",
    window_ai: "Window.AI API",
    webnn: "WebNN API",
    fp_score: "指紋独自性スコア",
    canvas_hash: "Canvas指紋",
    webgl_hash: "WebGL指紋",
    audio_rate: "音声サンプリングレート",
    audio_latency: "音声レイテンシ",
    storage_quota: "ストレージ割り当て",
    storage_usage: "使用済み容量",
    storage_persisted: "永続化ストレージ",
    local_time: "現地時間",
    timezone: "タイムゾーン",
    locale: "ロケール形式",
    calendar: "カレンダー",
    geo_lat: "緯度",
    geo_long: "経度",
    geo_acc: "精度",
    perm_notif: "通知権限",
    perm_midi: "MIDIデバイス",
    perm_geo: "位置情報",
    perm_camera: "カメラ",
    perm_mic: "マイク",
    media_devices: "メディアデバイス",
    video_codecs: "ビデオコーデック対応",
    audio_codecs: "オーディオコーデック対応",
    image_formats: "画像フォーマット対応",
    drm_support: "DRMサポート",
    speech_voices: "音声合成の声",
    audio_channels: "オーディオチャンネル数",
    pwa_install_status: "インストール状態"
  },

  values: {
    supported: "対応",
    not_supported: "非対応",
    detected: "検出",
    none: "なし",
    hidden: "隠蔽/ブロック",
    yes: "はい",
    no: "いいえ",
    connected: "接続済み",
    offline: "オフライン",
    installed: "インストール済",
    not_installed: "未インストール"
  },

  status: {
    granted: "許可",
    denied: "拒否",
    prompt: "確認中",
    error: "エラー",
    idle: "未リクエスト",
    running: "実行中",
    supported: "対応",
    not_supported: "非対応",
    detected: "検出",
    none: "なし",
    hidden: "隠蔽",
    yes: "はい",
    no: "いいえ",
    unknown: "不明"
  },

  actions: {
    run_benchmark: "ベンチマーク実行",
    about: "アプリについて",
    export_json: "JSONエクスポート",
    open_sensors: "センサー詳細",
    open_tools: "ハードウェアテスト",
    open_vision: "ビジョン機能 (Vision)",
    open_speedtest: "スピードテスト",
    view_details: "詳細を表示",
    view_base64: "Base64を表示",
    view_extensions: "拡張機能一覧",
    copy: "コピー",
    copied: "コピー完了",
    check: "確認",
    open_map: "地図を開く",
    stress_test: "ストレステスト",
    open_video_test: "ビデオデコードテスト"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "バックグラウンド同期",
    pushApi: "プッシュ通知",
    notification: "通知 API",
    appBadges: "アプリアイコンバッジ",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn (生体認証)",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "支払いリクエスト",
    nfc: "Web NFC",
    wakeLock: "画面常時点灯",
    fsAccess: "ファイルシステムアクセス",
    broadcast: "タブ間通信",
    webShare: "ネイティブ共有",
    clipboard: "クリップボード API",
    pip: "ピクチャーインピクチャー",
    geo: "位置情報",
    wasm: "WebAssembly",
    webCodecs: "WebCodecs",
    compression: "圧縮ストリーム API",
    webTransport: "WebTransport",
    eyeDropper: "スポイトツール",
    accelerometer: "加速度計",
    gyroscope: "ジャイロスコープ",
    ambientLight: "環境光センサー"
  },

  featureDescs: {
    serviceWorker: "オフラインアクセスとPWAのコア機能",
    bgSync: "ネットワーク復帰後のデータ自動同期",
    pushApi: "サーバーからのプッシュ通知を受信",
    notification: "システムレベルの通知を送信",
    appBadges: "アプリアイコンにマークを表示",
    webgpu: "次世代の高性能グラフィックスAPI",
    webxr: "仮想現実(VR)と拡張現実(AR)のサポート",
    webauthn: "パスワード不要の認証標準",
    bluetooth: "近くのBluetoothデバイスに接続",
    usb: "USBデバイスに接続",
    payment: "ブラウザネイティブの支払いインターフェース",
    nfc: "近距離無線通信の読み書き",
    wakeLock: "画面の自動消灯やロックを防止",
    fsAccess: "ローカルファイルの読み書き",
    broadcast: "異なるタブ間でメッセージを送信",
    webShare: "システムのネイティブ共有メニューを呼び出し",
    clipboard: "クリップボード内容の非同期読み書き",
    pip: "ビデオのフローティング再生",
    geo: "ユーザーの位置情報を取得",
    wasm: "高性能なバイナリコード実行",
    webCodecs: "低レベルの音画コーデック処理",
    compression: "ネイティブデータストリームの圧縮・解凍",
    webTransport: "低遅延の双方向データ転送",
    eyeDropper: "画面上の色を抽出するツール",
    accelerometer: "デバイスの加速度を検出",
    gyroscope: "デバイスの回転方向を検出",
    ambientLight: "周囲の光の強さを検出"
  },

  cameraTool: {
    title: "カメラテスト",
    btn_open: "カメラを開く",
    select_device: "デバイス選択",
    take_photo: "写真を撮る",
    start_record: "録画開始",
    stop_record: "録画停止",
    retake: "再試行",
    download_photo: "写真をダウンロード",
    download_video: "動画をダウンロード",
    current_res: "現在の解像度",
    max_res: "最大解像度",
    mirror: "左右反転",
    no_devices: "ビデオ入力デバイスが見つかりません",
    permission_denied: "カメラの権限が拒否されました",
    error_hardware: "ハードウェアが使用中か読み取れません",
    error_generic: "不明なエラーが発生しました"
  },

  audioTool: {
    title: "マイクテスト",
    btn_open: "マイクを開く",
    listening: "リッスン中...",
    start_record: "録音",
    stop_record: "停止",
    download: "ダウンロード",
    details_size: "ファイルサイズ",
    details_rate: "レート",
    details_type: "フォーマット",
    error_mic: "マイクにアクセスできません",
    close: "閉じる"
  },

  webglTool: {
    title: "WebGL 拡張機能",
    count: "個の拡張",
    search_placeholder: "拡張機能名を検索...",
    spec_link: "仕様書を見る",
    close: "閉じる"
  },

  imageDetails: {
    dimensions: "寸法",
    size: "サイズ"
  },

  base64Tool: {
    title: "Base64 データ",
    desc: "指紋の生データ",
    copy: "すべてコピー",
    close: "閉じる"
  },

  aboutModal: {
    title: "BrowserScopeについて",
    desc: "BrowserScopeはブラウザ上で動作する包括的な検出ツールです。ユーザーのプライバシーデータをサーバーに収集することはなく、すべての計算はローカルで行われます。開発者やユーザーが現在のブラウザの真の能力、指紋特徴、システム環境を理解するのを助けます。",
    version: "現在のバージョン",
    latest_update: "最近の更新",
    history: "更新履歴",
    features: {
        privacy: {
            title: "プライバシーファースト",
            desc: "100%クライアントサイド実行。データ収集ゼロ。指紋情報はデバイス内に留まります。"
        },
        tech: {
            title: "最先端技術",
            desc: "WebGPU、WebNN、WASMを搭載し、ブラウザ能力の限界をテストします。"
        },
        deepScan: {
            title: "ディープスキャン",
            desc: "100以上のハードウェアおよびソフトウェア信号を分析し、高エントロピーな識別子を生成します。"
        },
        stack: {
            title: "イノベーションスタック"
        },
        openSource: {
            title: "オープンソース",
            license: "MIT ライセンス"
        }
    },
    updates: [
        {
            version: "1.5.0",
            date: "2024-04-05",
            changes: ["開発者ツールを追加 (コンソール/インスペクター)", "コーデック検出を強化 (HDR/Dolby/深度)", "IPソース選択機能を追加", "フローティングウィンドウ対応"]
        },
        {
            version: "1.3.0",
            date: "2024-03-20",
            changes: ["高度なハードウェア対話ツール(筆圧/動画デコード)を追加", "モバイルレイアウトを最適化", "ロシア語サポートを追加"]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: ["ネットワーク診断ツール(WebRTC/DNS/プロトコル)を追加", "画面色域とHDRテストを追加", "指紋スコアリングアルゴリズムを改善"]
        },
        {
            version: "1.1.0",
            date: "2024-03-10",
            changes: ["AIパフォーマンス評価プレイグラウンドを追加", "Bluetoothとゲームパッド検出をサポート", "設定パネルを追加"]
        }
    ],
    close: "閉じる"
  },

  sensorModal: {
    sensor_title: "デバイスセンサー",
    sensor_permission_desc: "ジャイロスコープなどのセンサーデータにアクセスするには権限が必要です。",
    sensor_allow: "アクセスを許可",
    accelerometer: "加速度計",
    gyroscope: "ジャイロスコープ",
    magnetometer: "磁力計",
    ambient_light: "環境光",
    close: "閉じる"
  },

  scoreModal: {
    score_details_title: "指紋スコア詳細",
    tracking_potential: "追跡リスク",
    score_explanation: "このスコアは、現在のブラウザ環境が一意に識別される可能性を表します。スコアが高いほど、デバイスの指紋がユニークであり、Webサイトによる追跡が容易になります。",
    contributing_factors: "スコア影響因子",
    close: "閉じる",
    factors: {
        canvas_hash: "Canvas指紋",
        webgl_hash: "WebGL指紋",
        hardware_concurrency: "ハードウェア並列数",
        user_agent: "User Agentの複雑さ",
        resolution: "画面解像度",
        audio_context: "オーディオ指紋",
        battery_status: "バッテリーAPI",
        locale_time: "タイムゾーンと言語"
    },
    values: {
        val_unique: "ユニーク/希少な値",
        val_generic: "一般的/共通の値",
        val_specific: "具体的すぎる",
        val_readable: "読み取り可能",
        val_protected: "保護/隠蔽済み"
    },
    descriptions: {
        desc_canvas_unique: "Canvasレンダリング結果が非常にユニークです。",
        desc_canvas_generic: "Canvasは一般的または保護された結果を返しました。",
        desc_webgl_unique: "GPUレンダリング特徴がユニークです。",
        desc_webgl_generic: "WebGLは保護またはブロックされています。",
        desc_hardware_unique: "CPU/メモリの組み合わせが希少です。",
        desc_hardware_generic: "一般的なハードウェア構成です。",
        desc_ua_unique: "UA文字列に過剰な情報が含まれています。",
        desc_res_unique: "標準的ではない画面解像度です。",
        desc_audio_unique: "オーディオハードウェアの特徴が識別可能です。",
        desc_battery_unique: "バッテリーAPIが具体的な残量を暴露しています。",
        desc_battery_generic: "バッテリーAPIは利用不可または一般的です。",
        desc_locale_unique: "タイムゾーンと言語の組み合わせが識別に利用可能です。"
    }
  },

  fingerprintModal: {
    title: "指紋ジェネレーター",
    desc: "ブラウザ指紋の生成と分析",
    tab_v4: "FingerprintJS v4",
    tab_v2: "FingerprintJS v2",
    tab_fonts: "フォント検出",
    salt_label: "カスタムSalt (ノイズ)",
    font_detect_desc: "システムにインストールされたフォント一覧を検出",
    visitor_id: "訪問者ID (Hash)",
    time_taken: "所要時間",
    generating: "生成中...",
    components_label: "指紋コンポーネント",
    select_all: "全選択",
    deselect_all: "全解除",
    font_list_title: "検出されたフォント",
    copy: "IDをコピー",
    copied: "コピー完了",
    close: "閉じる"
  },

  benchmarkModal: {
    title: "パフォーマンスベンチマーク",
    start_btn: "フルテスト開始",
    running: "テスト実行中...",
    score: "総合スコア",
    cpu_test: "CPU 素数計算",
    math_test: "浮動小数点演算",
    memory_test: "メモリスループット",
    dom_test: "DOM操作性能",
    gpu_test: "Canvas描画性能",
    storage_test: "データベースIOPS"
  },

  aiPlayground: {
    title: "AI プレイグラウンド",
    desc: "ブラウザローカルで軽量AIモデル(DistilBERT)を実行します。データはアップロードされません。",
    model_name: "感情分析モデル",
    loading_model: "モデルウェイトを読み込み中...",
    input_placeholder: "感情分析したい英文を入力してください...",
    result_label: "分析結果",
    confidence: "信頼度"
  },

  computeStress: {
    title: "最先端計算ストレス・テスト",
    warning: "警告：このテストはGPU負荷を最大化します。バッテリー消費、発熱、一時的なシステムフリーズを引き起こす可能性があります。注意して使用してください。",
    start: "ニューラルストレス開始",
    stop: "停止",
    intensity: "テンソルサイズ",
    status_active: "計算中",
    status_idle: "アイドル",
    metric_gflops: "GFLOPS",
    metric_usage: "演算/秒",
    backend_webgpu: "バックエンド: WebGPU (行列乗算)",
    backend_fallback: "バックエンド: WebGL (GPGPUフォールバック)",
    error_webgpu: "このブラウザはWebGPUをサポートしていません。従来の方法にフォールバックします。",
    use_fp16: "FP16 (半精度浮動小数点) を使用",
    fp16_desc: "AI Tensor Cores 演算を加速",
    stability: "安定性",
    peak: "ピーク"
  },

  gamepadTool: {
    title: "ゲームパッドとBluetooth",
    tab_gamepad: "ゲームパッド",
    tab_bluetooth: "Bluetooth機器",
    no_gamepad: "ゲームパッド未検出",
    connect_instruction: "ゲームパッドを接続し、任意のボタンを押してアクティブにしてください",
    btn_scan_bt: "Bluetooth機器をスキャン",
    bt_scanning: "スキャン中...",
    bt_devices: "発見された機器",
    bt_no_devices: "機器なし",
    bt_not_supported: "現在のブラウザはWeb Bluetooth APIをサポートしていません"
  },

  hardwareToolsModal: {
    title: "ハードウェア対話ツール",
    tab_vibrate: "振動",
    tab_touch: "タッチ",
    tab_keyboard: "キーボード",
    tab_mouse: "マウスHz",
    tab_pointer: "筆圧/ペン",
    tab_video: "デコード",
    vibrate_not_supported: "このデバイスは振動APIをサポートしていません",
    vibrate_short: "短 (200ms)",
    vibrate_medium: "中 (500ms)",
    vibrate_pattern: "パルス",
    touch_instruction: "画面上をタッチまたは移動してください",
    touch_count: "タッチ点数",
    key_instruction: "任意のキーを押してテスト...",
    key_last: "現在のキー",
    key_history: "検出されたキー",
    key_input_placeholder: "ここに入力してキーボードをテスト...",
    mouse_instruction: "このエリア内でマウスカーソルを素早く動かし、イベントレポート率(Polling Rate)を測定します。",
    mouse_rate: "現在のレート",
    mouse_peak: "ピークレート",
    pointer_instruction: "ここに描画してください。筆圧、傾き、ペン入力に対応しています。",
    pointer_pressure: "筆圧感度",
    pointer_tilt: "傾き (X/Y)",
    pointer_type: "入力タイプ",
    video_instruction: "ハードウェアビデオデコード能力マトリックスを検出中...",
    video_codec: "コーデック",
    video_res: "解像度",
    video_efficient: "高効率 (ハードウェア)",
    video_smooth: "スムーズ再生",
    filter_supported: "対応済みのみ表示",
    // New Keys
    video_title: "動画・音声デコードマトリックス",
    status_api_error: "API エラー",
    status_api_na: "API 利用不可",
    status_hw: "HW",
    status_sw: "SW",
    status_software: "ソフトウェア",
    tooltip_hw: "ハードウェア加速 (高効率)",
    tooltip_sw: "ソフトウェアデコード (高負荷)",
    tooltip_drop: "フレームドロップの可能性",
    status_done: "完了"
  },

  visionModal: {
    title: "ビジョン機能 (Vision)",
    unsupported_desc: "お使いのブラウザはネイティブのBarcodeDetector APIをサポートしていません。Polyfillモード（ソフトウェアデコード）を使用してビジョン機能をテストできます。",
    api_status: "APIサポート状況",
    detect_mode: "検出モード",
    camera_source: "カメラソース",
    latency: "レイテンシ",
    hw_accel: "ハードウェア加速",
    sw_decode: "ソフトウェアデコード",
    sw_warning: "ソフトウェアデコードはCPU負荷が高く、低速になる可能性があります。",
    native_api: "ネイティブAPI (ハードウェア)",
    polyfill: "Polyfill (ソフトウェア)",
    detecting: "検出中...",
    formats: "サポート形式",
    perf: "パフォーマンス",
    fps: "FPS",
    last_result: "最新の検出結果",
    start_cam: "カメラを起動",
    stop_cam: "カメラを停止",
    switch_cam: "カメラ切り替え",
    no_cam_error: "カメラが見つからないか、権限が拒否されました",
    auto_scan: "自動スキャン",
    manual_capture: "手動キャプチャ"
  }
};
