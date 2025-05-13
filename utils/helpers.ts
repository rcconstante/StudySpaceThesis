// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Format a date to a readable string
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format a time to a readable string
export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get appropriate color for status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Optimal':
      return '#16a34a';
    case 'Moderate':
      return '#f59e0b';
    case 'Not Optimal':
      return '#dc2626';
    default:
      return '#6b7280';
  }
};