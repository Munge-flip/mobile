export const API_URL = 'http://192.168.1.4:8000/api/v1';

export const ENDPOINTS = {
  // Auth
  login: `${API_URL}/login`,
  register: `${API_URL}/register`,
  logout: `${API_URL}/logout`,
  
  // Services
  services: `${API_URL}/services`,
  
  // User
  profile: `${API_URL}/user/profile`,
  password: `${API_URL}/user/password`,
  orders: `${API_URL}/user/orders`,
  transactions: `${API_URL}/user/transactions`,
};
