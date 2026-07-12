
export const modals = {
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
            license: "MIT ライセンス",
            viewLicense: "ライセンス表示",
            hideLicense: "ライセンス非表示",
            downloadLicense: "ライセンスをダウンロード",
            licenseTitle: "ソフトウェアライセンス (MIT)",
            licenseText: `MIT ライセンス

Copyright (c) 2026 BrowserScope Contributors

以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を取得したすべての人に対し、ソフトウェアを無制限に扱う権利を無償で許諾します。これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に同じ行為を許可する権利が含まれますが、これらに限定されません。

上記の著作権表示および本許諾表示は、ソフトウェアのすべての複製または主要な部分に記載するものとします。

本ソフトウェアは「現状のまま」提供され、明示または黙示を問わず、商品性、特定の目的への適合性、および権利非侵害に関する保証を含むがこれらに限定されない、いかなる種類の保証も行いません。著作権者またはライセンス保持者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の取り扱いに起因するいかなる請求、損害、またはその他の責任に対しても責任を負わないものとします。`
        }
    },
    updates: [
        {
            version: "2.0.0",
            date: "2026-05-03",
            changes: [
                "🚀 新アーキテクチャとエクスペリエンスの完全なアップグレード",
                "vConsole読み込みエラーを修正（開発ツールが完璧に動作）", 
                "ネイティブアラートをモーダルに置き換えUXを向上",
                "通知アクションボタンとアイコン機能のカスタマイズ対応サポート",
                "多くの環境間互換性バグを改善し解決"
            ]
        },
        {
            version: "1.7.0",
            date: "2024-05-01",
            changes: ["WebGPUレイトレーシングベンチマークを追加", "GPU検出を強化"]
        },
        {
            version: "1.6.0",
            date: "2024-04-12",
            changes: ["リアルネットワーク速度テスト (Cloudflare) を追加", "I18n動的翻訳を追加", "Intlサポートを強化"]
        },
        {
            version: "1.5.0",
            date: "2024-04-05",
            changes: ["開発者ツールを追加 (コンソール/インスペクター)", "コーデック検出を強化 (HDR/Dolby/深度)", "IPソース選択機能を追加", "フローティングウィンドウ対応"]
        },
        {
            version: "1.4.0",
            date: "2024-03-25",
            changes: ["ビジョン機能 (バーコード/QR) を追加", "CPU/GPUマッピングデータベースを更新"]
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
    linear_accel: "線形加速度",
    gravity: "重力センサー",
    abs_orientation: "絶対方向",
    xaxis: "X軸",
    yaxis: "Y軸",
    zaxis: "Z軸",
    alpha: "Alpha",
    beta: "Beta",
    gamma: "Gamma",
    dark: "暗い",
    room: "室内",
    bright: "明るい",
    sensor_unavailable: "センサーは利用できません。",
    data_source_desc: "データは DeviceMotion、DeviceOrientation、および Generic Sensor API によって提供されます。",
    close: "閉じる"
  },
  scoreModal: {
    score_details_title: "指紋スコア詳細",
    tracking_potential: "追跡リスク",
    score_explanation: "このスコアは、現在のブラウザ環境が一意に識別される可能性を表します。スコアが高いほど、デバイスの指紋がユニークであり、Webサイトによる追跡が容易になります。",
    category_weights: "カテゴリーの重要度",
    contributing_factors: "スコア影響因子",
    value_label: "値",
    close: "閉じる",
    signals_count: "個のシグナル",
    raw_score: "生のスコア",
    pts: "点",
    ratings: {
        LOW: "低リスク",
        MEDIUM: "中リスク",
        HIGH: "高リスク",
        CRITICAL: "重大なリスク"
    },
    categories: {
        hardware: "ハードウェア",
        browser: "ブラウザ",
        network: "ネットワーク",
        media: "メディア",
        screen: "画面"
    },
    factors: {
        canvas_hash: "Canvas指紋",
        webgl_hash: "WebGL指紋",
        hardware_concurrency: "ハードウェア並列数",
        user_agent: "User Agentの複雑さ",
        resolution: "画面解像度",
        audio_context: "オーディオ指紋",
        battery_status: "バッテリーAPI",
        locale_time: "タイムゾーンと言語",
        gpu_renderer: "GPUレンダラー",
        webrtc_leak: "WebRTCリーク",
        screen_advanced: "高度な画面設定",
        drm_support: "DRMサポート",
        touch_support: "タッチサポート",
        installed_fonts: "インストール済みフォント",
        system_timezone: "システムタイムゾーン",
        language_preferences: "言語設定",
        dnt_enabled: "トラッキング拒否 (DNT)",
        gamepads_connected: "接続されたゲームパッド",
        screen_orientation: "画面の向き",
        network_type: "ネットワーク接続タイプ"
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
        desc_ua_ch: "Client Hintsが具体的なデバイスモデルを暴露しています。",
        desc_res_unique: "標準的ではない画面解像度です。",
        desc_audio_unique: "オーディオハードウェアの特徴が識別可能です。",
        desc_battery_unique: "バッテリーAPIが具体的な残量を暴露しています。",
        desc_battery_generic: "バッテリーAPIは利用不可または一般的です。",
        desc_locale_unique: "タイムゾーンと言語の組み合わせが識別に利用可能です。",
        desc_gpu_unique: "正確なGPUモデル文字列が暴露されています。",
        desc_webrtc_leak: "WebRTC経由で実際のローカルまたはパブリックIPが漏洩しています。",
        desc_webrtc_safe: "WebRTCのIP処理は難読化または無効化されています。",
        desc_screen_advanced: "色深度、HDR、DPRの組み合わせがユニークです。",
        desc_drm_unique: "サポートされているDRMシステムによりOS/ブラウザの組み合わせが絞り込まれます。",
        desc_generic: "一般的または共通のプロパティ値。",
        desc_dnt_unique: "トラッキング拒否 (DNT) が有効になっており、デバイスの一意性が高まる可能性があります。",
        desc_dnt_generic: "トラッキング拒否 (DNT) が無効、または設定されていません。"
    }
  },
  fingerprintModal: {
    title: "指紋ジェネレーター",
    desc: "ブラウザ指紋の生成と分析",
    tab_v5: "FingerprintJS v5",
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
    regenerate: "再生成",
    close: "閉じる",
    font_count: "個数",
    complex_obj: "[複雑なオブジェクト]",
    no_components: "コンポーネントがロードされていません",
    active_source: "有効なデータソース",
    items_included: "個のアイテムが含まれています",
    error_loading: "ライブラリのロードエラー"
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
    storage_test: "データベースIOPS",
    worker_status: "Web Worker 有効 (マルチスレッド高速)"
  },
  graphicsModal: {
    supported_features: "サポートされている機能",
    no_params_found: "一致するパラメーターが見つかりません：",
    title: "グラフィックス詳細情報 & 制限",
    tab_webgl: "WebGL 制限",
    tab_webgpu: "WebGPU 制限",
    tab_features: "機能サポート",
    loading: "GPU機能を照会中...",
    not_supported: "このブラウザはWebGPUをサポートしていません。",
    copy: "レポートをコピー",
    search: "パラメータを検索..."
  },
  speechModal: {
    title: "音声合成エクスプローラー",
    lang_filter: "言語でフィルタ",
    play: "再生",
    default: "デフォルト",
    local: "ローカル",
    remote: "リモート",
    no_voices: "音声が見つかりません。システムがテキスト読み上げをサポートしているか確認してください。",
    loading: "音声を読み込み中..."
  },
  storageBenchmark: {
    title: "ストレージベンチマーク Pro",
    start: "ベンチマーク開始",
    stop: "停止",
    target_label: "ストレージターゲット",
    size_label: "ペイロードサイズ",
    chunk_size: "チャンクサイズ",
    opfs: "OPFS (ファイルシステム)",
    idb: "IndexedDB (データベース)",
    cache: "Cache API (キャッシュ)",
    write: "書き込み",
    read: "読み込み",
    mbps: "MB/s",
    iops: "IOPS",
    results: "結果ログ",
    warning: "このテストは一時データをディスクに書き込みます。データは自動的に削除されますが、十分な空き容量があることを確認してください。",
    latency: "レイテンシ (平均/ピーク)",
    export_csv: "CSVエクスポート",
    clear_logs: "ログをクリア",
    chunk_size_64: "64 KB (高IOPS)",
    chunk_size_256: "256 KB",
    chunk_size_1024: "1 MB (バランス)",
    chunk_size_4096: "4 MB (高スループット)",
    table_time: "時間",
    table_target: "ターゲット",
    table_op: "タイプ",
    table_chunk: "チャンク",
    table_speed: "スループット",
    table_latency: "レイテンシ (平均/ピーク)",
    op_read: "読み込み",
    op_write: "書き込み",
    worker_status: "専有 Web Worker 動作中 (マルチスレッド高速同期 IO 有効)"
  },
  heatmap: {
    title: "グローバルネットワーク品質監視",
    start: "クイックスキャン",
    stop: "停止",
    region: "リージョン",
    latency: "レイテンシ (RTT)",
    status: "ステータス",
    status_pending: "待機中",
    status_error: "タイムアウト/エラー",
    desc: "ノードをクリックすると、詳細なリンク品質トレースモード(MTRシミュレーション)に入り、継続的な測定を行います。",
    back: "マップに戻る",
    mtr_title: "リンク品質トレース",
    packet_loss: "パケットロス",
    jitter: "ジッター",
    avg_latency: "平均レイテンシ",
    current: "現在",
    samples: "サンプル数",
    regions: {
        us_east: "米国東部 (バージニア北部)",
        us_west: "米国西部 (カリフォルニア)",
        ca_central: "カナダ (モントリオール)",
        sa_brazil: "ブラジル (サンパウロ)",
        sa_chile: "チリ (サンティアゴ)",
        eu_uk: "英国 (ロンドン)",
        eu_ger: "ドイツ (フランクフルト)",
        eu_fr: "フランス (パリ)",
        eu_se: "スウェーデン (ストックホルム)",
        ap_india: "インド (ムンバイ)",
        ap_sg: "シンガポール",
        ap_jp: "日本 (東京)",
        ap_kr: "韓国 (ソウル)",
        ap_au: "オーストラリア (シドニー)",
        cn_sh: "中国 (上海)",
        cn_hk: "中国 (香港)",
        cn_tw: "中国 (台北)",
        af_sa: "南アフリカ (ケープタウン)"
    }
  },
  aiPlayground: {
    title: "AI プレイグラウンド",
    desc: "ブラウザローカルで軽量AIモデル(DistilBERT)を実行します。データはアップロードされません。",
    select_task: "モデルタスクの選択",
    perf_metrics: "パフォーマンス指標",
    tasks: {
        sentiment: {
            title: "感情分析",
            desc: "テキストの感情を識別 (DistilBERT)",
            input: "感情分析したい英文を入力してください...",
            btn: "分析開始"
        },
        generation: {
            title: "テキスト生成",
            desc: "AIによるテキスト補完 (DistilGPT2)",
            input: "開始文を入力...",
            btn: "生成"
        },
        translation: {
            title: "翻訳",
            desc: "英日翻訳など (T5-Small)",
            input: "翻訳したい英文を入力...",
            btn: "翻訳"
        }
    },
    status: {
        loading_model: "モデルウェイトを読み込み中...",
        ready: "準備完了",
        computing: "計算中...",
        idle: "アイドル"
    },
    metrics: {
        time_load: "ロード時間",
        time_inference: "推論時間",
        device: "デバイス"
    },
    result_label: "分析結果",
    confidence: "信頼度",
    btn_load: "モデルを読み込む"
  },
  rayTracing: {
    title: "GPU レイトレーシング",
    start: "テスト開始",
    stop: "停止",
    fps: "FPS",
    spp: "サンプル/ピクセル",
    bounces: "バウンス数",
    resolution: "解像度",
    error_webgpu: "このブラウザはWebGPUをサポートしていません。Chrome 113+ または Edgeを使用してください。",
    desc: "WebGPUコンピュートシェーダーを使用したリアルタイムパストレーシングベンチマーク。",
    controls: "マテリアル制御",
    roughness: "粗さ",
    metalness: "金属度",
    color: "球の色",
    reset: "カメラリセット"
  },
  "extensionsModal": {
    "title": "ブラウザ拡張機能の検出",
    "note_strong": "注意:",
    "note_text": "プライバシーとセキュリティの理由から、ブラウザはインストールされている拡張機能の一覧を取得するネイティブAPIを提供していません。このツールはヒューリスティック(注入された変数やDOM要素の検出等)を使用して、一般的な拡張機能を識別します。これはインストールされている全ての拡張機能の完全なリストではありません。",
    "no_extensions": "既知の拡張機能は検出されませんでした。",
    "detected": "検出済み",
    "categories": {
      "Development": "開発",
      "Crypto": "仮想通貨",
      "Shopping": "ショッピング",
      "Productivity": "生産性",
      "Utility": "ユーティリティ"
    },
    "names": {
      "react-devtools": "React DevTools",
      "vue-devtools": "Vue.js devtools",
      "redux-devtools": "Redux DevTools",
      "apollo-devtools": "Apollo Client Devtools",
      "ember-inspector": "Ember Inspector",
      "metamask": "MetaMask",
      "phantom": "Phantom",
      "binance": "Binance Wallet",
      "coinbase": "Coinbase Wallet",
      "brave-wallet": "Brave Wallet",
      "sui-wallet": "Sui Wallet",
      "honey": "Honey",
      "grammarly": "Grammarly",
      "darkreader": "Dark Reader"
    },
    "descs": {
      "react-devtools": "公式 React デバッグ拡張機能",
      "vue-devtools": "公式 Vue.js デバッグ拡張機能",
      "redux-devtools": "Redux 状態デバッグ",
      "apollo-devtools": "GraphQL デバッグ機能",
      "ember-inspector": "Ember デバッグ機能",
      "metamask": "Web3 Ethereum ウォレット",
      "phantom": "Web3 Solana ウォレット",
      "binance": "Web3 Binance Chain ウォレット",
      "coinbase": "Web3 Coinbase ウォレット",
      "brave-wallet": "Brave 内蔵仮想通貨ウォレット",
      "sui-wallet": "Web3 Sui ウォレット",
      "honey": "自動クーポン適用ツール",
      "grammarly": "文章作成アシスタント",
      "darkreader": "ウェブサイトのダークモード"
    }
  }
,
  "ja3Modal": {
    "title": "SSL/TLS 指紋 (JA3/JA4)",
    "desc_title": "TLS Client Hello フィンガープリント",
    "desc": "HTTPSハンドシェイク中に、ブラウザはサポートされている暗号スイート、TLS拡張などを含むClient Helloメッセージを送信します。JA3/JA4は、これらのTCP/TLS特性をフィンガープリント化して、実際のブラウザエンジンを正確に特定したり、ボット、プロキシ、なりすましユーザーエージェントを検出したりします。",
    "fetching": "TLSハンドシェイクを分析中...",
    "retry": "再試行",
    "ja3_title": "JA3 指紋",
    "ja3_hash": "JA3 ハッシュ (MD5)",
    "ja3_string": "JA3 文字列 (生)",
    "ja3n_title": "JA3N 指紋",
    "ja3n_hash": "JA3N ハッシュ (MD5)",
    "ja3n_string": "JA3N 文字列 (生)",
    "server_ua": "サーバーが検出したユーザーエージェント"
  },
  "attributionsModal": {
    "title": "ソフトウェアおよびアセットの帰属表記 (Attributions)",
    "subtitle": "BrowserScope のブラウザ分析ダッシュボードを支えるサードパーティのオープンソースライブラリ、開発フレームワーク、およびデザイン用フォントを記録し、感謝を表します。",
    "search_placeholder": "ライブラリ、パッケージ、またはフォントを検索...",
    "tab_all": "すべてのアセット",
    "tab_libraries": "オープンソースライブラリとフレームワーク",
    "tab_fonts": "タイポグラフィとフォント",
    "view_license": "ライセンス本文を表示",
    "hide_license": "ライセンス本文を非表示",
    "license_type": "オープンソースライセンス",
    "role_label": "機能および統合ロール",
    "visit_site": "リポジトリを訪問",
    "empty_search": "\"{query}\" に一致するアセットは見つかりませんでした",
    "font_role": "システムインターフェース、レイアウト、ヘッダー、およびデータ視覚化パネル用の可読性の高いフォント。",
    "lib_role_react": "コンポーネントベースの宣言的UIレンダリングエンジンと、インタラクティブウィジェット用の状態管理アーキテクチャ。",
    "lib_role_fingerprint": "エントロピーの計算およびデバイス一致性の検証に使用される、多世代にわたる高度なブラウザフィンガープリント識別エンジン。",
    "lib_role_transformers": "クライアントのCPU/GPUでローカルAIモデルを実行するための、WebAssemblyベースのブラウザ内ニューラル推論フレームワーク。",
    "lib_role_lucide": "システムUIアイコンやメタデータ用の、完全にスケーラブルで鮮明なSVGベクターアイコン。",
    "lib_role_motion": "ハードウェア加速による、システム要素のスムーズなアニメーション、トランジション、およびインタラクティブなモーションエフェクト。",
    "lib_role_screenshot": "アクティブなDOMツリーをキャンバスにレンダリングし、エクスポート可能な高精細ダッシュボードスクリーンショットレポートを生成する機能。",
    "lib_role_jspdf": "クライアント側でのPDF診断レポートドキュメントのマルチスレッドコンパイル。",
    "lib_role_devtools": "モバイル向けに最適化された仮想ログ出力、DOMノード検査、およびウェブインスペクターコンソールツールボックス。",
    "lib_role_pwa": "オフラインファーストのアセットキャッシュおよびService Workerによるクライアントライフサイクル管理。",
    "lib_role_server": "ExpressサーバーでのAPIルーティング、レート制限、およびセキュアなHTTPヘッダー保護。",
    "lib_role_charts": "レスポンシブなインタラクティブチャート、ゲージ、グラフ、およびネットワーク診断メトリクスの可視化。",
    "close": "閉じる"
  },
  "keyboardShortcutsModal": {
    "title": "キーボードショートカット",
    "desc": "グローバルショートカットキーを使用して、操作効率を大幅に向上させます。",
    "categories": {
      "general": "全般・基本操作",
      "navigation": "ナビゲーション・診断ツール",
      "export": "データのエクスポート"
    },
    "keys": {
      "theme": "テーマの切り替え（ダーク / ライト）",
      "refresh": "再スキャン・データの更新",
      "help": "このヘルプ画面を開く / 閉じる",
      "close": "現在のモーダルを閉じる",
      "settings": "設定画面を開く",
      "benchmark": "ベンチマークスコアの実行",
      "ai": "AI プレイグラウンドを開く",
      "network": "ネットワークツール（Ping/ポート）",
      "display": "ディスプレイテストツール",
      "hardware": "高度なハードウェアテスト",
      "translate": "Google 翻訳ツール",
      "exportJson": "JSONデータの書き出し",
      "exportPdf": "PDF診断レポートの保存",
      "exportImage": "ダッシュボード画像の保存",
      "esc": "Esc",
      "alt": "Alt",
      "shift": "Shift"
    }
  }

};
