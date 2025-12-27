
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
  }
};
