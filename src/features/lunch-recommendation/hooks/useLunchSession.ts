'use client';

import { StartFormInput, LunchSession } from '../types';
import { buildCandidates, confirmVote, finalizeResult, shouldFinishVoting, spinRoulette, toggleCurrentSelection } from '../lib/lunchLogic';

const STORAGE_KEY = 'lunch-session';

const initialSession: LunchSession = {
  mode: 'waiting',
  candidates: [],
  rouletteResult: [],
  votes: [],
  sessionId: Date.now().toString(),
  participants: undefined,
  maxCandidates: undefined,
  categories: undefined,
  completedVoters: 0,
  currentSelectionId: null,
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

  // 시작 설정 저장 및 후보 생성 → roulette 단계로
  const startSession = (input: StartFormInput) => {
    const session = loadSession();
    const candidates = buildCandidates(input.categories, input.maxCandidates);

    const newSession: LunchSession = {
      ...session,
      mode: 'roulette',
      candidates,
      participants: input.participants,
      maxCandidates: input.maxCandidates,
      categories: input.categories,
      completedVoters: 0,
      currentSelectionId: null,
      sessionId: Date.now().toString(),
    };

    saveSession(newSession);
    return newSession;
  };

  // 룰렛 실행 → 단일이면 즉시 result, 다수면 voting
  const runRoulette = () => {
    const session = loadSession();
    const result = spinRoulette(session.candidates);

    if (!Array.isArray(result)) {
      const newSession: LunchSession = {
        ...session,
        mode: 'result',
        finalResult: result,
        rouletteResult: [result],
      };
      saveSession(newSession);
      return newSession;
    }

    const newSession: LunchSession = {
      ...session,
      mode: 'voting',
      rouletteResult: result,
      currentSelectionId: null,
      completedVoters: 0,
    };
    saveSession(newSession);
    return newSession;
  };

  // 현재 선택 토글
  const selectCandidate = (candidateId: string) => {
    const session = loadSession();
    const nextSelection = toggleCurrentSelection(session.currentSelectionId, candidateId);
    const newSession: LunchSession = { ...session, currentSelectionId: nextSelection };
    saveSession(newSession);
    return newSession;
  };

  // 현재 사용자 확정 → 집계하고 다음 사용자로
  const confirmCurrentVoter = () => {
    const session = loadSession();
    if (!session.currentSelectionId) return session;

    const nextVotes = confirmVote(session.votes, session.currentSelectionId);
    const completed = (session.completedVoters || 0) + 1;

    if (shouldFinishVoting(session.participants || 1, completed)) {
      const winnerId = finalizeResult(nextVotes, session.rouletteResult, session.rouletteResult[0]?.id);
      const final = session.rouletteResult.find(r => r.id === winnerId) || session.rouletteResult[0];
      const newSession: LunchSession = {
        ...session,
        votes: nextVotes,
        completedVoters: completed,
        mode: 'result',
        finalResult: final,
        currentSelectionId: null,
      };
      saveSession(newSession);
      return newSession;
    }

    const newSession: LunchSession = {
      ...session,
      votes: nextVotes,
      completedVoters: completed,
      currentSelectionId: null,
    };
    saveSession(newSession);
    return newSession;
  };

  const resetSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    return initialSession;
  };

  return {
    loadSession,
    saveSession,
    startSession,
    runRoulette,
    selectCandidate,
    confirmCurrentVoter,
    resetSession,
  };
};