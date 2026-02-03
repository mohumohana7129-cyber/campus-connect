import { Clock, MapPin, Users, ArrowRight, Bookmark, Share2, Star } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { getSeatStatus, getSeatStatusConfig, shareEvent, getModeIcon } from '@/lib/eventUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface EventListItemProps {
  event: CollegeEvent;
  onViewDetails?: (event: CollegeEvent) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: string) => void;
}

const EventListItem = ({ event, onViewDetails, isBookmarked = false, onToggleBookmark }: EventListItemProps) => {
  const seatPercentage = event.maxCapacity 
    ? Math.min((event.attendees / event.maxCapacity) * 100, 100)
    : 0;

  const seatStatus = getSeatStatus(event);
  const seatStatusConfig = getSeatStatusConfig(seatStatus);
  const modeInfo = getModeIcon(event.mode);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await shareEvent(event);
    if (result.success) {
      toast.success(result.method === 'clipboard' ? 'Link copied to clipboard!' : 'Shared successfully!');
    } else if (result.method !== 'cancelled') {
      toast.error('Failed to share');
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark?.(event.id);
    toast.success(isBookmarked ? 'Removed from saved events' : 'Event saved!');
  };

  return (
    <div className="group relative bg-card border border-border/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:shadow-premium hover:-translate-y-1 hover:border-accent/30">
      {/* Featured indicator */}
      {event.isFeatured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-semibold">
          <Star className="w-3 h-3 fill-accent" />
          Featured
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-2xl gradient-hero flex flex-col items-center justify-center text-primary-foreground shadow-premium">
          <span className="text-3xl font-bold leading-none">{new Date(event.date).getDate()}</span>
          <span className="text-xs uppercase font-semibold mt-1 tracking-wide">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={`${getCategoryColor(event.category)} text-xs font-semibold px-3 py-1 rounded-full`}
              >
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium rounded-full border-muted-foreground/30">
                {modeInfo.icon} {modeInfo.label}
              </Badge>
              {event.maxCapacity && (
                <Badge variant="outline" className={`text-xs font-medium rounded-full border ${seatStatusConfig.className}`}>
                  {seatStatusConfig.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleBookmark}
                className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark 
                  className={`w-4 h-4 transition-colors ${
                    isBookmarked ? 'fill-accent text-accent' : 'text-muted-foreground hover:text-accent'
                  }`} 
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110"
                aria-label="Share event"
              >
                <Share2 className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 truncate pr-20">
            {event.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pt-1">
            {/* Time */}
            <div className="flex items-center gap-2 text-foreground font-medium">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>{event.time}</span>
            </div>
            {/* Venue */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 rounded-md bg-muted">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="truncate max-w-[150px]">{event.venue}</span>
            </div>
            {/* Attendees */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-accent/10">
                <Users className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className={`font-semibold ${seatStatus === 'full' ? 'text-destructive' : 'text-foreground'}`}>
                {event.attendees}
              </span>
              {event.maxCapacity && (
                <span className="text-muted-foreground">/ {event.maxCapacity}</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {event.maxCapacity && (
            <div className="pt-1">
              <Progress 
                value={seatPercentage} 
                className={`h-1.5 max-w-xs rounded-full ${
                  seatStatus === 'full' ? '[&>div]:bg-destructive' : 
                  seatStatus === 'filling-fast' ? '[&>div]:bg-orange-500' : '[&>div]:bg-accent'
                }`}
              />
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0 flex items-center sm:pl-4">
          <Button 
            className="rounded-xl h-12 px-6 transition-all duration-300 hover:shadow-premium"
            onClick={() => onViewDetails?.(event)}
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventListItem;
