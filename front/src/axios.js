/* Axios plugin configuration */

import axios from 'axios';

// Create a new Axios instance with default settings
const instance = axios.create({
  baseURL: 'http://localhost:3000',  // Base URL for your API (adjust if needed)
  timeout: 10000,  // Optional timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // You can add any custom headers here if needed
  },
});

// You can add request/response interceptors to handle things like authentication tokens
instance.interceptors.request.use(
  (config) => {
    // You can add logic here to include auth tokens or modify the request headers
    // Example:
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default instance;