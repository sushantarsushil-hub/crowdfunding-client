'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Menu, X, PlusCircle, LayoutDashboard, LogIn, UserPlus, LogOut, Coins } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';
import NotificationDropdown from '../common/NotificationDropdown';
import Logo from '../common/Logo';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Campaigns', path: '/campaigns' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      role="banner"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200/80 py-0'
          : 'bg-white/95 backdrop-blur-sm border-b border-slate-100 py-1'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-700 font-bold bg-emerald-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/dashboard/add-campaign">
              <Button
                variant="outline"
                size="sm"
                icon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
              >
                Start Campaign
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-3">
                {/* Available credits badge */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-xs font-bold shadow-sm" aria-label={`${user?.credits ?? user?.availableCredits ?? 0} credits available`}>
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{user?.credits ?? user?.availableCredits ?? 0} Credits</span>
                </div>

                <Link href="/dashboard">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<LayoutDashboard className="w-4 h-4" />}
                  >
                    Dashboard
                  </Button>
                </Link>

                <NotificationDropdown />

                <div className="flex items-center space-x-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                  {user?.photoUrl || user?.avatar ? (
                    <img src={user.photoUrl || user.avatar} alt={user.name || 'User'} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" icon={<LogIn className="w-4 h-4" />}>
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
                    Join Platform
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 overflow-hidden"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                href="/dashboard/add-campaign"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="outline" size="md" fullWidth icon={<PlusCircle className="w-4 h-4" />}>
                  Start Campaign
                </Button>
              </Link>

              {isAuthenticated ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-xl text-xs font-bold text-amber-700">
                    <span className="flex items-center gap-1.5"><Coins className="w-4 h-4 text-amber-500" /> Available Credits</span>
                    <span>{user?.credits ?? user?.availableCredits ?? 0}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" fullWidth icon={<LayoutDashboard className="w-4 h-4" />}>
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="danger" size="md" fullWidth onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="md" fullWidth icon={<LogIn className="w-4 h-4" />}>
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="md" fullWidth icon={<UserPlus className="w-4 h-4" />}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
