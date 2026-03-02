import { useState } from 'react';
import { useAdminAuth, AppUser } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import { UserPlus, Shield, UserMinus } from 'lucide-react';

const RoleManager = () => {
  const { getAllUsers, assignOrganizer, revokeOrganizer } = useAdminAuth();
  const [newOrganizerEmail, setNewOrganizerEmail] = useState('');
  const [users, setUsers] = useState<AppUser[]>(getAllUsers());

  const refreshUsers = () => setUsers(getAllUsers());

  const handleAssign = () => {
    if (!newOrganizerEmail || !newOrganizerEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    assignOrganizer(newOrganizerEmail);
    setNewOrganizerEmail('');
    refreshUsers();
    toast.success(`${newOrganizerEmail} is now an Event Organizer`);
  };

  const handleRevoke = (email: string) => {
    revokeOrganizer(email);
    refreshUsers();
    toast.success(`Organizer access revoked for ${email}`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>;
      case 'organizer':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Organizer</Badge>;
      default:
        return <Badge variant="secondary">Student</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Organizer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assign Event Organizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter email address..."
              value={newOrganizerEmail}
              onChange={(e) => setNewOrganizerEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAssign}>
              <Shield className="w-4 h-4 mr-2" />
              Assign Organizer
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This email will be granted Event Organizer access on their next login.
          </p>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.department || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === 'organizer' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <UserMinus className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Organizer Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will change {user.email} from Organizer to Student role.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevoke(user.email)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {user.role === 'student' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            assignOrganizer(user.email);
                            refreshUsers();
                            toast.success(`${user.email} promoted to Organizer`);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Promote
                        </Button>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-xs text-muted-foreground">Immutable</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManager;
