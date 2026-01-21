import { CollegeEvent } from './eventData';

export type SeatStatus = 'available' | 'filling-fast' | 'full';

export const getSeatStatus = (event: CollegeEvent): SeatStatus => {
  if (!event.maxCapacity) return 'available';
  const percentage = (event.attendees / event.maxCapacity) * 100;
  if (percentage >= 100) return 'full';
  if (percentage >= 80) return 'filling-fast';
  return 'available';
};

export const getSeatStatusConfig = (status: SeatStatus) => {
  switch (status) {
    case 'full':
      return { label: 'Full', className: 'bg-destructive/10 text-destructive border-destructive/20' };
    case 'filling-fast':
      return { label: 'Filling Fast', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' };
    default:
      return { label: 'Available', className: 'bg-green-500/10 text-green-600 border-green-500/20' };
  }
};

export const shareEvent = async (event: CollegeEvent) => {
  const shareData = {
    title: event.title,
    text: `${event.title} - ${event.date} at ${event.venue}`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        return copyToClipboard(shareData.url);
      }
      return { success: false, method: 'cancelled' };
    }
  }
  return copyToClipboard(shareData.url);
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'failed' };
  }
};

export const generateGoogleCalendarUrl = (event: CollegeEvent): string => {
  const startDate = new Date(`${event.date} ${event.time}`);
  // Assume 2 hour duration if not specified
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatDateTime = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d{3}/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateTime(startDate)}/${formatDateTime(endDate)}`,
    details: event.description,
    location: event.venue,
    sf: 'true',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const getModeIcon = (mode: string): { icon: string; label: string } => {
  switch (mode) {
    case 'online':
      return { icon: '🌐', label: 'Online' };
    case 'hybrid':
      return { icon: '🔄', label: 'Hybrid' };
    default:
      return { icon: '📍', label: 'In-Person' };
  }
};

export const calculateDynamicStats = (events: CollegeEvent[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Events this month
  const eventsThisMonth = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).length;

  // Total unique attendees (simulated as sum for demo)
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
  const activeStudents = totalAttendees > 1000 
    ? `${(totalAttendees / 1000).toFixed(1)}K+` 
    : `${totalAttendees}`;

  // Unique organizers/clubs
  const uniqueClubs = new Set(events.map((e) => e.organizer)).size;

  // Live events (events happening today)
  const today = now.toISOString().split('T')[0];
  const liveEvents = events.filter((event) => event.date === today).length;

  return {
    eventsThisMonth,
    activeStudents,
    uniqueClubs,
    liveEvents,
  };
};
