import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import kristuJayantiLogo from '@/assets/kristu-jayanti-logo.png';

const navLinks = [
  { label: 'Home', href: '/home' },
  { label: 'Events', href: '/events' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'About', href: '/about' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/student-login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-header-dark border-b border-header-border">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <img 
              src={kristuJayantiLogo} 
              alt="Kristu Jayanti University" 
              className="h-16 w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className={`px-4 py-2 text-base font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-header-accent'
                    : 'text-header-text hover:text-header-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-header-text hover:text-header-accent hover:bg-header-border ml-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-header-text hover:bg-header-border"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-header-border animate-fade-in">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? 'text-header-accent bg-header-border'
                      : 'text-header-text hover:bg-header-border'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                className="px-4 py-3 text-base font-medium rounded-lg transition-colors text-header-text hover:bg-header-border text-left flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
