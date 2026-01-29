export type EventCategory = 'workshop' | 'cultural' | 'tech' | 'sports' | 'seminar' | 'hackathon';
export type EventMode = 'online' | 'offline' | 'hybrid';
export type AudienceType = 'students' | 'faculty' | 'public';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

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
  audienceType?: AudienceType;
  status?: EventStatus;
}

export const sampleEvents: CollegeEvent[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering neural networks, deep learning fundamentals, and practical applications using Python and TensorFlow.',
    date: '2025-01-15',
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
    date: '2025-01-20',
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
    date: '2025-01-25',
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
    date: '2025-01-18',
    time: '2:00 PM',
    venue: 'Sports Complex',
    category: 'sports',
    mode: 'offline',
    organizer: 'Sports Council',
    department: 'Physical Education',
    attendees: 200,
  },
  {
    id: '5',
    title: 'Guest Lecture: Future of Renewable Energy',
    description: 'Dr. Sarah Mitchell from MIT discusses the latest advancements in solar and wind energy technology.',
    date: '2025-01-22',
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
    date: '2025-01-28',
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
    date: '2025-02-01',
    time: '10:00 AM',
    venue: 'Business School Auditorium',
    category: 'tech',
    mode: 'offline',
    organizer: 'Entrepreneurship Cell',
    department: 'Business Administration',
    attendees: 60,
  },
  {
    id: '8',
    title: 'Classical Music Night',
    description: 'An evening of Indian classical music featuring renowned artists and student performers.',
    date: '2025-02-05',
    time: '6:30 PM',
    venue: 'Open Air Theatre',
    category: 'cultural',
    mode: 'offline',
    organizer: 'Music Society',
    department: 'Student Affairs',
    attendees: 150,
  },
];

export const categories: { value: EventCategory; label: string; color: string }[] = [
  { value: 'workshop', label: 'Workshop', color: 'category-workshop' },
  { value: 'cultural', label: 'Cultural', color: 'category-cultural' },
  { value: 'tech', label: 'Tech', color: 'category-tech' },
  { value: 'sports', label: 'Sports', color: 'category-sports' },
  { value: 'seminar', label: 'Seminar', color: 'category-seminar' },
  { value: 'hackathon', label: 'Hackathon', color: 'category-tech' },
];

export const audienceTypes: { value: AudienceType; label: string }[] = [
  { value: 'students', label: 'Students' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'public', label: 'Public' },
];

export const eventStatuses: { value: EventStatus; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export const getCategoryColor = (category: EventCategory): string => {
  const cat = categories.find(c => c.value === category);
  return cat?.color || 'category-tech';
};
