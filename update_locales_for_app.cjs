const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'utils', 'i18n', 'locales');
const locales = fs.readdirSync(localesDir);

const newTranslations = {
  'en': {
    performanceTitle: "Disable Blur",
    performanceDesc: "Disable blur effects and transparency to improve UI fluidity.",
    fastAnimationsTitle: "Fast Animations",
    fastAnimationsDesc: "Speed up all loading and transition animations.",
    collapseHeaderTitle: "Collapse Header",
    collapseHeaderDesc: "Use a collapsed menu for header actions (Desktop)."
  },
  'zh-CN': {
    performanceTitle: "禁用模糊",
    performanceDesc: "禁用模糊特效与透明度以提升界面流畅度（减少 GPU 消耗）。",
    fastAnimationsTitle: "加快动画",
    fastAnimationsDesc: "加快页面所有的加载内容和交互动画的播放速度。",
    collapseHeaderTitle: "收纳栏目",
    collapseHeaderDesc: "在电脑端隐藏顶部导航条上比较生僻的各类功能按键。"
  },
  'zh-TW': {
    performanceTitle: "停用模糊",
    performanceDesc: "停用模糊特效與透明度以提升介面流暢度（減少 GPU 消耗）。",
    fastAnimationsTitle: "加快動畫",
    fastAnimationsDesc: "加快頁面所有的加載內容和互動動畫的播放速度。",
    collapseHeaderTitle: "收納欄目",
    collapseHeaderDesc: "在電腦端隱藏頂部導航條上比較生僻的各類功能按鍵。"
  },
  'zh-HK': {
    performanceTitle: "停用模糊",
    performanceDesc: "停用模糊特效與透明度以提升介面流暢度（減少 GPU 消耗）。",
    fastAnimationsTitle: "加快動畫",
    fastAnimationsDesc: "加快頁面所有的加載內容和互動動畫的播放速度。",
    collapseHeaderTitle: "收納欄目",
    collapseHeaderDesc: "在電腦端隱藏頂部導航條上比較生僻的各類功能按鍵。"
  },
  'ja': {
    performanceTitle: "ブラーを無効化",
    performanceDesc: "ブラー効果と透明度を無効にし、UIの滑らかさを向上させます。",
    fastAnimationsTitle: "高速アニメーション",
    fastAnimationsDesc: "すべての読み込みと遷移アニメーションを高速化します。",
    collapseHeaderTitle: "ヘッダーの折りたたみ",
    collapseHeaderDesc: "デスクトップ画面のヘッダーアクションをメニューに折りたたみます。"
  },
  'ru': {
    performanceTitle: "Отключить размытие",
    performanceDesc: "Отключает эффекты размытия и прозрачности для повышения плавности UI.",
    fastAnimationsTitle: "Быстрые анимации",
    fastAnimationsDesc: "Ускорение всех анимаций загрузки и переходов.",
    collapseHeaderTitle: "Свернуть заголовок",
    collapseHeaderDesc: "Использовать свернутое меню для действий в заголовке на ПК."
  }
};

for (const loc of locales) {
  const file = path.join(localesDir, loc, 'settings.ts');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    const tr = newTranslations[loc] || newTranslations['en'];
    
    // Update performance
    content = content.replace(/performance:\s*\{[\s\S]*?\},/, `performance: {\n            title: "${tr.performanceTitle}",\n            desc: "${tr.performanceDesc}"\n        },`);
        
    // Insert fastAnimations & collapseHeader before cardVisibility
    if (!content.includes('fastAnimations')) {
      content = content.replace(/cardVisibility:\s*\{/, `fastAnimations: {\n            title: "${tr.fastAnimationsTitle}",\n            desc: "${tr.fastAnimationsDesc}"\n        },\n        collapseHeader: {\n            title: "${tr.collapseHeaderTitle}",\n            desc: "${tr.collapseHeaderDesc}"\n        },\n        cardVisibility: {`);
    }

    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${loc}/settings.ts`);
  }
}
