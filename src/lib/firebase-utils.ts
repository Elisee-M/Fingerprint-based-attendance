
// Utility function to calculate dynamic status with timezone using settings
export const calculateTeacherStatus = (timeIn: string, timeOut: string, settings?: any) => {
  if (!timeIn) return 'absent';
  
  // Use settings or default values
  const workingHoursStart = settings?.workingHoursStart || '08:30';
  const workingHoursEnd = settings?.workingHoursEnd || '17:00';
  const gracePeriod = parseInt(settings?.gracePeriod || '15');
  
  // Parse time in 24-hour format
  const timeInParts = timeIn.split(':');
  const timeInHour = parseInt(timeInParts[0]);
  const timeInMinute = parseInt(timeInParts[1]);
  
  // Parse working hours start time
  const workStartParts = workingHoursStart.split(':');
  const workStartHour = parseInt(workStartParts[0]);
  const workStartMinute = parseInt(workStartParts[1]);
  
  // Parse working hours end time
  const workEndParts = workingHoursEnd.split(':');
  const workEndHour = parseInt(workEndParts[0]);
  const workEndMinute = parseInt(workEndParts[1]);
  
  // Calculate if late (after working start time + grace period)
  const lateThresholdMinutes = (workStartHour * 60) + workStartMinute + gracePeriod;
  const checkInMinutes = (timeInHour * 60) + timeInMinute;
  
  // Start building status array
  const statusArray = ['present']; // Any teacher with time_in is present
  
  // Check if teacher was late
  const wasLate = checkInMinutes > lateThresholdMinutes;
  if (wasLate) {
    statusArray.push('late');
  }
  
  // Check checkout status (only if they have checked out)
  if (timeOut && timeOut !== '') {
    const timeOutParts = timeOut.split(':');
    const timeOutHour = parseInt(timeOutParts[0]);
    const timeOutMinute = parseInt(timeOutParts[1]);
    const checkOutMinutes = (timeOutHour * 60) + timeOutMinute;
    const workEndMinutes = (workEndHour * 60) + workEndMinute;
    
    // If left before working hours end, add left early status
    if (checkOutMinutes < workEndMinutes) {
      statusArray.push('left_early');
    } else {
      // If left at or after working hours end, add left on time status
      statusArray.push('left_on_time');
    }
  }
  
  // Return combined status as comma-separated string
  return statusArray.join(', ');
};
