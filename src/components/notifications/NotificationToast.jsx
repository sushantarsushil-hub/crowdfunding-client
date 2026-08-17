'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationToast = ({ title, message }) => {
  return (
    <div className="flex items-start space-x-3 p-1">
      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
        <Bell className="w-4 h-4" />
      </div>
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-white">{title}</h4>
        <p className="text-[11px] text-slate-300">{message}</p>
      </div>
    </div>
  );
};

export default NotificationToast;
