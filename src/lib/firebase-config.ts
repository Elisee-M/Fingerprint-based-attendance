
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH0AJ2n4vvNewipDmXMwh5_kac0d7orCo",
  authDomain: "essa-attendance.firebaseapp.com",
  databaseURL: "https://essa-attendance-default-rtdb.firebaseio.com/",
  projectId: "essa-attendance",
  storageBucket: "essa-attendance.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

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

export { firebaseConfig };
