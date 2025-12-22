import { useState, useMemo } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import Header from '@/components/Header';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleEvents, CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get dates that have events
  const eventDates = useMemo(() => {
    return sampleEvents.map(event => parseISO(event.date));
  }, []);

  // Get events for the selected date
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return sampleEvents.filter(event => 
      isSameDay(parseISO(event.date), selectedDate)
    );
  }, [selectedDate]);

  // Check if a date has events
  const hasEvents = (date: Date) => {
    return eventDates.some(eventDate => isSameDay(eventDate, date));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Event Calendar
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse events by date and plan your schedule
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md pointer-events-auto"
                modifiers={{
                  hasEvent: (date) => hasEvents(date),
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textDecorationColor: 'hsl(var(--primary))',
                    textUnderlineOffset: '4px',
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Events for Selected Date */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? (
                    <>Events on {formatTime(selectedDate.toISOString())}</>
                  ) : (
                    'Select a date to view events'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <EventListCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No events scheduled for this date</p>
                    <p className="text-sm mt-1">Try selecting a different date</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events Overview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleEvents.slice(0, 5).map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => setSelectedDate(parseISO(event.date))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[50px]">
                          <div className="text-xs text-muted-foreground uppercase">
                            {format(parseISO(event.date), 'MMM')}
                          </div>
                          <div className="text-xl font-bold text-foreground">
                            {format(parseISO(event.date), 'd')}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.time} • {event.venue}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn(getCategoryColor(event.category), 'capitalize')}
                      >
                        {event.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Event List Card Component
const EventListCard = ({ event }: { event: CollegeEvent }) => {
  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
        </div>
        <Badge 
          variant="secondary" 
          className={cn(getCategoryColor(event.category), 'capitalize shrink-0')}
        >
          {event.category}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{event.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>{event.attendees} attending</span>
        </div>
        <Badge variant="outline" className="w-fit capitalize">
          {event.mode}
        </Badge>
      </div>
    </div>
  );
};

export default CalendarPage;
