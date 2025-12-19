import { Calendar, Clock, MapPin, Users, Sparkles } from 'lucide-react';
import { CollegeEvent, getCategoryColor } from '@/lib/eventData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedEventProps {
  event: CollegeEvent;
}

const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-hero p-[1px]">
      <div className="bg-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent animate-pulse-soft" />
              <span className="text-sm font-medium text-accent">Featured Event</span>
            </div>
            
            <Badge 
              variant="secondary" 
              className={`${getCategoryColor(event.category)} text-xs font-medium px-2.5 py-0.5 mb-3`}
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {event.title}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-foreground">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="text-sm font-medium text-foreground">{event.venue}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Attendees</p>
                  <p className="text-sm font-medium text-foreground">
                    {event.attendees}{event.maxCapacity && ` / ${event.maxCapacity}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                Register Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          <div className="w-full md:w-80 h-48 md:h-auto rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🎓</div>
              <p className="text-sm text-muted-foreground">By {event.organizer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
