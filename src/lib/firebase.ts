
// Main Firebase module - exports all functionality  
export { TRADE_OPTIONS, isWorkingDay } from './firebase-config';
export { firebaseDatabase } from './firebase-database';
export { firebaseAuth } from './firebase-auth';
export { firebaseSettings } from './firebase-settings';
export { firebaseUsers } from './firebase-users';
export { saveToHistory, getHistoryByDate, saveWeeklyHistory, saveMonthlyHistory } from './firebase-history';
export { calculateTeacherStatus } from './firebase-utils';

// Import all modules for the firebaseDb object
import { firebaseDatabase } from './firebase-database';
import { firebaseSettings } from './firebase-settings';
import { firebaseUsers } from './firebase-users';
import { saveToHistory, getHistoryByDate, saveWeeklyHistory, saveMonthlyHistory } from './firebase-history';

// Maintain backward compatibility with the old firebaseDb object
export const firebaseDb = {
  ...firebaseDatabase,
  ...firebaseSettings,
  ...firebaseUsers,
  saveToHistory,
  getHistoryByDate,
  saveWeeklyHistory,
  saveMonthlyHistory
};
