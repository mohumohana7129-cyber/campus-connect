import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'event-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);

  const toggleBookmark = useCallback((eventId: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (eventId: string) => bookmarks.includes(eventId),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
};
