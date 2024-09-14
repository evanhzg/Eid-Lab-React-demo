import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.unpaws.loc/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;