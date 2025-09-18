
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

// User credentials management
export const firebaseUsers = {
  async getCredentials() {
    try {
      const token = await getAuthToken();
      const url = token 
        ? `${firebaseConfig.databaseURL}credentials.json?auth=${token}`
        : `${firebaseConfig.databaseURL}credentials.json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.error) {
        console.error('Database error:', data.error);
        return {};
      }
      
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
      
      const token = await getAuthToken();
      const url = token 
        ? `${firebaseConfig.databaseURL}credentials.json?auth=${token}`
        : `${firebaseConfig.databaseURL}credentials.json`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (data && data.error) {
        console.error('Database error:', data.error);
        throw new Error(data.error);
      }
      
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
        
        const token = await getAuthToken();
        const url = token 
          ? `${firebaseConfig.databaseURL}credentials.json?auth=${token}`
          : `${firebaseConfig.databaseURL}credentials.json`;
        
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        if (data && data.error) {
          console.error('Database error:', data.error);
          throw new Error(data.error);
        }
      }
    } catch (error) {
      console.error('Error deleting regular user:', error);
      throw error;
    }
  }
};
