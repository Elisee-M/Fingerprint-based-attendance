
import { firebaseUsers } from './firebase-users';

// Authentication functions
export const firebaseAuth = {
  signIn: async (email: string, password: string) => {
    try {
      const credentials = await firebaseUsers.getCredentials();
      
      // Check admin credentials
      if (credentials.admin && credentials.admin.email === email && credentials.admin.password === password) {
        const user = { uid: "admin", email, role: "admin" };
        localStorage.setItem("current_user", JSON.stringify(user));
        return { user };
      }
      
      // Check regular user credentials
      if (credentials.reguser) {
        for (const [userId, userData] of Object.entries(credentials.reguser)) {
          const typedUserData = userData as { email: string; password: string };
          if (typedUserData.email === email && typedUserData.password === password) {
            const user = { uid: userId, email, role: "reguser" };
            localStorage.setItem("current_user", JSON.stringify(user));
            return { user };
          }
        }
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  },
  
  signOut: async () => {
    localStorage.removeItem("current_user");
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem("current_user");
    return user ? JSON.parse(user) : null;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const currentUser = firebaseAuth.getCurrentUser();
      if (!currentUser) {
        throw new Error("No user logged in");
      }

      const credentials = await firebaseUsers.getCredentials();
      
      // Verify current password first
      if (currentUser.role === 'admin') {
        if (!credentials.admin || credentials.admin.password !== currentPassword) {
          throw new Error("Current password is incorrect");
        }
        // Update admin password
        credentials.admin.password = newPassword;
      } else if (currentUser.role === 'reguser') {
        if (!credentials.reguser || !credentials.reguser[currentUser.uid] || 
            credentials.reguser[currentUser.uid].password !== currentPassword) {
          throw new Error("Current password is incorrect");
        }
        // Update regular user password
        credentials.reguser[currentUser.uid].password = newPassword;
      }

      // Save updated credentials
      await fetch('https://essa-attendance-default-rtdb.firebaseio.com/credentials.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};
