import { useState, useEffect } from 'react';
import { About } from '@/lib/definitions';

export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/about');
      if (!response.ok) {
        throw new Error('Failed to fetch about data');
      }
      const data: About = await response.json();
      setAbout(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const refetch = () => {
    fetchAbout();
  };

  return { about, loading, error, refetch };
}