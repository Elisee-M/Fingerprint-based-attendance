
import { firebaseConfig } from './firebase-config';

// History management functions
export const saveToHistory = async (date: string, data: any) => {
  try {
    await fetch(`${firebaseConfig.databaseURL}history/daily/${date}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Error saving to history:', error);
    throw error;
  }
};

export const getHistoryByDate = async (date: string) => {
  try {
    const response = await fetch(`${firebaseConfig.databaseURL}history/daily/${date}.json`);
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('Error fetching history:', error);
    return {};
  }
};

// Weekly history management
export const saveWeeklyHistory = async (weekStart: string, weekData: any) => {
  try {
    await fetch(`${firebaseConfig.databaseURL}history/weekly/${weekStart}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(weekData)
    });
  } catch (error) {
    console.error('Error saving weekly history:', error);
    throw error;
  }
};

// Monthly history management
export const saveMonthlyHistory = async (month: string, monthData: any) => {
  try {
    await fetch(`${firebaseConfig.databaseURL}history/monthly/${month}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monthData)
    });
  } catch (error) {
    console.error('Error saving monthly history:', error);
    throw error;
  }
};
