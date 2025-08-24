import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

export default useFetch;