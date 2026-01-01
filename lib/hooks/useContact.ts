import { useEffect, useState } from "react";
import { Contact } from "@/lib/definitions";

export function useContact() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('Failed to fetch contact data');
      const data: Contact = await response.json();
      setContact(data)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContact();
  }, [])

  const refetch = () => {
    fetchContact();
  }

  return { contact, loading, error, refetch };
}