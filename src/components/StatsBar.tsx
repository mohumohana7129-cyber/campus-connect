import { Calendar, Users, Building2, Zap } from 'lucide-react';
import { calculateDynamicStats } from '@/lib/eventUtils';
import { useEvents } from '@/hooks/useEvents';
import { useMemo } from 'react';

const StatsBar = () => {
  const { events } = useEvents();
  const dynamicStats = useMemo(() => calculateDynamicStats(events), [events]);

  const stats = [
    { icon: Calendar, label: 'Events This Month', value: String(dynamicStats.eventsThisMonth), color: 'bg-primary/10 text-primary' },
    { icon: Users, label: 'Active Students', value: dynamicStats.activeStudents, color: 'bg-accent/10 text-accent' },
    { icon: Building2, label: 'Clubs & Societies', value: String(dynamicStats.uniqueClubs), color: 'bg-green-500/10 text-green-600' },
    { icon: Zap, label: 'Live Events', value: String(dynamicStats.liveEvents), color: 'bg-purple-500/10 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:shadow-premium transition-all duration-300 hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
