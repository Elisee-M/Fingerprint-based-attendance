
import { firebaseConfig } from './firebase-config';

// Settings management
export const firebaseSettings = {
  async getSettings() {
    try {
      const response = await fetch(`${firebaseConfig.databaseURL}settings.json`);
      const data = await response.json();
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
      await fetch(`${firebaseConfig.databaseURL}settings.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
};
