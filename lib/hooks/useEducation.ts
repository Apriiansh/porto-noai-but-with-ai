import { useState, useEffect } from 'react';
import { Education } from '@/lib/definitions';

export function useEducation() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/education');
      if (!response.ok) {
        throw new Error('Failed to fetch education data');
      }
      const data: Education[] = await response.json();
      setEducations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const refetch = () => {
    fetchEducations();
  };

  return { educations, loading, error, refetch };
}