import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kristuJayantiLogo from '@/assets/kristu-jayanti-logo.png';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Calendar', href: '#' },
  { label: 'About', href: '#' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-header-dark border-b border-header-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={kristuJayantiLogo} 
              alt="Kristu Jayanti University" 
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-header-text hover:text-header-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-header-text hover:bg-header-border"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-header-border animate-fade-in">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-header-text hover:bg-header-border rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;