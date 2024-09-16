import api from './api.ts';
import { Company } from '../../shared/types/index.ts';

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await api.get('/companies');
    return Array.isArray(response.data) ? response.data : response.data.companies || [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company with id ${id}:`, error);
    throw error;
  }
};

export const createCompany = async (companyData: Omit<Company, '_id'>): Promise<Company> => {
  try {
    const response = await api.post('/companies', companyData);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (id: string, companyData: Partial<Company>): Promise<Company> => {
  try {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating company with id ${id}:`, error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    await api.delete(`/companies/${id}`);
  } catch (error) {
    console.error(`Error deleting company with id ${id}:`, error);
    throw error;
  }
};

export const searchCompanies = async (query: string): Promise<Company[]> => {
  try {
    const response = await api.get('/companies/search', {
      params: { q: query },
    });
    return Array.isArray(response.data) ? response.data : response.data.companies || [];
  } catch (error) {
    console.error('Error searching companies:', error);
    throw error;
  }
};