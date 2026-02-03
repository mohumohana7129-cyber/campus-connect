import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventListItem from '@/components/EventListItem';
import FeaturedEvent from '@/components/FeaturedEvent';
import StatsBar from '@/components/StatsBar';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { CollegeEvent, EventCategory, EventMode, getCategoryColor } from '@/lib/eventData';
import { generateGoogleCalendarUrl } from '@/lib/eventUtils';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useEvents } from '@/hooks/useEvents';
import { Sparkles, Calendar, Clock, MapPin, Users, Building, User, CalendarPlus, ExternalLink, Shield, ArrowRight, GraduationCap } from 'lucide-react';
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
  const [showRegistration, setShowRegistration] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { events } = useEvents();

  const featuredEvent = events.find(e => e.isFeatured);
  
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (activeCategory && event.category !== activeCategory) return false;
      if (activeMode && event.mode !== activeMode) return false;
      return true;
    });
  }, [events, searchQuery, activeCategory, activeMode]);

  const handleViewDetails = (event: CollegeEvent) => {
    setSelectedEvent(event);
    setShowRegistration(false);
  };

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

  const scrollToEvents = () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-subtle">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 animate-fade-in"
            >
              <GraduationCap className="w-4 h-4" />
              Kristu Jayanti University Events Hub
            </div>
            
            {/* Main Heading */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              Discover What's{' '}
              <span className="gradient-text font-extrabold">Happening</span>
              <br className="hidden sm:block" />
              On Campus
            </h1>
            
            {/* Subheading */}
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              Never miss a workshop, hackathon, or cultural fest again. 
              All your university events in one beautiful, organized place.
            </p>
            
            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300"
                onClick={scrollToEvents}
              >
                Explore Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base font-semibold rounded-xl border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                View Calendar
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <StatsBar />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-premium border border-border/50 p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
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
      </section>

      {/* Featured Event */}
      {featuredEvent && !searchQuery && !activeCategory && !activeMode && (
        <section className="container mx-auto px-4 py-16">
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <FeaturedEvent event={featuredEvent} onViewDetails={handleViewDetails} />
          </div>
        </section>
      )}

      {/* Events Grid/List */}
      <section id="events-section" className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {searchQuery || activeCategory || activeMode ? 'Search Results' : 'Upcoming Events'}
            </h2>
            <p className="text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
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
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up"
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
                className="animate-fade-in-up"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {selectedEvent && !showRegistration && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={`${getCategoryColor(selectedEvent.category)} text-xs rounded-full`}>
                    {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs rounded-full">
                    {selectedEvent.mode.charAt(0).toUpperCase() + selectedEvent.mode.slice(1)}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <p className="text-muted-foreground">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{selectedEvent.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Venue</p>
                      <p className="text-sm font-medium">{selectedEvent.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
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
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                      <p className="text-sm font-medium">{selectedEvent.organizer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
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
                    <Button onClick={() => handleRegister(selectedEvent)} className="flex-1 h-12 rounded-xl">
                      {selectedEvent.googleFormLink && <ExternalLink className="w-4 h-4 mr-2" />}
                      Register Now
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedEvent(null)} className="h-12 rounded-xl">
                      Close
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl"
                    onClick={() => window.open(generateGoogleCalendarUrl(selectedEvent), '_blank')}
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Add to Google Calendar
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

      {/* Admin Access Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-gold">
              <Shield className="w-8 h-8 text-accent-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">Admin Access</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Manage events, view analytics, and control your campus event hub.
            </p>
            <Button 
              onClick={() => navigate('/admin/login')} 
              className="h-12 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-semibold shadow-gold transition-all duration-300 hover:scale-105"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-foreground">Kristu Jayanti</span>
                <p className="text-xs text-muted-foreground">University Events</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Kristu Jayanti University. Bringing your campus community together.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/about" className="hover:text-accent transition-colors duration-200">About</a>
              <a href="#" className="hover:text-accent transition-colors duration-200">Contact</a>
              <a href="#" className="hover:text-accent transition-colors duration-200">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
