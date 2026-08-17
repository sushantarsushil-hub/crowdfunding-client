export const ROLES = {
  SUPPORTER: 'supporter',
  CREATOR: 'creator',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.SUPPORTER]: 'Supporter Backer',
  [ROLES.CREATOR]: 'Campaign Creator',
  [ROLES.ADMIN]: 'Platform Administrator',
};

export const INITIAL_SIGNUP_CREDITS = {
  [ROLES.SUPPORTER]: 50,
  [ROLES.CREATOR]: 20,
  [ROLES.ADMIN]: 0,
};

export default ROLES;
