import { Calendar, Clock, MapPin, Users, ArrowRight, Bookmark, Share2, Star } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { getSeatStatus, getSeatStatusConfig, shareEvent, getModeIcon } from '@/lib/eventUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface EventCardProps {
  event: CollegeEvent;
  onViewDetails?: (event: CollegeEvent) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (eventId: string) => void;
}

const EventCard = ({ event, onViewDetails, isBookmarked = false, onToggleBookmark }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

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
    <Card className="group relative overflow-hidden bg-card border border-border rounded-xl shadow-card transition-shadow duration-200 hover:shadow-soft">
      {/* Featured Ribbon */}
      {event.isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="h-1 bg-primary" />
      
      <CardContent className="pt-5 pb-4 space-y-4">
        {/* Top Row: Category, Status, Mode, and Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className={`${getCategoryColor(event.category)} text-xs font-medium px-2.5 py-0.5 rounded-md`}
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium rounded-md border-border">
              {modeInfo.icon} {modeInfo.label}
            </Badge>
            {event.maxCapacity && (
              <Badge variant="outline" className={`text-xs font-medium rounded-md border ${seatStatusConfig.className}`}>
                {seatStatusConfig.label}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-md hover:bg-muted transition-colors duration-200"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark 
                className={`w-4 h-4 transition-colors ${
                  isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
                }`} 
              />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md hover:bg-muted transition-colors duration-200"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Event Title */}
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-snug">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2.5 pt-1">
          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>{event.time}</span>
            </div>
          </div>
          
          {/* Venue */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{event.venue}</span>
          </div>

          {/* Registration count with progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className={`font-medium ${seatStatus === 'full' ? 'text-destructive' : 'text-foreground'}`}>
                  {event.attendees}
                </span>
                {event.maxCapacity && (
                  <span className="text-muted-foreground">
                    / {event.maxCapacity} seats
                  </span>
                )}
              </div>
              {event.maxCapacity && (
                <span className={`text-xs font-medium ${
                  seatStatus === 'full' ? 'text-destructive' : 
                  seatStatus === 'filling-fast' ? 'text-orange-600' : 'text-muted-foreground'
                }`}>
                  {seatStatus === 'full' ? 'Sold out' : 
                   seatStatus === 'filling-fast' ? 'Almost full' : 
                   `${Math.round(100 - seatPercentage)}% available`}
                </span>
              )}
            </div>
            {event.maxCapacity && (
              <Progress 
                value={seatPercentage} 
                className={`h-1.5 rounded-full ${
                  seatStatus === 'full' ? '[&>div]:bg-destructive' : 
                  seatStatus === 'filling-fast' ? '[&>div]:bg-orange-500' : '[&>div]:bg-primary'
                }`}
              />
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5 px-5">
        <Button 
          className="w-full h-10 text-sm font-medium rounded-lg" 
          variant="default"
          onClick={() => onViewDetails?.(event)}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
