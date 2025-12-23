import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventListItem from '@/components/EventListItem';
import FeaturedEvent from '@/components/FeaturedEvent';
import StatsBar from '@/components/StatsBar';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { sampleEvents, CollegeEvent, EventCategory, EventMode, getCategoryColor } from '@/lib/eventData';
import { Sparkles, Calendar, Clock, MapPin, Users, Building, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [activeMode, setActiveMode] = useState<EventMode | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<CollegeEvent | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const featuredEvent = sampleEvents.find(e => e.isFeatured);
  
  const filteredEvents = useMemo(() => {
    return sampleEvents.filter(event => {
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
  }, [searchQuery, activeCategory, activeMode]);

  const handleViewDetails = (event: CollegeEvent) => {
    setSelectedEvent(event);
    setShowRegistration(false);
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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard event={event} onViewDetails={handleViewDetails} />
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
                <EventListItem event={event} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && !showRegistration && (
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
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setShowRegistration(true)} className="flex-1">
                    Register Now
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {selectedEvent && showRegistration && (
            <EventRegistrationForm 
              event={selectedEvent} 
              onClose={() => {
                setShowRegistration(false);
                setSelectedEvent(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

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
