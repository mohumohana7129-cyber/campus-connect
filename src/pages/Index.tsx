import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventListItem from '@/components/EventListItem';
import FeaturedEvent from '@/components/FeaturedEvent';
import StatsBar from '@/components/StatsBar';
import { CollegeEvent, EventCategory, EventMode, getCategoryColor } from '@/lib/eventData';
import { generateGoogleCalendarUrl, getActiveEvents, getEventStatus, canRegister } from '@/lib/eventUtils';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useEvents } from '@/hooks/useEvents';
import { Sparkles, Calendar, Clock, MapPin, Users, Building, User, CalendarPlus, ExternalLink, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [activeMode, setActiveMode] = useState<EventMode | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { events } = useEvents();

  // Only show upcoming and active events on home page
  const activeEvents = useMemo(() => getActiveEvents(events), [events]);
  const featuredEvent = activeEvents.find(e => e.isFeatured);
  
  const filteredEvents = useMemo(() => {
    return activeEvents.filter(event => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (activeCategory && event.category !== activeCategory) return false;

      // Mode filter
      if (activeMode && event.mode !== activeMode) return false;

      return true;
    });
  }, [activeEvents, searchQuery, activeCategory, activeMode]);

  const handleViewDetails = (event: CollegeEvent) => {
    setSelectedEvent(event);
  };

  // Google Form is the only registration method
  const handleRegister = (event: CollegeEvent) => {
    if (!canRegister(event)) {
      return;
    }
    // Open Google Form in new tab
    if (event.googleFormLink) {
      window.open(event.googleFormLink, '_blank', 'noopener,noreferrer');
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
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Your Campus Events Hub
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              <span className="italic">Discover</span> What's
              <span className="gradient-text font-extrabold tracking-wide drop-shadow-lg"> Happening</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Never miss a workshop, hackathon, or cultural fest again. 
              All your college events in one beautiful place.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <StatsBar />
          </div>

          {/* Search and Filters */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <SearchAndFilters
              onSearch={setSearchQuery}
              onFilterCategory={setActiveCategory}
              onFilterMode={setActiveMode}
              onViewChange={setViewMode}
              activeCategory={activeCategory}
              activeMode={activeMode}
              currentView={viewMode}
            />
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && !searchQuery && !activeCategory && !activeMode && (
        <section className="container mx-auto px-4 pb-12">
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <FeaturedEvent event={featuredEvent} onViewDetails={handleViewDetails} />
          </div>
        </section>
      )}

      {/* Events Grid/List */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {searchQuery || activeCategory || activeMode ? 'Search Results' : 'Upcoming Events'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {filteredEvents.length === 0 ? (
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
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard 
                  event={event} 
                  onViewDetails={handleViewDetails} 
                  isBookmarked={isBookmarked(event.id)}
                  onToggleBookmark={toggleBookmark}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventListItem 
                  event={event} 
                  onViewDetails={handleViewDetails}
                  isBookmarked={isBookmarked(event.id)}
                  onToggleBookmark={toggleBookmark}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={`${getCategoryColor(selectedEvent.category)} text-xs`}>
                    {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedEvent.mode.charAt(0).toUpperCase() + selectedEvent.mode.slice(1)}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <p className="text-muted-foreground">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{selectedEvent.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Venue</p>
                      <p className="text-sm font-medium">{selectedEvent.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attendees</p>
                      <p className="text-sm font-medium">
                        {selectedEvent.attendees}{selectedEvent.maxCapacity && ` / ${selectedEvent.maxCapacity}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                      <p className="text-sm font-medium">{selectedEvent.organizer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{selectedEvent.department}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 pt-4">
                  <div className="flex gap-3">
                    {canRegister(selectedEvent) && selectedEvent.googleFormLink ? (
                      <Button onClick={() => handleRegister(selectedEvent)} className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Register via Google Form
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="secondary" disabled>
                        {getEventStatus(selectedEvent) === 'completed' ? 'Event Completed' : 'Registration Closed'}
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                      Close
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(generateGoogleCalendarUrl(selectedEvent), '_blank')}
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Add to Google Calendar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Access Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Admin Access</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Manage events, view analytics, and control your campus event hub.
          </p>
          <Button onClick={() => navigate('/admin/login')} className="gap-2">
            <Shield className="w-4 h-4" />
            Admin Login
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground text-sm">🎓</span>
              </div>
              <span className="font-semibold text-foreground">CampusHub</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 CampusHub. Bringing your campus community together.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
