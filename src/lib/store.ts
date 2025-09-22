import { create } from 'zustand';
import { LunchSession, StartFormInput } from '../features/lunch-recommendation/types';
import { useLunchSession } from '../features/lunch-recommendation/hooks/useLunchSession';

interface LunchStore {
  session: LunchSession;
  actions: {
    startSession: (input: StartFormInput) => LunchSession;
    runRoulette: () => LunchSession;
    selectCandidate: (restaurantId: string) => LunchSession;
    confirmCurrentVoter: () => LunchSession;
    resetSession: () => LunchSession;
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
    startSession: (input: StartFormInput) => {
      const { startSession } = useLunchSession();
      const newSession = startSession(input);
      set({ session: newSession });
      return newSession;
    },
    
    runRoulette: () => {
      const { runRoulette } = useLunchSession();
      const newSession = runRoulette();
      set({ session: newSession });
      return newSession;
    },
    
    selectCandidate: (restaurantId: string) => {
      const { selectCandidate } = useLunchSession();
      const newSession = selectCandidate(restaurantId);
      set({ session: newSession });
      return newSession;
    },

    confirmCurrentVoter: () => {
      const { confirmCurrentVoter } = useLunchSession();
      const newSession = confirmCurrentVoter();
      set({ session: newSession });
      return newSession;
    },
    
    resetSession: () => {
      const { resetSession } = useLunchSession();
      const newSession = resetSession();
      set({ session: newSession });
      return newSession;
    },
    
    refreshSession: () => {
      const { loadSession } = useLunchSession();
      const currentSession = loadSession();
      set({ session: currentSession });
    }
  }
}));