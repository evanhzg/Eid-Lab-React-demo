import axios from 'axios';
import { Offer } from '../types';
import { ObjectId } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const getOffers = async (): Promise<Offer[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const getOfferById = async (id: ObjectId): Promise<Offer> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching offer with id ${id}:`, error);
    throw error;
  }
};

export const createOffer = async (offerData: Omit<Offer, '_id'>): Promise<Offer> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/offers`, offerData);
    return response.data;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

export const updateOffer = async (id: ObjectId, offerData: Partial<Offer>): Promise<Offer> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/offers/${id.toString()}`, offerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating offer with id ${id}:`, error);
    throw error;
  }
};

export const deleteOffer = async (id: ObjectId): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/offers/${id.toString()}`);
  } catch (error) {
    console.error(`Error deleting offer with id ${id}:`, error);
    throw error;
  }
};

export const searchOffers = async (query: string): Promise<Offer[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offers/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching offers:', error);
    throw error;
  }
};