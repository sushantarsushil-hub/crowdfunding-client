'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Circle, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../../hooks/useNotifications';
import { popoverVariants } from '../../constants/animations';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Fetch notifications using TanStack Query hook
  const { data, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const rawList = data?.data?.notifications || data?.notifications || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
  const unreadCount = data?.data?.unreadCount ?? data?.unreadCount ?? rawList.filter((n) => !(n.read ?? n.isRead)).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    const isRead = notification.read ?? notification.isRead;
    if (!isRead) {
      markReadMutation.mutate(notification._id || notification.id);
    }
    setIsOpen(false);
    if (notification.actionRoute) {
      router.push(notification.actionRoute);
    }
  };

  // Sort newest first
  const sortedNotifications = [...rawList].sort(
    (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white animate-pulse shadow-sm shadow-rose-500/40">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Responsive Floating Notification Panel (Fixed Sheet on Mobile, Popover on Desktop) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-3 top-16 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 w-auto sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 min-h-[44px] px-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* List Content */}
            <div className="max-h-[65vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
              ) : sortedNotifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No notifications</p>
                  <p className="text-[11px] text-slate-400">You are all caught up on platform updates.</p>
                </div>
              ) : (
                sortedNotifications.map((n, idx) => {
                  const isRead = n.read ?? n.isRead;
                  return (
                    <div
                      key={n._id || n.id || idx}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 transition-colors cursor-pointer flex items-start space-x-3 ${
                        !isRead ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      {/* Read/Unread Indicator Dot */}
                      <div className="pt-1 shrink-0">
                        {!isRead ? (
                          <Circle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${!isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {n.title || 'Platform Notification'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {n.message || n.text}
                        </p>

                        {n.actionRoute && (
                          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 pt-0.5">
                            <span>View details</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
