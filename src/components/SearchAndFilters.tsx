import { useState } from 'react';
import { Search, LayoutGrid, List, X, SlidersHorizontal } from 'lucide-react';
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events, clubs, or keywords..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-background border-border rounded-lg text-sm"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="default"
          className="h-11 px-4 rounded-lg font-medium"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs font-bold flex items-center justify-center">
              {(activeCategory ? 1 : 0) + (activeMode ? 1 : 0)}
            </span>
          )}
        </Button>
        <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
          <Button
            variant={currentView === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="h-11 w-11 rounded-none"
            onClick={() => onViewChange('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-11 w-11 rounded-none"
            onClick={() => onViewChange('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-muted/50 border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Filter Events</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground text-sm">
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
                    className={`cursor-pointer transition-colors duration-200 px-3 py-1 text-sm rounded-md ${
                      activeCategory === cat.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
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
                    className={`cursor-pointer transition-colors duration-200 px-3 py-1 text-sm rounded-md ${
                      activeMode === mode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
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
          <span className="text-sm text-muted-foreground">Active:</span>
          {activeCategory && (
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary">
              {activeCategory}
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => onFilterCategory(null)} />
            </Badge>
          )}
          {activeMode && (
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary">
              {activeMode}
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => onFilterMode(null)} />
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary">
              "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => handleSearch('')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
