'use client';

import { LunchSession, Restaurant, Vote } from '../types';
import { selectRouletteCandidates, selectFinalists, calculateResults, exportToCSV } from '../lib/lunchLogic';

const STORAGE_KEY = 'lunch-session';

const initialSession: LunchSession = {
  mode: 'waiting',
  candidates: [],
  rouletteResult: [],
  votes: [],
  sessionId: Date.now().toString()
};

export const useLunchSession = () => {
  const loadSession = (): LunchSession => {
    if (typeof window === 'undefined') return initialSession;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...initialSession, ...JSON.parse(stored) } : initialSession;
    } catch {
      return initialSession;
    }
  };

  const saveSession = (session: LunchSession) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const startSession = () => {
    const session = loadSession();
    const candidates = selectRouletteCandidates();
    
    const newSession: LunchSession = {
      ...session,
      mode: 'roulette',
      candidates,
      sessionId: Date.now().toString()
    };
    
    saveSession(newSession);
    return newSession;
  };

  const completeRoulette = () => {
    const session = loadSession();
    const finalists = selectFinalists(session.candidates);
    
    const newSession: LunchSession = {
      ...session,
      mode: 'voting',
      rouletteResult: finalists,
      votes: []
    };
    
    saveSession(newSession);
    return newSession;
  };

  const castVote = (restaurantId: string) => {
    const session = loadSession();
    const newVote: Vote = {
      id: Date.now().toString(),
      restaurantId,
      timestamp: Date.now()
    };
    
    const newSession: LunchSession = {
      ...session,
      votes: [...session.votes, newVote]
    };
    
    saveSession(newSession);
    return newSession;
  };

  const endVoting = () => {
    const session = loadSession();
    const { results, winner } = calculateResults(session.votes, session.rouletteResult);
    
    const newSession: LunchSession = {
      ...session,
      mode: 'result',
      finalResult: winner
    };
    
    saveSession(newSession);
    return { session: newSession, results };
  };

  const resetSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    return initialSession;
  };

  return {
    loadSession,
    startSession,
    completeRoulette,
    castVote,
    endVoting,
    resetSession,
    exportToCSV
  };
};