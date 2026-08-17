// Credit System Constants & Helper Functions

export const INITIAL_CREDITS = {
  supporter: 50,
  creator: 20,
  admin: 0,
};

export const CREDIT_PURCHASE_PACKAGES = [
  {
    id: 'package_100',
    credits: 100,
    priceUSD: 10,
    pricePerCredit: 0.10,
    popular: false,
    tagline: 'Starter Pack',
  },
  {
    id: 'package_300',
    credits: 300,
    priceUSD: 25,
    pricePerCredit: 0.083,
    popular: true,
    tagline: 'Most Popular',
  },
  {
    id: 'package_800',
    credits: 800,
    priceUSD: 60,
    pricePerCredit: 0.075,
    popular: false,
    tagline: 'Best Value',
  },
  {
    id: 'package_1500',
    credits: 1500,
    priceUSD: 110,
    pricePerCredit: 0.073,
    popular: false,
    tagline: 'Ultimate Backer',
  },
];

export const WITHDRAWAL_RULES = {
  CREDITS_PER_USD: 20, // 20 raised credits = $1
  MINIMUM_WITHDRAWAL_CREDITS: 200, // 200 credits = $10 minimum cashout
  MINIMUM_WITHDRAWAL_USD: 10,
};

/**
 * Calculates USD payout value for a given amount of raised credits.
 * @param {number} credits 
 * @returns {number} Amount in USD
 */
export const calculateUSDFromCredits = (credits) => {
  if (!credits || credits <= 0) return 0;
  return Number((credits / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2));
};

/**
 * Calculates required raised credits for a given USD amount.
 * @param {number} usd 
 * @returns {number} Credits needed
 */
export const calculateCreditsFromUSD = (usd) => {
  if (!usd || usd <= 0) return 0;
  return Math.ceil(usd * WITHDRAWAL_RULES.CREDITS_PER_USD);
};

/**
 * Validates a withdrawal request.
 * @param {number} requestedCredits 
 * @param {number} availableRaisedCredits 
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateWithdrawalRequest = (requestedCredits, availableRaisedCredits) => {
  if (!requestedCredits || requestedCredits <= 0) {
    return { isValid: false, error: 'Please enter a valid credit amount to withdraw.' };
  }
  if (requestedCredits < WITHDRAWAL_RULES.MINIMUM_WITHDRAWAL_CREDITS) {
    return {
      isValid: false,
      error: `Minimum withdrawal is ${WITHDRAWAL_RULES.MINIMUM_WITHDRAWAL_CREDITS} credits ($${WITHDRAWAL_RULES.MINIMUM_WITHDRAWAL_USD} USD).`,
    };
  }
  if (requestedCredits > availableRaisedCredits) {
    return { isValid: false, error: 'Requested credits exceed your current available raised credits balance.' };
  }
  return { isValid: true, error: null };
};
