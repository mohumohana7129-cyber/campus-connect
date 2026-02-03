import { Calendar, Clock, MapPin, Users, Sparkles, ArrowRight, Star } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-10 lg:p-12">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            {/* Featured badge */}
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-semibold text-accent">Featured Event</span>
            </div>
            
            {/* Category badge */}
            <Badge 
              variant="secondary" 
              className="bg-white/10 text-primary-foreground border-none text-xs font-medium px-3 py-1 rounded-full mb-4"
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              {event.title}
            </h2>
            
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl">
              {event.description}
            </p>

            {/* Event details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Date</p>
                  <p className="text-sm font-medium text-primary-foreground">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Time</p>
                  <p className="text-sm font-medium text-primary-foreground">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Venue</p>
                  <p className="text-sm font-medium text-primary-foreground">{event.venue}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-primary-foreground/60">Attendees</p>
                  <p className="text-sm font-medium text-primary-foreground">
                    {event.attendees}{event.maxCapacity && ` / ${event.maxCapacity}`}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={handleClick}
                className="h-12 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-semibold shadow-gold transition-all duration-300 hover:scale-105"
              >
                Register Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleClick}
                className="h-12 px-8 border-2 border-primary-foreground/30 text-primary-foreground hover:bg-white/10 hover:border-primary-foreground/50 rounded-xl font-semibold transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Event visual */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="h-full min-h-[280px] rounded-2xl bg-gradient-to-br from-accent/30 to-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-7xl mb-4">🎓</div>
                <p className="text-sm text-primary-foreground/80 font-medium">Organized by</p>
                <p className="text-lg text-primary-foreground font-semibold">{event.organizer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
