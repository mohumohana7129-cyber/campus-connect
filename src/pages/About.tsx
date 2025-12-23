import Header from '@/components/Header';
import { GraduationCap, Users, Building2, Award, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Students' },
    { icon: GraduationCap, value: '500+', label: 'Faculty Members' },
    { icon: Building2, value: '40+', label: 'Departments' },
    { icon: Award, value: '25+', label: 'Years of Excellence' },
  ];

  const highlights = [
    {
      title: 'Excellence in Education',
      description: 'Ranked among the top universities in India with NAAC A++ accreditation and recognized for academic excellence.',
    },
    {
      title: 'Holistic Development',
      description: 'Focus on nurturing well-rounded individuals through academics, sports, cultural activities, and community service.',
    },
    {
      title: 'Industry Connections',
      description: 'Strong partnerships with leading companies ensuring excellent placement opportunities for our graduates.',
    },
    {
      title: 'Vibrant Campus Life',
      description: 'A dynamic campus with state-of-the-art facilities, clubs, and events that foster creativity and innovation.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="gradient-text">Kristu Jayanti</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kristu Jayanti University is a premier institution dedicated to academic excellence, 
              holistic development, and nurturing future leaders. Established with a vision to 
              transform lives through quality education, we continue to inspire and empower 
              students to achieve their dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 bg-card border-border/50">
              <CardContent className="p-0">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Kristu Jayanti Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">
          Why <span className="gradient-text">Kristu Jayanti?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((highlight, index) => (
            <Card key={index} className="p-6 bg-card border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold text-foreground mb-3">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide quality higher education that prepares students for professional 
                excellence while instilling values of integrity, compassion, and social responsibility. 
                We strive to create an environment that fosters innovation, critical thinking, 
                and lifelong learning.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized university that transforms lives through holistic 
                education, cutting-edge research, and community engagement. We envision graduates 
                who are ethical leaders, innovative thinkers, and responsible citizens contributing 
                to a better world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">
          Get in <span className="gradient-text">Touch</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 bg-card border-border/50 text-center">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Address</h3>
              <p className="text-sm text-muted-foreground">
                K. Narayanapura, Kothanur P.O.<br />
                Bengaluru - 560077<br />
                Karnataka, India
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6 bg-card border-border/50 text-center">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Phone</h3>
              <p className="text-sm text-muted-foreground">
                +91 80 2846 5353<br />
                +91 80 2846 5757
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-6 bg-card border-border/50 text-center">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">
                info@kristujayanti.edu.in<br />
                admissions@kristujayanti.edu.in
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground text-sm">🎓</span>
              </div>
              <span className="font-semibold text-foreground">CampusHub</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 CampusHub. Bringing your campus community together.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <a href="/events" className="hover:text-foreground transition-colors">Events</a>
              <a href="/calendar" className="hover:text-foreground transition-colors">Calendar</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
