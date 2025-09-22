import { create } from 'zustand';
import { LunchSession } from '../features/lunch-recommendation/types';
import { useLunchSession } from '../features/lunch-recommendation/hooks/useLunchSession';

interface LunchStore {
  session: LunchSession;
  actions: {
    startSession: () => void;
    completeRoulette: () => void;
    castVote: (restaurantId: string) => void;
    endVoting: () => void;
    resetSession: () => void;
    refreshSession: () => void;
  };
}

export const useLunchStore = create<LunchStore>((set, get) => ({
  session: {
    mode: 'waiting',
    candidates: [],
    rouletteResult: [],
    votes: [],
    sessionId: Date.now().toString()
  },
  
  actions: {
    startSession: () => {
      const { startSession } = useLunchSession();
      const newSession = startSession();
      set({ session: newSession });
    },
    
    completeRoulette: () => {
      const { completeRoulette } = useLunchSession();
      const newSession = completeRoulette();
      set({ session: newSession });
    },
    
    castVote: (restaurantId: string) => {
      const { castVote } = useLunchSession();
      const newSession = castVote(restaurantId);
      set({ session: newSession });
    },
    
    endVoting: () => {
      const { endVoting } = useLunchSession();
      const { session } = endVoting();
      set({ session });
    },
    
    resetSession: () => {
      const { resetSession } = useLunchSession();
      const newSession = resetSession();
      set({ session: newSession });
    },
    
    refreshSession: () => {
      const { loadSession } = useLunchSession();
      const currentSession = loadSession();
      set({ session: currentSession });
    }
  }
}));