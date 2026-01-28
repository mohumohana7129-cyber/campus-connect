import { useState, useEffect } from 'react';
import { CollegeEvent, sampleEvents } from '@/lib/eventData';

const STORAGE_KEY = 'campus_events';

export const useEvents = () => {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from localStorage or use sample data
  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch {
        setEvents(sampleEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
      }
    } else {
      setEvents(sampleEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
    }
    setIsLoading(false);
  }, []);

  // Persist events to localStorage
  const saveEvents = (newEvents: CollegeEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  };

  const addEvent = (event: Omit<CollegeEvent, 'id'>) => {
    const newEvent: CollegeEvent = {
      ...event,
      id: Date.now().toString(),
    };
    saveEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CollegeEvent>) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    );
    saveEvents(updatedEvents);
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(event => event.id !== id));
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
  };
};
