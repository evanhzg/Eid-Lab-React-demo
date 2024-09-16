import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.unpaws.loc/api',
  withCredentials: true,
});

export const fetchOffers = async (params?: Record<string, any>) => {
  const response = await api.get('/offers', { params });
  console.log(response)
  
  return response.data;
};

export default api;