export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_DETAILS: (id) => `/campaigns/${id}`,
  
  DASHBOARD: {
    HOME: '/dashboard',
    
    SUPPORTER: {
      CONTRIBUTIONS: '/dashboard/supporter/contributions',
      PURCHASE: '/dashboard/supporter/purchase',
    },
    
    CREATOR: {
      CAMPAIGNS: '/dashboard/creator/campaigns',
      NEW_CAMPAIGN: '/dashboard/creator/campaigns/new',
      WITHDRAWALS: '/dashboard/creator/withdrawals',
    },
    
    ADMIN: {
      USERS: '/dashboard/admin/users',
      CAMPAIGNS: '/dashboard/admin/campaigns',
      WITHDRAWALS: '/dashboard/admin/withdrawals',
      REPORTS: '/dashboard/admin/reports',
    },
  },
};

export default ROUTES;
