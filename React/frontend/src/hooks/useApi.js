import { useState } from 'react';
import apiClient from '../api/axios'; // Make sure this path points to the file above

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient({
        method: method,
        url: url,
        data: data,
      });
      
      setLoading(false);
      // Return a consistent success object
      return { success: true, payload: response.data };
      
    } catch (err) {
      setLoading(false);
      
      // specific error handling for Django DRF responses
      let errorMsg = "An error occurred";
      if (err.response && err.response.data) {
          if (err.response.data.detail) {
              errorMsg = err.response.data.detail;
          } else {
              // Handle field-specific errors (e.g., {name: ["This field is required."]})
              errorMsg = JSON.stringify(err.response.data);
          }
      } else if (err.message) {
          errorMsg = err.message;
      }
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return { request, loading, error };
};


