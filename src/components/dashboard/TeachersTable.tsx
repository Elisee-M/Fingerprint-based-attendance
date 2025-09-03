
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface TeachersTableProps {
  allTeachers: any[];
}

const getStatusBadgeStyle = (status: string) => {
  switch (status.trim()) {
    case 'present':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'late':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'left_early':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'gone_home_on_time':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'absent':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatStatusLabel = (status: string) => {
  return status.replace('left_early', 'left early').replace('gone_home_on_time', 'gone home on time');
};

const TeachersTable = ({ allTeachers }: TeachersTableProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Today's Teacher Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Trade</th>
                <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Time In</th>
                <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Time Out</th>
                <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {allTeachers.map((teacher, index) => (
                <tr key={teacher.id} className={`border-b hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 md:px-6 font-medium text-gray-900">{teacher.name}</td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.trade || teacher.subject}</td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.time_in || 'Not checked in'}</td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.time_out || 'Not checked out'}</td>
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex flex-wrap gap-1">
                      {teacher.status.split(', ').map((status: string, idx: number) => (
                        <Badge
                          key={idx}
                          className={`text-xs font-semibold border ${getStatusBadgeStyle(status)}`}
                          variant="outline"
                        >
                          {formatStatusLabel(status)}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allTeachers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No teacher data available</p>
              <p className="text-gray-400 text-sm">Teachers will appear here once they are added to the system</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeachersTable;
