import Header from '@/components/Header';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Calendar</h1>
        <p className="text-muted-foreground">View the academic calendar and scheduled events.</p>
      </main>
    </div>
  );
};

export default Calendar;
