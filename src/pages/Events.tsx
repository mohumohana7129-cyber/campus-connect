import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { CollegeEvent, EventCategory, EventMode, getCategoryColor } from '@/lib/eventData';
import { useEvents } from '@/hooks/useEvents';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Building, User, ExternalLink, GraduationCap } from 'lucide-react';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [activeMode, setActiveMode] = useState<EventMode | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const { events } = useEvents();
  const { isBookmarked, toggleBookmark } = useBookmarks();

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
      
      {/* Page Hero */}
      <section className="bg-light">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Upcoming Events
              </h1>
              <p className="text-muted-foreground text-sm">
                Discover and register for events at Kristu Jayanti University
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-card rounded-xl shadow-card border border-border p-5 -mt-6 mb-8 relative z-10">
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
          <h2 className="text-xl font-bold text-foreground mb-1">
            {searchQuery || activeCategory || activeMode ? 'Search Results' : 'All Events'}
          </h2>
          <p className="text-muted-foreground text-sm">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length > 0 ? (
          <div
            className={
              currentView === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-3'
            }
          >
            {filteredEvents.map((event) => (
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
          <div className="text-center py-16 px-4 bg-card rounded-xl border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
              We couldn't find any events matching your criteria. Try adjusting your filters.
            </p>
            <Button 
              variant="default"
              className="rounded-lg"
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
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
                <Badge className={`${getCategoryColor(selectedEvent.category)} capitalize rounded-md`}>
                  {selectedEvent.category}
                </Badge>
                <Badge variant="outline" className="capitalize rounded-md">
                  {selectedEvent.mode}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm">{selectedEvent.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-medium">{selectedEvent.venue}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm truncate">{selectedEvent.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="text-sm truncate">{selectedEvent.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {selectedEvent.attendees} registered
                    {selectedEvent.maxCapacity && ` / ${selectedEvent.maxCapacity} spots`}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full h-10 rounded-lg mt-2" 
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

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Kristu Jayanti University</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Kristu Jayanti University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;
