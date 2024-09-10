import axios from 'axios';
import { Company } from '../types';
import { ObjectId } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: ObjectId): Promise<Company> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies/${id.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company with id ${id}:`, error);
    throw error;
  }
};

export const createCompany = async (companyData: Omit<Company, '_id'>): Promise<Company> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/companies`, companyData);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (id: ObjectId, companyData: Partial<Company>): Promise<Company> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/companies/${id.toString()}`, companyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating company with id ${id}:`, error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/companies/${id.toString()}`);
  } catch (error) {
    console.error(`Error deleting company with id ${id}:`, error);
    throw error;
  }
};

export const searchCompanies = async (query: string): Promise<Company[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching companies:', error);
    throw error;
  }
};