
export const settings = {
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
            title: "ブラーを無効化",
            desc: "ブラー効果と透明度を無効にし、UIの滑らかさを向上させます。"
        },
        animations: {
            title: "アニメーションを無効にする",
            desc: "ページ遷移とカードの読み込みアニメーションをオフにします。"
        },
        fastAnimations: {
            title: "高速アニメーション",
            desc: "すべての読み込みと遷移アニメーションを高速化します。"
        },
        collapseHeader: {
            title: "ヘッダーの折りたたみ",
            desc: "デスクトップ画面のヘッダーアクションをメニューに折りたたみます。"
        },
        cardVisibility: {
            title: "表示項目をカスタマイズ",
            desc: "必要のない特定のカードやグループをメイン画面から非表示にします。"
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
  }
};
