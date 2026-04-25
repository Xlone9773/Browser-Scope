const fs = require('fs');
const path = require('path');

const newFeatures = [
    { key: 'manifest', en: 'Web App Manifest', descEn: 'Defines PWA branding and behavior', zhCN: 'Web 应用清单', descZhCN: '定义 PWA 图标和应用行为', zhTW: 'Web 應用程式清單', descZhTW: '定義 PWA 圖示和應用程式行為', zhHK: 'Web 應用程式清單', descZhHK: '定義 PWA 圖示和應用程式行為', ja: 'Web アプリマニフェスト', descJa: 'PWA のブランディングと動作を定義', ru: 'Web App Manifest', descRu: 'Определяет брендинг и поведение PWA' },
    { key: 'standalone', en: 'Standalone Mode', descEn: 'Running as installed app', zhCN: '独立运行模式', descZhCN: '作为独立已安装的应用运行', zhTW: '獨立執行模式', descZhTW: '作為獨立已安裝的應用程式執行', zhHK: '獨立執行模式', descZhHK: '作為獨立已安裝的應用程式執行', ja: 'スタンドアロンモード', descJa: 'インストール済みアプリとして実行', ru: 'Автономный режим', descRu: 'Работа в режиме установленного приложения' },
    { key: 'contentIndex', en: 'Content Index API', descEn: 'Index offline content for browser list', zhCN: '内容索引 API', descZhCN: '让浏览器能够列出离线缓存的内容', zhTW: '內容索引 API', descZhTW: '讓瀏覽器能夠列出離線快取的內容', zhHK: '內容索引 API', descZhHK: '讓瀏覽器能夠列出離線快取的內容', ja: 'コンテンツインデックス API', descJa: 'Web ブラウザーの一覧にオフラインコンテンツをインデックス化', ru: 'Content Index API', descRu: 'Индексирование оффлайн-контента для обозревателя' },
    { key: 'protocolHandling', en: 'Protocol Handling', descEn: 'Register custom URL schemes', zhCN: '协议处理 API', descZhCN: '注册自定义 URL 协议 (如 mailto: 等)', zhTW: '協定處理 API', descZhTW: '註冊自訂 URL 協定 (如 mailto: 等)', zhHK: '協定處理 API', descZhHK: '註冊自訂 URL 協定 (如 mailto: 等)', ja: 'プロトコルハンドラー', descJa: 'カスタム URL スキームを登録', ru: 'Protocol Handling', descRu: 'Регистрация пользовательских URL-схем' }
];

const localesDir = path.join(__dirname, 'utils', 'i18n', 'locales');
const langs = ['en', 'zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'];

langs.forEach(lang => {
    const file = path.join(localesDir, lang, 'dashboard.ts');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        
        let newFeaturesStr = "";
        let newFeatureDescsStr = "";
        
        newFeatures.forEach(feat => {
            const val = lang === 'zh-CN' ? feat.zhCN : 
                        lang === 'zh-TW' ? feat.zhTW : 
                        lang === 'zh-HK' ? feat.zhHK : 
                        lang === 'ja' ? feat.ja : 
                        lang === 'ru' ? feat.ru : feat.en;
            newFeaturesStr += `\n    ${feat.key}: "${val}",`;
        });
        
        newFeatures.forEach(feat => {
            const descVal = lang === 'zh-CN' ? feat.descZhCN : 
                            lang === 'zh-TW' ? feat.descZhTW : 
                            lang === 'zh-HK' ? feat.descZhHK : 
                            lang === 'ja' ? feat.descJa : 
                            lang === 'ru' ? feat.descRu : feat.descEn;
            newFeatureDescsStr += `\n    ${feat.key}: "${descVal}",`;
        });
        
        // Inject features (before installPrompt or computePressure, just pick one to insert after)
        content = content.replace(/installPrompt: "(.*?)"(,?)/, `installPrompt: "$1"$2,${newFeaturesStr.slice(0, -1)}`);
        
        // Inject featureDescs
        content = content.replace(/installPrompt: "(.*?)"(,?)/g, (match, p1, p2, offset, string) => {
            // we only want to replace the SECOND match which is in featureDescs, but maybe it replaced both or just one?
            // Safer way:
            return match; 
        });

        const lines = content.split('\n');
        const installPromptIndices = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('installPrompt:')) {
                installPromptIndices.push(i);
            }
        }
        
        if (installPromptIndices.length === 2) {
            lines.splice(installPromptIndices[1] + 1, 0, newFeatureDescsStr.substring(1));
            lines.splice(installPromptIndices[0] + 1, 0, newFeaturesStr.substring(1));
            // Add comma to installPrompt line if missing
            if (!lines[installPromptIndices[0]].trim().endsWith(',')) {
                lines[installPromptIndices[0]] += ',';
            }
            if (!lines[installPromptIndices[1] + 1].trim().endsWith(',')) { // the second one shifted down by previous insertion
                lines[installPromptIndices[1] + 1] += ',';
            }
        }

        fs.writeFileSync(file, lines.join('\n'));
    }
});
