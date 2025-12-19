import { useState } from 'react';
import { GraduationCap, Menu, X, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">Kristu Jayanti</span>
              <span className="text-xs text-muted-foreground leading-tight">University Events</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Discover
            </Button>
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Calendar
            </Button>
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              My Events
            </Button>
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Clubs
            </Button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button>Post Event</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">Discover</Button>
              <Button variant="ghost" className="justify-start">Calendar</Button>
              <Button variant="ghost" className="justify-start">My Events</Button>
              <Button variant="ghost" className="justify-start">Clubs</Button>
              <hr className="my-2 border-border/50" />
              <Button className="w-full">Post Event</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
