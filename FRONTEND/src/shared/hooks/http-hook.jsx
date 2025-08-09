import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal
      });

      const responseData = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        ctrl => ctrl !== httpAbortCtrl
      );

      if (!response.ok) {
      console.error('API Error Response:', responseData);
      const errorMessage = responseData?.message || 'Logging in failed, please try again later.';
      throw new Error(errorMessage);
      }

      setIsLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message || 'Something went wrong!');
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
