import { LunchCategory, Restaurant, Vote } from '../types';
import { MOCK_RESTAURANTS } from './mockData';

// 순수 함수: 후보 생성 (카테고리 필터 + 최대 수 제한)
export const buildCandidates = (
  categories: LunchCategory[],
  maxCandidates: number
): Restaurant[] => {
  const filtered = MOCK_RESTAURANTS.filter(r =>
    !categories || categories.length === 0 ? true : categories.includes(r.category || 'etc')
  );
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, maxCandidates));
};

// 순수 함수: 룰렛 스핀 (단일 또는 다수 후보 반환)
export const spinRoulette = (
  candidates: Restaurant[]
): Restaurant | Restaurant[] => {
  if (candidates.length <= 1) return candidates[0] ?? candidates;
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const count = Math.min(3, Math.max(2, Math.floor(Math.random() * 2) + 2)); // 2~3
  return shuffled.slice(0, Math.min(count, candidates.length));
};

// 순수 함수: 현재 선택 토글
export const toggleCurrentSelection = (
  prevSelectionId: string | null | undefined,
  clickedId: string
): string | null => {
  if (!prevSelectionId) return clickedId;
  if (prevSelectionId === clickedId) return null;
  return clickedId;
};

// 순수 함수: 투표 집계(불변)
export const confirmVote = (
  existingVotes: Vote[],
  selectionId: string
): Vote[] => {
  const newVote: Vote = {
    id: `${Date.now()}`,
    restaurantId: selectionId,
    timestamp: Date.now(),
  };
  return [...existingVotes, newVote];
};

// 순수 함수: 종료 여부 판단
export const shouldFinishVoting = (
  participants: number,
  completedVoters: number
): boolean => {
  return completedVoters >= participants;
};

// 순수 함수: 최종 결과 도출(동률이면 랜덤)
export const finalizeResult = (
  votes: Vote[],
  candidates: Restaurant[],
  fallbackCandidateId?: string
): string => {
  const voteCounts = votes.reduce((acc, v) => {
    acc[v.restaurantId] = (acc[v.restaurantId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(voteCounts).length === 0) {
    return fallbackCandidateId ?? candidates[0]?.id ?? '';
  }

  const sorted = [...candidates]
    .map(r => ({ id: r.id, count: voteCounts[r.id] || 0 }))
    .sort((a, b) => b.count - a.count);

  const topCount = sorted[0].count;
  const topIds = sorted.filter(s => s.count === topCount).map(s => s.id);
  const winnerId = topIds[Math.floor(Math.random() * topIds.length)];
  return winnerId;
};