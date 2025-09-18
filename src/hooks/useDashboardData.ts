import { useState, useEffect, useCallback } from 'react';
import { firebaseDb, calculateTeacherStatus } from '@/lib/firebase';
import { firebaseConfig, auth } from '@/lib/firebase-config';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    presentTeachers: 0,
    lateTeachers: 0,
    absentTeachers: 0,
    leftEarlyTeachers: 0,
    goneHomeOnTimeTeachers: 0
  });
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      // Load both teachers and settings data
      const [teachersData, settings] = await Promise.all([
        firebaseDb.getTeachers(),
        firebaseDb.getSettings()
      ]);
      
      const teachersArray = Object.values(teachersData).map((teacher: any) => ({
        ...teacher,
        status: calculateTeacherStatus(teacher.time_in, teacher.time_out, settings)
      }));

      const totalTeachers = teachersArray.length;
      
      // Count teachers based on their multi-status
      const presentTeachers = teachersArray.filter(t => t.status.includes('present')).length;
      const lateTeachers = teachersArray.filter(t => t.status.includes('late')).length;
      const leftEarlyTeachers = teachersArray.filter(t => t.status.includes('left_early')).length;
      const absentTeachers = teachersArray.filter(t => t.status === 'absent').length;
      
      // Calculate teachers who went home on time
      const goneHomeOnTimeTeachers = teachersArray.filter(t => 
        t.status.includes('gone_home_on_time')
      ).length;

      setStats({
        totalTeachers,
        presentTeachers,
        lateTeachers,
        absentTeachers,
        leftEarlyTeachers,
        goneHomeOnTimeTeachers
      });

      // Show all teachers on dashboard
      setAllTeachers(teachersArray);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    loadDashboardData();
    
    // Set up real-time updates by polling every 3 seconds
    const intervalId = setInterval(() => {
      loadDashboardData();
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [loadDashboardData]);

  // End day function - saves current data to history and resets attendance
  const endDay = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      console.log('Ending day and saving data to history for date:', currentDate);

      // Get current teachers data
      const teachers = await firebaseDb.getTeachers();
      
      // Get auth token for history save
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      
      // Save current teacher data to history
      const historyUrl = token 
        ? `${firebaseConfig.databaseURL}history/daily/${currentDate}.json?auth=${token}`
        : `${firebaseConfig.databaseURL}history/daily/${currentDate}.json`;
      
      await fetch(historyUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teachers)
      });
      
      // Reset time_in and time_out for all teachers while keeping other data
      if (teachers && Object.keys(teachers).length > 0) {
        const resetTeachers = {};
        
        for (const teacherId in teachers) {
          resetTeachers[teacherId] = {
            ...teachers[teacherId],
            time_in: '',
            time_out: '',
            status: 'absent'
          };
        }
        
        console.log('Resetting teachers data:', resetTeachers);
        
        // Save the reset teachers data
        const teachersUrl = token 
          ? `${firebaseConfig.databaseURL}teachers.json?auth=${token}`
          : `${firebaseConfig.databaseURL}teachers.json`;
        
        await fetch(teachersUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetTeachers)
        });
      } else {
        console.log('No teachers found to reset');
      }
      
      console.log('Day ended successfully. Data saved to history and attendance reset.');
      
      // Reload dashboard data to reflect changes
      await loadDashboardData();
    } catch (error) {
      console.error('Error ending day:', error);
      throw error;
    }
  };

  return {
    stats,
    allTeachers,
    loading,
    loadDashboardData,
    endDay
  };
};