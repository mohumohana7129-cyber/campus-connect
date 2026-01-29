import { useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { CollegeEvent } from '@/lib/eventData';
import AdminLayout from '@/components/admin/AdminLayout';
import EventForm from '@/components/admin/EventForm';
import EventsTable from '@/components/admin/EventsTable';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Users, 
  Building, 
  TrendingUp, 
  Plus,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { events, addEvent, updateEvent, deleteEvent, isLoading } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CollegeEvent | null>(null);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, event) => sum + event.attendees, 0);
    const uniqueDepartments = new Set(events.map(e => e.department)).size;
    
    // Events this month
    const now = new Date();
    const eventsThisMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === now.getMonth() && 
             eventDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalEvents, totalRegistrations, uniqueDepartments, eventsThisMonth };
  }, [events]);

  const handleCreateEvent = (data: Omit<CollegeEvent, 'id'>) => {
    addEvent(data);
    setShowEventForm(false);
    toast.success('Event created successfully!');
  };

  const handleUpdateEvent = (data: Omit<CollegeEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
      setEditingEvent(null);
      toast.success('Event updated successfully!');
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toast.success('Event deleted successfully!');
  };

  const handleEditClick = (event: CollegeEvent) => {
    setEditingEvent(event);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              <CalendarDays className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalRegistrations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
              <Building className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.uniqueDepartments}</div>
              <p className="text-xs text-muted-foreground mt-1">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.eventsThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Events scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Event Management</h2>
              <Button onClick={() => setShowEventForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
            <EventsTable 
              events={events} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteEvent} 
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Analytics & Insights</h2>
            <AnalyticsCharts events={events} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-2xl">
          <EventForm 
            onSubmit={handleCreateEvent} 
            onCancel={() => setShowEventForm(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <EventForm 
            event={editingEvent}
            onSubmit={handleUpdateEvent} 
            onCancel={() => setEditingEvent(null)} 
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
