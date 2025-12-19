import { Calendar, Users, Building2, Zap } from 'lucide-react';

const stats = [
  { icon: Calendar, label: 'Events This Month', value: '24', color: 'text-primary' },
  { icon: Users, label: 'Active Students', value: '2.5K+', color: 'text-event-cultural' },
  { icon: Building2, label: 'Clubs & Societies', value: '45', color: 'text-event-sports' },
  { icon: Zap, label: 'Live Events', value: '3', color: 'text-accent' },
];

const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-md transition-shadow"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
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
