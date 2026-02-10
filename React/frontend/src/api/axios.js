import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Your Django API URL
  withCredentials: true, // This sends cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// This magic bit tells Axios to automatically find the 
// Django CSRF cookie and put it in the header for you.
api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';

export default api;

