import { useState } from 'react';
import { Search, Filter, Calendar, LayoutGrid, List, X } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events, clubs, or keywords..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-card border-border/50 rounded-xl text-base"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="lg"
          className="h-12 px-4 rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </Button>
        <div className="hidden sm:flex border border-border/50 rounded-xl overflow-hidden">
          <Button
            variant={currentView === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-none"
            onClick={() => onViewChange('grid')}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-none"
            onClick={() => onViewChange('list')}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-card border border-border/50 rounded-xl p-4 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filter Events</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Categories */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={activeCategory === cat.value ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      activeCategory === cat.value ? '' : cat.color
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
              <p className="text-sm text-muted-foreground mb-2">Event Mode</p>
              <div className="flex flex-wrap gap-2">
                {(['offline', 'online', 'hybrid'] as EventMode[]).map((mode) => (
                  <Badge
                    key={mode}
                    variant={activeMode === mode ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => onFilterMode(activeMode === mode ? null : mode)}
                  >
                    {mode === 'offline' && '📍'}
                    {mode === 'online' && '🌐'}
                    {mode === 'hybrid' && '🔄'}
                    <span className="ml-1 capitalize">{mode}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeCategory && (
            <Badge variant="secondary" className="gap-1">
              {activeCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterCategory(null)} />
            </Badge>
          )}
          {activeMode && (
            <Badge variant="secondary" className="gap-1">
              {activeMode}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterMode(null)} />
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleSearch('')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
