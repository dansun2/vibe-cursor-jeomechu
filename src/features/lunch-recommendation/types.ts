import { z } from 'zod';

export type LunchCategory =
  | 'korean'
  | 'japanese'
  | 'chinese'
  | 'western'
  | 'dessert'
  | 'etc';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  address: string;
  category?: LunchCategory;
}

export interface Vote {
  id: string;
  restaurantId: string;
  timestamp: number;
}

export interface LunchSession {
  mode: 'waiting' | 'roulette' | 'voting' | 'result';
  candidates: Restaurant[];
  rouletteResult: Restaurant[];
  votes: Vote[];
  finalResult?: Restaurant;
  sessionId: string;
  // v0 확장 필드
  participants?: number;
  maxCandidates?: number;
  categories?: LunchCategory[];
  completedVoters?: number;
  currentSelectionId?: string | null;
}

export type LunchMode = LunchSession['mode'];

export const StartFormSchema = z.object({
  participants: z.number().int().min(1).max(50),
  maxCandidates: z.number().int().min(1).max(10),
  categories: z.array(z.custom<LunchCategory>()).min(1),
});

export type StartFormInput = z.infer<typeof StartFormSchema>;