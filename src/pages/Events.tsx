import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { CollegeEvent, EventCategory, EventMode } from '@/lib/eventData';
import { useEvents } from '@/hooks/useEvents';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Building, User, ExternalLink } from 'lucide-react';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [activeMode, setActiveMode] = useState<EventMode | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const { events } = useEvents();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !activeCategory || event.category === activeCategory;
      const matchesMode = !activeMode || event.mode === activeMode;

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [events, searchQuery, activeCategory, activeMode]);

  const handleRegister = (event: CollegeEvent) => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Upcoming Events
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and register for exciting events at Kristu Jayanti University
          </p>
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
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length > 0 ? (
          <div
            className={
              currentView === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={setSelectedEvent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any events matching your criteria. Try adjusting your filters or check back later for new events.
            </p>
            <Button 
              variant="default"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
                setActiveMode(null);
              }}
            >
              View All Events
            </Button>
          </div>
        )}
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

              <Button 
                className="w-full mt-4" 
                onClick={() => selectedEvent && handleRegister(selectedEvent)}
              >
                {selectedEvent?.googleFormLink && <ExternalLink className="w-4 h-4 mr-2" />}
                Register Now
              </Button>
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
