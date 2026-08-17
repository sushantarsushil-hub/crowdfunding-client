export const calculatePasswordStrength = (password = '') => {
  if (!password) {
    return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400', percent: 0, feedback: [] };
  }

  let score = 0;
  const feedback = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('1 uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('1 lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('1 digit (0-9)');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('1 special character');
  }

  let label = 'Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-600';
  let percent = 25;

  if (score <= 2) {
    label = 'Weak';
    color = 'bg-rose-500';
    textColor = 'text-rose-600';
    percent = 25;
  } else if (score === 3) {
    label = 'Fair';
    color = 'bg-amber-500';
    textColor = 'text-amber-600';
    percent = 50;
  } else if (score === 4) {
    label = 'Good';
    color = 'bg-teal-500';
    textColor = 'text-teal-600';
    percent = 75;
  } else {
    label = 'Strong';
    color = 'bg-emerald-600';
    textColor = 'text-emerald-600';
    percent = 100;
  }

  return { score, label, color, textColor, percent, feedback };
};
