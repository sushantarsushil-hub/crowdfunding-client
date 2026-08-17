'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Heart, 
  Coins, 
  LogOut 
} from 'lucide-react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/dashboard/Sidebar';
import Footer from '../../components/footer/Footer';
import Badge from '../../components/ui/Badge';
import NotificationDropdown from '../../components/common/NotificationDropdown';
import useAuth from '../../hooks/use-auth';
import Logo from '../../components/common/Logo';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const role = user?.role || 'supporter';

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
        
        {/* Dashboard Topbar / Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle Dashboard Menu"
              >
                {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Logo size="sm" />
            </div>

            {/* Dashboard Topbar Right Controls */}
            <div className="flex items-center space-x-2.5">
              
              {/* Role Badge */}
              <Badge variant={role === 'admin' ? 'error' : role === 'creator' ? 'info' : 'success'} size="md">
                {role}
              </Badge>

              {/* Available Credits Pill */}
              <Link href={role === 'creator' ? '/dashboard/creator/withdrawals' : '/dashboard/supporter/purchase'}>
                <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center space-x-1.5 hover:bg-emerald-100/80 transition-colors shadow-2xs min-h-[36px]">
                  <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{role === 'creator' ? `${user?.raisedCredits ?? user?.raised_credits ?? 0} Raised Cr` : `${user?.credits ?? 0} Credits`}</span>
                </div>
              </Link>

              {/* Reusable Notification Dropdown Component */}
              <NotificationDropdown />

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body Shell */}
        <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
          
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile Sidebar Drawer */}
          <AnimatePresence>
            {mobileDrawerOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <motion.div
                  initial={{ x: -250 }}
                  animate={{ x: 0 }}
                  exit={{ x: -250 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-72 bg-white h-full shadow-2xl p-4 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-slate-900 text-sm">Dashboard Menu</span>
                    <button
                      onClick={() => setMobileDrawerOpen(false)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <Sidebar onItemClick={() => setMobileDrawerOpen(false)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Dashboard Content Area */}
          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {children}
          </main>
        </div>

        {/* Dashboard Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
