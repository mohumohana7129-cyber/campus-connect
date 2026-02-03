import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kristuJayantiLogo from '@/assets/kristu-jayanti-logo.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'About', href: '/about' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-header-dark border-b border-header-border transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-black/20' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={kristuJayantiLogo} 
              alt="Kristu Jayanti University" 
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={index}
                  to={link.href}
                  className={`nav-link ${isActive ? 'active' : 'text-header-text'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-header-text hover:bg-header-border hover:text-header-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-4 border-t border-header-border bg-header-dark/95 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={index}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-header-accent bg-header-border'
                        : 'text-header-text hover:bg-header-border hover:text-header-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
