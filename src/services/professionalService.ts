import axios from 'axios';
import { Professional } from '../types';
import { ObjectId } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const getProfessionals = async (): Promise<Professional[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professionals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }
};

export const getProfessionalById = async (id: ObjectId): Promise<Professional> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professionals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional with id ${id}:`, error);
    throw error;
  }
};

export const createProfessional = async (professionalData: Omit<Professional, '_id'>): Promise<Professional> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/professionals`, professionalData);
    return response.data;
  } catch (error) {
    console.error('Error creating professional:', error);
    throw error;
  }
};

export const updateProfessional = async (id: ObjectId, professionalData: Partial<Professional>): Promise<Professional> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/professionals/${id.toString()}`, professionalData);
    return response.data;
  } catch (error) {
    console.error(`Error updating professional with id ${id}:`, error);
    throw error;
  }
};

export const deleteProfessional = async (id: ObjectId): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/professionals/${id.toString()}`);
  } catch (error) {
    console.error(`Error deleting professional with id ${id}:`, error);
    throw error;
  }
};