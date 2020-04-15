import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005'
});

export const registerRequest = data => api.post('/register', data);
export const loginRequest = data => api.post('/login', data);