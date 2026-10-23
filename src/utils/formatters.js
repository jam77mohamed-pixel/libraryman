// Date, currency, string and calculation utilities

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const calculateDaysOverdue = (dueDateStr, returnDateStr = null) => {
  if (!dueDateStr) return 0;
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(23, 59, 59, 999);
  const compareDate = returnDateStr ? new Date(returnDateStr) : new Date();
  
  if (compareDate <= dueDate) {
    return 0;
  }
  
  const diffTime = Math.abs(compareDate - dueDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const DAILY_FINE_RATE = 1.0; // $1.00 per day overdue

export const calculateFineAmount = (daysOverdue, rate = DAILY_FINE_RATE) => {
  if (daysOverdue <= 0) return 0;
  return Number((daysOverdue * rate).toFixed(2));
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const generateISBN = () => {
  const prefix = '978';
  const group = Math.floor(1 + Math.random() * 9);
  const publisher = Math.floor(100 + Math.random() * 900);
  const title = Math.floor(10000 + Math.random() * 90000);
  const check = Math.floor(Math.random() * 10);
  return `${prefix}-${group}-${publisher}-${title}-${check}`;
};

export const generateMembershipId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `LIB-${year}-${randomNum}`;
};
