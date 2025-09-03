
import { firebaseConfig } from './firebase-config';

// Get current Rwanda date as YYYY-MM-DD (GMT+2) - manual calculation
const getRwandaDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const rwandaTime = new Date(utc + (2 * 3600000)); // GMT+2 = +2 hours
  return rwandaTime.toISOString().split('T')[0];
};

// Core database operations for teachers
export const firebaseDatabase = {
  async getTeachers() {
    try {
      const response = await fetch(`${firebaseConfig.databaseURL}teachers.json`);
      const data = await response.json();
      return data || {};
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return {};
    }
  },
  
  async saveTeachers(teachers: any) {
    try {
      await fetch(`${firebaseConfig.databaseURL}teachers.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teachers)
      });
    } catch (error) {
      console.error('Error saving teachers:', error);
      throw error;
    }
  },
  
  async addTeacher(teacher: any) {
    try {
      const teachers = await this.getTeachers();
      const id = Date.now().toString();
      const rwandaDate = getRwandaDate();
      const newTeacher = {
        ...teacher,
        id,
        time_in: '',
        time_out: '',
        status: 'absent',
        date: rwandaDate
      };
      teachers[id] = newTeacher;
      await this.saveTeachers(teachers);
      return id;
    } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
    }
  },
  
  async updateTeacher(id: string, teacher: any) {
    try {
      const teachers = await this.getTeachers();
      teachers[id] = { ...teachers[id], ...teacher };
      await this.saveTeachers(teachers);
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },
  
  async deleteTeacher(id: string) {
    try {
      const teachers = await this.getTeachers();
      delete teachers[id];
      await this.saveTeachers(teachers);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }
};
