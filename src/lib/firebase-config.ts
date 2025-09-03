
// Firebase configuration and constants
export const firebaseConfig = {
  databaseURL: "https://essa-attendance-default-rtdb.firebaseio.com/"
};

// Trade options with abbreviations
export const TRADE_OPTIONS = [
  { label: 'Computer System and Architecture (CSA)', value: 'CSA' },
  { label: 'Software Development (SOD)', value: 'SOD' },
  { label: 'Building Construction (BDC)', value: 'BDC' },
  { label: 'Food and Beverage Operation (FBO)', value: 'FBO' },
  { label: 'Tourism and Hospitality (TOR)', value: 'TOR' },
  { label: 'Accounting (ACC)', value: 'ACC' },
  { label: "O'level", value: "O'level" }
];

// Utility function to check if it's a working day (Monday-Friday)
export const isWorkingDay = (date: Date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
};
