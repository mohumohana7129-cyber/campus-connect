import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchAndFilters from '@/components/SearchAndFilters';
import EventCard from '@/components/EventCard';
import EventListItem from '@/components/EventListItem';
import FeaturedEvent from '@/components/FeaturedEvent';
import StatsBar from '@/components/StatsBar';
import { sampleEvents, CollegeEvent, EventCategory, EventMode } from '@/lib/eventData';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [activeMode, setActiveMode] = useState<EventMode | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    console.log('View details for:', event.title);
    // In a real app, this would navigate to event details page
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Discover What's
              <span className="gradient-text"> Happening</span>
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
            <FeaturedEvent event={featuredEvent} />
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
