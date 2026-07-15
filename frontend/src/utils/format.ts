import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'KSh'): string => {
  return `${currency} ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-KE');
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date, formatStr: string = 'dd MMM yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return String(date);
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd MMM yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return String(date);
  }
};

export const formatPhone = (phone: string): string => {
  // Format Kenyan phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const calculateMargin = (cost: number, price: number): number => {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
};

export const calculateMarkup = (cost: number, price: number): number => {
  if (cost === 0) return 0;
  return ((price - cost) / cost) * 100;
};
