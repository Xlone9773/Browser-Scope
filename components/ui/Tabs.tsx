// src/components/ui/Tabs.tsx
import React, { useRef, useEffect, useCallback } from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  variant?: 'modal' | 'pills' | 'underline';
  size?: 'sm' | 'md';
  autoScroll?: boolean;
  className?: string;
  id?: string;
}

export const Tabs = <T extends string = string>({
  items,
  activeTab,
  onChange,
  variant = 'modal',
  size = 'md',
  autoScroll = true,
  className = '',
  id = 'tabs-nav'
}: TabsProps<T>): React.ReactElement => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active tab button into center view
  useEffect(() => {
    if (!autoScroll) return;

    const scrollActiveTab = () => {
      const container = tabsContainerRef.current;
      if (!container) return;
      const activeElement = container.querySelector<HTMLElement>('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    };

    scrollActiveTab();
    const rafId = requestAnimationFrame(scrollActiveTab);
    return () => cancelAnimationFrame(rafId);
  }, [activeTab, autoScroll]);

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabledItems = items.filter((item) => !item.disabled);
      const currentIndex = enabledItems.findIndex((item) => item.id === activeTab);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % enabledItems.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIndex = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIndex = enabledItems.length - 1;
        e.preventDefault();
      }

      if (nextIndex !== currentIndex) {
        onChange(enabledItems[nextIndex].id);
      }
    },
    [items, activeTab, onChange]
  );

  if (variant === 'pills') {
    return (
      <div
        id={id}
        ref={tabsContainerRef}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 ${className}`}
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`${id}-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`${id}-panel-${item.id}`}
              data-active={isActive}
              disabled={item.disabled}
              onClick={() => onChange(item.id)}
              className={`inline-flex shrink-0 min-w-max items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && <span className="shrink-0 inline-flex items-center justify-center pointer-events-none">{item.icon}</span>}
              <span className="shrink-0 whitespace-nowrap">{item.label}</span>
              {item.badge && <span className="shrink-0 inline-flex items-center ml-1">{item.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    const paddingClass = size === 'sm' ? 'py-2 px-3 text-xs' : 'py-3 px-3.5 sm:px-4 text-xs sm:text-sm';
    return (
      <div
        id={id}
        ref={tabsContainerRef}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={`flex border-b border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto scrollbar-hide ${className}`}
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`${id}-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`${id}-panel-${item.id}`}
              data-active={isActive}
              disabled={item.disabled}
              onClick={() => onChange(item.id)}
              className={`flex-1 shrink-0 min-w-max ${paddingClass} font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b-2 border-transparent'
              }`}
            >
              {item.icon && <span className="shrink-0 inline-flex items-center justify-center pointer-events-none">{item.icon}</span>}
              <span className="shrink-0 whitespace-nowrap">{item.label}</span>
              {item.badge && <span className="shrink-0 inline-flex items-center ml-1">{item.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'modal' variant: Standard pre-made modal tab bar
  const paddingClass = size === 'sm' ? 'py-2 px-3 text-xs' : 'py-3 px-3.5 sm:px-4 text-xs sm:text-sm';

  return (
    <div
      id={id}
      ref={tabsContainerRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={`flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0 overflow-x-auto scrollbar-hide ${className}`}
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            role="tab"
            id={`${id}-tab-${item.id}`}
            aria-selected={isActive}
            aria-controls={`${id}-panel-${item.id}`}
            data-active={isActive}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={`flex-1 shrink-0 min-w-max ${paddingClass} font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-800 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
            }`}
          >
            {item.icon && <span className="shrink-0 inline-flex items-center justify-center pointer-events-none">{item.icon}</span>}
            <span className="shrink-0 whitespace-nowrap">{item.label}</span>
            {item.badge && <span className="shrink-0 inline-flex items-center ml-1">{item.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};
