import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { CollegeEvent, EventCategory, EventMode } from '@/lib/eventData';
import { getActiveEvents, getCompletedEvents, getEventStatus, canRegister } from '@/lib/eventUtils';
import { useEvents } from '@/hooks/useEvents';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Building, User, ExternalLink, History, CalendarDays } from 'lucide-react';

// Empty state component for no results
const EmptyState = ({ title, message, onReset }: { title: string; message: string; onReset: () => void }) => (
  <div className="text-center py-20 px-4">
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
      <Calendar className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">{message}</p>
    <Button variant="default" onClick={onReset}>
      View All Events
    </Button>
  </div>
);

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [activeMode, setActiveMode] = useState<EventMode | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { events, registerForEvent } = useEvents();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Separate active/upcoming events from completed events
  const upcomingEvents = useMemo(() => getActiveEvents(events), [events]);
  const completedEvents = useMemo(() => getCompletedEvents(events), [events]);

  const filterEvents = (eventList: CollegeEvent[]) => {
    return eventList.filter((event) => {
      const matchesSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !activeCategory || event.category === activeCategory;
      const matchesMode = !activeMode || event.mode === activeMode;

      return matchesSearch && matchesCategory && matchesMode;
    });
  };

  const filteredUpcoming = useMemo(() => filterEvents(upcomingEvents), [upcomingEvents, searchQuery, activeCategory, activeMode]);
  const filteredCompleted = useMemo(() => filterEvents(completedEvents), [completedEvents, searchQuery, activeCategory, activeMode]);

  const handleRegister = (event: CollegeEvent) => {
    if (!canRegister(event)) {
      return; // Don't allow registration for completed or full events
    }
    if (event.googleFormLink) {
      window.open(event.googleFormLink, '_blank', 'noopener,noreferrer');
    } else {
      setShowRegistration(true);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const currentEvents = activeTab === 'upcoming' ? filteredUpcoming : filteredCompleted;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header with Tabs */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {activeTab === 'upcoming' ? 'Upcoming Events' : 'Event History'}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {activeTab === 'upcoming' 
                    ? 'Discover and register for exciting events at Kristu Jayanti University'
                    : 'Browse past events and their highlights'}
                </p>
              </div>
              <TabsList className="grid w-full max-w-[300px] grid-cols-2">
                <TabsTrigger value="upcoming" className="gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <SearchAndFilters
                onSearch={setSearchQuery}
                onFilterCategory={setActiveCategory}
                onFilterMode={setActiveMode}
                onViewChange={setCurrentView}
                activeCategory={activeCategory}
                activeMode={activeMode}
                currentView={currentView}
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {currentEvents.length} event{currentEvents.length !== 1 ? 's' : ''}
              </p>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              {filteredUpcoming.length > 0 ? (
                <div
                  className={
                    currentView === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredUpcoming.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={setSelectedEvent}
                      isBookmarked={isBookmarked(event.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No upcoming events"
                  message="Check back later for new events or browse our event history."
                  onReset={() => {
                    setSearchQuery('');
                    setActiveCategory(null);
                    setActiveMode(null);
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              {filteredCompleted.length > 0 ? (
                <div
                  className={
                    currentView === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredCompleted.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Completed
                        </Badge>
                      </div>
                      <EventCard
                        event={event}
                        onViewDetails={setSelectedEvent}
                        isBookmarked={isBookmarked(event.id)}
                        onToggleBookmark={toggleBookmark}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No past events"
                  message="There are no completed events to display yet."
                  onReset={() => {
                    setSearchQuery('');
                    setActiveCategory(null);
                    setActiveMode(null);
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => {
        setSelectedEvent(null);
        setShowRegistration(false);
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {showRegistration ? `Register for ${selectedEvent?.title}` : selectedEvent?.title}
            </DialogTitle>
            {showRegistration && (
              <DialogDescription>
                Fill in your details to complete your registration
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedEvent && !showRegistration && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="capitalize">
                  {selectedEvent.category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedEvent.mode}
                </Badge>
                {getEventStatus(selectedEvent) === 'completed' && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Completed
                  </Badge>
                )}
                {getEventStatus(selectedEvent) === 'active' && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Happening Now
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground">{selectedEvent.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-primary" />
                  <span>Organized by {selectedEvent.organizer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-primary" />
                  <span>{selectedEvent.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span>
                    {selectedEvent.attendees} registered
                    {selectedEvent.maxCapacity && ` / ${selectedEvent.maxCapacity} spots`}
                  </span>
                </div>
              </div>

              {canRegister(selectedEvent) ? (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => selectedEvent && handleRegister(selectedEvent)}
                >
                  {selectedEvent?.googleFormLink && <ExternalLink className="w-4 h-4 mr-2" />}
                  Register Now
                </Button>
              ) : (
                <Button className="w-full mt-4" variant="secondary" disabled>
                  {getEventStatus(selectedEvent) === 'completed' ? 'Event Completed' : 'Registration Closed'}
                </Button>
              )}
            </div>
          )}

          {selectedEvent && showRegistration && (
            <EventRegistrationForm 
              event={selectedEvent} 
              onClose={() => {
                setSelectedEvent(null);
                setShowRegistration(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
