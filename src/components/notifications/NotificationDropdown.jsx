'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  Check 
} from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../../hooks/useNotifications';

export const NotificationDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data } = useNotifications();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const rawNotifications = data?.data?.notifications || data?.notifications || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const notifications = Array.isArray(rawNotifications) ? rawNotifications : [];

  // Sort newest first
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
  );

  const unreadCount = sortedNotifications.filter((n) => !n.isRead && !n.read).length;

  const handleNotificationClick = (n) => {
    const isUnread = !n.isRead && !n.read;
    if (isUnread) {
      markReadMutation.mutate(n._id || n.id);
    }

    setIsOpen(false);

    // Route navigation mapping according to notification type
    const actionRoute = n.actionRoute || getRouteForType(n.type, n);
    if (actionRoute) {
      router.push(actionRoute);
    }
  };

  const getRouteForType = (type = '', n = {}) => {
    switch (type) {
      case 'contribution_created':
      case 'contribution_approved':
      case 'contribution_rejected':
        return '/dashboard/supporter/contributions';
      case 'campaign_approved':
      case 'campaign_rejected':
        return '/dashboard/creator/campaigns';
      case 'withdrawal_approved':
      case 'withdrawal_rejected':
        return '/dashboard/creator/withdrawals';
      default:
        return n.campaignId ? `/campaigns/${n.campaignId}` : '/dashboard';
    }
  };

  const getNotificationIcon = (type = '') => {
    switch (type) {
      case 'contribution_created':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'contribution_approved':
      case 'campaign_approved':
      case 'withdrawal_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'contribution_rejected':
      case 'campaign_rejected':
      case 'withdrawal_rejected':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-2xl hover:bg-slate-100 text-slate-600 relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Animated Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 text-xs space-y-3"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* List Body */}
            {sortedNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-medium">
                No notifications right now.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 space-y-1 pr-1">
                {sortedNotifications.map((n, idx) => {
                  const isUnread = !n.isRead && !n.read;
                  const dateStr = new Date(n.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={n._id || n.id || idx}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 rounded-2xl cursor-pointer transition-colors flex items-start space-x-3 ${
                        isUnread ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white border border-slate-100 shrink-0 shadow-2xs mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>

                      <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold block truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                            {n.title || n.message || 'Notification Alert'}
                          </span>
                          {isUnread && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                        </div>

                        <p className="text-slate-500 line-clamp-2 leading-relaxed text-[11px]">
                          {n.message || n.body}
                        </p>

                        <span className="text-[10px] text-slate-400 font-semibold block pt-1">
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
