// types/index.ts

interface Program {
  id: number;
  title: string;
  description: string;
  features: string[];
  price: string;
  mentor: string;
  mentorBio: string;
  duration: string;
  gyms: string[];
}

interface Gym {
  id: number;
  name: string;
  location: string;
  amenities: string[];
  images: string[];
  rating: number;
  programs: string[];
}

interface ScheduleItem {
  time: string;
  session: string;
  icon: React.ReactNode;
}

interface UserProgram {
  name: string;
  progress: number;
  mentor: string;
  nextSession: string;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

interface User {
  name: string;
  email: string;
  memberSince: string;
  activePrograms: number;
  fitnessGoals: string;
}

type TabType = 'programs' | 'settings';

interface AmenityIcons {
  [key: string]: React.ReactNode;
}   
interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  duration: string;
  instructor: string;
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  appliedPromo: string | null;
  discountAmount: number;
  lastSynced: number | null;
  status: 'idle' | 'syncing' | 'error';
  error: string | null;
  expiresAt?: number;
}
interface RazorpayPrefill {
  name: string;
  email: string;
  contact?: string;
}

interface RazorpayTheme {
  color: string;
}

interface RazorpayModal {
  ondismiss: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: RazorpayPrefill;
  theme?: RazorpayTheme;
  modal?: RazorpayModal;
}



