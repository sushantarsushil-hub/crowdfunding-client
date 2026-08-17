import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NotificationDropdown from '../common/NotificationDropdown';
import { 
  HeartHandshake, 
  Home,
  Compass,
  Heart,
  CreditCard,
  History,
  PlusCircle,
  Layers,
  Banknote,
  Users,
  ShieldCheck,
  Landmark,
  BarChart3,
  ArrowLeft, 
  Menu, 
  X, 
  Bell, 
  Search,
  LogOut,
  Coins,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';
import Logo from '../common/Logo';

export const DashboardLayout = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = (user?.role || 'supporter').toLowerCase();

  // Dynamic Navigation Configuration per Role
  const roleNavItems = {
    supporter: [
      { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Home', path: '/', icon: Home, external: true },
      { name: 'Explore Campaigns', path: '/campaigns', icon: Compass, external: true },
      { name: 'My Contributions', path: '/dashboard/my-contributions', icon: Heart },
      { name: 'Purchase Credit', path: '/dashboard/purchase-credits', icon: CreditCard },
      { name: 'Payment History', path: '/dashboard/payment-history', icon: History },
    ],
    creator: [
      { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Home', path: '/', icon: Home, external: true },
      { name: 'Add New Campaign', path: '/dashboard/create-campaign', icon: PlusCircle },
      { name: 'My Campaigns', path: '/dashboard/my-campaigns', icon: Layers },
      { name: 'Contributions to Review', path: '/dashboard/contributions-to-review', icon: UserCheck },
      { name: 'Withdrawals', path: '/dashboard/withdrawals', icon: Banknote },
      { name: 'Payment History', path: '/dashboard/payment-history', icon: History },
    ],
    admin: [
      { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Home', path: '/', icon: Home, external: true },
      { name: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
      { name: 'Manage Campaigns', path: '/dashboard/admin/campaigns', icon: ShieldCheck },
      { name: 'Withdrawal Requests', path: '/dashboard/admin/withdrawals', icon: Landmark },
      { name: 'Reports', path: '/dashboard/admin/reports', icon: BarChart3 },
    ],
  };

  const navItems = roleNavItems[userRole] || roleNavItems.supporter;

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    if (current) return current.name;
    if (location.pathname === '/dashboard/profile') return 'Account Profile Settings';
    return 'Dashboard';
  };

  const handleManualCreditRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentCreditBalance = userRole === 'creator'
    ? (user?.raisedCredits ?? 0)
    : (user?.credits ?? user?.availableCredits ?? 0);

  const displayUserPhoto = user?.photoUrl || user?.avatar;

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '0.75rem',
          },
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out shrink-0 border-r border-slate-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <Logo variant="dark" size="sm" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic Role Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {userRole} Portal
              </span>
              <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {userRole}
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive && !item.external
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & User Info */}
        <div className="p-5 border-t border-slate-800 space-y-3">
          {/* Available Credits Card */}
          <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{userRole === 'creator' ? 'Raised Credits' : 'Available Credits'}</span>
              </span>
              <button
                onClick={handleManualCreditRefresh}
                title="Refresh Credit Balance"
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
            <div className="text-xl font-extrabold text-emerald-400">
              {currentCreditBalance}{' '}
              <span className="text-xs font-normal text-slate-400">Cr</span>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Return to Public Website</span>
          </Link>

          {/* User Profile Card */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between px-2">
            <Link to="/dashboard/profile" className="flex items-center space-x-2.5 overflow-hidden hover:opacity-80 transition-opacity">
              {displayUserPhoto ? (
                <img src={displayUserPhoto} alt={user?.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role || 'supporter'}</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Credits Header Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600">Credits:</span>
              <span className="text-emerald-600">{user?.credits ?? user?.availableCredits ?? 0}</span>
              <button onClick={handleManualCreditRefresh} title="Refresh credits" className="p-0.5 hover:bg-slate-200 rounded">
                <RefreshCw className={`w-3 h-3 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Notifications Dropdown */}
            <NotificationDropdown />

            {/* Quick Action per role */}
            {userRole === 'creator' && (
              <Link to="/dashboard/create-campaign" className="hidden sm:block">
                <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                  New Campaign
                </Button>
              </Link>
            )}
            {userRole === 'supporter' && (
              <Link to="/dashboard/purchase-credits" className="hidden sm:block">
                <Button variant="primary" size="sm" icon={<CreditCard className="w-4 h-4" />}>
                  Buy Credits
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} FundFlow Management System</span>
          <span className="capitalize font-semibold text-slate-600">Logged in as {userRole}</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
