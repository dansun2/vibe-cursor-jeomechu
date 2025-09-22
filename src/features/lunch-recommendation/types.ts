export interface Restaurant {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    rating: number;
    address: string;
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
  }
  
  export type LunchMode = LunchSession['mode'];