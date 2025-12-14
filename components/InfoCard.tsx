import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  label: string;
  value: string | number | boolean;
  subValue?: string;
  isFeature?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, subValue, isFeature }) => {
  let displayValue = value;
  let statusColor = 'text-slate-800';

  if (typeof value === 'boolean') {
    displayValue = value ? 'Supported' : 'Not Supported';
    statusColor = value ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded text-sm font-medium' : 'text-slate-400 bg-slate-50 px-2 py-0.5 rounded text-sm';
  } else if (isFeature) {
      // If it's passed as a string but represents a boolean status conceptually (like "Yes" / "No")
      if(value === 'Yes' || value === 'Supported') statusColor = 'text-green-600 font-medium';
      if(value === 'No' || value === 'Not Supported') statusColor = 'text-slate-400';
  }

  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <div className="text-right">
        <span className={`text-sm ${statusColor} break-all`}>{displayValue}</span>
        {subValue && <div className="text-xs text-slate-400 mt-0.5">{subValue}</div>}
      </div>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full transition-all hover:shadow-md duration-300">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          <Icon size={20} strokeWidth={2} />
        </div>
        <h3 className="font-semibold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};

export const FeatureGrid: React.FC<{ items: { name: string; supported: boolean; description: string }[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div 
          key={item.name} 
          className={`p-3 rounded-lg border ${
            item.supported 
              ? 'bg-green-50/50 border-green-100/50' 
              : 'bg-slate-50 border-slate-100'
          } flex flex-col gap-1`}
        >
          <div className="flex items-center justify-between mb-1">
             <span className={`text-sm font-semibold ${item.supported ? 'text-green-700' : 'text-slate-500'}`}>
              {item.name}
            </span>
             <div className={`w-2 h-2 rounded-full ${item.supported ? 'bg-green-500' : 'bg-slate-300'}`}></div>
          </div>
          <span className="text-xs text-slate-400 leading-tight">
            {item.description}
          </span>
        </div>
      ))}
    </div>
  );
};

export { InfoItem };