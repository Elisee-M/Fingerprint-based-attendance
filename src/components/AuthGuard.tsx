
import React, { useEffect, useState } from 'react';
import { firebaseAuth } from '@/lib/firebase-auth';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = firebaseAuth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen to auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChange((authUser) => {
      if (authUser) {
        // User is signed in, get their role from localStorage
        const currentUser = firebaseAuth.getCurrentUser();
        setUser(currentUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await firebaseAuth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {React.cloneElement(children as React.ReactElement, { onLogout: handleLogout, user })}
    </div>
  );
};

export default AuthGuard;
