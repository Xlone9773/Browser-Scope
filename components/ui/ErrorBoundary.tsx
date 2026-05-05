
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { translations } from '../../utils/i18n';
import { Language } from '../../utils/i18n/types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in component [${this.props.name || 'Unknown'}]:`, error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private getTranslation() {
    const defaultLang = 'en';
    let lang = defaultLang;
    try {
      const stored = localStorage.getItem('language');
      if (stored && translations[stored as Language]) {
        lang = stored;
      }
    } catch(e) {}
    
    // Fallback to english if not found
    return (translations[lang as Language] as any)?.common?.error_boundary || {
        title: "Component Crashed",
        message: "An unexpected error occurred.",
        retry: "Try Again",
        unknown_component: "Unknown Component"
    };
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const t = this.getTranslation();

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
            {t.title}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-6 max-w-xs font-mono text-xs break-words">
            {this.state.error?.message || t.message}
          </p>
          <button 
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
            {t.retry}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
