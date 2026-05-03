import fs from "fs";
import path from "path";

const updates = {
  "en": {
    oldStr: `scrollbar: {
            title: "Hide Scrollbar",
            desc: "Force hide the system's default scrollbar styles."
        },`,
    newStr: `scrollbar: {
            title: "Hide Main Page Scrollbar",
            desc: "Only hide the default scrollbar on the main page."
        },
        globalScrollbar: {
            title: "Hide All Scrollbars",
            desc: "Globally hide scrollbars for all elements, including inside modals."
        },`
  },
  "zh-CN": {
    oldStr: `scrollbar: {
            title: "隐藏系统滚动条",
            desc: "强制隐藏浏览器默认的滚动条样式。"
        },`,
    newStr: `scrollbar: {
            title: "隐藏主页滚动条",
            desc: "仅隐藏主页面上的默认滚动条样式。"
        },
        globalScrollbar: {
            title: "全局隐藏滚动条",
            desc: "禁止并隐藏页面中所有元素的滚动条（包括弹窗内）。"
        },`
  },
  "zh-TW": {
    oldStr: `scrollbar: {
            title: "隱藏系統滾動條",
            desc: "強制隱藏瀏覽器預設的滾動條樣式。"
        },`,
    newStr: `scrollbar: {
            title: "隱藏主頁捲動條",
            desc: "僅隱藏主頁面上的預設捲動條樣式。"
        },
        globalScrollbar: {
            title: "全局隱藏捲動條",
            desc: "禁止並隱藏頁面中所有元素的捲動條（包括對話方塊內）。"
        },`
  },
  "zh-HK": {
    oldStr: `scrollbar: {
            title: "隱藏系統滾動條",
            desc: "強制隱藏瀏覽器預設的滾動條樣式。"
        },`,
    newStr: `scrollbar: {
            title: "隱藏主頁捲動條",
            desc: "僅隱藏主頁面上的預設捲動條樣式。"
        },
        globalScrollbar: {
            title: "全局隱藏捲動條",
            desc: "禁止並隱藏頁面中所有元素的捲動條（包括對話方塊內）。"
        },`
  },
  "ja": {
    oldStr: `scrollbar: {
            title: "システムスクロールバーを非表示",
            desc: "ブラウザのデフォルトのスクロールバースタイルを強制的に非表示にします。"
        },`,
    newStr: `scrollbar: {
            title: "メインページのスクロールバーを非表示",
            desc: "メインページのデフォルトのスクロールバーのみを非表示にします。"
        },
        globalScrollbar: {
            title: "すべてのスクロールバーを非表示",
            desc: "モーダル内を含む、すべての要素のスクロールバーを非表示にします。"
        },`
  },
  "ru": {
    oldStr: `scrollbar: {
            title: "Скрыть полосу прокрутки",
            desc: "Принудительно скрыть стандартный стиль полосы прокрутки."
        },`,
    newStr: `scrollbar: {
            title: "Скрыть полосу прокрутки (Главная)",
            desc: "Скрывает полосу прокрутки только на главной странице."
        },
        globalScrollbar: {
            title: "Скрыть все полосы прокрутки",
            desc: "Глобально скрывает все полосы прокрутки, включая модальные окна."
        },`
  }
};

for (const [lang, {oldStr, newStr}] of Object.entries(updates)) {
  const file = path.join("utils", "i18n", "locales", lang, "settings.ts");
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    if (content.indexOf("globalScrollbar") === -1) {
      const regex = /scrollbar:\s*\{\s*title:\s*"[^"]*",\s*desc:\s*"[^"]*"\s*\}(\s*,)?/;
      if (regex.test(content)) {
        content = content.replace(regex, newStr);
      } else {
        console.warn("Could not find pattern in", lang);
      }
      fs.writeFileSync(file, content);
      console.log("Updated", lang);
    } else {
      console.log("Already updated", lang);
    }
  }
}
