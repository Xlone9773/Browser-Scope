const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, 'utils', 'i18n', 'locales');
const langs = ['en', 'zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'];

langs.forEach(lang => {
    const file = path.join(localesDir, lang, 'dashboard.ts');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        
        // Remove everything between `installPrompt:` and `webgpu:` and just leave `installPrompt: "...",` 
        // Then we inject correctly.
        content = content.replace(/installPrompt:\s*".*?",[\s\S]*?webgpu:/g, (match) => {
            const installPromptLine = match.split('\n')[0];
            return installPromptLine + '\n    webgpu:';
        });

        const newFeatures = {
            zhCN: { manifest: 'Web 应用清单', standalone: '独立运行模式', contentIndex: '内容索引 API', protocolHandling: '协议处理 API' },
            zhTW: { manifest: 'Web 應用程式清單', standalone: '獨立執行模式', contentIndex: '內容索引 API', protocolHandling: '協定處理 API' },
            zhHK: { manifest: 'Web 應用程式清單', standalone: '獨立執行模式', contentIndex: '內容索引 API', protocolHandling: '協定處理 API' },
            ja: { manifest: 'Web アプリマニフェスト', standalone: 'スタンドアロンモード', contentIndex: 'コンテンツインデックス API', protocolHandling: 'プロトコルハンドラー' },
            ru: { manifest: 'Web App Manifest', standalone: 'Автономный режим', contentIndex: 'Content Index API', protocolHandling: 'Protocol Handling' },
            en: { manifest: 'Web App Manifest', standalone: 'Standalone Mode', contentIndex: 'Content Index API', protocolHandling: 'Protocol Handling' }
        };

        const newDescs = {
            zhCN: { manifest: '定义 PWA 图标和应用行为', standalone: '作为独立已安装的应用运行', contentIndex: '让浏览器能够列出离线缓存的内容', protocolHandling: '注册自定义 URL 协议 (如 mailto: 等)' },
            zhTW: { manifest: '定義 PWA 圖示和應用程式行為', standalone: '作為獨立已安裝的應用程式執行', contentIndex: '讓瀏覽器能夠列出離線快取的內容', protocolHandling: '註冊自訂 URL 協定 (如 mailto: 等)' },
            zhHK: { manifest: '定義 PWA 圖示和應用程式行為', standalone: '作為獨立已安裝的應用程式執行', contentIndex: '讓瀏覽器能夠列出離線快取的內容', protocolHandling: '註冊自訂 URL 協定 (如 mailto: 等)' },
            ja: { manifest: 'PWA のブランディングと動作を定義', standalone: 'インストール済みアプリとして実行', contentIndex: 'Web ブラウザーの一覧にオフラインコンテンツをインデックス化', protocolHandling: 'カスタム URL スキームを登録' },
            ru: { manifest: 'Определяет брендинг и поведение PWA', standalone: 'Работа в режиме установленного приложения', contentIndex: 'Индексирование оффлайн-контента для обозревателя', protocolHandling: 'Регистрация пользовательских URL-схем' },
            en: { manifest: 'Defines PWA branding and behavior', standalone: 'Running as installed app', contentIndex: 'Index offline content for browser list', protocolHandling: 'Register custom URL schemes' }
        };

        const f = newFeatures[lang.replace('-', '')] || newFeatures.en || newFeatures[lang] || (lang === 'zh-CN' ? newFeatures.zhCN : lang === 'zh-TW' ? newFeatures.zhTW : lang === 'zh-HK' ? newFeatures.zhHK : newFeatures.en);
        const d = newDescs[lang.replace('-', '')] || newDescs.en || newDescs[lang] || (lang === 'zh-CN' ? newDescs.zhCN : lang === 'zh-TW' ? newDescs.zhTW : lang === 'zh-HK' ? newDescs.zhHK : newDescs.en);

        let injectFeat = `\n    manifest: "${f.manifest}",\n    standalone: "${f.standalone}",\n    contentIndex: "${f.contentIndex}",\n    protocolHandling: "${f.protocolHandling}",`;
        let injectDesc = `\n    manifest: "${d.manifest}",\n    standalone: "${d.standalone}",\n    contentIndex: "${d.contentIndex}",\n    protocolHandling: "${d.protocolHandling}",`;

        // The replace will match twice (one for feature, one for desc).
        // Since we removed the mess, installPrompt matches exactly the normal format.
        let matchCount = 0;
        content = content.replace(/installPrompt:\s*".*?",/g, (match) => {
            matchCount++;
            if (matchCount === 1) {
                return match + injectFeat;
            } else {
                return match + injectDesc;
            }
        });

        fs.writeFileSync(file, content);
    }
});
