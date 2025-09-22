import { Restaurant, Vote } from '../types';
import { MOCK_RESTAURANTS, generateMockVotes } from './mockData';

export const selectRouletteCandidates = (): Restaurant[] => {
  // 5-6개 후보 랜덤 선택
  const shuffled = [...MOCK_RESTAURANTS].sort(() => Math.random() - 0.5);
  const candidateCount = Math.floor(Math.random() * 2) + 5; // 5 or 6
  return shuffled.slice(0, candidateCount);
};

export const selectFinalists = (candidates: Restaurant[]): Restaurant[] => {
  // 룰렛 결과로 2-3개 최종 후보 선택
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const finalistCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
  return shuffled.slice(0, finalistCount);
};

export const calculateResults = (votes: Vote[], candidates: Restaurant[]) => {
  const voteCounts = votes.reduce((acc, vote) => {
    acc[vote.restaurantId] = (acc[vote.restaurantId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = votes.length;
  const results = candidates.map(restaurant => ({
    restaurant,
    votes: voteCounts[restaurant.id] || 0,
    percentage: totalVotes > 0 ? ((voteCounts[restaurant.id] || 0) / totalVotes * 100) : 0
  }));

  const winner = results.reduce((prev, current) =>
    (prev.votes > current.votes) ? prev : current
  );

  return {
    results,
    winner: winner.restaurant,
    totalVotes
  };
};

export const exportToCSV = (results: any[]) => {
  const headers = ['메뉴', '득표수', '비율'];
  const csvContent = [
    headers.join(','),
    ...results.map(result =>
      `"${result.restaurant.name}","${result.votes}","${result.percentage.toFixed(1)}%"`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `점메추_결과_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};