export interface Coach {
  id: string;
  name: string;
  role: string;
  experience: string;
  image: string;
  achievements: string[];
}

export interface ScheduleSlot {
  time: string;
  activity: string;
  coach: string;
  intensity: 'Low' | 'Medium' | 'High' | 'Extreme';
  availableSpots: number;
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  category: 'fitness' | 'martial_arts' | 'swimming' | 'rackets' | 'yoga' | 'extreme' | string;
  categoryName: string;
  address: string;
  metro: string;
  metroColor?: string;
  priceMonthly: number;
  priceTrial: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  tags: string[];
  schedule: string;
  description: string;
  amenities: string[];
  coaches: Coach[];
  timetable: ScheduleSlot[];
  features: {
    sqMeters: number;
    yearOpened: number;
    freeParking: boolean;
    poolLengthMeters?: number;
  };
}

export interface Sport {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  heroImage: string;
  gallery: string[];
  intensity: 'Низкая' | 'Средняя' | 'Высокая' | 'Экстремальная';
  calorieBurnPerHour: number;
  targetMuscles: string[];
  benefits: string[];
  whoIsItFor: string;
  requiredGear: string[];
  averagePrice: string;
  relatedClubIds: string[];
}

export type LeadStatus = 'new' | 'contacted' | 'enrolled' | 'cancelled';
export type LeadSource = 'quiz' | 'catalog' | 'landing_form' | 'ai_chat' | 'matcher' | 'club_page';

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  sportInterest?: string;
  clubId?: string;
  clubName?: string;
  budget?: string;
  source: LeadSource;
  aiSummary?: string;
  status: LeadStatus;
  notes?: string;
  bookingDate?: string;
  bookingTime?: string;
}

export interface QuizAnswers {
  goal: string;
  experience: string;
  sportType: string;
  location: string;
  budget: string;
  intensityPreference?: string;
  preferredTime?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedClubId?: string;
}
