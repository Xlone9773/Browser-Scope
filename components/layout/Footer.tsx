
import React from 'react';

interface FooterProps {
  text: string;
}

export const Footer: React.FC<FooterProps> = ({ text }) => {
  return (
    <footer className="text-center py-8 text-sm text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
        <p>{text}</p>
    </footer>
  );
};
