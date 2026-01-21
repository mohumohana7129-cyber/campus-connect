import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EventCardProps {
  event: CollegeEvent;
  onViewDetails?: (event: CollegeEvent) => void;
}

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate seat availability percentage
  const seatPercentage = event.maxCapacity 
    ? Math.min((event.attendees / event.maxCapacity) * 100, 100)
    : 0;

  const isAlmostFull = seatPercentage >= 80;

  return (
    <Card className="overflow-hidden group bg-card border-border/50 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30">
      <div className="relative h-2 gradient-hero" />
      
      <CardContent className="pt-6 pb-5 space-y-4">
        {/* Category and Mode Badges */}
        <div className="flex items-start justify-between gap-3">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(event.category)} text-xs font-semibold px-2.5 py-1`}
          >
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
          {event.mode !== 'offline' && (
            <Badge variant="outline" className="text-xs font-medium">
              {event.mode === 'online' ? '🌐 Online' : '🔄 Hybrid'}
            </Badge>
          )}
        </div>

        {/* Event Title - More prominent */}
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
                <span className={`font-semibold ${isAlmostFull ? 'text-destructive' : 'text-foreground'}`}>
                  {event.attendees}
                </span>
                {event.maxCapacity && (
                  <span className="text-muted-foreground">
                    / {event.maxCapacity} seats
                  </span>
                )}
              </div>
              {event.maxCapacity && (
                <span className={`text-xs font-medium ${isAlmostFull ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {isAlmostFull ? 'Almost full!' : `${Math.round(100 - seatPercentage)}% available`}
                </span>
              )}
            </div>
            {event.maxCapacity && (
              <Progress 
                value={seatPercentage} 
                className={`h-1.5 ${isAlmostFull ? '[&>div]:bg-destructive' : ''}`}
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
