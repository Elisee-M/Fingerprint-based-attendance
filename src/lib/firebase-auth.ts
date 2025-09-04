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
import { auth, database } from './firebase-config';

export interface UserData {
  name: string;
  role: 'admin' | 'reguser';
}

// Authentication functions
export const firebaseAuth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user role from database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val() as UserData;
        const userWithRole = {
          uid: user.uid,
          email: user.email,
          role: userData.role,
          name: userData.name
        };
        
        localStorage.setItem("current_user", JSON.stringify(userWithRole));
        return { user: userWithRole };
      } else {
        throw new Error("User data not found in database");
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  },

  // Create new user (admin only)
  createUser: async (email: string, password: string, name: string, role: 'admin' | 'reguser') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in database (no password, no email)
      const userData: UserData = { name, role };
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userData);
      
      return { uid: user.uid, email: user.email, ...userData };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create user");
    }
  },

  // Delete user (admin only)
  deleteUser: async (uid: string) => {
    try {
      // Remove from database first
      const userRef = ref(database, `users/${uid}`);
      await remove(userRef);
      
      // Note: Deleting from Firebase Auth requires the user to be currently signed in
      // or requires Firebase Admin SDK. For now, we'll only remove from database.
      // In production, you'd need a Cloud Function to delete from Auth.
      
      return { success: true };
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
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.entries(usersData).map(([uid, data]) => ({
          uid,
          ...(data as UserData)
        }));
      }
      
      return [];
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch users");
    }
  }
};