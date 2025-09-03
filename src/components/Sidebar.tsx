import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userRole?: string;
}

const Sidebar = ({ activeTab, onTabChange, onLogout, userRole }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = userRole === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', allowedRoles: ['admin', 'reguser'] },
    { id: 'teachers', label: 'Teachers', icon: '👥', allowedRoles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: '📈', allowedRoles: ['admin'] },
    { id: 'users', label: 'Manage Users', icon: '👤', allowedRoles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: '⚙️', allowedRoles: ['admin'] },
    { id: 'password', label: 'Change Password', icon: '🔑', allowedRoles: ['reguser'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(userRole || 'reguser')
  );

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">ESSA Nyarugunga</h1>
              <p className="text-sm text-gray-600">
                {isAdmin ? 'Admin Panel' : 'User Panel'}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hidden md:flex"
          >
            {collapsed ? '→' : '←'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id && "bg-blue-600 text-white"
                )}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          onClick={onLogout}
        >
          <span className="mr-3">🚪</span>
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        "bg-white shadow-lg transition-all duration-300 h-screen flex-col hidden md:flex",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 z-50 flex flex-col md:hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
