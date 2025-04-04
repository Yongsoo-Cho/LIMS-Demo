import { useEffect, useState } from "react";

const isCacheValid = (timestamp: string | null, maxAgeMinutes: number) => {
  if (!timestamp) return false;
  const saved = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const diffInMinutes = (now - saved) / (1000 * 60);
  return diffInMinutes < maxAgeMinutes;
};
export function useCachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T | null>,
  maxAgeMinutes = 5,
): {
  data: T | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const freshData = await fetchFn();
      if (freshData) {
        setData(freshData);
        localStorage.setItem(key, JSON.stringify(freshData));
        localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      const cached = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      if (cached && isCacheValid(timestamp, maxAgeMinutes)) {
        setData(JSON.parse(cached));
        setLoading(false);
      }
      await refetch();
    };

    load();
  }, [key]);

  return { data, loading, error, refetch };
}
