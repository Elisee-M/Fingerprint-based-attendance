
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { firebaseDb } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Save, Key } from 'lucide-react';
import ChangePassword from './ChangePassword';

interface SettingsProps {
  onLogout?: () => void;
  user?: any;
}

const Settings = ({ onLogout, user }: SettingsProps) => {
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'ESSA Nyarugunga',
    workingHoursStart: '08:30',
    workingHoursEnd: '17:00',
    gracePeriod: '15'
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!isAdmin) {
      setInitialLoad(false);
      return;
    }

    try {
      const settings = await firebaseDb.getSettings();
      setSchoolSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings from Firebase.",
        variant: "destructive",
      });
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      await firebaseDb.saveSettings(schoolSettings);
      
      toast({
        title: "Settings Saved",
        description: "School settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  if (initialLoad) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
              {isAdmin ? 'Settings' : 'User Settings'}
            </h1>
            <p className="text-gray-600">
              {isAdmin ? 'Configure school and system settings' : 'Manage your account settings'}
            </p>
          </div>
        </div>

        {/* Security Settings - Available for all users */}
        <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white/50">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Password Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Change your account password for enhanced security. Make sure to use a strong password.
                </p>
              </div>
              <ChangePassword />
            </div>
          </CardContent>
        </Card>

        {/* Admin-only sections */}
        {isAdmin && (
          <>
            {/* School Information */}
            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 bg-white/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                    <Input
                      value={schoolSettings.name}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })}
                      className="bg-white border-orange-300 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (minutes)</label>
                    <Input
                      type="number"
                      value={schoolSettings.gracePeriod}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, gracePeriod: e.target.value })}
                      className="bg-white border-orange-300 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Start</label>
                    <Input
                      type="time"
                      value={schoolSettings.workingHoursStart}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, workingHoursStart: e.target.value })}
                      className="bg-white border-orange-300 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours End</label>
                    <Input
                      type="time"
                      value={schoolSettings.workingHoursEnd}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, workingHoursEnd: e.target.value })}
                      className="bg-white border-orange-300 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Timezone</h3>
                    <p className="text-gray-600">Africa/Kigali (Rwanda Time)</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Real-time Updates</h3>
                    <p className="text-gray-600">Live data synchronization with Firebase</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Data Storage</h3>
                    <p className="text-gray-600">Firebase Realtime Database</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Working Days</h3>
                    <p className="text-gray-600">Monday to Friday Only</p>
                  </div>
                </div>

                {/* ELONDA Company Information */}
                <div className="mt-8 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-300">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-gray-700 font-medium">System developed by</span>
                      <span className="font-bold text-orange-600">ELONDA</span>
                      <span className="text-red-500">❤️</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      For technical support or system issues, contact: 
                      <a href="mailto:mugiranezaelisee0@gmail.com" className="text-orange-600 hover:underline ml-1 font-medium">
                        mugiranezaelisee0@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
