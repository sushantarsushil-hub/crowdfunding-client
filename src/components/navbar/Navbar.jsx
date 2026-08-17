'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Coins, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Code,
  ExternalLink,
  ChevronDown,
  Compass,
  PlusCircle,
  Banknote,
  ShieldCheck
} from 'lucide-react';
import useAuth from '../../hooks/use-auth';
import Button from '../ui/Button';
import CONFIG from '../../constants/config';
import Logo from '../common/Logo';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600" aria-label="Main Navigation">
          <Link
            href="/campaigns"
            className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl transition-colors hover:text-emerald-600 hover:bg-slate-50 ${
              isLinkActive('/campaigns') ? 'text-emerald-600 bg-emerald-50/80 font-extrabold' : ''
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Explore Campaigns</span>
          </Link>

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl transition-colors hover:text-emerald-600 hover:bg-slate-50 ${
                isLinkActive('/dashboard') ? 'text-emerald-600 bg-emerald-50/80 font-extrabold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Join as Developer Button (Links to CONFIG.GITHUB_REPO_URL) */}
          <a
            href={CONFIG.GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs min-h-[36px]"
            title="View Source Code & Join Developer Ecosystem"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Join as Developer</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </nav>

        {/* Right Section: Auth & Profile */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative flex items-center space-x-3">
              {/* Credit Balance Pill */}
              <Link href={user?.role === 'creator' ? '/dashboard/creator/withdrawals' : '/dashboard/supporter/purchase'}>
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold text-xs flex items-center space-x-1.5 hover:bg-emerald-100/60 transition-colors shadow-2xs min-h-[36px]">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>
                    {user?.role === 'creator'
                      ? `${user?.raisedCredits ?? user?.raised_credits ?? 0} Raised Cr`
                      : `${user?.credits ?? 0} Credits`}
                  </span>
                </div>
              </Link>

              {/* Profile Avatar & Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                  aria-expanded={profileDropdownOpen}
                  aria-label="User profile menu"
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-colors min-w-[44px] min-h-[44px]"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {user?.photoUrl || user?.profile_image || user?.avatar ? (
                      <img
                        src={user.photoUrl || user.profile_image || user.avatar}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 pr-1 max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Animated Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-xs font-semibold text-slate-700 space-y-1"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <span className="font-bold text-slate-900 text-sm block">{user?.name}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{user?.email}</span>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-100 text-slate-700">
                          {user?.role || 'supporter'}
                        </span>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Dashboard Overview</span>
                      </Link>

                      {user?.role === 'supporter' && (
                        <>
                          <Link href="/dashboard/supporter/contributions" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>My Contributions</span>
                          </Link>
                          <Link href="/dashboard/supporter/purchase" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]">
                            <Coins className="w-4 h-4 text-amber-500" />
                            <span>Purchase Credits</span>
                          </Link>
                        </>
                      )}

                      {user?.role === 'creator' && (
                        <>
                          <Link href="/dashboard/creator/campaigns/new" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]">
                            <PlusCircle className="w-4 h-4 text-emerald-600" />
                            <span>Add Campaign</span>
                          </Link>
                          <Link href="/dashboard/creator/withdrawals" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]">
                            <Banknote className="w-4 h-4 text-teal-600" />
                            <span>Withdrawals</span>
                          </Link>
                        </>
                      )}

                      {user?.role === 'admin' && (
                        <>
                          <Link href="/dashboard/admin/users" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]">
                            <User className="w-4 h-4 text-indigo-600" />
                            <span>Manage Users</span>
                          </Link>
                          <Link href="/dashboard/admin/campaigns" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 min-h-[44px]">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Manage Campaigns</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 text-left font-bold min-h-[44px]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
            className="p-2 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Framer Motion Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 font-semibold text-xs text-slate-700"
          >
            <Link
              href="/campaigns"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 py-3 px-3 rounded-xl hover:bg-slate-50 min-h-[44px]"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Campaigns</span>
            </Link>

            {isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 py-3 px-3 rounded-xl hover:bg-slate-50 text-emerald-600 font-bold min-h-[44px]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Mobile Join as Developer Link */}
            <a
              href={CONFIG.GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white font-bold min-h-[44px]"
            >
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Join as Developer</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-2xl">
                  <span className="font-bold text-slate-900">{user?.name}</span>
                  <span className="text-emerald-700 font-extrabold">{user?.credits ?? 0} Cr</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-3 px-3 text-rose-600 font-bold flex items-center space-x-2 min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full min-h-[44px]">Log In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full min-h-[44px]">Register Account</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
