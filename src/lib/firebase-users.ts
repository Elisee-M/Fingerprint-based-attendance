
import { firebaseConfig } from './firebase-config';

// User credentials management
export const firebaseUsers = {
  async getCredentials() {
    try {
      const response = await fetch(`${firebaseConfig.databaseURL}credentials.json`);
      const data = await response.json();
      return data || {};
    } catch (error) {
      console.error('Error fetching credentials:', error);
      return {};
    }
  },

  async addRegularUser(userData: { email: string; password: string }) {
    try {
      const credentials = await this.getCredentials();
      if (!credentials.reguser) {
        credentials.reguser = {};
      }
      
      const userId = `user${Date.now()}`;
      credentials.reguser[userId] = userData;
      
      await fetch(`${firebaseConfig.databaseURL}credentials.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      return userId;
    } catch (error) {
      console.error('Error adding regular user:', error);
      throw error;
    }
  },

  async deleteRegularUser(userId: string) {
    try {
      const credentials = await this.getCredentials();
      if (credentials.reguser && credentials.reguser[userId]) {
        delete credentials.reguser[userId];
        
        await fetch(`${firebaseConfig.databaseURL}credentials.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials)
        });
      }
    } catch (error) {
      console.error('Error deleting regular user:', error);
      throw error;
    }
  }
};
