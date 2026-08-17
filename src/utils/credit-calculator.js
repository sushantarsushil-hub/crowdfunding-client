import { WITHDRAWAL_RULES } from '../constants/credit-rules';

export const creditsToUSD = (credits) => {
  if (!credits || credits <= 0) return 0;
  return credits / WITHDRAWAL_RULES.CREDITS_PER_USD;
};

export const usdToCredits = (usdAmount) => {
  if (!usdAmount || usdAmount <= 0) return 0;
  return usdAmount * WITHDRAWAL_RULES.CREDITS_PER_USD;
};

export const canWithdraw = (raisedCredits) => {
  return (raisedCredits || 0) >= WITHDRAWAL_RULES.MIN_WITHDRAWAL_CREDITS;
};
