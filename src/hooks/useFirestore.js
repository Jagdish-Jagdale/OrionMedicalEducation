import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching Firestore data.
 * @param {function} fetchFn - Async function that returns data from Firestore.
 * @param {Array} deps - Dependency array that, when changed, triggers a re-fetch.
 */
export function useFirestore(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
