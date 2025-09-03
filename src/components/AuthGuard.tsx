
import React, { useEffect, useState } from 'react';
import { firebaseAuth } from '@/lib/firebase';
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
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await firebaseAuth.signIn(email, password);
      setUser(result.user);
    } catch (error) {
      throw error;
    }
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
