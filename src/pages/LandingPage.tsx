import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import kristuJayantiLogo from '@/assets/kristu-jayanti-logo.png';
import {
  GraduationCap,
  Calendar,
  Users,
  Award,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Globe,
  BookOpen,
  Mic2,
  Trophy,
  Palette,
} from 'lucide-react';

const LandingPage = () => {
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-landing-cream">
      {/* Top Bar */}
      <div className="bg-landing-navy text-landing-text-muted text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 80 2844 0744
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Mail className="w-3 h-3" /> info@kristujayanti.com
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> kristujayanti.edu.in
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-landing-navy-light border-b border-landing-navy-lighter sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={kristuJayantiLogo}
                alt="Kristu Jayanti College"
                className="h-14 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-landing-text font-bold text-lg leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                  Kristu Jayanti University
                </h1>
                <p className="text-landing-text-muted text-xs">University | Bengaluru</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              <a href="#about" className="hidden md:inline-block px-4 py-2 text-sm text-landing-text hover:text-landing-gold transition-colors" style={{ fontFamily: "'Georgia', serif" }}>
                About
              </a>
              <a href="#events" className="hidden md:inline-block px-4 py-2 text-sm text-landing-text hover:text-landing-gold transition-colors" style={{ fontFamily: "'Georgia', serif" }}>
                Events
              </a>
              <a href="#contact" className="hidden md:inline-block px-4 py-2 text-sm text-landing-text hover:text-landing-gold transition-colors" style={{ fontFamily: "'Georgia', serif" }}>
                Contact
              </a>

              {/* Login Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="text-landing-gold hover:text-landing-gold-light hover:bg-landing-navy-lighter gap-1 text-sm"
                  style={{ fontFamily: "'Georgia', serif" }}
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  onBlur={() => setTimeout(() => setLoginDropdownOpen(false), 200)}
                >
                  Login <ChevronDown className="w-3 h-3" />
                </Button>
                {loginDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-landing-navy-light border border-landing-navy-lighter rounded-md shadow-xl z-50 py-1 animate-fade-in">
                    <Link
                      to="/admin-login"
                      className="block px-4 py-2.5 text-sm text-landing-text hover:bg-landing-navy-lighter hover:text-landing-gold transition-colors"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      Admin Login
                    </Link>
                    <Link
                      to="/organiser-login"
                      className="block px-4 py-2.5 text-sm text-landing-text hover:bg-landing-navy-lighter hover:text-landing-gold transition-colors"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      Organiser Login
                    </Link>
                    <Link
                      to="/student-login"
                      className="block px-4 py-2.5 text-sm text-landing-text hover:bg-landing-navy-lighter hover:text-landing-gold transition-colors"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      Student Login
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-landing-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(38 92% 50% / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(220 40% 40% / 0.2) 0%, transparent 50%)',
          }} />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-landing-navy-lighter/50 border border-landing-navy-lighter rounded-full px-4 py-1.5 mb-6">
              <GraduationCap className="w-4 h-4 text-landing-gold" />
              <span className="text-landing-text-muted text-sm" style={{ fontFamily: "'Georgia', serif" }}>
                Kristu Jayanti University
              </span>
            </div>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-landing-text mb-6 leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              College{' '}
              <span className="text-landing-gold">Events</span>{' '}
              Portal
            </h2>
            <p className="text-landing-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ fontFamily: "'Georgia', serif" }}>
              Discover Workshops, Fests, Hackathons &amp; Cultural Events happening across all departments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student-login">
                <Button size="lg" className="bg-landing-gold hover:bg-landing-gold-light text-landing-navy font-semibold px-8 w-full sm:w-auto" style={{ fontFamily: "'Georgia', serif" }}>
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Student Login
                </Button>
              </Link>
              <Link to="/organiser-login">
                <Button size="lg" variant="outline" className="border-landing-gold/40 text-landing-gold hover:bg-landing-gold/10 px-8 w-full sm:w-auto" style={{ fontFamily: "'Georgia', serif" }}>
                  <Users className="w-5 h-5 mr-2" />
                  Organiser Login
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button size="lg" variant="outline" className="border-landing-gold/40 text-landing-gold hover:bg-landing-gold/10 px-8 w-full sm:w-auto" style={{ fontFamily: "'Georgia', serif" }}>
                  <Award className="w-5 h-5 mr-2" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path d="M0,60 L0,20 Q360,0 720,20 Q1080,40 1440,20 L1440,60 Z" fill="hsl(40 33% 96%)" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-landing-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Georgia', serif", color: 'hsl(220 40% 13%)' }}>
              About the Events Portal
            </h3>
            <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: "'Georgia', serif", color: 'hsl(220 20% 35%)' }}>
              The Kristu Jayanti University Events Portal is the centralised platform for discovering, managing, and participating in academic, cultural, technical, and co-curricular events across all departments. Whether you're a student looking for the next hackathon, an organiser planning a workshop, or an administrator overseeing the event ecosystem — this is your hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Calendar, title: 'Department Events', desc: 'Browse events tailored to your department and interests.' },
              { icon: Users, title: 'Easy Registration', desc: 'Register for events seamlessly via integrated forms.' },
              { icon: Award, title: 'Organised Management', desc: 'Organisers and admins can create, edit, and manage events effortlessly.' },
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-landing-navy/5 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-landing-gold" />
                  </div>
                  <h4 className="font-bold mb-2 text-lg" style={{ fontFamily: "'Georgia', serif", color: 'hsl(220 40% 13%)' }}>
                    {item.title}
                  </h4>
                  <p className="text-sm" style={{ color: 'hsl(220 15% 45%)' }}>{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Highlights Section */}
      <section id="events" className="py-16 md:py-24" style={{ backgroundColor: 'hsl(220 40% 13%)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-landing-text mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              Event Highlights
            </h3>
            <p className="text-landing-text-muted max-w-xl mx-auto" style={{ fontFamily: "'Georgia', serif" }}>
              A glimpse of the vibrant events hosted across departments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, title: 'Workshops', desc: 'Hands-on learning sessions by industry experts', color: 'text-blue-400' },
              { icon: Trophy, title: 'Hackathons', desc: 'Code, innovate, and compete with the best', color: 'text-green-400' },
              { icon: Palette, title: 'Cultural Fests', desc: 'Art, music, dance, and creative showcases', color: 'text-pink-400' },
              { icon: Mic2, title: 'Seminars', desc: 'Knowledge sharing by distinguished speakers', color: 'text-amber-400' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-landing-navy-light border border-landing-navy-lighter rounded-xl p-6 text-center hover:border-landing-gold/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-landing-navy-lighter/50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h4 className="font-bold text-landing-text mb-1.5" style={{ fontFamily: "'Georgia', serif" }}>
                  {item.title}
                </h4>
                <p className="text-sm text-landing-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/student-login">
              <Button size="lg" variant="outline" className="border-landing-gold/40 text-landing-gold hover:bg-landing-gold/10 px-8" style={{ fontFamily: "'Georgia', serif" }}>
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-landing-navy-light border-t border-landing-navy-lighter py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* College Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={kristuJayantiLogo} alt="Kristu Jayanti University" className="h-12 w-auto" />
                <div>
                  <h4 className="text-landing-text font-bold" style={{ fontFamily: "'Georgia', serif" }}>Kristu Jayanti University</h4>
                  <p className="text-landing-text-muted text-xs">University</p>
                </div>
              </div>
              <p className="text-landing-text-muted text-sm leading-relaxed">
                A premier educational institution committed to academic excellence, holistic formation, and social transformation.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-landing-text font-bold mb-4" style={{ fontFamily: "'Georgia', serif" }}>Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Student Login', href: '/student-login' },
                  { label: 'Organiser Login', href: '/organiser-login' },
                  { label: 'Admin Login', href: '/admin-login' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.href} className="text-landing-text-muted hover:text-landing-gold text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-landing-text font-bold mb-4" style={{ fontFamily: "'Georgia', serif" }}>Contact Us</h4>
              <div className="space-y-3 text-sm text-landing-text-muted">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-landing-gold shrink-0" />
                  K. Narayanapura, Kothanur P.O., Bengaluru - 560077
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-landing-gold shrink-0" />
                  +91 80 2844 0744
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-landing-gold shrink-0" />
                  info@kristujayanti.com
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-landing-navy-lighter pt-6 text-center">
            <p className="text-landing-text-muted text-xs">
              © {new Date().getFullYear()} Kristu Jayanti College, Autonomous. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
