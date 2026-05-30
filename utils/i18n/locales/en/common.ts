
export const common = {
  meta: {
    title: "BrowserScope",
    subtitle: "Comprehensive browser fingerprinting and capability detection tool.",
    footer: "BrowserScope - Device Intelligence Tool",
  },
  common: {
    menu: "Menu",
    language: "Language",
    fullscreen: "Fullscreen",
    exit_fullscreen: "Exit Fullscreen",
    loading: "Initializing...",
    error_boundary: {
        title: "Component Crashed",
        message: "An unexpected error occurred rendering this module.",
        retry: "Try Again",
        unknown_component: "Unknown Component",
        component_in: "in",
        preliminary_analysis: "Preliminary Analysis:",
        show_stack_trace: "View Stack Trace",
        hide_stack_trace: "Hide Stack Trace",
        copy_error_details: "Copy Error Details",
        copied: "Copied!",
        error_stack: "Error Stack",
        component_stack: "React Component Stack",
        no_stack_trace: "No stack trace available.",
        no_component_stack: "No component stack available.",
        analysis_no_error: "No error object available.",
        analysis_null_reference: "Possible null reference error. Check if data is loaded before rendering.",
        analysis_function_call: "Function call fail. Check if the callback/method exists and is bound correctly.",
        analysis_invalid_hook: "React Hook issue. Hooks must be called inside a functional component body.",
        analysis_network: "Network error. Check your internet connection or API endpoint status.",
        analysis_json: "JSON parsing error. Received unexpected data format from the server.",
        analysis_unexpected: "Unexpected runtime error. Please review the stack trace below.",
        clear_cache: "Clear Cache & Reload",
        reload_page: "Reload Page",
        home: "Return Home",
        context_metadata: "Environment Context",
        time: "Timestamp",
        url: "Current URL",
        user_agent: "User Agent"
    },
    modal_loading: {
        initializing: "Initializing",
        loading_module: "Loading Module Resource"
    },
    loading_steps: [
        "Analyzing system environment...",
        "Detecting graphics capabilities...",
        "Evaluating network status...",
        "Calculating device fingerprints...",
        "Loading complete"
    ],
    refresh: "Refresh Data",
    actions: {
        start: "Start",
        stop: "Stop",
        close: "Close",
        copy: "Copy",
        copied: "Copied",
        download: "Download",
        view_details: "View Details",
        check: "Check",
        open: "Open",
        reset: "Reset",
        export: "Export JSON"
    }
  },
  status: {
    granted: "Granted",
    denied: "Denied",
    prompt: "Prompt",
    error: "Error",
    idle: "Idle",
    running: "Running",
    supported: "Supported",
    not_supported: "Not Supported",
    detected: "Detected",
    none: "None",
    hidden: "Hidden",
    yes: "Yes",
    no: "No",
    unknown: "Unknown"
  },
  values: {
    supported: "Supported",
    not_supported: "Not Supported",
    detected: "Detected",
    none: "None",
    hidden: "Hidden/Masked",
    yes: "Yes",
    no: "No",
    connected: "Connected",
    offline: "Offline",
    installed: "Installed",
    not_installed: "Not Installed"
  }
};
