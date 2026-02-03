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
import { Calendar, Clock, MapPin, Users, Building, User, CalendarPlus, ExternalLink, Shield, ArrowRight, GraduationCap } from 'lucide-react';
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
      <section className="bg-light">
        <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Kristu Jayanti University Events Hub
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Discover What's Happening On Campus
            </h1>
            
            {/* Subheading */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Never miss a workshop, hackathon, or cultural fest again. 
              All your university events in one organized place.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Button 
                size="lg" 
                className="h-12 px-6 font-medium rounded-lg"
                onClick={scrollToEvents}
              >
                Explore Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-6 font-medium rounded-lg"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>

            {/* Stats Bar */}
            <StatsBar />
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
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
        <section className="container mx-auto px-4 py-12">
          <FeaturedEvent event={featuredEvent} onViewDetails={handleViewDetails} />
        </section>
      )}

      {/* Events Grid/List */}
      <section id="events-section" className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {searchQuery || activeCategory || activeMode ? 'Search Results' : 'Upcoming Events'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
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
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event} 
                onViewDetails={handleViewDetails} 
                isBookmarked={isBookmarked(event.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <EventListItem 
                key={event.id}
                event={event} 
                onViewDetails={handleViewDetails}
                isBookmarked={isBookmarked(event.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          {selectedEvent && !showRegistration && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={`${getCategoryColor(selectedEvent.category)} text-xs rounded-md`}>
                    {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs rounded-md">
                    {selectedEvent.mode.charAt(0).toUpperCase() + selectedEvent.mode.slice(1)}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-5 mt-4">
                <p className="text-muted-foreground text-sm">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{selectedEvent.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Venue</p>
                      <p className="text-sm font-medium">{selectedEvent.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Attendees</p>
                      <p className="text-sm font-medium">
                        {selectedEvent.attendees}{selectedEvent.maxCapacity && ` / ${selectedEvent.maxCapacity}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                      <p className="text-sm font-medium">{selectedEvent.organizer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Building className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{selectedEvent.department}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex gap-3">
                    <Button onClick={() => handleRegister(selectedEvent)} className="flex-1 h-10 rounded-lg">
                      {selectedEvent.googleFormLink && <ExternalLink className="w-4 h-4 mr-2" />}
                      Register Now
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedEvent(null)} className="h-10 rounded-lg">
                      Close
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full h-10 rounded-lg"
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
      <section className="container mx-auto px-4 py-12">
        <div className="bg-primary rounded-xl p-8 md:p-12 text-center">
          <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">Admin Access</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto text-sm">
            Manage events, view analytics, and control your campus event hub.
          </p>
          <Button 
            onClick={() => navigate('/admin/login')} 
            className="h-10 px-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-lg font-medium"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Kristu Jayanti</span>
                <span className="text-muted-foreground ml-1">University</span>
              </div>
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

export default Index;
