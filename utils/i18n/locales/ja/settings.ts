
export const settings = {
  settings: {
    title: "設定",
    nav: {
        general: "一般",
        appearance: "外観",
        network: "ネットワークツール",
        display: "画面テスト",
        storage: "ストレージ管理",
        resources: "ネットワーク要求",
        developer: "開発者",
        modules: "モジュール管理",
        versions: "バージョンと更新"
    },
    general: {
        fontSettings: {
            title: "フォントのカスタマイズ",
            desc: "本文のテキストとダイアログのタイトルフォントを個別にカスタマイズします。",
            bodyFont: "本文フォント",
            bodyFontDesc: "レポート、リスト、および各種診断詳細テキストのフォントを変更します。",
            modalTitleFont: "モーダルタイトルフォント",
            modalTitleFontDesc: "すべての設定ダイアログ、モーダルのヘッダータイトルフォントを変更します。",
            codeFont: "等幅/コードフォント",
            codeFontDesc: "コードブロック、ターミナル、パス、および変数の等幅フォントスタイルを変更します。",
            defaultFont: "システムデフォルト (MiSans)",
            defaultCodeFont: "システムデフォルト等幅フォント",
            mismatchError: "選択したフォントは現在の言語（{lang}）をサポートしていないため、切り替えがブロックされました。使用するには、事前に「ストレージ管理」でダウンロードするか、言語を変更してください。",
            mismatchTitle: "不適合なフォント言語",
            fontNames: {
                googlesansflex: "Google Sans Flex",
                notosans: "Noto Sans",
                roboto: "Roboto Regular",
                harmonyossanssc: "HarmonyOS Sans SC (ハーモニーOSサンス)",
                misans: "MiSans (小米ランティン体)",
                smileysans: "得意黒 (Smiley Sans Oblique)",
                zcoolxiaowei: "站酷小薇体 (ZCOOL XiaoWei)",
                sawarabigothic: "さわらびゴシック (Sawarabi Gothic)",
                notosanssc: "Noto Sans SC (思源ゴシック 簡体字)",
                notosanstc: "Noto Sans TC (思源ゴシック 繁体字)",
                notosansjp: "Noto Sans JP (思源ゴシック 日本語)",
                jetbrainsmono: "JetBrains Mono",
                firacode: "Fira Code",
                robotomono: "Roboto Mono",
                sourcecodepro: "Source Code Pro",
                geist: "Geist"
            }
        },
        fontFix: {
            title: "フォント描画修復",
            desc: "GPUハードウェアアクセラレーションとサイレント再描画パルスを適用し、一部ブラウザでの文字のぼやけを解消します。"
        },
        showTabs: {
            title: "ナビゲーションタブを表示",
            desc: "コンテンツ上部にフィルタリング用のタブを表示します。すべてのタブが空の場合は自動的に非表示になります。"
        },
        showSearch: {
        
        
            title: "検索バーを有効にする",
        
        
            desc: "タブバーの上部に検索バーを表示し、ダッシュボードのカテゴリやカードのコンテンツを素早くフィルタリングできるようにします。"
        
        
        },
        
        
        
        searchScope: {
            title: "検索範囲",
            desc: "検索キーワードの一致範囲を選択します。",
            options: {
                all: "すべて",
                category: "カテゴリ",
                title: "タイトル",
                value: "値"
            }
        },
        searchMode: {
            title: "検索モード",
            desc: "あいまい検索または完全一致を選択します。",
            options: {
                fuzzy: "あいまい",
                exact: "完全一致"
            }
        },simpleMode: {
            title: "シンプルモード",
            desc: "複雑な技術的詳細を隠し、核心情報のみを表示します。"
        },
        scrollbar: {
            title: "メインページのスクロールバーを非表示",
            desc: "メインページのデフォルトのスクロールバーのみを非表示にします。"
        },
        globalScrollbar: {
            title: "すべてのスクロールバーを非表示",
            desc: "モーダル内を含む、すべての要素のスクロールバーを非表示にします。"
        },
        themeColor: {
            title: "テーマカラー",
            desc: "アプリケーションのメインカラーテーマを選択します。"
        },
        animationStyle: {
            title: "アニメーションスタイル",
            desc: "UI要素の入場アニメーションスタイルを選択します。",
            options: {
                slideUp: "スライドアップ",
                fade: "フェードイン",
                flyIn: "フライイン",
                zoom: "ズームイン"
            }
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
            title: "トランジションを高速化",
            desc: "ホバーや展開などのトランジション効果を高速化します。"
        },
        collapseHeader: {
            title: "ヘッダーの折りたたみ",
            desc: "デスクトップ画面のヘッダーアクションをメニューに折りたたみます。"
        },
        cardVisibility: {
            title: "表示項目をカスタマイズ",
            desc: "必要のない特定のカードやグループをメイン画面から非表示にします。"
        },
        
        restoreNotifications: {
            title: "通知の復元",
            desc: "以前に閉じたすべての通知カードをダッシュボード上部に再表示します。",
            button: "すべて復元",
            empty: "閉じられた通知はありません"
        },
        quickSummaryVisibility: {
            title: "クイックサマリー",
            desc: "ダッシュボード上部にセキュリティ指標を含むクイックサマリーウィジェットを再表示します。",
            restoreBtn: "表示を復元",
            activeState: "表示中"
        },udpBypass: {
            title: "UDP プロキシを有効にする (CORS バイパス)",
            desc: "UDP マッピング API を使用して、CORS によるネットワーク要求のインターセプトを完全にバイパスします。",
            unsupportedEnv: "現在の実行環境ではUDPを有効にできません",
            checkingUdp: "UDP サポートを確認中...",
            recheckUdp: "再確認",
            limitationsTitle: "制限事項",
            limitationsList: [
                "プロキシサーバーの遅延: リクエストは中継プロキシノードを経由するため、伝送遅延が発生します。",
                "実際のIPの隠蔽: エンドポイントには実際のローカルIPではなく、クラウドプロキシサーバーのIPアドレスが表示されます。",
                "リージョンルーティングの偏差: プロキシサーバーの物理的な位置に影響され、地域の判定に誤差が生じる場合があります。",
                "レート制限: 高頻度の同時ネットワークスキャンは、プロキシノードのAPIレート制限をトリガーする可能性があります。"
            ],
            pros: "設定不要。対応している仮想環境であればすぐに使用可能です。",
            cons: "遅延が高く、クライアントの実際の送信IPを公開できず、サーバーに依存し、レート制限の可能性があります。",
            prosLabel: "メリット",
            consLabel: "デメリット"
        },
        userscriptBypass: {
            title: "Tampermonkey CORS バイパス補助 (ローカル接続)",
            desc: "ブラウザにインストールされた Tampermonkey スクリプトを使用して、ローカル PC から直接ネットワーク診断と TLS 指紋取得を実行します。CORS 制限を完全に回避し、プロキシを経由しないセキュアで高速な直接接続を提供します。",
            recommended: "推奨方案",
            statusActive: "スクリプト検出完了・接続中",
            statusInactive: "未検出 / スクリプトが読み込まれていません",
            installGuide: "スクリプトインストールガイド",
            copyScript: "スクリプトコードをコピー",
            quickInstall: "ワンクリック簡単インストール (推奨)",
            manualInstallBackup: "手動コピー＆ペースト (バックアップ)",
            copied: "クリップボードにコピーしました!",
            enableBtn: "Tampermonkey の CORS バイパスを優先する",
            disableBtn: "無効化 (フォールバック)",
            recheck: "ステータス再確認",
            checking: "接続状況を確認中...",
            pros: "直接接続、最小限の遅延、実際の送信IPを正確に検出、完全なプライバシー保護、レート制限なし。",
            cons: "初回のみ拡張機能のインストールとスクリプトコードのコピー＆ペースト作業が必要です。",
            comparisonTitle: "接続方式の比較",
            methodHeader: "特性の比較",
            udpBypassHeader: "UDP クラウドプロキシ (サーバー)",
            userscriptBypassHeader: "Tampermonkey スクリプト (ローカル直連)",
            steps: {
                step1: "ブラウザに **Tampermonkey (篡改猴)** または同様のユーザースクリプト管理拡張機能をインストールします。",
                step2: "拡張機能のアイコンをクリックし、**「新規スクリプトを作成」 (Create a new script)** を選択します。",
                step3: "以下のスクリプトコード全体をコピーしてエディタに貼り付け、保存 (Ctrl+S) します。",
                step4: "保存後、このページを更新してください。システムがスクリプトと自動的にハンドシェイク接続を行います。"
            }
        },
        exportSettings: {
            title: "設定のエクスポートとインポート",
            desc: "現在の設定や環境をエクスポートするか、インポートしてプラットフォーム移行後にすばやく構成します。",
            exportBtn: "エクスポート",
            importBtn: "インポート",
            importSuccess: "設定のインポートが完了しました。ページを再読み込みします。",
            importError: "無効な設定ファイルです。"
        },
        appExportSettings: {
            title: "「エクスポート」機能設定",
            desc: "ダッシュボードの「エクスポート」機能のフォーマットと解像度を制御します。",
            imageScale: "画像アップスケーリング率",
            pdfFormat: "PDF ページ形式",
            pdfFont: "PDF エクスポートフォント",
            scales: {
                scale1: "1x - オリジナル解像度",
                scale2: "2x - Retina 高画質",
                scale3: "3x - ウルトラ HD",
                scale4: "4x - エクストリーム HD"
            },
            formats: {
                a4: "A4 (210 × 297 mm)",
                letter: "レター (8.5 × 11 インチ)",
                legal: "リーガル (8.5 × 14 インチ)"
            },
            fonts: {
                auto: "自動 / 言語デフォルトフォント",
                helvetica: "Helvetica (サンセリフ)",
                times: "Times New Roman (セリフ)",
                courier: "Courier (等幅フォント)"
            }
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
            fail_v6: "IPv6 非対応",
            detail_location: "位置情報",
            detail_asn: "ASN",
            detail_timezone: "タイムゾーン",
            detail_zip: "郵便番号",
            detail_fraud: "不正スコア",
            detail_residential: "家庭用回線",
            detail_broadcast: "ブロードキャスト",
            detail_ua: "ユーザーエージェント",
            yes: "はい",
            no: "いいえ"
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
            click_to_exit: "クリックして終了",
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
        },
        motion: {
            title: "モーションブラーとスタッターテスト",
            desc: "移動するブロックを目で追ってください。動きが滑らかでない場合は、システムがフレームをドロップしているか、リフレッシュレートが低い可能性があります。"
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
        usageLabel: "ストレージ使用率",
        fonts: {
            title: "フォントキャッシュ管理",
            desc: "アプリケーションのビルドサイズを大幅に削減するため、診断レポートのPDFエクスポートで使用される非英語フォントはグローバルCDNからオンデマンドで取得されるようになりました。ここでフォントを事前ダウンロードしてオフラインで使用できるようにしたり、削除してブラウザのキャッシュ容量を解放したりできます。",
            name: "フォント名",
            languages: "対象言語",
            status: "ステータス",
            cached: "キャッシュ済み ({size})",
            notCached: "未キャッシュ (CDNから取得)",
            downloading: "ダウンロード中...",
            downloadBtn: "ダウンロード",
            deleteBtn: "削除",
            sizeUnknown: "サイズ不明",
            downloadSuccess: "フォントが正常にダウンロードされました！",
            deleteSuccess: "フォントが正常に削除されました！",
            downloadFailed: "フォントのダウンロードに失敗しました。",
            deleteFailed: "フォントの削除に失敗しました。",
            labels: {
                googlesansflex: "英語 / ラテン文字",
                notosans: "多言語 / キリル文字",
                roboto: "ロシア語 / キリル文字",
                harmonyossanssc: "中国語簡体字 / 英語",
                misans: "中国語簡体字 / 英語",
                zcoolxiaowei: "中国語 (簡体字・繁体字)",
                sawarabigothic: "日本語",
                notosanssc: "中国語簡体字",
                notosanstc: "中国語繁体字",
                notosansjp: "日本語"
            }
        },
        locales: {
            title: "言語パックのキャッシュ管理",
            desc: "初期読み込み時間を短縮するため、コアとなる英語以外の言語パックは必要に応じて動的にダウンロードされます。オフラインアクセスのためにダウンロードするか、削除してストレージを解放できます。",
            name: "言語パック",
            code: "言語コード",
            status: "ステータス",
            cached: "キャッシュ済み ({size})",
            notCached: "未キャッシュ (クリックして取得)",
            downloading: "ダウンロード中...",
            downloadBtn: "ダウンロード",
            deleteBtn: "削除",
            sizeUnknown: "サイズ不明",
            downloadSuccess: "言語パックが正常にダウンロードされました！",
            deleteSuccess: "言語パックが正常に削除されました！",
            downloadFailed: "言語パックのダウンロードに失敗しました。",
            deleteFailed: "言語パックの削除に失敗しました。",
            coreLanguage: "コア言語 (組み込み)",
            notDownloadedTooltip: "この言語パックはダウンロードされていません。クリックすると自動的にダウンロードして切り替えます。",
            cannotDeleteActive: "レンダリングの問題を避けるため、現在使用中の言語パックは削除できません。"
        }
    },
    resources: {
        title: "ネットワーク要求モニター",
        subtitle: "アプリケーションによって作成されたネットワーク要求を監視および分析します（ネイティブ Fetch、UDP プロキシ、およびユーザースクリプトを区別）。",
        clear: "ログをクリア",
        empty: "ネットワーク要求ログはまだありません。",
        searchPlaceholder: "要求URLを検索...",
        all: "すべて",
        columns: {
            url: "要求URL",
            method: "メソッド",
            type: "イニシエータタイプ",
            status: "ステータス",
            duration: "時間",
            time: "タイムスタンプ"
        },
        types: {
            udp: "UDP 転送",
            native: "ネイティブ要求",
            script: "ユーザースクリプト",
            unknown: "その他"
        },
        details: {
            title: "要求の詳細",
            id: "要求 ID",
            url: "要求URL",
            method: "メソッド",
            type: "要求タイプ",
            status: "レスポンスステータス",
            duration: "所要時間",
            initiator: "イニシエータ",
            timestamp: "タイムスタンプ",
            pending: "保留中...",
            openUrl: "ターゲットURLを開く"
        }
    },
    developer: {
        config: {
            simulateCrash: "アプリのクラッシュをシミュレート",
            clearConsoleCache: "コンソールと PWA キャッシュをクリア",
            clearConsoleCacheDesc: "Service Worker を強制登録解除し、Cache Storage キャッシュをクリア",
            defaultConsoleTitle: "デフォルトコンソール",
            consoleNone: "なし（システムデフォルト）",
            consoleVConsole: "vConsole",
            consoleEruda: "Eruda",
            recordEvents: "イベントを記録",
            recordEventsDesc: "ウィンドウとネットワークイベントを自動記録",
            vconsole: "vConsole 統合",
            vconsoleDesc: "Tencent vConsole パネルを有効にする",
            eruda: "Eruda 統合",
            erudaDesc: "Eruda パネルを有効にする",
            erudaDefaultTab: "デフォルトタブ",
            erudaDefaultTabDesc: "Erudaが開かれたときにフォーカスするタブを選択します",
            vconsoleDefaultTab: "vConsole デフォルトタブ",
            vconsoleDefaultTabDesc: "vConsoleが開かれたときにフォーカスするタブを選択します",
            vconsoleTabs: {
                default: "デフォルト (Default)",
                system: "システム (System)",
                network: "ネットワーク (Network)",
                element: "要素 (Element)",
                storage: "ストレージ (Storage)"
            },
            erudaTabs: {
                console: "コンソール (Console)",
                elements: "要素 (Elements)",
                network: "ネットワーク (Network)",
                resources: "リソース (Resources)",
                sources: "ソースコード (Sources)",
                info: "情報 (Info)",
                snippets: "スニペット (Snippets)",
                timing: "タイミング (Timing)",
                features: "機能 (Features)",
                monitor: "モニター (Monitor)",
                fps: "FPS"
            },
            loadSnippets: "コードスニペット",
            loadSnippetsDesc: "Eruda コンソールに挿入するコードスニペットを選択します",
            snippetClearLocal: "ローカルストレージのクリア",
            snippetClearSession: "セッションストレージのクリア",
            snippetShowCookies: "Cookieの表示",
            snippetToggleBlur: "背景のぼかしを切り替える",
            snippetToggleEditable: "ページの編集可能状態を切り替える",
        },
        warning: {
            title: "操作は極めて危険です！",
            desc: "ここは開発者向けのデバッグエリアです。何をしているのか理解していない場合は、直ちにウィンドウを閉じてください！\n\nここでコードを貼り付けるよう誘導する人物は詐欺師です。不明なコードを実行すると、プライバシーの漏洩、アカウントの乗っ取り、またはデバイスが悪意を持って制御される可能性があります。",
            agree: "リスクを理解して続行",
            cancel: "やめる、この機能は使わない",
            disabled_title: "開発者モードが無効になりました",
            disabled_desc: "現在キャンセルを選択しました。問題のトラブルシューティングが必要になった場合は、いつでも再度有効にできます。",
            reenable: "再度有効にし、リスクを受け入れる"
        },
        nav: {
            events: "イベント",
            inspector: "オブジェクト検査",
            console: "コンソール"
        },
        actions: {
            float: "フロート表示",
            loadVConsole: "vConsole を読み込む",
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
            run: "即時実行",
            presets: {
                userAgent: { label: "User Agent", desc: "ブラウザの UA 文字列を表示" },
                screenInfo: { label: "画面情報", desc: "解像度とピクセル比" },
                cookies: { label: "Cookies", desc: "すべてのクッキーを表示" },
                clearStorage: { label: "ローカルストレージ消去", desc: "LocalStorage を消去" },
                editPage: { label: "ページ編集", desc: "コンテンツの編集可否を切り替え" },
                disableBlur: { label: "ぼかし無効化", desc: "グローバルぼかしを切り替え" },
                blockClicks: { label: "クリックブロック", desc: "グローバルクリックを切り替え" },
                getKeys: { label: "すべてのキー取得", desc: "LocalStorage のキー一覧" },
                reload: { label: "ページ再読み込み", desc: "強制リロード" },
                performance: { label: "パフォーマンス", desc: "現在のタイムスタンプ(ms)" },
                network: { label: "ネットワーク情報", desc: "接続の詳細" },
                memory: { label: "メモリ", desc: "ヒープサイズ (Chromeのみ)" }
            }
        },
        floating_state: {
            title: "開発者ツールが別ウィンドウで開いています",
            desc: "より良い体験のために、開発者ツールウィンドウは現在のモーダルから切り離されました。",
            return: "モーダルに戻る"
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
            system: "システム",
            locked: "ロック"
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
    },
    versions: {
        title: "ソフトウェアバージョン",
        desc: "現在のコアアプリケーションのバージョンとロード済みのモジュールを表示します。必要に応じて更新情報を強制的に取得します。",
        forcePull: "アップデートを確認",
        applyUpdate: "アップデートを適用して再起動",
        upToDate: "アプリはすでに最新です。",
        lastChecked: "最終チェック: ",
        coreApp: "コアアプリケーション",
        installedModules: "インストール済みモジュール",
        libraries: "コアライブラリ"
    }
  }
,
  "modules": {
    "impact": {
      "high": "高",
      "med": "中",
      "low": "低"
    },
    "title": "モジュール",
    "desc": "動的にロードされたツールを管理します。",
    "status": {
      "active": "アクティブ",
      "cached": "キャッシュ済",
      "inactive": "非アクティブ",
      "system": "システム",
      "locked": "ロック済"
    },
    "actions": {
      "unloadAll": "すべてアンロード",
      "unload": "アンロード"
    },
    "headers": {
      "name": "名前",
      "status": "ステータス",
      "impact": "影響",
      "action": "アクション"
    }
  },
  "versions": {
    "upToDate": "アプリはすでに最新です。",
    "title": "ソフトウェアバージョン",
    "desc": "現在のコアソフトウェアバージョンとロードされたモジュールを表示します。必要に応じて更新を取得します。",
    "applyUpdate": "更新を適用",
    "forcePull": "更新を確認",
    "lastChecked": "最終確認:",
    "coreApp": "コアアプリケーション",
    "libraries": "コアライブラリ",
    "installedModules": "インストール済みモジュール"
  },
  "developer": {
    "config": {
      "recordEvents": "イベントを記録",
      "recordEventsDesc": "ウィンドウとネットワークイベントを自動記録",
      "defaultConsoleTitle": "デフォルトコンソール",
      "consoleVConsole": "vConsole",
      "consoleEruda": "Eruda",
      "vconsoleDefaultTab": "vConsoleのデフォルトタブ",
      "vconsoleDefaultTabDesc": "vConsoleを開いたときにフォーカスするタブを選択します。",
      "vconsoleTabs": {
        "default": "デフォルト",
        "system": "システム",
        "network": "ネットワーク",
        "element": "要素",
        "storage": "ストレージ"
      },
      "erudaDefaultTab": "Erudaのデフォルトタブ",
      "erudaDefaultTabDesc": "Erudaを開いたときにフォーカスするタブを選択します。",
      "erudaTabs": {
        "console": "コンソール",
        "elements": "要素 (DOM)",
        "network": "ネットワーク",
        "resources": "リソース",
        "sources": "ソース (コード)",
        "info": "情報",
        "snippets": "スニペット",
        "timing": "タイミング",
        "features": "機能",
        "monitor": "モニター",
        "fps": "FPS"
      },
      "loadSnippets": "コードスニペット",
      "snippetClearLocal": "LocalStorageをクリア",
      "snippetClearSession": "SessionStorageをクリア",
      "snippetShowCookies": "Cookieを表示",
      "snippetToggleBlur": "ボディブラーの切り替え",
      "snippetToggleEditable": "編集可能ページの切り替え",
       "simulateCrash": "開発クラッシュをシミュレート",
       "clearConsoleCache": "コンソールと PWA キャッシュをクリア",
       "clearConsoleCacheDesc": "Service Worker を強制登録解除し、Cache Storage キャッシュをクリア"
    }
  }

};
