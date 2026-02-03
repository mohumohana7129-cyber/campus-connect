import { useState } from 'react';
import { Search, Filter, LayoutGrid, List, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories, EventCategory, EventMode } from '@/lib/eventData';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: EventCategory | null) => void;
  onFilterMode: (mode: EventMode | null) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  activeCategory: EventCategory | null;
  activeMode: EventMode | null;
  currentView: 'grid' | 'list';
}

const SearchAndFilters = ({
  onSearch,
  onFilterCategory,
  onFilterMode,
  onViewChange,
  activeCategory,
  activeMode,
  currentView,
}: SearchAndFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const clearFilters = () => {
    onFilterCategory(null);
    onFilterMode(null);
    setSearchQuery('');
    onSearch('');
  };

  const hasActiveFilters = activeCategory || activeMode || searchQuery;

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events, clubs, or keywords..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-14 bg-background border-border rounded-xl text-base focus-visible:ring-accent"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="lg"
          className="h-14 px-5 rounded-xl font-semibold"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
              {(activeCategory ? 1 : 0) + (activeMode ? 1 : 0)}
            </span>
          )}
        </Button>
        <div className="hidden sm:flex border border-border rounded-xl overflow-hidden">
          <Button
            variant={currentView === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="h-14 w-14 rounded-none"
            onClick={() => onViewChange('grid')}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-14 w-14 rounded-none"
            onClick={() => onViewChange('list')}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-muted/50 border border-border rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground text-lg">Filter Events</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-5">
            {/* Categories */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={activeCategory === cat.value ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 px-4 py-2 text-sm rounded-full ${
                      activeCategory === cat.value ? 'bg-primary text-primary-foreground' : 'hover:border-accent hover:text-accent'
                    }`}
                    onClick={() => onFilterCategory(activeCategory === cat.value ? null : cat.value)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Event Mode</p>
              <div className="flex flex-wrap gap-2">
                {(['offline', 'online', 'hybrid'] as EventMode[]).map((mode) => (
                  <Badge
                    key={mode}
                    variant={activeMode === mode ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 px-4 py-2 text-sm rounded-full ${
                      activeMode === mode ? 'bg-primary text-primary-foreground' : 'hover:border-accent hover:text-accent'
                    }`}
                    onClick={() => onFilterMode(activeMode === mode ? null : mode)}
                  >
                    {mode === 'offline' && '📍'}
                    {mode === 'online' && '🌐'}
                    {mode === 'hybrid' && '🔄'}
                    <span className="ml-1.5 capitalize">{mode}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {activeCategory && (
            <Badge variant="secondary" className="gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20">
              {activeCategory}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors" onClick={() => onFilterCategory(null)} />
            </Badge>
          )}
          {activeMode && (
            <Badge variant="secondary" className="gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20">
              {activeMode}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors" onClick={() => onFilterMode(null)} />
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20">
              "{searchQuery}"
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors" onClick={() => handleSearch('')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
