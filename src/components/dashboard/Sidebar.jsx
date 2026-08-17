'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '../../hooks/use-auth';
import Badge from '../ui/Badge';
import { 
  SUPPORTER_NAVIGATION, 
  CREATOR_NAVIGATION, 
  ADMIN_NAVIGATION 
} from '../../constants/navigation';

export const Sidebar = ({ onItemClick }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const role = user?.role || 'supporter';

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return ADMIN_NAVIGATION;
      case 'creator':
        return CREATOR_NAVIGATION;
      case 'supporter':
      default:
        return SUPPORTER_NAVIGATION;
    }
  };

  const navItems = getNavItems();
  const isActive = (path) => pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* User Profile Summary & Role Badge */}
      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center overflow-hidden">
            {user?.photoUrl || user?.avatar ? (
              <img src={user.photoUrl || user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-sm text-slate-900 truncate block">{user?.name || 'User'}</span>
            <span className="text-[11px] text-slate-500 font-medium truncate block">{user?.email}</span>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between">
          <Badge variant={role === 'admin' ? 'error' : role === 'creator' ? 'info' : 'success'} size="sm">
            {role}
          </Badge>
          <span className="text-[11px] font-extrabold text-emerald-700">
            {role === 'creator' ? `${user?.raisedCredits ?? 0} Cr Raised` : `${user?.credits ?? 0} Cr`}
          </span>
        </div>
      </div>

      {/* Dynamic Role Navigation Menu */}
      <nav className="space-y-1.5 text-xs font-bold text-slate-600" aria-label="Dashboard Navigation">
        <div className="px-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
          {role.toUpperCase()} MENU
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path + item.label}
              href={item.path}
              onClick={onItemClick}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-2xl transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200/80 shadow-2xs'
                  : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
