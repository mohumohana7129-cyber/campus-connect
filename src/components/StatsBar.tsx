import { Calendar, Users, Building2, Zap } from 'lucide-react';
import { calculateDynamicStats } from '@/lib/eventUtils';
import { useEvents } from '@/hooks/useEvents';
import { useMemo } from 'react';

const StatsBar = () => {
  const { events } = useEvents();
  const dynamicStats = useMemo(() => calculateDynamicStats(events), [events]);

  const stats = [
    { icon: Calendar, label: 'Events This Month', value: String(dynamicStats.eventsThisMonth), color: 'bg-primary/10 text-primary' },
    { icon: Users, label: 'Active Students', value: dynamicStats.activeStudents, color: 'bg-blue-500/10 text-blue-600' },
    { icon: Building2, label: 'Clubs & Societies', value: String(dynamicStats.uniqueClubs), color: 'bg-green-500/10 text-green-600' },
    { icon: Zap, label: 'Live Events', value: String(dynamicStats.liveEvents), color: 'bg-purple-500/10 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-lg p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
