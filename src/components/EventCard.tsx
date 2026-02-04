import { Calendar, Clock, MapPin, Users, ArrowRight, Bookmark, Share2 } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { getSeatStatus, getSeatStatusConfig, shareEvent, getModeIcon, getEventStatus, canRegister } from '@/lib/eventUtils';
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
  const eventStatus = getEventStatus(event);
  const isRegistrationOpen = canRegister(event);

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
    <Card className="overflow-hidden group bg-card border-border/50 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30">
      <div className="relative h-2 gradient-hero" />
      
      <CardContent className="pt-6 pb-5 space-y-4">
        {/* Top Row: Category, Status, Mode, and Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className={`${getCategoryColor(event.category)} text-xs font-semibold px-2.5 py-1`}
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium">
              {modeInfo.icon} {modeInfo.label}
            </Badge>
            {event.maxCapacity && isRegistrationOpen && (
              <Badge variant="outline" className={`text-xs font-medium border ${seatStatusConfig.className}`}>
                {seatStatusConfig.label}
              </Badge>
            )}
            {eventStatus === 'active' && (
              <Badge className="text-xs font-medium bg-green-500/10 text-green-600 border-green-500/20">
                🔴 Live Now
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark 
                className={`w-4 h-4 transition-colors ${
                  isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                }`} 
              />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>

        {/* Event Title */}
        <h3 className="font-bold text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 pt-2">
          {/* Date & Time - Single line */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{event.time}</span>
            </div>
          </div>
          
          {/* Venue - Secondary */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary/70 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          {/* Registration count with progress bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                <span className={`font-semibold ${seatStatus === 'full' ? 'text-destructive' : 'text-foreground'}`}>
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
                   seatStatus === 'filling-fast' ? 'Almost full!' : 
                   `${Math.round(100 - seatPercentage)}% available`}
                </span>
              )}
            </div>
            {event.maxCapacity && (
              <Progress 
                value={seatPercentage} 
                className={`h-1.5 ${
                  seatStatus === 'full' ? '[&>div]:bg-destructive' : 
                  seatStatus === 'filling-fast' ? '[&>div]:bg-orange-500' : ''
                }`}
              />
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5 px-6">
        <Button 
          className="w-full h-11 text-sm font-semibold group/btn transition-all duration-200 hover:shadow-lg hover:shadow-primary/25" 
          variant="default"
          onClick={() => onViewDetails?.(event)}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
