
import { firebaseAuth } from '@/lib/firebase';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsCards from './dashboard/StatsCards';
import TeachersTable from './dashboard/TeachersTable';
import CompanyInfo from './dashboard/CompanyInfo';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface DashboardProps {
  userRole?: string;
  onLogout?: () => void;
  user?: any;
}

const Dashboard = ({ onLogout, user, userRole }: DashboardProps) => {
  const { stats, allTeachers, loading, endDay } = useDashboardData();
  const [isEndingDay, setIsEndingDay] = useState(false);

  const currentUser = firebaseAuth.getCurrentUser();
  const isAdmin = (userRole || currentUser?.role) === 'admin';

  const handleEndDay = async () => {
    try {
      setIsEndingDay(true);
      await endDay();
      alert('Day ended successfully! Data saved to history.');
    } catch (error) {
      alert('Error ending day. Please try again.');
      console.error('Error ending day:', error);
    } finally {
      setIsEndingDay(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header with user info and live clock */}
        <DashboardHeader userEmail={user?.email} />

        {/* End Day Button with Confirmation - Show only for admin */}
        {isAdmin && (
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  disabled={isEndingDay}
                >
                  <Calendar className="w-4 h-4" />
                  {isEndingDay ? 'Ending Day...' : 'End Day'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Day Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to end the day? This will:
                    <br />
                    • Save all current attendance data to history
                    <br />
                    <br />
                    This action will archive today's data for reporting purposes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleEndDay}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, End Day
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Statistics Cards - Show only for admin */}
        {isAdmin && <StatsCards stats={stats} />}

        {/* All Teachers List - Show complete attendance for the day */}
        <TeachersTable allTeachers={allTeachers} />

        {/* ELONDA Company Info - Show for both admin and regular users */}
        <CompanyInfo />
      </div>
    </div>
  );
};

export default Dashboard;
