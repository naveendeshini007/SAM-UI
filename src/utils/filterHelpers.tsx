// src/utils/filterHelpers.ts

export const STATES = [
  { label: 'California', value: 'CA' },
  { label: 'New York', value: 'NY' },
  { label: 'Texas', value: 'TX' },
  { label: 'Washington', value: 'WA' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Florida', value: 'FL' },
];

export const MONTHS = [
  { label: 'January', value: '01' }, { label: 'February', value: '02' },
  { label: 'March', value: '03' }, { label: 'April', value: '04' },
  { label: 'May', value: '05' }, { label: 'June', value: '06' },
  { label: 'July', value: '07' }, { label: 'August', value: '08' },
  { label: 'September', value: '09' }, { label: 'October', value: '10' },
  { label: 'November', value: '11' }, { label: 'December', value: '12' },
];

// Generates an array of years from current year down to 10 years ago
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => (currentYear - i).toString());
};

// Mock cities mapping (In a real app, this might come from an API)
export const CITIES_BY_STATE: Record<string, string[]> = {
  CA: ['San Francisco', 'Los Angeles', 'San Diego'],
  NY: ['New York', 'Buffalo', 'Albany'],
  TX: ['Austin', 'Houston', 'Dallas'],
  WA: ['Seattle', 'Tacoma'],
  MA: ['Boston', 'Cambridge'],
};