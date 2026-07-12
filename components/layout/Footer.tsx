
import React from 'react';

interface FooterProps {
  text: string;
  onOpenAttributions?: () => void;
  label?: string;
}

export const Footer: React.FC<FooterProps> = React.memo(({ text, onOpenAttributions, label = "Third-Party Attributions" }) => {
  return (
    <footer className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
        <p className="font-medium">{text}</p>
        {onOpenAttributions && (
          <button 
            onClick={onOpenAttributions}
            className="mt-1 font-semibold text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 underline decoration-slate-300 dark:decoration-slate-700 hover:decoration-indigo-500 dark:hover:decoration-indigo-400 underline-offset-4 cursor-pointer transition-colors"
          >
            {label}
          </button>
        )}
    </footer>
  );
});
