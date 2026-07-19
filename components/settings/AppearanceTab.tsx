import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, Type } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select, SelectColor } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Translation } from '../../utils/i18n/types';
import { FONTS_LIST, isFontCompatibleWithLang } from '../../utils/fonts';
import { useToast } from '../../hooks/useToast';
import { Language } from '../../utils/i18n/types';

const LOCAL_I18N = {
  en: {
    fontSettings: "Font Customization",
    fontSettingsDesc: "Customize UI typography for body content and dialog modal titles.",
    bodyFont: "Body Font",
    bodyFontDesc: "Change the font family of body texts, lists, and diagnostic reports.",
    modalTitleFont: "Modal Title Font",
    modalTitleFontDesc: "Change the font family of headers, settings modal, and dialogs.",
    defaultFont: "System Default (Inter)",
    mismatchError: "The selected font does not support your current display language ({lang}). Select blocked.",
    mismatchTitle: "Font Language Blocked",
  },
  'zh-CN': {
    fontSettings: "界面字体定制",
    fontSettingsDesc: "为正文文本和弹窗标题定制个性化的界面排版字体。",
    bodyFont: "正文字体",
    bodyFontDesc: "改变所有数据、表格、说明文本与诊断报告的正文字体。",
    modalTitleFont: "弹窗标题字体",
    modalTitleFontDesc: "改变所有弹出窗口、对话框和设置标题的字体样式。",
    defaultFont: "系统默认 (Inter)",
    mismatchError: "所选字体不支持当前界面语言（{lang}），已自动为您拦截。请先在「存储管理」中下载该字体或切换界面语言！",
    mismatchTitle: "字体语言不兼容",
  },
  'zh-TW': {
    fontSettings: "介面字體定制",
    fontSettingsDesc: "為正文文本和彈窗標題定制個性化的介面排版字體。",
    bodyFont: "正文字體",
    bodyFontDesc: "改變所有數據、表格、說明文本與診斷報告的正文字體。",
    modalTitleFont: "彈窗標題字體",
    modalTitleFontDesc: "改變所有彈出窗口、對話框和設定標題的字體樣式。",
    defaultFont: "系統預設 (Inter)",
    mismatchError: "所選字體不支援目前介面語言（{lang}），已自動為您攔截。請先在「儲存管理」中下載該字體或切換介面語言！",
    mismatchTitle: "字體語言不兼容",
  },
  'zh-HK': {
    fontSettings: "介面字體定制",
    fontSettingsDesc: "為正文文本和彈窗標題定制個性化的介面排版字體。",
    bodyFont: "正文字體",
    bodyFontDesc: "改變所有數據、表格、說明文本與診斷報告的正文字體。",
    modalTitleFont: "彈窗標題字體",
    modalTitleFontDesc: "改變所有彈出窗口、對話框和設定標題的字體樣式。",
    defaultFont: "系統預設 (Inter)",
    mismatchError: "所選字體不支援目前介面語言（{lang}），已自動為您攔截。請先在「儲存管理」中下載該字體或切換介面語言！",
    mismatchTitle: "字體語言不兼容",
  },
  ja: {
    fontSettings: "フォントのカスタマイズ",
    fontSettingsDesc: "本文のテキストとダイアログのタイトルフォントを個別にカスタマイズします。",
    bodyFont: "本文フォント",
    bodyFontDesc: "レポート、リスト、および各種診断詳細テキストのフォントを変更します。",
    modalTitleFont: "モーダルタイトルフォント",
    modalTitleFontDesc: "すべての設定ダイアログ、モーダルのヘッダータイトルフォントを変更します。",
    defaultFont: "システムデフォルト (Inter)",
    mismatchError: "選択したフォントは現在の言語（{lang}）をサポートしていないため、切り替えがブロックされました。使用するには、事前に「ストレージ管理」でダウンロードするか、言語を変更してください。",
    mismatchTitle: "不適合なフォント言語",
  },
  ru: {
    fontSettings: "Настройка шрифтов",
    fontSettingsDesc: "Настройте шрифты для основного содержимого и заголовков модальных окон.",
    bodyFont: "Шрифт основного текста",
    bodyFontDesc: "Изменяет шрифт для текста отчетов, таблиц и основного интерфейса.",
    modalTitleFont: "Шрифт заголовка модального окна",
    modalTitleFontDesc: "Изменяет шрифт для всех диалогов и заголовков модальных окон.",
    defaultFont: "Системный по умолчанию (Inter)",
    mismatchError: "Выбранный шрифт не поддерживает ваш текущий язык интерфейса ({lang}). Смена заблокирована.",
    mismatchTitle: "Шрифт не поддерживает язык",
  }
};

// Custom Premium Restore Button Component
interface CustomRestoreButtonProps {
    onClick: () => void;
    disabled: boolean;
    activeText: string;
    inactiveText: string;
}

const CustomRestoreButton: React.FC<CustomRestoreButtonProps> = ({ onClick, disabled, activeText, inactiveText }) => {
    return (
        <Button
            variant={disabled ? "secondary" : "soft"}
            onClick={onClick}
            disabled={disabled}
            size="md"
            leftIcon={disabled ? <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> : <RotateCcw className="w-4.5 h-4.5 shrink-0 transition-transform duration-500 group-hover:rotate-180" />}
            className="min-w-[140px] font-semibold rounded-xl group select-none active:scale-[0.97] transition-all"
        >
            <span className="truncate">{disabled ? activeText : inactiveText}</span>
        </Button>
    );
};

interface AppearanceTabProps {
    t: Translation['settings']['general'];
    themeColor: SelectColor;
    setThemeColor: (color: string) => void;
    animationStyle: string;
    setAnimationStyle: (style: string) => void;
    simpleMode: boolean;
    toggleSimpleMode: (value: boolean) => void;
    hideScrollbar: boolean;
    toggleHideScrollbar: (value: boolean) => void;
    globalHideScrollbar: boolean;
    toggleGlobalHideScrollbar: (value: boolean) => void;
    disableBlur: boolean;
    toggleDisableBlur: (value: boolean) => void;
    disableAnimations: boolean;
    toggleDisableAnimations: (value: boolean) => void;
    fastAnimations: boolean;
    toggleFastAnimations: (value: boolean) => void;
    collapseHeader: boolean;
    toggleCollapseHeader: (value: boolean) => void;
    showTabs: boolean;
    toggleShowTabs: (value: boolean) => void;
    showSearch: boolean;
    toggleShowSearch: (value: boolean) => void;
    translationDict: Translation;
    hiddenCards: string[];
    setHiddenCards: (cards: string[]) => void;
    restoreAllNotifications: () => void;
    dismissedNotificationsCount: number;
    showQuickSummary: boolean;
    toggleShowQuickSummary: (val: boolean) => void;
    bodyFont: string;
    updateBodyFont: (font: string) => void;
    modalTitleFont: string;
    updateModalTitleFont: (font: string) => void;
    lang: string;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ 
    t, 
    themeColor,
    setThemeColor,
    animationStyle,
    setAnimationStyle,
    simpleMode, 
    toggleSimpleMode, 
    hideScrollbar, 
    toggleHideScrollbar,
    globalHideScrollbar,
    toggleGlobalHideScrollbar,
    disableBlur,
    toggleDisableBlur,
    disableAnimations,
    toggleDisableAnimations,
    fastAnimations,
    toggleFastAnimations,
    collapseHeader,
    toggleCollapseHeader,
    showTabs,
    toggleShowTabs,
    showSearch,
    toggleShowSearch,
    translationDict,
    hiddenCards,
    setHiddenCards,
    restoreAllNotifications,
    dismissedNotificationsCount,
    showQuickSummary,
    toggleShowQuickSummary,
    bodyFont,
    updateBodyFont,
    modalTitleFont,
    updateModalTitleFont,
    lang
}) => {
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const localT = LOCAL_I18N[lang as keyof typeof LOCAL_I18N] || LOCAL_I18N.en;
    const toast = useToast();

    const bodyFontOptions = [
        { id: 'default', label: localT.defaultFont },
        ...FONTS_LIST
            .filter(f => isFontCompatibleWithLang(f.key, lang as Language))
            .map(f => ({
                id: f.key,
                label: f.name
            }))
    ];

    const modalTitleFontOptions = [
        { id: 'default', label: localT.defaultFont },
        ...FONTS_LIST
            .filter(f => isFontCompatibleWithLang(f.key, lang as Language))
            .map(f => ({
                id: f.key,
                label: f.name
            }))
    ];

    const handleFontChange = (fontKey: string, type: 'body' | 'modal') => {
        if (fontKey !== 'default' && !isFontCompatibleWithLang(fontKey, lang as Language)) {
            toast.error(
                localT.mismatchError.replace('{lang}', lang),
                localT.mismatchTitle,
                5000
            );
            return;
        }

        if (type === 'body') {
            updateBodyFont(fontKey);
        } else {
            updateModalTitleFont(fontKey);
        }
    };

    const sectionsObj = translationDict?.sections || {};
    const availableCards = [
        { id: 'environment', name: sectionsObj.environment },
        { id: 'system', name: sectionsObj.system },
        { id: 'hardware', name: sectionsObj.hardware },
        { id: 'display', name: sectionsObj.display },
        { id: 'network', name: sectionsObj.network },
        { id: 'security', name: sectionsObj.security },
        { id: 'fingerprint', name: sectionsObj.fingerprints },
        { id: 'ai', name: sectionsObj.ai_compute },
        { id: 'location', name: sectionsObj.location },
        { id: 'storage', name: sectionsObj.storage },
        { id: 'permissions', name: sectionsObj.permissions },
        { id: 'media_devices', name: sectionsObj.media_devices },
        { id: 'media_capabilities', name: sectionsObj.media_caps },
        { id: 'user_agent', name: sectionsObj.user_agent },
        { id: 'pwa', name: sectionsObj.pwa },
        { id: 'features', name: sectionsObj.features },
    ];

    const toggleCardHide = (id: string) => {
        if (hiddenCards.includes(id)) {
            setHiddenCards(hiddenCards.filter(c => c !== id));
        } else {
            setHiddenCards([...hiddenCards, id]);
        }
    };

    const dictSettings = translationDict?.settings?.general || {};

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Simple Mode Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleSimpleMode(!simpleMode)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.simpleMode?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.simpleMode?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={simpleMode} onChange={toggleSimpleMode} />
                </div>
            </div>
            {/* Show Tabs Option (NEW) */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleShowTabs(!showTabs)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.showTabs?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.showTabs?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={showTabs} onChange={toggleShowTabs} />
                </div>
            </div>
            {/* Show Search Bar Option */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleShowSearch(!showSearch)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.showSearch?.title || "Enable Search Bar"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.showSearch?.desc || "Display a search bar above the tab bar to quickly filter dashboard categories and card content."}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={showSearch} onChange={toggleShowSearch} />
                </div>
            </div>
            {/* Theme Color Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {translationDict.settings?.general?.themeColor?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {translationDict.settings?.general?.themeColor?.desc}
                    </p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg self-stretch sm:self-auto flex-wrap gap-1">
                    {[
                        { id: 'indigo', hex: '#6366f1' },
                        { id: 'emerald', hex: '#10b981' },
                        { id: 'rose', hex: '#f43f5e' },
                        { id: 'amber', hex: '#f59e0b' },
                        { id: 'blue', hex: '#3b82f6' },
                        { id: 'violet', hex: '#8b5cf6' },
                        { id: 'sky', hex: '#77bbee' },
                        { id: 'ice', hex: '#a7c8ff' },
                        { id: 'cherry', hex: '#efa7a8' }
                    ].map(theme => (
                        <button
                            key={theme.id}
                            onClick={() => setThemeColor(theme.id)}
                            className={`w-8 h-8 rounded-md transition-all flex items-center justify-center ${themeColor === theme.id ? 'ring-2 ring-slate-800 dark:ring-white scale-110 shadow-sm' : 'hover:scale-105'}`}
                            style={{ backgroundColor: theme.hex }}
                            title={theme.id}
                        >
                            {themeColor === theme.id ? <div className="w-2 h-2 rounded-full bg-white dark:bg-slate-900" /> : null}
                        </button>
                    ))}
                </div>
            </div>
            {/* Animation Style Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {translationDict.settings?.general?.animationStyle?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {translationDict.settings?.general?.animationStyle?.desc}
                    </p>
                </div>
                <Select 
                    value={animationStyle}
                    onChange={(val) => setAnimationStyle(val as string)}
                    options={[
                        { id: 'slide-up', label: translationDict.settings?.general?.animationStyle?.options?.slideUp },
                        { id: 'fade', label: translationDict.settings?.general?.animationStyle?.options?.fade },
                        { id: 'fly-in', label: translationDict.settings?.general?.animationStyle?.options?.flyIn },
                        { id: 'zoom', label: translationDict.settings?.general?.animationStyle?.options?.zoom }
                    ]}
                    className="w-full sm:w-48"
                    color={themeColor}
                />
            </div>

            {/* Font Customization Panel */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Type size={18} className="text-indigo-500" />
                        {localT.fontSettings}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {localT.fontSettingsDesc}
                    </p>
                </div>
                
                <div className="space-y-4">
                    {/* Body Font Select */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 max-w-md">
                            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {localT.bodyFont}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {localT.bodyFontDesc}
                            </p>
                        </div>
                        <Select 
                            value={bodyFont}
                            onChange={(val) => handleFontChange(val as string, 'body')}
                            options={bodyFontOptions}
                            className="w-full sm:w-48"
                            color={themeColor}
                        />
                    </div>

                    {/* Modal Title Font Select */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 max-w-md">
                            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {localT.modalTitleFont}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {localT.modalTitleFontDesc}
                            </p>
                        </div>
                        <Select 
                            value={modalTitleFont}
                            onChange={(val) => handleFontChange(val as string, 'modal')}
                            options={modalTitleFontOptions}
                            className="w-full sm:w-48"
                            color={themeColor}
                        />
                    </div>
                </div>
            </div>
            {/* Disable Blur */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableBlur(!disableBlur)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.performance?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.performance?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={disableBlur} onChange={toggleDisableBlur} />
                </div>
            </div>
            {/* Hide Scrollbar Toggle */}
            <div 
                className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${globalHideScrollbar ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                onClick={() => { if (!globalHideScrollbar) toggleHideScrollbar(!hideScrollbar); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.scrollbar?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.scrollbar?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={hideScrollbar || globalHideScrollbar} onChange={(val) => { if (!globalHideScrollbar) toggleHideScrollbar(val); }} disabled={globalHideScrollbar} />
                </div>
            </div>
            {/* Global Hide Scrollbar Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleGlobalHideScrollbar(!globalHideScrollbar)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.globalScrollbar?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.globalScrollbar?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={globalHideScrollbar} onChange={toggleGlobalHideScrollbar} />
                </div>
            </div>
            {/* Disable Animations */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableAnimations(!disableAnimations)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.animations?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.animations?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={disableAnimations} onChange={toggleDisableAnimations} />
                </div>
            </div>
            {/* Fast Animations */}
            <div 
                className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${disableAnimations ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                onClick={() => { if (!disableAnimations) toggleFastAnimations(!fastAnimations); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.fastAnimations?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.fastAnimations?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={fastAnimations} onChange={toggleFastAnimations} disabled={disableAnimations} />
                </div>
            </div>
            {/* Collapse Header Menu Desktop */}
            <div 
                className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${!isDesktop ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                onClick={() => { if (isDesktop) toggleCollapseHeader(!collapseHeader); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.collapseHeader?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.collapseHeader?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={collapseHeader} onChange={toggleCollapseHeader} disabled={!isDesktop} />
                </div>
            </div>

            {/* Custom Visibility */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {dictSettings.cardVisibility?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {dictSettings.cardVisibility?.desc}
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableCards.map(card => {
                        const isHidden = hiddenCards.includes(card.id);
                        return (
                            <button
                                key={card.id}
                                onClick={() => toggleCardHide(card.id)}
                                className={`
                                    flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors border text-left
                                    ${isHidden 
                                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 line-through' 
                                        : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'}
                                `}
                            >
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isHidden ? 'bg-slate-300 dark:bg-slate-600' : 'bg-indigo-500'}`} />
                                <span className="truncate">{card.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Summary Visibility */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1 max-w-[70%]">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {dictSettings.quickSummaryVisibility?.title || "Quick Summary"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {dictSettings.quickSummaryVisibility?.desc || "Bring back the quick summary widget at the top of the main dashboard."}
                    </p>
                </div>
                <div>
                    <CustomRestoreButton 
                        onClick={() => toggleShowQuickSummary(true)}
                        disabled={showQuickSummary}
                        activeText={dictSettings.quickSummaryVisibility?.activeState || "Showing"}
                        inactiveText={dictSettings.quickSummaryVisibility?.restoreBtn || "Restore Display"}
                    />
                </div>
            </div>

            {/* Restore Notifications */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1 max-w-[70%]">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {dictSettings.restoreNotifications?.title || "Restore Notifications"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {dictSettings.restoreNotifications?.desc || "Bring back all previously dismissed notification cards."}
                    </p>
                </div>
                <div>
                    <CustomRestoreButton 
                        onClick={restoreAllNotifications}
                        disabled={dismissedNotificationsCount === 0}
                        activeText={dictSettings.restoreNotifications?.empty || "No dismissed notifications"}
                        inactiveText={dictSettings.restoreNotifications?.button || "Restore All"}
                    />
                </div>
            </div>
        </div>
    );
};
