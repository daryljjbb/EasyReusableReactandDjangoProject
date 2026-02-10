import { useState } from 'react';
import api from '../api/axios';

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Method = GET/POST/PUT/DELETE | url = 'items/' | body = JSON data
  const request = async (method, url, body = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api({ method, url, data: body });
      setData(res.data);
      return { success: true, payload: res.data };
    } catch (err) {
      // Catch backend errors (400, 404, 500) or network crashes
      const msg = err.response?.data?.detail || "Connection Error";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request, setData };
};

