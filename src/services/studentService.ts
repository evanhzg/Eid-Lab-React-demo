import api from '../utils/api';
import { Student } from '../types';

export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await api.get('/students');
    return Array.isArray(response.data) ? response.data : response.data.students || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentById = async (id: string): Promise<Student> => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student with id ${id}:`, error);
    throw error;
  }
};

export const createStudent = async (studentData: Omit<Student, '_id'>): Promise<Student> => {
  try {
    const response = await api.post('/students', studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
  try {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating student with id ${id}:`, error);
    throw error;
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/students/${id}`);
  } catch (error) {
    console.error(`Error deleting student with id ${id}:`, error);
    throw error;
  }
};

export const searchStudents = async (query: string): Promise<Student[]> => {
  try {
    const response = await api.get('/students/search', {
      params: { q: query },
    });
    return Array.isArray(response.data) ? response.data : response.data.students || [];
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};
