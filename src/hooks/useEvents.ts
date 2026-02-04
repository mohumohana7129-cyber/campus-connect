import { useState, useEffect, useCallback } from 'react';
import { CollegeEvent, sampleEvents } from '@/lib/eventData';
import { canRegister } from '@/lib/eventUtils';

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
  const saveEvents = useCallback((newEvents: CollegeEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
  }, []);

  const addEvent = useCallback((event: Omit<CollegeEvent, 'id'>) => {
    const newEvent: CollegeEvent = {
      ...event,
      id: Date.now().toString(),
    };
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    return newEvent;
  }, [events, saveEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<CollegeEvent>) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    );
    saveEvents(updatedEvents);
  }, [events, saveEvents]);

  const deleteEvent = useCallback((id: string) => {
    saveEvents(events.filter(event => event.id !== id));
  }, [events, saveEvents]);

  const getEvent = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  // Register for an event - decreases available seats
  const registerForEvent = useCallback((eventId: string): { success: boolean; message: string } => {
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    if (!canRegister(event)) {
      if (event.maxCapacity && event.attendees >= event.maxCapacity) {
        return { success: false, message: 'This event is fully booked' };
      }
      return { success: false, message: 'Registration is closed for this event' };
    }

    // Increment attendee count
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, attendees: e.attendees + 1 } : e
    );
    saveEvents(updatedEvents);
    
    return { success: true, message: 'Registration successful!' };
  }, [events, saveEvents]);

  // Refresh events from localStorage (useful for cross-tab sync)
  const refreshEvents = useCallback(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch {
        // Keep current events if parse fails
      }
    }
  }, []);

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    registerForEvent,
    refreshEvents,
  };
};
