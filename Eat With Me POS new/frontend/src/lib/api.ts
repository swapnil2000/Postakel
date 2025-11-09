import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor to add authentication token and restaurant ID to every API request
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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

export default apiClient;