export type EventCategory = 'workshop' | 'cultural' | 'tech' | 'sports' | 'seminar';
export type EventMode = 'online' | 'offline' | 'hybrid';

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  mode: EventMode;
  organizer: string;
  department: string;
  registrationLink?: string;
  googleFormLink?: string;
  posterUrl?: string;
  attendees: number;
  maxCapacity?: number;
  isFeatured?: boolean;
}

// Generate future dates relative to today
const getFutureDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const sampleEvents: CollegeEvent[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering neural networks, deep learning fundamentals, and practical applications using Python and TensorFlow.',
    date: getFutureDate(5),
    time: '10:00 AM',
    venue: 'Computer Science Lab 301',
    category: 'workshop',
    mode: 'offline',
    organizer: 'Tech Club',
    department: 'Computer Science',
    attendees: 45,
    maxCapacity: 60,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Annual Cultural Fest - Rhythm 2025',
    description: 'Three-day extravaganza featuring music, dance, drama, and art competitions from colleges across the state.',
    date: getFutureDate(12),
    time: '5:00 PM',
    venue: 'Main Auditorium',
    category: 'cultural',
    mode: 'offline',
    organizer: 'Cultural Committee',
    department: 'Student Affairs',
    attendees: 500,
    maxCapacity: 800,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Hackathon: Code for Change',
    description: '24-hour coding marathon to build innovative solutions for social impact. Great prizes and networking opportunities!',
    date: getFutureDate(18),
    time: '9:00 AM',
    venue: 'Innovation Hub',
    category: 'tech',
    mode: 'hybrid',
    organizer: 'Developer Community',
    department: 'Computer Science',
    attendees: 120,
    maxCapacity: 150,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Inter-College Basketball Championship',
    description: 'Annual basketball tournament featuring teams from 12 colleges. Come support your team!',
    date: getFutureDate(8),
    time: '2:00 PM',
    venue: 'Sports Complex',
    category: 'sports',
    mode: 'offline',
    organizer: 'Sports Council',
    department: 'Physical Education',
    attendees: 180,
    maxCapacity: 250,
  },
  {
    id: '5',
    title: 'Guest Lecture: Future of Renewable Energy',
    description: 'Dr. Sarah Mitchell from MIT discusses the latest advancements in solar and wind energy technology.',
    date: getFutureDate(3),
    time: '3:00 PM',
    venue: 'Seminar Hall A',
    category: 'seminar',
    mode: 'hybrid',
    organizer: 'Energy Club',
    department: 'Electrical Engineering',
    attendees: 80,
    maxCapacity: 100,
  },
  {
    id: '6',
    title: 'Photography Workshop: Capture the Moment',
    description: 'Learn professional photography techniques including composition, lighting, and post-processing.',
    date: getFutureDate(20),
    time: '11:00 AM',
    venue: 'Art Studio',
    category: 'workshop',
    mode: 'offline',
    organizer: 'Photography Club',
    department: 'Fine Arts',
    attendees: 25,
    maxCapacity: 30,
  },
  {
    id: '7',
    title: 'Startup Pitch Competition',
    description: 'Present your startup idea to a panel of investors and industry experts. Win funding and mentorship!',
    date: getFutureDate(25),
    time: '10:00 AM',
    venue: 'Business School Auditorium',
    category: 'tech',
    mode: 'offline',
    organizer: 'Entrepreneurship Cell',
    department: 'Business Administration',
    attendees: 60,
    maxCapacity: 80,
  },
  {
    id: '8',
    title: 'Classical Music Night',
    description: 'An evening of Indian classical music featuring renowned artists and student performers.',
    date: getFutureDate(15),
    time: '6:30 PM',
    venue: 'Open Air Theatre',
    category: 'cultural',
    mode: 'offline',
    organizer: 'Music Society',
    department: 'Student Affairs',
    attendees: 120,
    maxCapacity: 200,
  },
  {
    id: '9',
    title: 'Web Development Bootcamp',
    description: 'Intensive 2-day bootcamp covering React, Node.js, and modern web development practices.',
    date: getFutureDate(0), // Today - Active event
    time: '9:00 AM',
    venue: 'Tech Lab 201',
    category: 'workshop',
    mode: 'offline',
    organizer: 'Web Dev Club',
    department: 'Computer Science',
    attendees: 35,
    maxCapacity: 40,
  },
  {
    id: '10',
    title: 'Career Fair 2025',
    description: 'Connect with top employers, explore internship opportunities, and get your resume reviewed.',
    date: getFutureDate(30),
    time: '10:00 AM',
    venue: 'Main Hall',
    category: 'seminar',
    mode: 'offline',
    organizer: 'Placement Cell',
    department: 'Career Services',
    attendees: 250,
    maxCapacity: 500,
  },
  {
    id: '11',
    title: 'Yoga & Wellness Session',
    description: 'Start your morning with guided yoga and meditation for stress relief and mental clarity.',
    date: getFutureDate(2),
    time: '6:00 AM',
    venue: 'Sports Ground',
    category: 'sports',
    mode: 'offline',
    organizer: 'Wellness Club',
    department: 'Physical Education',
    attendees: 40,
    maxCapacity: 50,
  },
  {
    id: '12',
    title: 'Data Science Symposium',
    description: 'Industry experts discuss the latest trends in data analytics, visualization, and business intelligence.',
    date: getFutureDate(22),
    time: '2:00 PM',
    venue: 'Conference Hall B',
    category: 'seminar',
    mode: 'hybrid',
    organizer: 'Data Science Club',
    department: 'Computer Science',
    attendees: 90,
    maxCapacity: 120,
  },
  // Some completed events for history
  {
    id: '13',
    title: 'Orientation Week 2024',
    description: 'Welcome session for new students with campus tours and introduction to university life.',
    date: getFutureDate(-30), // Past event
    time: '9:00 AM',
    venue: 'Main Auditorium',
    category: 'seminar',
    mode: 'offline',
    organizer: 'Student Council',
    department: 'Student Affairs',
    attendees: 600,
    maxCapacity: 600,
  },
  {
    id: '14',
    title: 'Coding Competition 2024',
    description: 'Annual competitive programming event with algorithmic challenges.',
    date: getFutureDate(-15), // Past event
    time: '10:00 AM',
    venue: 'Computer Lab 101',
    category: 'tech',
    mode: 'offline',
    organizer: 'Coding Club',
    department: 'Computer Science',
    attendees: 75,
    maxCapacity: 75,
  },
  {
    id: '15',
    title: 'Art Exhibition: Colors of Culture',
    description: 'Showcase of student artwork exploring themes of cultural diversity and heritage.',
    date: getFutureDate(-7), // Past event
    time: '11:00 AM',
    venue: 'Art Gallery',
    category: 'cultural',
    mode: 'offline',
    organizer: 'Art Society',
    department: 'Fine Arts',
    attendees: 200,
    maxCapacity: 200,
  },
];

export const categories: { value: EventCategory; label: string; color: string }[] = [
  { value: 'workshop', label: 'Workshop', color: 'category-workshop' },
  { value: 'cultural', label: 'Cultural', color: 'category-cultural' },
  { value: 'tech', label: 'Tech', color: 'category-tech' },
  { value: 'sports', label: 'Sports', color: 'category-sports' },
  { value: 'seminar', label: 'Seminar', color: 'category-seminar' },
];

export const getCategoryColor = (category: EventCategory): string => {
  const cat = categories.find(c => c.value === category);
  return cat?.color || 'category-tech';
};
