/**
 * Centralized Query Keys Factory for TanStack Query
 * Organizes query keys across all 9 domains to ensure consistent cache invalidation and zero duplicate keys.
 */
export const QUERY_KEYS = {
  // 1. Campaigns & Details
  campaigns: {
    all: ['campaigns'],
    list: (filters = {}) => ['campaigns', 'list', filters],
    detail: (id) => ['campaigns', 'detail', id],
    my: (params = {}) => ['campaigns', 'my', params],
    adminAll: (params = {}) => ['campaigns', 'admin', params],
    pending: (params = {}) => ['campaigns', 'pending', params],
  },

  // 2. Contributions
  contributions: {
    all: ['contributions'],
    my: (params = {}) => ['contributions', 'my', params],
    creatorPending: (params = {}) => ['contributions', 'creator-pending', params],
  },

  // 3. Payments & Credit Purchases
  payments: {
    all: ['payments'],
    my: (params = {}) => ['payments', 'my', params],
    history: (params = {}) => ['payments', 'history', params],
  },

  // 4. Withdrawals
  withdrawals: {
    all: ['withdrawals'],
    my: (params = {}) => ['withdrawals', 'my', params],
    adminAll: (params = {}) => ['withdrawals', 'admin', params],
    pending: (params = {}) => ['withdrawals', 'pending', params],
  },

  // 5. Notifications
  notifications: {
    all: ['notifications'],
    list: (params = {}) => ['notifications', 'list', params],
    unreadCount: ['notifications', 'unreadCount'],
  },

  // 6. Users & Profile
  users: {
    all: ['users'],
    profile: ['users', 'profile'],
    me: ['users', 'me'],
    transactions: (params = {}) => ['users', 'transactions', params],
    adminList: (params = {}) => ['users', 'admin', params],
  },

  // 7. Admin Statistics
  admin: {
    all: ['admin'],
    stats: ['admin', 'stats'],
  },

  // 8. Reports
  reports: {
    all: ['reports'],
    adminList: (params = {}) => ['reports', 'admin', params],
  },
};

export default QUERY_KEYS;
