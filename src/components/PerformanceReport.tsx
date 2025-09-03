
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { firebaseDb } from '@/lib/firebase';
import { Users, TrendingUp, Clock, UserX, User, MessageCircle } from 'lucide-react';

const PerformanceReport = () => {
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const getAttendanceMessage = (stats: any) => {
    const { present, late, absent, total } = stats;
    const attendanceRate = parseFloat(stats.attendanceRate);
    const lateRate = (late / total) * 100;
    
    if (attendanceRate >= 95 && lateRate < 5) {
      return { message: "Excellent attendance! Always on time.", type: "excellent" };
    } else if (attendanceRate >= 90 && lateRate < 10) {
      return { message: "Good attendance with occasional lateness.", type: "good" };
    } else if (lateRate > 30) {
      return { message: "Frequently late. Needs improvement.", type: "warning" };
    } else if (lateRate > 50) {
      return { message: "Always late. Requires immediate attention.", type: "critical" };
    } else if (attendanceRate < 70) {
      return { message: "Poor attendance. Needs improvement.", type: "critical" };
    } else if (attendanceRate < 85) {
      return { message: "Average attendance. Can do better.", type: "warning" };
    } else {
      return { message: "Good attendance overall.", type: "good" };
    }
  };

  const loadPerformanceData = async () => {
    try {
      // Get current teachers
      const teachersData = await firebaseDb.getTeachers();
      const teachers = Object.values(teachersData);

      // Get historical data for the past 30 working days
      const performanceStats = await Promise.all(
        teachers.map(async (teacher: any) => {
          let present = 0;
          let late = 0;
          let absent = 0;
          let leftEarly = 0;
          let workingDaysChecked = 0;

          // Check last 30 days of history (only working days)
          for (let i = 0; i < 30; i++) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dayOfWeek = date.getDay();
            
            // Skip weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;
            
            workingDaysChecked++;
            const dateStr = date.toISOString().split('T')[0];
            
            try {
              const historyData = await firebaseDb.getHistoryByDate(dateStr);
              const teacherRecord = Object.values(historyData).find((t: any) => t.name === teacher.name);
              
              if (teacherRecord) {
                const record = teacherRecord as any;
                switch (record.status) {
                  case 'present':
                    present++;
                    break;
                  case 'late':
                    late++;
                    break;
                  case 'left early':
                    leftEarly++;
                    break;
                  case 'absent':
                    absent++;
                    break;
                }
              } else {
                absent++; // If no record, consider absent
              }
            } catch (error) {
              // If no history data for this date, consider absent
              absent++;
            }
          }

          const totalDays = workingDaysChecked;
          const attendanceRate = totalDays > 0 ? ((present + late) / totalDays * 100).toFixed(1) : '0.0';

          const stats = {
            name: teacher.name,
            trade: teacher.trade || teacher.subject,
            present,
            late,
            absent,
            leftEarly,
            total: totalDays,
            attendanceRate
          };

          return {
            ...stats,
            attendanceMessage: getAttendanceMessage(stats)
          };
        })
      );

      setPerformanceData(performanceStats);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Performance Report</h2>
        <p className="text-gray-600">Teacher performance over the last 30 working days (Monday-Friday)</p>
      </div>

      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceData.map((teacher, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                <div>
                  <div className="font-bold">{teacher.name}</div>
                  <div className="text-sm opacity-90">{teacher.trade}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Attendance Rate */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{teacher.attendanceRate}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>

                {/* Attendance Message */}
                <div className={`p-3 rounded-lg text-center ${
                  teacher.attendanceMessage.type === 'excellent' ? 'bg-green-50 border border-green-200' :
                  teacher.attendanceMessage.type === 'good' ? 'bg-blue-50 border border-blue-200' :
                  teacher.attendanceMessage.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MessageCircle className={`w-4 h-4 ${
                      teacher.attendanceMessage.type === 'excellent' ? 'text-green-600' :
                      teacher.attendanceMessage.type === 'good' ? 'text-blue-600' :
                      teacher.attendanceMessage.type === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div className={`text-sm font-medium ${
                    teacher.attendanceMessage.type === 'excellent' ? 'text-green-800' :
                    teacher.attendanceMessage.type === 'good' ? 'text-blue-800' :
                    teacher.attendanceMessage.type === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {teacher.attendanceMessage.message}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-xl font-bold text-green-600">{teacher.present}</span>
                    </div>
                    <div className="text-xs text-gray-600">Present</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-xl font-bold text-yellow-600">{teacher.late}</span>
                    </div>
                    <div className="text-xs text-gray-600">Late</div>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <UserX className="w-4 h-4 text-red-600" />
                      <span className="text-xl font-bold text-red-600">{teacher.absent}</span>
                    </div>
                    <div className="text-xs text-gray-600">Absent</div>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="text-xl font-bold text-orange-600">{teacher.leftEarly}</span>
                    </div>
                    <div className="text-xs text-gray-600">Left Early</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {performanceData.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No performance data available</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceReport;
