import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
  BookOpen,
  Bug,
  Trash2,
  Home,
  Monitor,
} from "lucide-react";
import { activeTranslations, en } from "../../utils/i18n";
import { loggerStore } from "../../utils/loggerStore";

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

interface Diagnostics {
  component: string;
  time: string;
  url: string;
  userAgent: string;
  screen: string;
  viewport: string;
  dpr: number;
  online: boolean;
  localStorageKeys: string[];
  sessionStorageKeys: string[];
  errorMessage: string;
  errorStack: string | undefined;
  componentStack: string | null | undefined;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  private handleGlobalError = (event: ErrorEvent): void => {
    if (this.props.name === "RootApp" && !this.state.hasError) {
      const msg = (event.message || (event.error && event.error.message) || "").toLowerCase();
      if (
        msg.includes("vconsole") ||
        msg.includes("websocket closed without opened") ||
        msg.includes("script error") ||
        msg.includes("resizeobserver loop")
      ) {
        return;
      }
      this.setState({
        hasError: true,
        error: event.error || new Error(event.message || "Unknown error"),
        errorInfo: { componentStack: "Captured by Window Error Listener" },
      });
    }
  };

  private handleGlobalPromise = (event: PromiseRejectionEvent): void => {
    if (this.props.name === "RootApp" && !this.state.hasError) {
      const msg = (event.reason instanceof Error ? event.reason.message : String(event.reason)).toLowerCase();
      if (
        msg.includes("vconsole") ||
        msg.includes("websocket closed without opened") ||
        msg.includes("script error") ||
        msg.includes("transition was skipped")
      ) {
        return;
      }
      this.setState({
        hasError: true,
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        errorInfo: { componentStack: "Captured by Window Unhandled Rejection Listener" },
      });
    }
  };

  public componentDidMount(): void {
    if (this.props.name === "RootApp") {
      window.addEventListener("error", this.handleGlobalError);
      window.addEventListener("unhandledrejection", this.handleGlobalPromise);
    }
  }

  public componentWillUnmount(): void {
    if (this.props.name === "RootApp") {
      window.removeEventListener("error", this.handleGlobalError);
      window.removeEventListener("unhandledrejection", this.handleGlobalPromise);
    }
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    const errorMsg = `Uncaught error in component [${this.props.name}]: ${error.message}\n${errorInfo.componentStack}`;
    
    // Comprehensive system diagnostic info
    const diagnostics: Diagnostics = {
      component: this.props.name || "Unknown",
      time: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      dpr: window.devicePixelRatio,
      online: navigator.onLine,
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
    };
    
    // Detailed group console log for troubleshooting
    console.group(`[ErrorBoundary] Component Crash: ${this.props.name || "Unknown"}`);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Component Stack:", errorInfo.componentStack);
    console.info("Diagnostics:", diagnostics);
    console.groupEnd();

    // Store in global custom developer logs
    loggerStore.addLog(
      "ERROR_BOUNDARY_CRASH",
      `Component [${this.props.name}] crashed: ${error.message}. System Details: ${JSON.stringify(diagnostics, null, 2)}`
    );
    
    loggerStore.addConsole("error", errorMsg);
  }

  public handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  public handleCopy = (): void => {
    const { error, errorInfo } = this.state;
    const ua = navigator.userAgent;
    const url = window.location.href;
    const timestamp = new Date().toISOString();
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    const dpr = window.devicePixelRatio;
    const online = navigator.onLine ? "ONLINE" : "OFFLINE";
    const localKeys = Object.keys(localStorage).filter(k => k.startsWith("developer_") || k === "app_theme" || k === "app_lang").join(", ") || "None";
    const sessionKeys = Object.keys(sessionStorage).join(", ") || "None";

    const text = `--- Context Metadata ---
Time: ${timestamp}
URL: ${url}
User Agent: ${ua}
Screen Resolution: ${screenRes}
Viewport Size: ${viewport}
Device Pixel Ratio: ${dpr}
Online Status: ${online}
Relevant LocalStorage Keys: ${localKeys}
Session Storage Keys: ${sessionKeys}

--- Error Details ---
Component: ${this.props.name || "Unknown"}
Error Name: ${error?.name || "Error"}
Error Message: ${error?.message || "Unknown error"}

--- Error Stack ---
${error?.stack || "No stack trace available"}

--- Component Stack ---
${errorInfo?.componentStack || "No component stack available"}`;

    try {
      navigator.clipboard.writeText(text);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch { /* ignore */ }
  };

  public handleClearCache = (): void => {
    if (
      window.confirm(
        "Are you sure you want to clear cache and reload? This will reset all your settings.",
      )
    ) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  public handleHome = (): void => {
    window.dispatchEvent(new Event("close-all-modals"));
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  public handleReload = (): void => {
    window.location.reload();
  };

  private getAnalysis(error: Error | null, t: typeof en.common.error_boundary): ReactNode {
    if (!error) return t.analysis_no_error;
    const msg = error.message.toLowerCase();
    if (
      msg.includes("cannot read properties of undefined") ||
      msg.includes("cannot read properties of null") ||
      msg.includes("reading 'usestate'")
    ) {
      return t.analysis_null_reference;
    }
    if (msg.includes("is not a function")) {
      return t.analysis_function_call;
    }
    if (
      msg.includes("invalid hook call") ||
      msg.includes("reading 'usestate'")
    ) {
      return t.analysis_invalid_hook;
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return t.analysis_network;
    }
    if (msg.includes("unexpected token") || msg.includes("json")) {
      return t.analysis_json;
    }
    return t.analysis_unexpected;
  }

  private getTranslation(): typeof en.common.error_boundary {
    return activeTranslations?.common?.error_boundary || en.common.error_boundary;
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const t = this.getTranslation();
      const analysisMsg = this.getAnalysis(this.state.error, t);

      return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm p-4 md:p-8 flex items-start justify-center overflow-y-auto">
          <div className="p-6 bg-red-50 dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-xl flex flex-col text-left shadow-2xl w-full max-w-4xl font-sans relative backdrop-blur-md mt-10 md:mt-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
                  {t.title}{" "}
                  <span className="text-red-500 font-normal text-sm opacity-70">
                    {t.component_in}{" "}
                    {this.props.name || t.unknown_component}
                  </span>
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {this.state.error?.message || t.message}
                </p>
              </div>
            </div>

            <div className="mb-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded p-3 text-sm text-orange-800 dark:text-orange-300 flex gap-2 items-start">
              <BookOpen size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">
                  {t.preliminary_analysis}
                </span>
                {analysisMsg}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <RefreshCw size={16} />
                {t.retry}
              </button>

              <button
                onClick={this.handleClearCache}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <Trash2 size={16} />
                {t.clear_cache}
              </button>

              <button
                onClick={this.handleHome}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <Home size={16} />
                {t.home}
              </button>

              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                <RefreshCw size={16} />
                {t.reload_page}
              </button>

              <button
                onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
              >
                {this.state.showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {this.state.showDetails ? t.hide_stack_trace : t.show_stack_trace}
              </button>

              {this.state.showDetails ? (
                <button
                  onClick={this.handleCopy}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium transition-colors ml-auto active:scale-95"
                >
                  <Copy size={16} className={this.state.copied ? "text-emerald-500" : ""} />
                  {this.state.copied ? t.copied : t.copy_error_details}
                </button>
              ) : null}
            </div>

            {this.state.showDetails ? (
              <div className="mt-4 bg-slate-100 dark:bg-[#0f172a] rounded-lg p-4 overflow-x-auto text-xs text-red-900 dark:text-red-300 font-mono text-left w-full shadow-inner border border-red-200 dark:border-red-900">
                <div className="text-slate-500 dark:text-slate-400 mb-3 border-b border-red-200 dark:border-red-900/50 pb-2 flex items-center gap-1 font-bold font-sans">
                  <Monitor size={14} />{" "}
                  {t.context_metadata}
                </div>
                
                <div className="mb-6 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {/* Time */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        {t.time}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 select-all font-mono">
                        {new Date().toISOString()}
                      </span>
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        {t.url}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 break-all select-all font-mono">
                        {window.location.href}
                      </span>
                    </div>

                    {/* Connection status */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        Network Status
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">
                        {navigator.onLine ? "ONLINE" : "OFFLINE"}
                      </span>
                    </div>

                    {/* Language / Locale */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        Locale Language
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">
                        {navigator.language}
                      </span>
                    </div>

                    {/* Device Pixel Ratio */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        Device Pixel Ratio (DPR)
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">
                        {window.devicePixelRatio}
                      </span>
                    </div>

                    {/* Screen / Viewport */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        Screen & Viewport
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">
                        Screen: {window.screen.width}x{window.screen.height} | Viewport: {window.innerWidth}x{window.innerHeight}
                      </span>
                    </div>

                    {/* User Agent */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        {t.user_agent}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 break-words select-all font-mono">
                        {navigator.userAgent}
                      </span>
                    </div>

                    {/* Active Configuration */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                        Active Configuration
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 break-all font-mono">
                        {Object.keys(localStorage).filter((k: string) => k.startsWith("developer_") || k === "app_theme" || k === "app_lang").map((k: string) => `${k}: ${localStorage.getItem(k) || ""}`).join(" | ") || "No relevant keys configured"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-500 dark:text-slate-400 mb-2 border-b border-red-200 dark:border-red-900/50 pb-2 flex items-center gap-1 font-bold font-sans">
                  <Bug size={14} /> {t.error_stack}
                </div>
                <div className="whitespace-pre-wrap break-all mb-6 bg-white/50 dark:bg-black/20 p-3 rounded border border-red-100 dark:border-red-900/30">
                  {this.state.error?.stack ? (
                    this.state.error.stack.split("\n").map((line: string, i: number) => {
                      if (line.trim().startsWith("at ")) {
                        const match = line.match(
                          /(at\s+)([A-Za-z0-9_$.<>]+)(\s+\(?)/,
                        );
                        return match ? (
                          <div
                            key={i}
                            className="text-slate-700 dark:text-slate-300"
                          >
                            <span className="text-slate-500 dark:text-slate-500">
                              {match[1]}
                            </span>
                            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                              {match[2]}
                            </span>
                            <span>
                              {line.substring(match[0].length - 1)}
                            </span>
                          </div>
                        ) : (
                          <div
                            key={i}
                            className="text-slate-700 dark:text-slate-300"
                          >
                            {line}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={i}
                          className="text-red-600 dark:text-red-300 font-bold"
                        >
                          {line}
                        </div>
                      );
                    })
                  ) : (
                    <div>{t.no_stack_trace}</div>
                  )}
                </div>

                <div className="text-slate-500 dark:text-slate-400 mb-2 border-b border-red-200 dark:border-red-900/50 pb-2 flex items-center gap-1 font-bold font-sans mt-6">
                  <AlertTriangle size={14} />{" "}
                  {t.component_stack}
                </div>
                <div className="whitespace-pre-wrap break-all bg-white/50 dark:bg-black/20 p-3 rounded border border-red-100 dark:border-red-900/30 text-orange-600 dark:text-orange-300">
                  {this.state.errorInfo?.componentStack ? (
                    this.state.errorInfo.componentStack
                      .split("\n")
                      .map((line: string, i: number) => {
                        if (!line.trim()) return null;
                        const isCurrent = this.props.name ? line.includes(this.props.name) : false;
                        return (
                          <div
                            key={i}
                            className={`py-0.5 ${isCurrent ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold px-2 rounded-sm border-l-2 border-indigo-500 my-1" : ""}`}
                          >
                            {line}
                          </div>
                        );
                      })
                  ) : (
                    <div>{t.no_component_stack}</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
