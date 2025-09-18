import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updatePassword, 
  sendPasswordResetEmail,
  deleteUser,
  User
} from 'firebase/auth';
import { ref, set, get, remove } from 'firebase/database';
import { auth, database, firebaseConfig } from './firebase-config';

export interface UserData {
  name: string;
  role: 'admin' | 'reguser';
}

// Get auth token for requests
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Authentication functions
export const firebaseAuth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase Auth successful for user:", user.uid);
      
      // Fetch user role from database using REST API
      const token = await user.getIdToken();
      const url = `${firebaseConfig.databaseURL}users/${user.uid}.json?auth=${token}`;
      
      console.log("Attempting to fetch user data from database...");
      const response = await fetch(url);
      const userData = await response.json();
      
      if (userData && !userData.error) {
        console.log("User data found:", userData);
        const userWithRole = {
          uid: user.uid,
          email: user.email,
          role: userData.role,
          name: userData.name
        };
        
        localStorage.setItem("current_user", JSON.stringify(userWithRole));
        return { user: userWithRole };
      } else {
        console.error("User data not found in database for UID:", user.uid);
        // Create default user data if not exists
        const defaultUserData: UserData = { 
          name: user.email?.split('@')[0] || 'User', 
          role: 'reguser' 
        };
        
        const createResponse = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(defaultUserData)
        });
        
        if (createResponse.ok) {
          console.log("Created default user data:", defaultUserData);
          
          const userWithRole = {
            uid: user.uid,
            email: user.email,
            role: defaultUserData.role,
            name: defaultUserData.name
          };
          
          localStorage.setItem("current_user", JSON.stringify(userWithRole));
          return { user: userWithRole };
        } else {
          throw new Error("Failed to create user data in database");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        throw new Error("No user found with this email address");
      } else if (error.code === 'auth/wrong-password') {
        throw new Error("Incorrect password");
      } else if (error.code === 'auth/invalid-email') {
        throw new Error("Invalid email address format");
      } else if (error.code === 'auth/user-disabled') {
        throw new Error("This user account has been disabled");
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error("Too many failed login attempts. Please try again later");
      } else if (error.code === 'permission-denied' || error.message.includes('permission-denied')) {
        throw new Error("Database access denied. Please contact administrator");
      } else {
        throw new Error(error.message || "Login failed");
      }
    }
  },

  // Create new user (admin only)
  createUser: async (email: string, password: string, name: string, role: 'admin' | 'reguser') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in database using REST API
      const userData: UserData = { name, role };
      const token = await user.getIdToken();
      const url = `${firebaseConfig.databaseURL}users/${user.uid}.json?auth=${token}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        return { uid: user.uid, email: user.email, ...userData };
      } else {
        throw new Error("Failed to store user data in database");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to create user");
    }
  },

  // Delete user (admin only)
  deleteUser: async (uid: string) => {
    try {
      // Remove from database using REST API
      const token = await getAuthToken();
      const url = token 
        ? `${firebaseConfig.databaseURL}users/${uid}.json?auth=${token}`
        : `${firebaseConfig.databaseURL}users/${uid}.json`;
      
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        throw new Error("Failed to delete user from database");
      }
      
      // Note: Deleting from Firebase Auth requires the user to be currently signed in
      // or requires Firebase Admin SDK. For now, we'll only remove from database.
      // In production, you'd need a Cloud Function to delete from Auth.
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete user");
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("current_user");
    } catch (error: any) {
      throw new Error(error.message || "Sign out failed");
    }
  },
  
  // Get current user from localStorage (for immediate access)
  getCurrentUser: () => {
    const user = localStorage.getItem("current_user");
    return user ? JSON.parse(user) : null;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Change password (user must be currently authenticated)
  changePassword: async (newPassword: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in");
      }
      
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to change password");
    }
  },

  // Send password reset email
  sendPasswordReset: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Failed to send password reset email");
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const token = await getAuthToken();
      const url = token 
        ? `${firebaseConfig.databaseURL}users.json?auth=${token}`
        : `${firebaseConfig.databaseURL}users.json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.error) {
        console.error('Database error:', data.error);
        throw new Error(data.error);
      }
      
      if (data) {
        return Object.entries(data).map(([uid, userData]) => ({
          uid,
          ...(userData as UserData)
        }));
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.message || "Failed to fetch users");
    }
  }
};