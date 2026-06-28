import React, { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

interface AppNotificationProps {
  type: NotificationType;
  title?: string;
  message: string | ReactNode;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const AppNotification: React.FC<AppNotificationProps> = ({ type, title, message, onClose, action }) => {
  const getIcon = () => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-amber-500 shrink-0" size={20} />;
      case 'error': return <AlertCircle className="text-rose-500 shrink-0" size={20} />;
      case 'success': return <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />;
      default: return <Info className="text-blue-500 shrink-0" size={20} />;
    }
  };

  const getBgClass = () => {
    switch (type) {
      case 'warning': return 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50';
      case 'error': return 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50';
      case 'success': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'warning': return 'bg-amber-100/50 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400';
      case 'error': return 'bg-rose-100/50 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-400';
      case 'success': return 'bg-emerald-100/50 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400';
      default: return 'bg-blue-100/50 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400';
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg shadow-sm w-full transition-all ${getBgClass()}`}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        {Boolean(title) && <h4 className={`text-sm font-semibold mb-1 ${
          type === 'warning' ? 'text-amber-800 dark:text-amber-300' :
          type === 'error' ? 'text-rose-800 dark:text-rose-300' :
          type === 'success' ? 'text-emerald-800 dark:text-emerald-300' :
          'text-blue-800 dark:text-blue-300'
        }`}>{title}</h4>}
        <div className={`text-sm ${
          type === 'warning' ? 'text-amber-700 dark:text-amber-400' :
          type === 'error' ? 'text-rose-700 dark:text-rose-400' :
          type === 'success' ? 'text-emerald-700 dark:text-emerald-400' :
          'text-blue-700 dark:text-blue-400'
        }`}>{message}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <button 
            onClick={action.onClick}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${getButtonClass()}`}
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-md opacity-70 hover:opacity-100 transition-opacity ${
              type === 'warning' ? 'text-amber-700 dark:text-amber-400' :
              type === 'error' ? 'text-rose-700 dark:text-rose-400' :
              type === 'success' ? 'text-emerald-700 dark:text-emerald-400' :
              'text-blue-700 dark:text-blue-400'
            }`}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
