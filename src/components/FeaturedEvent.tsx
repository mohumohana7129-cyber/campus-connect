import { Calendar, Clock, MapPin, Users, ArrowRight, Star } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedEventProps {
  event: CollegeEvent;
  onViewDetails?: (event: CollegeEvent) => void;
}

const FeaturedEvent = ({ event, onViewDetails }: FeaturedEventProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleClick = () => {
    onViewDetails?.(event);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-6 md:p-8 lg:p-10">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="flex-1">
            {/* Featured badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-full mb-4">
              <Star className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Featured Event</span>
            </div>
            
            {/* Category badge */}
            <Badge 
              variant="secondary" 
              className="bg-primary-foreground/10 text-primary-foreground border-none text-xs font-medium px-2.5 py-0.5 rounded-md mb-3"
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 leading-tight">
              {event.title}
            </h2>
            
            <p className="text-primary-foreground/80 text-base mb-6 max-w-xl">
              {event.description}
            </p>

            {/* Event details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-primary-foreground/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Date</p>
                  <p className="text-sm font-medium text-primary-foreground">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-primary-foreground/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Time</p>
                  <p className="text-sm font-medium text-primary-foreground">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-primary-foreground/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Venue</p>
                  <p className="text-sm font-medium text-primary-foreground">{event.venue}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-primary-foreground/10 rounded-lg">
                <Users className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Attendees</p>
                  <p className="text-sm font-medium text-primary-foreground">
                    {event.attendees}{event.maxCapacity && ` / ${event.maxCapacity}`}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                onClick={handleClick}
                className="h-11 px-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-lg font-medium"
              >
                Register Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleClick}
                className="h-11 px-6 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-lg font-medium"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Event visual */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="h-full min-h-[200px] rounded-lg bg-primary-foreground/10 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-6xl mb-3">🎓</div>
                <p className="text-sm text-primary-foreground/80">Organized by</p>
                <p className="text-base text-primary-foreground font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
