import { useState, useEffect } from 'react';
import { CollegeEvent, EventCategory, EventMode, categories } from '@/lib/eventData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface EventFormProps {
  event?: CollegeEvent | null;
  onSubmit: (data: Omit<CollegeEvent, 'id'>) => void;
  onCancel: () => void;
}

const modes: { value: EventMode; label: string }[] = [
  { value: 'offline', label: 'In-Person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EventForm = ({ event, onSubmit, onCancel }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'workshop' as EventCategory,
    mode: 'offline' as EventMode,
    organizer: '',
    department: '',
    googleFormLink: '',
    attendees: 0,
    maxCapacity: 100,
    isFeatured: false,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        category: event.category,
        mode: event.mode,
        organizer: event.organizer,
        department: event.department,
        googleFormLink: event.googleFormLink || '',
        attendees: event.attendees,
        maxCapacity: event.maxCapacity || 100,
        isFeatured: event.isFeatured || false,
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      googleFormLink: formData.googleFormLink, // Required field
      maxCapacity: formData.maxCapacity || undefined,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        <DialogDescription>
          {event ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="AI & Machine Learning Workshop"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the event..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizer">Organizer *</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="Tech Club"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="10:00 AM"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="venue">Venue *</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Computer Science Lab 301"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as EventCategory })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Mode *</Label>
            <Select
              value={formData.mode}
              onValueChange={(value) => setFormData({ ...formData, mode: value as EventMode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Current Attendees</Label>
            <Input
              id="attendees"
              type="number"
              min={0}
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max Capacity</Label>
            <Input
              id="maxCapacity"
              type="number"
              min={1}
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 100 })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="googleFormLink">Google Form Registration Link *</Label>
            <Input
              id="googleFormLink"
              type="url"
              value={formData.googleFormLink}
              onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
              placeholder="https://forms.google.com/..."
              required
            />
            <p className="text-xs text-muted-foreground">
              All event registrations are handled via Google Forms. This field is required.
            </p>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Featured Event
            </Label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" className="flex-1">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default EventForm;
