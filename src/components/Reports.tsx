
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { firebaseDb } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { FileText, Download, Calendar, BarChart3, AlertCircle } from 'lucide-react';

interface ReportsProps {
  onLogout?: () => void;
  user?: any;
}

const Reports = ({ onLogout, user }: ReportsProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState<string>('daily');
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const generateDateRange = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(start);
    
    while (current <= end) {
      // Include all days (including weekends)
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const handleGenerateReport = async () => {
    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }

    if (reportType === 'longterm' && (!endDate || startDate > endDate)) {
      toast({
        title: "Error",
        description: "Please select valid start and end dates for long time reports.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setReportData([]);

    try {
      if (reportType === 'daily') {
        const dateStr = startDate.toISOString().split('T')[0];
        const historyData = await firebaseDb.getHistoryByDate(dateStr);
        
        if (!historyData || Object.keys(historyData).length === 0) {
          setErrorMessage(`No attendance data found for ${dateStr}. Make sure attendance was recorded on this date.`);
          toast({
            title: "No Data Found",
            description: `No attendance data available for ${dateStr}`,
            variant: "destructive",
          });
          return;
        }

        const teachersArray = Object.values(historyData);
        setReportData(teachersArray);
        
      } else if (reportType === 'longterm') {
        const dateRange = generateDateRange(startDate, endDate!);
        const allData: any[] = [];
        const missingDates: string[] = [];

        for (const date of dateRange) {
          try {
            const historyData = await firebaseDb.getHistoryByDate(date);
            if (historyData && Object.keys(historyData).length > 0) {
              const teachersArray = Object.values(historyData);
              teachersArray.forEach((teacher: any) => {
                allData.push({
                  ...teacher,
                  date: date
                });
              });
            } else {
              missingDates.push(date);
            }
          } catch (error) {
            console.log(`No data found for date: ${date}`);
            missingDates.push(date);
          }
        }

        if (allData.length === 0) {
          setErrorMessage(`No attendance data found for the selected date range. Missing data for all days between ${startDate.toISOString().split('T')[0]} and ${endDate!.toISOString().split('T')[0]}.`);
          toast({
            title: "No Data Found",
            description: "No attendance data available for the selected period",
            variant: "destructive",
          });
          return;
        }

        if (missingDates.length > 0) {
          console.log('Missing data for dates:', missingDates);
        }

        setReportData(allData);
      }

      toast({
        title: "Report Generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} attendance report has been generated successfully.`,
      });

    } catch (error) {
      console.error('Error generating report:', error);
      setErrorMessage('Failed to generate report. Please try again.');
      toast({
        title: "Error",
        description: "Failed to generate report. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (reportData.length === 0) {
      toast({
        title: "No Data",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    const headers = reportType === 'daily' 
      ? ['Name', 'Trade', 'Time In', 'Time Out']
      : ['Date', 'Name', 'Trade', 'Time In', 'Time Out'];

    const csvContent = [
      headers,
      ...reportData.map(teacher => {
        const baseData = [
          teacher.name || '',
          teacher.trade || teacher.subject || '',
          teacher.time_in || 'Not checked in',
          teacher.time_out || 'Not checked out'
        ];
        
        return reportType === 'daily' 
          ? baseData 
          : [teacher.date || '', ...baseData];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const dateStr = startDate?.toISOString().split('T')[0] || 'unknown';
    const fileName = reportType === 'daily' 
      ? `daily-attendance-report-${dateStr}.csv`
      : `longterm-attendance-report-${dateStr}-to-${endDate?.toISOString().split('T')[0]}.csv`;
    
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Report has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
              Attendance Reports
            </h1>
            <p className="text-gray-600">Generate and download attendance reports</p>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Generate Report
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4" style={{ backgroundColor: 'rgb(232, 231, 197)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-white border-orange-300 focus:border-orange-500">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="longterm">Long Time Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {reportType === 'daily' ? 'Select Date' : 'Start Date'}
                </label>
                <Input
                  type="date"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="bg-white border-orange-300 focus:border-orange-500"
                />
              </div>
              
              {reportType === 'longterm' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="bg-white border-orange-300 focus:border-orange-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleGenerateReport}
                disabled={loading}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                disabled={reportData.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-medium">Data Not Found</h4>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {reportData.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report
                {reportType === 'daily' && startDate && ` - ${startDate.toISOString().split('T')[0]}`}
                {reportType === 'longterm' && startDate && endDate && 
                  ` - ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {reportType === 'longterm' && (
                        <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Date</th>
                      )}
                      <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Trade</th>
                      <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Time In</th>
                      <th className="text-left py-4 px-4 md:px-6 font-semibold text-gray-700">Time Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((teacher, index) => (
                      <tr key={`${teacher.id || teacher.name}-${teacher.date || 'current'}-${index}`} className={`border-b hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        {reportType === 'longterm' && (
                          <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.date || 'N/A'}</td>
                        )}
                        <td className="py-4 px-4 md:px-6 font-medium text-gray-900">{teacher.name}</td>
                        <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.trade || teacher.subject}</td>
                        <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.time_in || 'Not checked in'}</td>
                        <td className="py-4 px-4 md:px-6 text-gray-700">{teacher.time_out || 'Not checked out'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;
