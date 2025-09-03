
import { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Teachers from './Teachers';
import Reports from './Reports';
import Settings from './Settings';
import ManageUsers from './ManageUsers';

interface AdminPanelProps {
  onLogout?: () => void;
  user?: any;
}

const AdminPanel = ({ onLogout, user }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const userRole = user?.role || 'reguser';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={userRole} onLogout={onLogout} user={user} />;
      case 'teachers':
        return userRole === 'admin' ? <Teachers onLogout={onLogout} user={user} /> : <Dashboard userRole={userRole} onLogout={onLogout} user={user} />;
      case 'reports':
        return userRole === 'admin' ? <Reports onLogout={onLogout} user={user} /> : <Dashboard userRole={userRole} onLogout={onLogout} user={user} />;
      case 'users':
        return userRole === 'admin' ? <ManageUsers onLogout={onLogout} user={user} /> : <Dashboard userRole={userRole} onLogout={onLogout} user={user} />;
      case 'settings':
        return userRole === 'admin' ? <Settings onLogout={onLogout} user={user} /> : <Dashboard userRole={userRole} onLogout={onLogout} user={user} />;
      case 'password':
        return <Settings onLogout={onLogout} user={user} />;
      default:
        return <Dashboard userRole={userRole} onLogout={onLogout} user={user} />;
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
        userRole={userRole}
      />
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
