import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EventListItemProps {
  event: CollegeEvent;
  onViewDetails?: (event: CollegeEvent) => void;
}

const EventListItem = ({ event, onViewDetails }: EventListItemProps) => {
  // Calculate seat availability percentage
  const seatPercentage = event.maxCapacity 
    ? Math.min((event.attendees / event.maxCapacity) * 100, 100)
    : 0;

  const isAlmostFull = seatPercentage >= 80;

  return (
    <div className="group bg-card border border-border/50 rounded-xl p-4 sm:p-5 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl gradient-hero flex flex-col items-center justify-center text-primary-foreground shadow-lg">
          <span className="text-2xl font-bold leading-none">{new Date(event.date).getDate()}</span>
          <span className="text-xs uppercase font-medium mt-0.5">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
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
          </div>

          {/* Title - More prominent */}
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 truncate">
            {event.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm pt-1">
            {/* Time - Primary info */}
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <Clock className="w-4 h-4 text-primary" />
              <span>{event.time}</span>
            </div>
            {/* Venue - Secondary */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary/70" />
              <span className="truncate max-w-[150px]">{event.venue}</span>
            </div>
            {/* Attendees with visual indicator */}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className={`font-semibold ${isAlmostFull ? 'text-destructive' : 'text-foreground'}`}>
                {event.attendees}
              </span>
              {event.maxCapacity && (
                <span className="text-muted-foreground">/ {event.maxCapacity}</span>
              )}
            </div>
          </div>

          {/* Progress bar for seat availability */}
          {event.maxCapacity && (
            <div className="pt-1">
              <Progress 
                value={seatPercentage} 
                className={`h-1 max-w-xs ${isAlmostFull ? '[&>div]:bg-destructive' : ''}`}
              />
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0 flex items-center sm:pl-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-12 w-12 sm:h-10 sm:w-10 transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-110"
            onClick={() => onViewDetails?.(event)}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventListItem;
