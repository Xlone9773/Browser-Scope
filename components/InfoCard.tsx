
import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  label: string;
  value: string | number | boolean;
  subValue?: string;
  isFeature?: boolean;
}

// Memoized InfoItem to prevent re-renders of list items
const InfoItem = memo<InfoItemProps>(({ label, value, subValue, isFeature }) => {
  let displayValue = value;
  let statusColor = 'text-slate-800 dark:text-slate-200';

  if (typeof value === 'boolean') {
    displayValue = value ? 'Supported' : 'Not Supported';
    statusColor = value 
      ? 'text-green-700 bg-green-50 border border-green-100 dark:border-green-900/30 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-xs font-medium' 
      : 'text-slate-500 bg-slate-100 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded text-xs';
  } else if (isFeature) {
      // If it's passed as a string but represents a boolean status conceptually (like "Yes" / "No")
      if(value === 'Yes' || value === 'Supported') statusColor = 'text-green-600 dark:text-green-400 font-medium';
      if(value === 'No' || value === 'Not Supported') statusColor = 'text-slate-400 dark:text-slate-500';
  }

  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors px-2 -mx-2 rounded">
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
      <div className="text-right">
        <span className={`text-sm ${statusColor} break-all`}>{displayValue}</span>
        {subValue && <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subValue}</div>}
      </div>
    </div>
  );
});

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

// Memoized InfoCard shell
export const InfoCard = memo<InfoCardProps>(({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-all hover:shadow-md duration-300">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-white dark:bg-slate-800">
        <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300">
          <Icon size={20} strokeWidth={2} />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
});

export const FeatureGrid: React.FC<{ items: { name: string; supported: boolean; description: string }[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div 
          key={item.name} 
          className={`p-3 rounded-lg border ${
            item.supported 
              ? 'bg-green-50/50 border-green-100/50 dark:bg-green-900/10 dark:border-green-800/30' 
              : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700'
          } flex flex-col gap-1`}
        >
          <div className="flex items-center justify-between mb-1">
             <span className={`text-sm font-semibold ${item.supported ? 'text-green-700 dark:text-green-400' : 'text-slate-500 dark:text-slate-500'}`}>
              {item.name}
            </span>
             <div className={`w-2 h-2 rounded-full ${item.supported ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 leading-tight">
            {item.description}
          </span>
        </div>
      ))}
    </div>
  );
};

export { InfoItem };
