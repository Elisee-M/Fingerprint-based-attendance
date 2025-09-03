
import { Users } from 'lucide-react';
import LiveClock from '../LiveClock';

interface DashboardHeaderProps {
  userEmail?: string;
}

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Users className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
            Attendance Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {userEmail || 'User'}</p>
        </div>
      </div>
      
      <LiveClock />
    </div>
  );
};

export default DashboardHeader;
