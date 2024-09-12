import api from './api.ts';
import { Offer } from '../../shared/types/index.ts';

export const getOffers = async (): Promise<Offer[]> => {
  try {
    const response = await api.get('/offers');
    return Array.isArray(response.data) ? response.data : response.data.offers || [];
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const getOfferById = async (id: string): Promise<Offer> => {
  try {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching offer with id ${id}:`, error);
    throw error;
  }
};

export const createOffer = async (offerData: Omit<Offer, '_id'>): Promise<Offer> => {
  try {
    const response = await api.post('/offers', offerData);
    return response.data;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

export const updateOffer = async (id: string, offerData: Partial<Offer>): Promise<Offer> => {
  try {
    const response = await api.put(`/offers/${id}`, offerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating offer with id ${id}:`, error);
    throw error;
  }
};

export const deleteOffer = async (id: string): Promise<void> => {
  try {
    await api.delete(`/offers/${id}`);
  } catch (error) {
    console.error(`Error deleting offer with id ${id}:`, error);
    throw error;
  }
};

export const searchOffers = async (query: string): Promise<Offer[]> => {
  try {
    const response = await api.get('/offers/search', {
      params: { q: query },
    });
    return Array.isArray(response.data) ? response.data : response.data.offers || [];
  } catch (error) {
    console.error('Error searching offers:', error);
    throw error;
  }
};