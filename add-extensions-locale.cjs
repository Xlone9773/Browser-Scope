const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, 'utils', 'i18n', 'locales');
const langs = ['en', 'zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'];

// What to add to modals.ts
const newModals = {
    zhCN: {
        extensionsModal: {
            title: "浏览器扩展检测",
            note_strong: "注意：",
            note_text: "由于隐私和安全原因，浏览器不提供原生 API 来列出已安装的扩展。此检测工具通过启发式方法（如检测注入的变量或 DOM 元素）来识别常见的护展程序。这并非您安装的所有扩展的完整列表。",
            no_extensions: "未检测到已知的扩展程序。",
            detected: "已检测到",
            categories: {
                Development: "开发工具",
                Crypto: "加密钱包",
                Shopping: "购物/优惠券",
                Productivity: "生产力",
                Utility: "实用工具"
            },
            names: {
                "react-devtools": "React 开发者工具",
                "vue-devtools": "Vue.js 开发者工具",
                "redux-devtools": "Redux 开发者工具",
                "apollo-devtools": "Apollo 开发者工具",
                "ember-inspector": "Ember 检查器",
                "metamask": "MetaMask (小狐狸)",
                "phantom": "Phantom (幻影)",
                "binance": "币安钱包",
                "coinbase": "Coinbase 钱包",
                "brave-wallet": "Brave 钱包",
                "sui-wallet": "Sui 钱包",
                "honey": "Honey (自动优惠券)",
                "grammarly": "Grammarly (语法检查)",
                "darkreader": "Dark Reader (深色模式)"
            },
            descs: {
                "react-devtools": "官方 React 调试扩展",
                "vue-devtools": "官方 Vue.js 调试扩展",
                "redux-devtools": "Redux 状态调试",
                "apollo-devtools": "GraphQL 调试工具",
                "ember-inspector": "Ember 框架调试",
                "metamask": "Web3 以太坊钱包",
                "phantom": "Web3 Solana 钱包",
                "binance": "Web3 币安智能链钱包",
                "coinbase": "Web3 Coinbase 钱包",
                "brave-wallet": "Brave 浏览器内置加密钱包",
                "sui-wallet": "Web3 Sui 钱包",
                "honey": "自动查找并应用优惠券",
                "grammarly": "智能写作助手",
                "darkreader": "为所有网页生成深色主题"
            }
        }
    },
    zhTW: {
        extensionsModal: {
            title: "瀏覽器擴展檢測",
            note_strong: "注意：",
            note_text: "基於隱私和安全性考量，瀏覽器不提供原生 API 來列出已安裝的擴充功能。此檢測工具使用啟發式方法（如檢測注入的變數或 DOM 元素）來識別常見的擴展。這並非您安裝的所有擴展的完整清單。",
            no_extensions: "未檢測到已知的擴充功能。",
            detected: "已檢測到",
            categories: { Development: "開發工具", Crypto: "加密錢包", Shopping: "購物/優惠券", Productivity: "生產力", Utility: "實用工具" },
            names: {
                "react-devtools": "React 開發者工具", "vue-devtools": "Vue.js 開發者工具", "redux-devtools": "Redux 開發者工具",
                "apollo-devtools": "Apollo 開發者工具", "ember-inspector": "Ember 檢查器", "metamask": "MetaMask",
                "phantom": "Phantom", "binance": "幣安錢包", "coinbase": "Coinbase 錢包", "brave-wallet": "Brave 錢包",
                "sui-wallet": "Sui 錢包", "honey": "Honey (優惠券)", "grammarly": "Grammarly (寫作助手)", "darkreader": "Dark Reader"
            },
            descs: {
                "react-devtools": "官方 React 偵錯擴充功能", "vue-devtools": "官方 Vue.js 偵錯擴充功能", "redux-devtools": "Redux 狀態偵錯",
                "apollo-devtools": "GraphQL 偵錯工具", "ember-inspector": "Ember 框架偵錯", "metamask": "Web3 乙太坊錢包",
                "phantom": "Web3 Solana 錢包", "binance": "Web3 幣安智能鏈錢包", "coinbase": "Web3 Coinbase 錢包",
                "brave-wallet": "Brave 瀏覽器內建加密錢包", "sui-wallet": "Web3 Sui 錢包", "honey": "自動查找並應用優惠券",
                "grammarly": "寫作助手與文法檢查", "darkreader": "為所有網頁生成深色主題"
            }
        }
    },
    zhHK: {
        extensionsModal: {
            title: "瀏覽器擴展檢測",
            note_strong: "注意：",
            note_text: "基於私隱和安全性考量，瀏覽器不提供原生 API 來列出已安裝的擴充功能。此檢測工具使用啟發式方法（如檢測注入的變數或 DOM 元素）來識別常見的擴充功能。這並非您安裝的所有擴展的完整清單。",
            no_extensions: "未檢測到已知的擴充功能。",
            detected: "已檢測到",
            categories: { Development: "開發工具", Crypto: "加密錢包", Shopping: "購物/優惠券", Productivity: "生產力", Utility: "實用工具" },
            names: {
                "react-devtools": "React 開發者工具", "vue-devtools": "Vue.js 開發者工具", "redux-devtools": "Redux 開發者工具",
                "apollo-devtools": "Apollo 開發者工具", "ember-inspector": "Ember 檢查器", "metamask": "MetaMask",
                "phantom": "Phantom", "binance": "幣安錢包", "coinbase": "Coinbase 錢包", "brave-wallet": "Brave 錢包",
                "sui-wallet": "Sui 錢包", "honey": "Honey (優惠券)", "grammarly": "Grammarly (寫作助手)", "darkreader": "Dark Reader"
            },
            descs: {
                "react-devtools": "官方 React 偵錯擴充功能", "vue-devtools": "官方 Vue.js 偵錯擴充功能", "redux-devtools": "Redux 狀態偵錯",
                "apollo-devtools": "GraphQL 偵錯工具", "ember-inspector": "Ember 框架偵錯", "metamask": "Web3 乙太坊錢包",
                "phantom": "Web3 Solana 錢包", "binance": "Web3 幣安智能鏈錢包", "coinbase": "Web3 Coinbase 錢包",
                "brave-wallet": "Brave 瀏覽器內置加密錢包", "sui-wallet": "Web3 Sui 錢包", "honey": "自動查找並套用優惠券",
                "grammarly": "寫作助手與文法檢查", "darkreader": "為所有網頁生成深色主題"
            }
        }
    },
    ja: {
        extensionsModal: {
            title: "ブラウザ拡張機能の検出",
            note_strong: "注意:",
            note_text: "プライバシーとセキュリティの理由から、ブラウザはインストールされている拡張機能の一覧を取得するネイティブAPIを提供していません。このツールはヒューリスティック(注入された変数やDOM要素の検出等)を使用して、一般的な拡張機能を識別します。これはインストールされている全ての拡張機能の完全なリストではありません。",
            no_extensions: "既知の拡張機能は検出されませんでした。",
            detected: "検出済み",
            categories: { Development: "開発", Crypto: "仮想通貨", Shopping: "ショッピング", Productivity: "生産性", Utility: "ユーティリティ" },
            names: {
                "react-devtools": "React DevTools", "vue-devtools": "Vue.js devtools", "redux-devtools": "Redux DevTools",
                "apollo-devtools": "Apollo Client Devtools", "ember-inspector": "Ember Inspector", "metamask": "MetaMask",
                "phantom": "Phantom", "binance": "Binance Wallet", "coinbase": "Coinbase Wallet", "brave-wallet": "Brave Wallet",
                "sui-wallet": "Sui Wallet", "honey": "Honey", "grammarly": "Grammarly", "darkreader": "Dark Reader"
            },
            descs: {
                "react-devtools": "公式 React デバッグ拡張機能", "vue-devtools": "公式 Vue.js デバッグ拡張機能", "redux-devtools": "Redux 状態デバッグ",
                "apollo-devtools": "GraphQL デバッグ機能", "ember-inspector": "Ember デバッグ機能", "metamask": "Web3 Ethereum ウォレット",
                "phantom": "Web3 Solana ウォレット", "binance": "Web3 Binance Chain ウォレット", "coinbase": "Web3 Coinbase ウォレット",
                "brave-wallet": "Brave 内蔵仮想通貨ウォレット", "sui-wallet": "Web3 Sui ウォレット", "honey": "自動クーポン適用ツール",
                "grammarly": "文章作成アシスタント", "darkreader": "ウェブサイトのダークモード"
            }
        }
    },
    ru: {
        extensionsModal: {
            title: "Инвентаризация расширений",
            note_strong: "Примечание:",
            note_text: "По соображениям конфиденциальности браузеры не предоставляют API для просмотра установленных расширений. Этот инструмент использует эвристику (например, обнаружение внедренных переменных или DOM) для поиска популярных расширений. Это не полный список ваших расширений.",
            no_extensions: "Известных расширений не найдено.",
            detected: "Обнаружено",
            categories: { Development: "Разработка", Crypto: "Криптовайты", Shopping: "Покупки", Productivity: "Продуктивность", Utility: "Утилиты" },
            names: {
                "react-devtools": "React DevTools", "vue-devtools": "Vue.js devtools", "redux-devtools": "Redux DevTools",
                "apollo-devtools": "Apollo Client Devtools", "ember-inspector": "Ember Inspector", "metamask": "MetaMask",
                "phantom": "Phantom", "binance": "Binance Wallet", "coinbase": "Coinbase Wallet", "brave-wallet": "Brave Wallet",
                "sui-wallet": "Sui Wallet", "honey": "Honey", "grammarly": "Grammarly", "darkreader": "Dark Reader"
            },
            descs: {
                "react-devtools": "Официальное расширение отладки React", "vue-devtools": "Официальное расширение отладки Vue", "redux-devtools": "Отладка состояния Redux",
                "apollo-devtools": "Отладка GraphQL", "ember-inspector": "Отладка Ember", "metamask": "Web3 кошелек Ethereum",
                "phantom": "Web3 кошелек Solana", "binance": "Web3 кошелек Binance", "coinbase": "Web3 кошелек Coinbase",
                "brave-wallet": "Встроенный кошелек Brave", "sui-wallet": "Web3 кошелек Sui", "honey": "Автоматические купоны",
                "grammarly": "Помощник по написанию текстов", "darkreader": "Темная тема для сайтов"
            }
        }
    },
    en: {
        extensionsModal: {
            title: "Browser Extension Inventory",
            note_strong: "Note:",
            note_text: "Browsers do not provide a native API for web pages to list installed extensions for privacy and security reasons. This inventory uses heuristics (e.g., detecting injected variables or DOM elements) to identify common extensions. It is not a complete list of your installed extensions.",
            no_extensions: "No well-known extensions detected.",
            detected: "Detected",
            categories: {
                Development: "Development", Crypto: "Crypto", Shopping: "Shopping", Productivity: "Productivity", Utility: "Utility"
            },
            names: {
                "react-devtools": "React Developer Tools", "vue-devtools": "Vue.js devtools", "redux-devtools": "Redux DevTools",
                "apollo-devtools": "Apollo Client Devtools", "ember-inspector": "Ember Inspector", "metamask": "MetaMask",
                "phantom": "Phantom", "binance": "Binance Wallet", "coinbase": "Coinbase Wallet", "brave-wallet": "Brave Wallet",
                "sui-wallet": "Sui Wallet", "honey": "Honey", "grammarly": "Grammarly", "darkreader": "Dark Reader"
            },
            descs: {
                "react-devtools": "Official React debugging extension", "vue-devtools": "Official Vue debugging extension", "redux-devtools": "Redux state debugging",
                "apollo-devtools": "GraphQL debugging", "ember-inspector": "Ember debugging", "metamask": "Web3 Ethereum wallet",
                "phantom": "Web3 Solana wallet", "binance": "Web3 Binance Chain wallet", "coinbase": "Web3 Coinbase wallet",
                "brave-wallet": "Built-in Brave crypto wallet", "sui-wallet": "Web3 Sui wallet", "honey": "Automatic Coupons",
                "grammarly": "Writing Assistant", "darkreader": "Dark mode for websites"
            }
        }
    }
};

const newCardPhrases = {
    zhCN: { scan_extensions: "检测扩展" },
    zhTW: { scan_extensions: "檢測擴充功能" },
    zhHK: { scan_extensions: "檢測擴充功能" },
    ja: { scan_extensions: "拡張機能スキャン" },
    ru: { scan_extensions: "Сканировать расширения" },
    en: { scan_extensions: "Scan Extensions" }
};

langs.forEach(lang => {
    const lg = lang.replace('-', '');
    
    // 1. Modals.ts
    const modalFile = path.join(localesDir, lang, 'modals.ts');
    if (fs.existsSync(modalFile)) {
        let content = fs.readFileSync(modalFile, 'utf-8');
        
        if (!content.includes('extensionsModal:')) {
            const m = newModals[lg] || newModals.en;
            // append to the end of modals object
            content = content.replace(/(\n};\n?)$/, ",\n" + JSON.stringify({extensionsModal: m.extensionsModal}, null, 2).slice(2, -2) + "\n};\n");
            fs.writeFileSync(modalFile, content);
        }
    }

    // 2. Add to translations label if possible? We will just use modal localization in the ExtensionsModal file directly since we pass t into it from app if we adjust App.tsx.
    // Let's add sections.extensions for the card.
    const dashboardFile = path.join(localesDir, lang, 'dashboard.ts');
    if (fs.existsSync(dashboardFile)) {
        let content = fs.readFileSync(dashboardFile, 'utf-8');
        
        if (!content.includes('extensions:')) {
            // Find labels
            const b = newCardPhrases[lg] || newCardPhrases.en;
            content = content.replace(/labels: \{/g, `labels: {\n    extensions: "${b.scan_extensions}",`);
            fs.writeFileSync(dashboardFile, content);
        }
    }
});
