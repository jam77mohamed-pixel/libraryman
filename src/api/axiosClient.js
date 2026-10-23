import axios from 'axios';

// Create central Axios instance targeting DummyJSON
const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for logging & auth header if needed
axiosClient.interceptors.request.use(
  (config) => {
    // You can attach authorization token if present
    const user = localStorage.getItem('library_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        // ignore
      }
    }
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for unified response or error formatting
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[Axios Response Error]:', error.response || error.message);
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'A network or server error occurred. Please check your connection.',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
