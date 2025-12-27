
export const modules = {
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

  base64Tool: {
    title: "Base64 データ",
    desc: "指紋の生データ",
    copy: "すべてコピー",
    close: "閉じる"
  },

  imageDetails: {
    dimensions: "寸法",
    size: "サイズ"
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
  },

  midiModal: {
    title: "Web MIDI スタジオ",
    no_inputs: "MIDI入力デバイスが見つかりません。デバイスを接続してください。",
    inputs: "入力デバイス",
    outputs: "出力デバイス",
    log: "シグナルログ",
    clear: "クリア",
    octave: "オクターブ",
    waveform: "波形",
    sine: "正弦波",
    square: "矩形波",
    sawtooth: "のこぎり波",
    triangle: "三角波",
    velocity: "ベロシティ",
    note: "ノート"
  }
};
