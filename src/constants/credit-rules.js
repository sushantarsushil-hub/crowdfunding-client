export const CREDIT_PACKAGES = [
  {
    id: 'credits_100',
    packageId: 'credits_100',
    credits: 100,
    priceUSD: 10,
    label: 'Starter Supporter',
    badge: 'Popular',
    isPopular: false,
    description: 'Perfect for making your first contribution to urgent relief funds.',
  },
  {
    id: 'credits_300',
    packageId: 'credits_300',
    credits: 300,
    priceUSD: 25,
    label: 'Community Backer',
    badge: 'Most Popular',
    isPopular: true,
    description: 'Boost high-impact campaigns and unlock community recognition badges.',
  },
  {
    id: 'credits_800',
    packageId: 'credits_800',
    credits: 800,
    priceUSD: 60,
    label: 'Impact Champion',
    badge: 'Best Value',
    isPopular: false,
    description: 'Substantial backing for medical relief and clean energy causes.',
  },
  {
    id: 'credits_1500',
    packageId: 'credits_1500',
    credits: 1500,
    priceUSD: 110,
    label: 'Visionary Patron',
    badge: 'Ultimate Value',
    isPopular: false,
    description: 'Maximum credit value for philanthropists driving systemic change.',
  },
];

export const WITHDRAWAL_RULES = {
  CREDITS_PER_USD: 20, // 20 Raised Credits = $1.00 USD
  MIN_WITHDRAWAL_CREDITS: 200, // Minimum payout requirement = 200 Raised Credits ($10.00 USD)
  MIN_WITHDRAWAL_USD: 10,
};

export const INITIAL_CREDIT_BONUSES = {
  SUPPORTER: 50,
  CREATOR: 20,
};

export default {
  CREDIT_PACKAGES,
  WITHDRAWAL_RULES,
  INITIAL_CREDIT_BONUSES,
};
