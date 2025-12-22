import Header from '@/components/Header';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">About Us</h1>
        <p className="text-muted-foreground">Learn more about Kristu Jayanti University and our mission.</p>
      </main>
    </div>
  );
};

export default About;
