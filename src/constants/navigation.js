import { 
  LayoutDashboard, 
  Compass, 
  Heart, 
  Coins, 
  Receipt, 
  PlusCircle, 
  Layers, 
  Banknote, 
  Users, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export const SUPPORTER_NAVIGATION = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Explore Campaigns', path: '/campaigns', icon: Compass },
  { label: 'My Contributions', path: '/dashboard/supporter/contributions', icon: Heart },
  { label: 'Purchase Credit', path: '/dashboard/supporter/purchase', icon: Coins },
  { label: 'Payment History', path: '/dashboard/supporter/purchase', icon: Receipt },
];

export const CREATOR_NAVIGATION = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Add New Campaign', path: '/dashboard/creator/campaigns/new', icon: PlusCircle },
  { label: 'My Campaigns', path: '/dashboard/creator/campaigns', icon: Layers },
  { label: 'Withdrawals', path: '/dashboard/creator/withdrawals', icon: Banknote },
  { label: 'Payment History', path: '/dashboard/creator/withdrawals', icon: Receipt },
];

export const ADMIN_NAVIGATION = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
  { label: 'Manage Campaigns', path: '/dashboard/admin/campaigns', icon: ShieldCheck },
  { label: 'Withdrawal Requests', path: '/dashboard/admin/withdrawals', icon: Banknote },
  { label: 'Reports', path: '/dashboard/admin/reports', icon: AlertCircle },
];
