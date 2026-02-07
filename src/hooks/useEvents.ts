import { useCallback, useSyncExternalStore } from 'react';
import { CollegeEvent, sampleEvents } from '@/lib/eventData';
import { canRegister } from '@/lib/eventUtils';

const STORAGE_KEY = 'campus_events';
const VERSION_KEY = 'campus_events_version';
const EVENTS_VERSION = 3; // Increment this when adding new seeded events

// Shared store for cross-component synchronization
let listeners: Array<() => void> = [];
let cachedEvents: CollegeEvent[] | null = null;

const getStoredEvents = (): CollegeEvent[] => {
  if (cachedEvents !== null) return cachedEvents;
  
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = storedVersion ? parseInt(storedVersion, 10) : 0;
    
    // If version mismatch or missing, reseed with latest events
    if (currentVersion !== EVENTS_VERSION) {
      cachedEvents = sampleEvents;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
      localStorage.setItem(VERSION_KEY, EVENTS_VERSION.toString());
      return cachedEvents;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      cachedEvents = JSON.parse(stored);
      return cachedEvents!;
    }
  } catch {
    // Parse failed - reseed
  }
  
  // Initialize with sample data
  cachedEvents = sampleEvents;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
  localStorage.setItem(VERSION_KEY, EVENTS_VERSION.toString());
  return cachedEvents;
};

const setStoredEvents = (events: CollegeEvent[]) => {
  cachedEvents = events;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  // Notify all subscribers
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const getSnapshot = () => {
  return getStoredEvents();
};

export const useEvents = () => {
  // Use useSyncExternalStore for proper synchronization across components
  const events = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // No loading state - events load synchronously from localStorage/cache
  const isLoading = false;

  const addEvent = useCallback((event: Omit<CollegeEvent, 'id'>) => {
    const newEvent: CollegeEvent = {
      ...event,
      id: Date.now().toString(),
    };
    const currentEvents = getStoredEvents();
    const updatedEvents = [...currentEvents, newEvent];
    setStoredEvents(updatedEvents);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CollegeEvent>) => {
    const currentEvents = getStoredEvents();
    const updatedEvents = currentEvents.map(event =>
      event.id === id ? { ...event, ...updates } : event
    );
    setStoredEvents(updatedEvents);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    const currentEvents = getStoredEvents();
    setStoredEvents(currentEvents.filter(event => event.id !== id));
  }, []);

  const getEvent = useCallback((id: string) => {
    const currentEvents = getStoredEvents();
    return currentEvents.find(event => event.id === id);
  }, []);

  // Register for an event - increases attendee count
  const registerForEvent = useCallback((eventId: string): { success: boolean; message: string } => {
    const currentEvents = getStoredEvents();
    const event = currentEvents.find(e => e.id === eventId);
    
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
    const updatedEvents = currentEvents.map(e =>
      e.id === eventId ? { ...e, attendees: e.attendees + 1 } : e
    );
    setStoredEvents(updatedEvents);
    
    return { success: true, message: 'Registration successful!' };
  }, []);

  // Refresh events from localStorage (useful for cross-tab sync)
  const refreshEvents = useCallback(() => {
    cachedEvents = null; // Clear cache to force reload
    listeners.forEach(listener => listener());
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
