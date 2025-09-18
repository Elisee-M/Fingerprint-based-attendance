
import { firebaseConfig } from './firebase-config';
import { auth } from './firebase-config';

// Get auth token for requests
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Settings management
export const firebaseSettings = {
  async getSettings() {
    try {
      const token = await getAuthToken();
      const url = token 
        ? `${firebaseConfig.databaseURL}settings.json?auth=${token}`
        : `${firebaseConfig.databaseURL}settings.json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.error) {
        console.error('Database error:', data.error);
        return {
          name: 'ESSA Nyarugunga',
          workingHoursStart: '08:30',
          workingHoursEnd: '17:00',
          gracePeriod: '15'
        };
      }
      
      return data || {
        name: 'ESSA Nyarugunga',
        workingHoursStart: '08:30',
        workingHoursEnd: '17:00',
        gracePeriod: '15'
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        name: 'ESSA Nyarugunga',
        workingHoursStart: '08:30',
        workingHoursEnd: '17:00',
        gracePeriod: '15'
      };
    }
  },

  async saveSettings(settings: any) {
    try {
      const token = await getAuthToken();
      const url = token 
        ? `${firebaseConfig.databaseURL}settings.json?auth=${token}`
        : `${firebaseConfig.databaseURL}settings.json`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      if (data && data.error) {
        console.error('Database error:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
};
