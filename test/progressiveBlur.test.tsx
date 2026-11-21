import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressiveBlur } from '../components/ui/ProgressiveBlur';
import { ToastProvider } from '../components/ui/Toast';
import { SettingsModal } from '../components/SettingsModal';
import { AboutModal } from '../components/AboutModal';
import { SearchBarAndTabs } from '../components/layout/SearchBarAndTabs';
import { en } from '../utils/i18n/en';
import {
  buildProgressiveBlurCssVars,
  resolveProgressiveBlurState,
  supportsProgressiveBlur,
} from '../utils/progressiveBlur';

describe('ProgressiveBlur capability, state matrix, Settings mobile & SearchBarAndTabs', () => {
  const originalCss = globalThis.CSS;
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  afterEach(() => {
    vi.restoreAllMocks();
    Element.prototype.scrollIntoView = originalScrollIntoView;
    if (originalCss === undefined) {
      delete (globalThis as { CSS?: typeof CSS }).CSS;
    } else {
      Object.defineProperty(globalThis, 'CSS', {
        value: originalCss,
        configurable: true,
        writable: true,
      });
    }
  });

  it('detects progressive blur support only when both backdrop-filter and mask-image are supported', () => {
    expect(supportsProgressiveBlur(null)).toBe(false);

    expect(
      supportsProgressiveBlur((prop) => prop === 'backdrop-filter' || prop === 'mask-image'),
    ).toBe(true);

    expect(
      supportsProgressiveBlur(
        (prop) => prop === '-webkit-backdrop-filter' || prop === '-webkit-mask-image',
      ),
    ).toBe(true);

    expect(supportsProgressiveBlur((prop) => prop === 'backdrop-filter')).toBe(false);
    expect(supportsProgressiveBlur((prop) => prop === 'mask-image')).toBe(false);
  });

  it('enforces fallback and grayed-out toggle states for unsupported browsers and global disableBlur', () => {
    expect(
      resolveProgressiveBlurState({
        isSupported: false,
        disableBlur: false,
        enableProgressiveBlur: true,
      }),
    ).toEqual({
      isSupported: false,
      isBlockedByDisableBlur: false,
      isToggleDisabled: true,
      isSwitchChecked: false,
      isEffectActive: false,
    });

    expect(
      resolveProgressiveBlurState({
        isSupported: true,
        disableBlur: true,
        enableProgressiveBlur: true,
      }),
    ).toEqual({
      isSupported: true,
      isBlockedByDisableBlur: true,
      isToggleDisabled: true,
      isSwitchChecked: false,
      isEffectActive: false,
    });

    expect(
      resolveProgressiveBlurState({
        isSupported: true,
        disableBlur: false,
        enableProgressiveBlur: true,
      }),
    ).toEqual({
      isSupported: true,
      isBlockedByDisableBlur: false,
      isToggleDisabled: false,
      isSwitchChecked: true,
      isEffectActive: true,
    });

    expect(
      resolveProgressiveBlurState({
        isSupported: true,
        disableBlur: false,
        enableProgressiveBlur: false,
      }),
    ).toEqual({
      isSupported: true,
      isBlockedByDisableBlur: false,
      isToggleDisabled: false,
      isSwitchChecked: false,
      isEffectActive: false,
    });
  });

  it('builds clamped CSS variables with staggered feather stops strictly inside bounds', () => {
    const vars = buildProgressiveBlurCssVars({
      direction: 'to bottom',
      baseBlur: -4,
      maxBlur: 14,
      maskStart: '46%',
      maskEnd: '98%',
      overlayAlpha: 1.5,
    });
    expect(vars['--pb-base-blur']).toBe('0px');
    expect(vars['--pb-mid-blur']).toBe('5px');
    expect(vars['--pb-max-blur']).toBe('14px');
    expect(vars['--pb-mask-start']).toBe('46%');
    expect(vars['--pb-mask-end']).toBe('98%');
    expect(vars['--pb-overlay-alpha']).toBe('1');
    expect(parseFloat(vars['--pb-peak-end'])).toBeLessThan(98);
  });

  it('renders staggered feathered + peak + scrim layers when active, and opaque fallback when disabled or unsupported', () => {
    Object.defineProperty(globalThis, 'CSS', {
      value: { supports: () => true },
      configurable: true,
      writable: true,
    });

    const { container, rerender } = render(
      <ProgressiveBlur enabled={true} disabled={false} baseBlur={0} maxBlur={14} />,
    );

    expect(container.querySelector('[data-progressive-blur="active"]')).not.toBeNull();
    expect(container.querySelector('.progressive-blur-base')).toBeNull();
    expect(container.querySelector('.progressive-blur-feather')).not.toBeNull();
    expect(container.querySelector('.progressive-blur-layer')).not.toBeNull();
    expect(container.querySelector('.progressive-blur-scrim')).not.toBeNull();

    rerender(<ProgressiveBlur enabled={true} disabled={true} baseBlur={2} maxBlur={14} />);
    expect(container.querySelector('[data-progressive-blur="active"]')).toBeNull();
    expect(container.querySelector('[data-progressive-blur="fallback"]')).not.toBeNull();

    rerender(<ProgressiveBlur enabled={false} disabled={false} />);
    expect(container.querySelector('[data-progressive-blur="fallback"]')).not.toBeNull();
  });

  it('AppearanceTab gray-locks Progressive Blur switch when unsupported and follows disableBlur', async () => {
    const { AppearanceTab } = await import('../components/settings/AppearanceTab');
    const togglePB = vi.fn();

    Object.defineProperty(globalThis, 'CSS', {
      value: { supports: () => false },
      configurable: true,
      writable: true,
    });

    const baseProps = {
      t: en.settings.general,
      themeColor: 'indigo' as const,
      setThemeColor: vi.fn(),
      animationStyle: 'slide-up',
      setAnimationStyle: vi.fn(),
      simpleMode: false,
      toggleSimpleMode: vi.fn(),
      hideScrollbar: false,
      toggleHideScrollbar: vi.fn(),
      globalHideScrollbar: false,
      toggleGlobalHideScrollbar: vi.fn(),
      disableBlur: false,
      toggleDisableBlur: vi.fn(),
      enableProgressiveBlur: true,
      toggleEnableProgressiveBlur: togglePB,
      disableAnimations: false,
      toggleDisableAnimations: vi.fn(),
      disableTabAnimations: false,
      toggleDisableTabAnimations: vi.fn(),
      fastAnimations: false,
      toggleFastAnimations: vi.fn(),
      collapseHeader: false,
      toggleCollapseHeader: vi.fn(),
      showTabs: true,
      toggleShowTabs: vi.fn(),
      showSearch: true,
      toggleShowSearch: vi.fn(),
      translationDict: en,
      hiddenCards: [],
      setHiddenCards: vi.fn(),
      restoreAllNotifications: vi.fn(),
      dismissedNotificationsCount: 0,
      showQuickSummary: true,
      toggleShowQuickSummary: vi.fn(),
      bodyFont: 'default',
      updateBodyFont: vi.fn(),
      modalTitleFont: 'default',
      updateModalTitleFont: vi.fn(),
      codeFont: 'default',
      updateCodeFont: vi.fn(),
      lang: 'en',
      fontFix: false,
      toggleFontFix: vi.fn(),
    };

    const { unmount } = render(
      <ToastProvider>
        <AppearanceTab {...baseProps} />
      </ToastProvider>,
    );
    const pbSwitchUnsupported = screen.getByRole('switch', {
      name: en.settings.general.progressiveBlur.title,
    });
    expect(pbSwitchUnsupported).toBeDisabled();
    expect(pbSwitchUnsupported).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(en.settings.general.progressiveBlur.unsupportedHint)).toBeInTheDocument();
    fireEvent.click(pbSwitchUnsupported);
    expect(togglePB).not.toHaveBeenCalled();

    unmount();

    Object.defineProperty(globalThis, 'CSS', {
      value: { supports: () => true },
      configurable: true,
      writable: true,
    });

    const { rerender } = render(
      <ToastProvider>
        <AppearanceTab {...baseProps} />
      </ToastProvider>,
    );
    const pbSwitchSupported = screen.getByRole('switch', {
      name: en.settings.general.progressiveBlur.title,
    });
    expect(pbSwitchSupported).not.toBeDisabled();
    expect(pbSwitchSupported).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(pbSwitchSupported);
    expect(togglePB).toHaveBeenCalledWith(false);

    rerender(
      <ToastProvider>
        <AppearanceTab {...baseProps} disableBlur={true} />
      </ToastProvider>,
    );
    const pbSwitchPaused = screen.getByRole('switch', {
      name: en.settings.general.progressiveBlur.title,
    });
    expect(pbSwitchPaused).toBeDisabled();
    expect(pbSwitchPaused).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(en.settings.general.progressiveBlur.disabledByBlurHint)).toBeInTheDocument();
  });

  it('SettingsModal mounts floating mobile-only ProgressiveBlur tab backing plate and falls back cleanly on disableBlur', () => {
    Element.prototype.scrollIntoView = vi.fn();
    Object.defineProperty(globalThis, 'CSS', {
      value: { supports: () => true },
      configurable: true,
      writable: true,
    });

    const settingsBaseProps = {
      onClose: vi.fn(),
      t: en,
      themeColor: 'indigo',
      setThemeColor: vi.fn(),
      animationStyle: 'slide-up',
      setAnimationStyle: vi.fn(),
      simpleMode: false,
      toggleSimpleMode: vi.fn(),
      hideScrollbar: false,
      toggleHideScrollbar: vi.fn(),
      globalHideScrollbar: false,
      toggleGlobalHideScrollbar: vi.fn(),
      timeFormat: '24' as const,
      setTimeFormat: vi.fn(),
      disableBlur: false,
      toggleDisableBlur: vi.fn(),
      enableProgressiveBlur: true,
      toggleEnableProgressiveBlur: vi.fn(),
      disableAnimations: false,
      toggleDisableAnimations: vi.fn(),
      disableTabAnimations: false,
      toggleDisableTabAnimations: vi.fn(),
      fastAnimations: false,
      toggleFastAnimations: vi.fn(),
      collapseHeader: false,
      toggleCollapseHeader: vi.fn(),
      showTabs: true,
      toggleShowTabs: vi.fn(),
      showSearch: true,
      toggleShowSearch: vi.fn(),
      imageExportScale: 2,
      updateImageExportScale: vi.fn(),
      pdfExportFormat: 'a4' as const,
      updatePdfExportFormat: vi.fn(),
      pdfExportFont: 'auto' as const,
      updatePdfExportFont: vi.fn(),
      searchScope: 'all' as const,
      updateSearchScope: vi.fn(),
      searchMode: 'fuzzy' as const,
      updateSearchMode: vi.fn(),
      hiddenCards: [],
      setHiddenCards: vi.fn(),
      restoreAllNotifications: vi.fn(),
      dismissedNotificationsCount: 0,
      showQuickSummary: true,
      toggleShowQuickSummary: vi.fn(),
      lang: 'en',
      bodyFont: 'default',
      updateBodyFont: vi.fn(),
      modalTitleFont: 'default',
      updateModalTitleFont: vi.fn(),
      codeFont: 'default',
      updateCodeFont: vi.fn(),
      isDevToolsFloating: false,
      setDevToolsFloating: vi.fn(),
    };

    const { rerender } = render(
      <ToastProvider>
        <SettingsModal {...settingsBaseProps} />
      </ToastProvider>,
    );

    const activeBackdrop = document.body.querySelector('[data-progressive-blur="active"]');
    expect(activeBackdrop).not.toBeNull();
    expect(activeBackdrop?.className).toContain('md:hidden');

    rerender(
      <ToastProvider>
        <SettingsModal {...settingsBaseProps} disableBlur={true} />
      </ToastProvider>,
    );

    expect(document.body.querySelector('[data-progressive-blur="active"]')).toBeNull();
    const fallbackBackdrop = document.body.querySelector('[data-progressive-blur="fallback"]');
    expect(fallbackBackdrop).not.toBeNull();
    expect(fallbackBackdrop?.className).toContain('md:hidden');
  });

  it('SearchBarAndTabs renders feathered ProgressiveBlur when active and opaque fallback when disabled or turned off', () => {
    Object.defineProperty(globalThis, 'CSS', {
      value: { supports: () => true },
      configurable: true,
      writable: true,
    });

    const tabs = [
      { id: 'all' as const, label: 'All', icon: <span>A</span> },
      { id: 'browser' as const, label: 'Browser', icon: <span>B</span> },
    ];

    const baseSearchProps = {
      showSearch: true,
      showTabs: true,
      showSearchSettings: false,
      setShowSearchSettings: vi.fn(),
      handleSearch: vi.fn(),
      searchScope: 'all' as const,
      updateSearchScope: vi.fn(),
      searchMode: 'fuzzy' as const,
      updateSearchMode: vi.fn(),
      availableTabs: tabs,
      activeTab: 'all' as const,
      setActiveTab: vi.fn(),
      setSlideDirection: vi.fn(),
      tabsContainerRef: { current: null },
      activeTabRef: { current: null },
      themeColor: 'indigo',
      disableBlur: false,
      enableProgressiveBlur: true,
      t: en,
    };

    const { container, rerender } = render(<SearchBarAndTabs {...baseSearchProps} />);

    const activeBlur = container.querySelector('[data-progressive-blur="active"]') as HTMLElement | null;
    expect(activeBlur).not.toBeNull();
    expect(activeBlur?.style.getPropertyValue('--pb-mask-start')).toBe('68%');
    expect(activeBlur?.className).toContain('-bottom-7');

    rerender(<SearchBarAndTabs {...baseSearchProps} showSearchSettings={true} />);
    const expandedBlur = container.querySelector('[data-progressive-blur="active"]') as HTMLElement | null;
    expect(expandedBlur?.style.getPropertyValue('--pb-mask-start')).toBe('78%');

    rerender(<SearchBarAndTabs {...baseSearchProps} enableProgressiveBlur={false} />);
    expect(container.querySelector('[data-progressive-blur="active"]')).toBeNull();
    expect(container.querySelector('[data-progressive-blur="fallback"]')).not.toBeNull();

    rerender(<SearchBarAndTabs {...baseSearchProps} disableBlur={true} />);
    expect(container.querySelector('[data-progressive-blur="active"]')).toBeNull();
    expect(container.querySelector('[data-progressive-blur="fallback"]')).not.toBeNull();
  });

  it('AboutModal mounts top and bottom ProgressiveBlur scroll-edge overlays and respects disableBlur/enableProgressiveBlur', () => {
    Object.defineProperty(globalThis, 'CSS', {
      value: { supports: () => true },
      configurable: true,
      writable: true,
    });

    const { rerender } = render(
      <AboutModal
        onClose={vi.fn()}
        t={en.aboutModal}
        disableBlur={false}
        enableProgressiveBlur={true}
      />,
    );

    const activeLayers = Array.from(
      document.body.querySelectorAll('[data-progressive-blur="active"]'),
    ) as HTMLElement[];
    expect(activeLayers).toHaveLength(2);
    expect(activeLayers[0].style.getPropertyValue('--pb-direction')).toBe('to bottom');
    expect(activeLayers[0].style.getPropertyValue('--pb-overlay-alpha')).toBe('0');
    expect(activeLayers[1].style.getPropertyValue('--pb-direction')).toBe('to top');
    expect(activeLayers[1].style.getPropertyValue('--pb-overlay-alpha')).toBe('0.8');

    const scrollContainer = activeLayers[0].parentElement?.querySelector('.overflow-y-auto') as HTMLElement | null;
    expect(scrollContainer).not.toBeNull();
    if (scrollContainer) {
      Object.defineProperty(scrollContainer, 'scrollTop', { value: 260, configurable: true });
      fireEvent.scroll(scrollContainer);
    }

    const updatedTopLayer = document.body.querySelector('[data-progressive-blur="active"]') as HTMLElement | null;
    expect(updatedTopLayer?.style.getPropertyValue('--pb-overlay-alpha')).toBe('0.78');

    rerender(
      <AboutModal
        onClose={vi.fn()}
        t={en.aboutModal}
        disableBlur={true}
        enableProgressiveBlur={true}
      />,
    );
    expect(document.body.querySelectorAll('[data-progressive-blur="active"]')).toHaveLength(0);
    expect(document.body.querySelectorAll('[data-progressive-blur="fallback"]')).toHaveLength(2);
  });
});
