import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Home, LogOut, LayoutDashboard } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToWebsite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage events & analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBackToWebsite}>
              <Home className="w-4 h-4 mr-2" />
              Back to Website
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
