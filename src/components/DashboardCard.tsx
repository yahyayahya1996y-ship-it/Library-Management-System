import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  colorScheme: 'amber' | 'rose' | 'emerald' | 'blue' | 'indigo';
  id?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  colorScheme,
  id,
}) => {
  // Setup colors dynamically mapped from parameters
  const colorMap = {
    amber: {
      bg: 'bg-amber-50 border-amber-100',
      text: 'text-amber-800',
      iconBg: 'bg-amber-500',
      iconText: 'text-white',
    },
    rose: {
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-800',
      iconBg: 'bg-rose-500',
      iconText: 'text-white',
    },
    emerald: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-800',
      iconBg: 'bg-emerald-500',
      iconText: 'text-white',
    },
    blue: {
      bg: 'bg-blue-50 border-blue-100',
      text: 'text-blue-800',
      iconBg: 'bg-blue-500',
      iconText: 'text-white',
    },
    indigo: {
      bg: 'bg-indigo-50 border-indigo-100',
      text: 'text-indigo-800',
      iconBg: 'bg-indigo-500',
      iconText: 'text-white',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.amber;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id={id}
      className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4`}
    >
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <span className="text-3xl font-bold text-gray-900 tracking-tight leading-none block">{value}</span>
        {subtext && <p className="text-xs text-gray-500 mt-1.5 font-medium">{subtext}</p>}
      </div>

      <div className={`p-4 rounded-xl ${scheme.bg} border shrink-0 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${scheme.text}`} />
      </div>
    </motion.div>
  );
};
export default DashboardCard;
