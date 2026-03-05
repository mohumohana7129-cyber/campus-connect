import { CollegeEvent, getCategoryColor, AvailabilityStatus } from '@/lib/eventData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, ExternalLink, Star } from 'lucide-react';

interface EventsTableProps {
  events: CollegeEvent[];
  onEdit: (event: CollegeEvent) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (eventId: string, status: AvailabilityStatus) => void;
}

const getAvailabilityBadge = (status: string) => {
  switch (status) {
    case 'Closed':
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">{status}</Badge>;
    case 'Filling Fast':
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">{status}</Badge>;
    default:
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">{status}</Badge>;
  }
};

const statusOptions: AvailabilityStatus[] = ['Available', 'Filling Fast', 'Closed'];

const EventsTable = ({ events, onEdit, onDelete, onStatusChange }: EventsTableProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No events found. Create your first event!</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[300px]">Event</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium line-clamp-1">{event.title}</span>
                    {event.isFeatured && (
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className={`${getCategoryColor(event.category)} text-xs`}>
                      {event.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {event.mode}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {event.department}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{formatDate(event.date)}</div>
                  <div className="text-muted-foreground">{event.time}</div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                {event.venue}
              </TableCell>
              <TableCell className="text-center">
                {onStatusChange ? (
                  <Select
                    value={event.availabilityStatus || 'Available'}
                    onValueChange={(value) => onStatusChange(event.id, value as AvailabilityStatus)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs mx-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  getAvailabilityBadge(event.availabilityStatus || 'Available')
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {event.googleFormLink && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(event.googleFormLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(event)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsTable;
