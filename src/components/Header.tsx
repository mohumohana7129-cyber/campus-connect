import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kristuJayantiLogo from '@/assets/kristu-jayanti-logo.png';

const topLinks = [
  { label: 'UN SDG 10', href: '#' },
  { label: 'UBA', href: '#' },
  { label: 'NIRF', href: '#' },
  { label: 'IQAC', href: '#' },
  { label: 'ARIIA', href: '#' },
  { label: 'KJC Journals', href: '#' },
  { label: 'Library', href: '#' },
  { label: 'Hostel', href: '#' },
  { label: 'Disclosures', href: '#' },
];

const mainNavLinks = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'Academics', href: '#' },
  { label: 'Research', href: '#' },
  { label: 'Campus', href: '#' },
  { label: 'Student Services', href: '#' },
  { label: 'Admission', href: '#' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="bg-header-dark border-b border-header-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center h-8">
            <nav className="hidden lg:flex items-center gap-1">
              {topLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="px-3 py-1 text-xs text-header-muted hover:text-header-text transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-header-dark">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={kristuJayantiLogo} 
                alt="Kristu Jayanti University" 
                className="h-14 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNavLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-header-text hover:text-header-accent transition-colors flex items-center gap-1"
                >
                  {link.label}
                  {['About Us', 'Academics', 'Research', 'Campus', 'Student Services'].includes(link.label) && (
                    <ChevronDown className="w-3 h-3" />
                  )}
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
                {mainNavLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium text-header-text hover:bg-header-border rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="my-2 border-header-border" />
                <div className="flex flex-wrap gap-2 px-4 py-2">
                  {topLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-xs text-header-muted hover:text-header-text transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;