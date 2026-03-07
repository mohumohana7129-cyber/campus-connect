import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useEvents } from '@/hooks/useEvents';
import { CollegeEvent, AvailabilityStatus } from '@/lib/eventData';
import EventForm from '@/components/admin/EventForm';
import EventsTable from '@/components/admin/EventsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Plus, 
  LogOut,
  LayoutDashboard,
  Calendar
} from 'lucide-react';

const OrganizerPanel = () => {
  const { logout, currentUser } = useAdminAuth();
  const navigate = useNavigate();
  const { events, addEvent, updateEvent, deleteEvent, updateAvailability } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CollegeEvent | null>(null);

  // Only show events created by this organizer
  const myEvents = useMemo(() => {
    if (!currentUser) return [];
    return events.filter(e => e.createdBy === currentUser.email);
  }, [events, currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/organiser-login');
  };

  const handleCreateEvent = (data: Omit<CollegeEvent, 'id'>) => {
    addEvent({
      ...data,
      createdBy: currentUser?.email || '',
      lastUpdatedBy: currentUser?.email || '',
      lastUpdatedAt: new Date().toISOString(),
    });
    setShowEventForm(false);
    toast.success('Event created successfully!');
  };

  const handleUpdateEvent = (data: Omit<CollegeEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...data,
        lastUpdatedBy: currentUser?.email || '',
        lastUpdatedAt: new Date().toISOString(),
      });
      setEditingEvent(null);
      toast.success('Event updated successfully!');
    }
  };

  const handleDeleteEvent = (id: string) => {
    // Only allow deleting own events
    const event = events.find(e => e.id === id);
    if (event && event.createdBy === currentUser?.email) {
      deleteEvent(id);
      toast.success('Event deleted successfully!');
    } else {
      toast.error('You can only delete events you created.');
    }
  };

  const handleEditClick = (event: CollegeEvent) => {
    if (event.createdBy === currentUser?.email) {
      setEditingEvent(event);
    } else {
      toast.error('You can only edit events you created.');
    }
  };

  const handleStatusChange = (eventId: string, status: AvailabilityStatus) => {
    const event = events.find(e => e.id === eventId);
    if (event && event.createdBy === currentUser?.email) {
      updateEvent(eventId, {
        availabilityStatus: status,
        lastUpdatedBy: currentUser?.email || '',
        lastUpdatedAt: new Date().toISOString(),
      });
      toast.success(`Event status updated to "${status}"`);
    } else {
      toast.error('You can only update status of events you created.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Organizer Panel</h1>
              <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/home')}>
              <Calendar className="w-4 h-4 mr-2" />
              Back to Website
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Events</CardTitle>
              <CalendarDays className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Events you created</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Events</h2>
            <Button onClick={() => setShowEventForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
          <EventsTable 
            events={myEvents} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteEvent}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>

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
    </div>
  );
};

export default OrganizerPanel;
