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
      <section className="relative overflow-hidden gradient-subtle">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Upcoming Events
              </h1>
              <p className="text-muted-foreground">
                Discover and register for exciting events at Kristu Jayanti University
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-card rounded-2xl shadow-premium border border-border/50 p-6 -mt-8 mb-10 relative z-10">
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {searchQuery || activeCategory || activeMode ? 'Search Results' : 'All Events'}
          </h2>
          <p className="text-muted-foreground">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length > 0 ? (
          <div
            className={
              currentView === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'flex flex-col gap-4'
            }
          >
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
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
          <div className="text-center py-20 px-4 bg-card rounded-2xl border border-border/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any events matching your criteria. Try adjusting your filters or check back later for new events.
            </p>
            <Button 
              variant="default"
              className="rounded-xl"
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
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
            <div className="space-y-5">
              <div className="flex gap-2 flex-wrap">
                <Badge className={`${getCategoryColor(selectedEvent.category)} capitalize rounded-full`}>
                  {selectedEvent.category}
                </Badge>
                <Badge variant="outline" className="capitalize rounded-full">
                  {selectedEvent.mode}
                </Badge>
              </div>

              <p className="text-muted-foreground">{selectedEvent.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-medium">{selectedEvent.venue}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm truncate">{selectedEvent.organizer}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="text-sm truncate">{selectedEvent.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="font-medium">
                    {selectedEvent.attendees} registered
                    {selectedEvent.maxCapacity && ` / ${selectedEvent.maxCapacity} spots`}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full h-12 rounded-xl mt-4 font-semibold" 
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
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Kristu Jayanti University</span>
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
