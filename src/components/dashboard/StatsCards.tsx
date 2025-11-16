
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, User, UserX, Home } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalTeachers: number;
    presentTeachers: number;
    lateTeachers: number;
    absentTeachers: number;
    leftEarlyTeachers: number;
    goneHomeOnTimeTeachers: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-blue-100">Total Teachers</CardTitle>
          <Users className="w-6 h-6 text-blue-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold">{stats.totalTeachers}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-green-100">Present Today</CardTitle>
          <User className="w-6 h-6 text-green-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold">{stats.presentTeachers}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-yellow-100">Late Today</CardTitle>
          <Clock className="w-6 h-6 text-yellow-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold">{stats.lateTeachers}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-red-100">Absent Today</CardTitle>
          <UserX className="w-6 h-6 text-red-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold">{stats.absentTeachers}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-orange-100">Left Early</CardTitle>
          <Clock className="w-6 h-6 text-orange-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold">{stats.leftEarlyTeachers}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-purple-100">Left On Time</CardTitle>
          <Home className="w-6 h-6 text-purple-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl md:text-4xl font-bold">{stats.goneHomeOnTimeTeachers}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
