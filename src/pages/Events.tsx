import Header from '@/components/Header';

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Events</h1>
        <p className="text-muted-foreground">Discover upcoming events at Kristu Jayanti University.</p>
      </main>
    </div>
  );
};

export default Events;
