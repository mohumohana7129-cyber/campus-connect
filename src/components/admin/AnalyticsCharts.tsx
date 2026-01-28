import { useMemo } from 'react';
import { CollegeEvent } from '@/lib/eventData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface AnalyticsChartsProps {
  events: CollegeEvent[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(221 83% 53%)',
  'hsl(142 76% 36%)',
  'hsl(47 96% 53%)',
];

const AnalyticsCharts = ({ events }: AnalyticsChartsProps) => {
  // Calculate department-wise participation
  const departmentData = useMemo(() => {
    const deptMap = new Map<string, number>();
    events.forEach((event) => {
      const current = deptMap.get(event.department) || 0;
      deptMap.set(event.department, current + event.attendees);
    });
    return Array.from(deptMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [events]);

  // Calculate events per department
  const eventsPerDepartment = useMemo(() => {
    const deptMap = new Map<string, number>();
    events.forEach((event) => {
      const current = deptMap.get(event.department) || 0;
      deptMap.set(event.department, current + 1);
    });
    return Array.from(deptMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [events]);

  const pieChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    departmentData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [departmentData]);

  const barChartConfig = useMemo(() => {
    return {
      count: {
        label: 'Events',
        color: 'hsl(var(--primary))',
      },
    };
  }, []);

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No data available for analytics.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Department-wise Participation Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department-wise Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name.slice(0, 10)}${name.length > 10 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {departmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Events per Department Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Events per Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-[300px]">
            <BarChart data={eventsPerDepartment} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
                name="Events"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
