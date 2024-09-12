import api from './api';

export const isAuthenticated = () => {
    console.log('All cookies:', document.cookie);
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    console.log('Parsed cookies:', cookies);
    const token = cookies.find(c => c.startsWith('token='));
    console.log('Token found:', token);
    return !!token;
  };
  
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    // Redirect to login page or update app state
  } catch (error) {
    console.error('Logout failed', error);
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await api.get('/auth/check-auth');
    return true;
  } catch (error) {
    return false;
  }
};