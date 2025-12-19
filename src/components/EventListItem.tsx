import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventListItemProps {
  event: CollegeEvent;
  onViewDetails?: (event: CollegeEvent) => void;
}

const EventListItem = ({ event, onViewDetails }: EventListItemProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="group bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-16 h-16 rounded-xl gradient-hero flex flex-col items-center justify-center text-primary-foreground">
          <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
          <span className="text-xs uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={`${getCategoryColor(event.category)} text-xs font-medium`}
              >
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
              {event.mode !== 'offline' && (
                <Badge variant="outline" className="text-xs">
                  {event.mode === 'online' ? '🌐 Online' : '🔄 Hybrid'}
                </Badge>
              )}
            </div>
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors truncate">
            {event.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate max-w-[150px]">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              <span>{event.attendees} attending</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex-shrink-0 flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-10 w-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
