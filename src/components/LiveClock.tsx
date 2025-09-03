
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-100 shadow-sm">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Clock className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">
          {formatDate(currentTime)}
        </div>
        <div className="text-lg font-bold text-blue-600">
          {formatTime(currentTime)} (Local Time)
        </div>
      </div>
    </div>
  );
};

export default LiveClock;
