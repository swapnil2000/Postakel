import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor to add authentication token and restaurant ID to every API request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const restaurantId = localStorage.getItem('restaurantId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (restaurantId) {
      config.headers['X-Restaurant-Id'] = restaurantId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If API returns 401, it means the token is invalid or expired.
      // Log the user out and redirect to the login page.
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('restaurantId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;