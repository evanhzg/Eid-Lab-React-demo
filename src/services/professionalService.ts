import api from '../utils/api';
import { Professional } from '../types';

export const getProfessionals = async (): Promise<Professional[]> => {
  try {
    const response = await api.get('/professionals');
    return Array.isArray(response.data) ? response.data : response.data.professionals || [];
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }
};

export const getProfessionalById = async (id: string): Promise<Professional> => {
  try {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional with id ${id}:`, error);
    throw error;
  }
};

export const createProfessional = async (professionalData: Omit<Professional, '_id'>): Promise<Professional> => {
  try {
    const response = await api.post('/professionals', professionalData);
    return response.data;
  } catch (error) {
    console.error('Error creating professional:', error);
    throw error;
  }
};

export const updateProfessional = async (id: string, professionalData: Partial<Professional>): Promise<Professional> => {
  try {
    const response = await api.put(`/professionals/${id}`, professionalData);
    return response.data;
  } catch (error) {
    console.error(`Error updating professional with id ${id}:`, error);
    throw error;
  }
};

export const deleteProfessional = async (id: string): Promise<void> => {
  try {
    await api.delete(`/professionals/${id}`);
  } catch (error) {
    console.error(`Error deleting professional with id ${id}:`, error);
    throw error;
  }
};

export const searchProfessionals = async (query: string): Promise<Professional[]> => {
  try {
    const response = await api.get('/professionals/search', {
      params: { q: query },
    });
    return Array.isArray(response.data) ? response.data : response.data.professionals || [];
  } catch (error) {
    console.error('Error searching professionals:', error);
    throw error;
  }
};