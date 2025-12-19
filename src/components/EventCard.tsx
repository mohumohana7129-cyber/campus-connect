import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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

  return (
    <Card className="event-card-hover overflow-hidden group bg-card border-border/50">
      <div className="relative h-2 gradient-hero" />
      
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(event.category)} text-xs font-medium px-2.5 py-0.5`}
          >
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
          {event.mode !== 'offline' && (
            <Badge variant="outline" className="text-xs">
              {event.mode === 'online' ? '🌐 Online' : '🔄 Hybrid'}
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-4 h-4 text-primary ml-2" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>
              {event.attendees} registered
              {event.maxCapacity && ` / ${event.maxCapacity} spots`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5">
        <Button 
          className="w-full group/btn" 
          variant="default"
          onClick={() => onViewDetails?.(event)}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
