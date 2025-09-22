'use client';

import { StartFormInput, LunchSession, LunchCategory } from '../types';
import { buildCandidates, buildCategoryCandidates, buildMenuCandidatesByCategory, confirmVote, finalizeResult, pickOne, shouldFinishVoting, spinRoulette, toggleCurrentSelection } from '../lib/lunchLogic';
import { getCategoryLabel } from '../lib/mockData';

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

  // 시작 설정 저장 및 후보 생성 → rouletteCategory 단계로
  const startSession = (input: StartFormInput) => {
    const session = loadSession();
    const cats = buildCategoryCandidates(input.categories);

    const newSession: LunchSession = {
      ...session,
      mode: 'rouletteCategory',
      candidates: cats.map(c => ({
        id: `cat:${c}`,
        name: getCategoryLabel(c),
        description: '',
        imageUrl: 'https://picsum.photos/300/200?random=101',
        rating: 0,
        address: '',
        category: c,
      })),
      participants: input.participants,
      maxCandidates: input.maxCandidates,
      categories: input.categories,
      address: input.address,
      rouletteMode: input.rouletteMode,
      completedVoters: 0,
      currentSelectionId: null,
      sessionId: Date.now().toString(),
    };

    saveSession(newSession);
    return newSession;
  };

  // 룰렛 실행: 카테고리 → (옵션) 메뉴 → 투표/결과
  const runRoulette = () => {
    const session = loadSession();
    // 1) 카테고리 단계 → 다음 단계 준비
    if (session.mode === 'rouletteCategory') {
      const picked = pickOne(session.candidates);
      const pickedCategory = (picked.category || 'etc') as LunchCategory;
      const nextCandidates = session.rouletteMode === 'categoryOnly'
        ? buildCandidates([pickedCategory], session.maxCandidates || 5)
        : buildMenuCandidatesByCategory(pickedCategory, session.maxCandidates || 5);

      if (session.rouletteMode === 'categoryOnly') {
        // 바로 투표로 이동: 후보는 rouletteResult로 세팅
        const nextSession: LunchSession = {
          ...session,
          mode: 'voting',
          selectedCategory: pickedCategory,
          candidates: nextCandidates,
          rouletteResult: nextCandidates,
          currentSelectionId: null,
          completedVoters: 0,
          lastSpinTargetId: `cat:${pickedCategory}`,
        };
        saveSession(nextSession);
        return nextSession;
      }

      // 메뉴 룰렛 단계로
      const nextSession: LunchSession = {
        ...session,
        mode: 'rouletteMenu',
        selectedCategory: pickedCategory,
        candidates: nextCandidates,
        rouletteResult: [],
        lastSpinTargetId: `cat:${pickedCategory}`,
      };
      saveSession(nextSession);
      return nextSession;
    }

    // 2) 메뉴 단계 → 투표/결과
    if (session.mode === 'rouletteMenu') {
      // v1 스펙: 메뉴 단계에서는 단일 최종 당첨으로 바로 결과 페이지
      const result = pickOne(session.candidates);
      const nextSession: LunchSession = {
        ...session,
        mode: 'result',
        finalResult: result,
        rouletteResult: [result],
        lastSpinTargetId: result.id,
      };
      saveSession(nextSession);
      return nextSession;
    }

    // 3) 이전 로직 유지(호환)
    const result = spinRoulette(session.candidates);
    if (!Array.isArray(result)) {
      const nextSession: LunchSession = { ...session, mode: 'result', finalResult: result, rouletteResult: [result] };
      saveSession(nextSession);
      return nextSession;
    }
    const nextSession: LunchSession = { ...session, mode: 'voting', rouletteResult: result, currentSelectionId: null, completedVoters: 0 };
    saveSession(nextSession);
    return nextSession;
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