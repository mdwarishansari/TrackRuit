import { format, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
};

export const getDaysSince = (dateString) => {
  if (!dateString) return 0;
  try {
    return differenceInDays(new Date(), parseISO(dateString));
  } catch {
    return 0;
  }
};

export const generateGradient = (color1, color2) => {
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};