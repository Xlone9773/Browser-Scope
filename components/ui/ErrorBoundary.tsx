
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Copy, BookOpen, Bug } from 'lucide-react';
import { translations } from '../../utils/i18n';
import { Language } from '../../utils/i18n/types';
import { loggerStore } from '../../utils/loggerStore';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    const errorMsg = `Uncaught error in component [${this.props.name || 'Unknown'}]: ${error.message}\n${errorInfo.componentStack}`;
    console.error(errorMsg);
    // Explicitly add to loggerStore so it triggers our global console interception safely
    loggerStore.addConsole('error', errorMsg);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false, copied: false });
  };

  public handleCopy = () => {
    const { error, errorInfo } = this.state;
    const text = `Component: ${this.props.name || 'Unknown'}\nError: ${error?.message}\n${error?.stack || ''}\n\nComponent Stack:${errorInfo?.componentStack || ''}`;
    try {
        navigator.clipboard.writeText(text);
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
    } catch(e) {}
  };

  private getAnalysis(error: Error | null) {
      if (!error) return "No error object available.";
      const msg = error.message.toLowerCase();
      if (msg.includes("cannot read properties of undefined") || msg.includes("cannot read properties of null")) {
          return "Possible null reference error. Check if data is loaded before rendering.";
      }
      if (msg.includes("is not a function")) {
          return "Function call fail. Check if the callback/method exists and is bound correctly.";
      }
      if (msg.includes("invalid hook call")) {
          return "React Hook issue. Hooks must be called inside a functional component body.";
      }
      if (msg.includes("network") || msg.includes("fetch")) {
          return "Network error. Check your internet connection or API endpoint status.";
      }
      if (msg.includes("unexpected token") || msg.includes("json")) {
          return "JSON parsing error. Received unexpected data format from the server.";
      }
      return "Unexpected runtime error. Please review the stack trace below.";
  }

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
        message: "An unexpected error occurred rendering this module.",
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
      const analysisMsg = this.getAnalysis(this.state.error);

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/40 rounded-xl flex flex-col text-left min-h-[200px] shadow-sm w-full font-sans">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
                {t.title} <span className="text-red-500 font-normal text-sm opacity-70">in {this.props.name || t.unknown_component}</span>
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {this.state.error?.message || t.message}
              </p>
            </div>
          </div>
          
          <div className="mb-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded p-3 text-sm text-orange-800 dark:text-orange-300 flex gap-2 items-start">
             <BookOpen size={16} className="shrink-0 mt-0.5" />
             <div>
                <span className="font-bold block mb-1">Preliminary Analysis:</span>
                {analysisMsg}
             </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap mb-4">
              <button 
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <RefreshCw size={16} />
                {t.retry}
              </button>
              
              <button 
                onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
              >
                {this.state.showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {this.state.showDetails ? 'Hide Stack Trace' : 'View Stack Trace'}
              </button>
              
              {this.state.showDetails && (
                  <button 
                    onClick={this.handleCopy}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium transition-colors ml-auto"
                  >
                    {this.state.copied ? <Copy size={16} className="text-green-500" /> : <Copy size={16} />}
                    {this.state.copied ? 'Copied!' : 'Copy Error Details'}
                  </button>
              )}
          </div>

          {this.state.showDetails && (
              <div className="mt-2 bg-slate-900 rounded p-4 overflow-x-auto text-xs text-red-300 font-mono text-left w-full shadow-inner border border-red-900">
                <div className="text-slate-400 mb-1 border-b border-red-900/50 pb-1 flex items-center gap-1">
                    <Bug size={14} /> Error Stack
                </div>
                <div className="whitespace-pre-wrap break-all mb-4">
                    {this.state.error?.stack || 'No stack trace available.'}
                </div>
                <div className="text-slate-400 mb-1 border-b border-red-900/50 pb-1 flex items-center gap-1 mt-4">
                    <AlertTriangle size={14} /> React Component Stack
                </div>
                <div className="whitespace-pre-wrap break-all text-orange-300">
                    {this.state.errorInfo?.componentStack || 'No component stack available.'}
                </div>
              </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
