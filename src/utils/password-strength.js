/**
 * Evaluates password strength score (0 to 4) and returns strength metadata.
 * @param {string} password 
 * @returns {{ score: number, label: string, color: string, percentage: number }}
 */
export const evaluatePasswordStrength = (password = '') => {
  if (!password) {
    return { score: 0, label: 'Empty', color: 'bg-slate-200', percentage: 0 };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'Weak', color: 'bg-rose-500', percentage: 25 };
  } else if (score === 2 || score === 3) {
    return { score: 3, label: 'Medium', color: 'bg-amber-500', percentage: 65 };
  } else {
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', percentage: 100 };
  }
};

export default evaluatePasswordStrength;
