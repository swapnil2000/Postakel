const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * A helper function to get the default headers, including the auth token.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * A wrapper for the native fetch API that handles auth and errors.
 */
const handleResponse = async (response: Response) => {
  // If the token is invalid (401) or forbidden (403), force a logout.
  if (response.status === 401 || response.status === 403) {
    console.error("Authentication error. Redirecting to login.");
    localStorage.removeItem('token'); // Clear the invalid token
    window.location.href = '/login'; // Redirect to login page
    // Throw an error to stop the promise chain
    throw new Error('Authentication failed');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    // For DELETE, we might not always get a JSON body back on success
    if (response.status === 204) return; // No Content
    return handleResponse(response);
  },
};