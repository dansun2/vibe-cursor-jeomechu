'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLunchStore } from '@/lib/store';
import { Restaurant } from '../types';
import { useRouter } from 'next/navigation';

export const VotingScreen = () => {
  const { session, actions } = useLunchStore();
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');

  const handleSelect = (restaurantId: string) => {
    setSelectedRestaurant(prev => (prev === restaurantId ? '' : restaurantId));
    actions.selectCandidate(restaurantId);
  };

  const handleConfirm = () => {
    const newSession = actions.confirmCurrentVoter();
    if (newSession.mode === 'result') {
      router.push('/result');
    }
  };

  const getVoteCount = (restaurantId: string) => {
    return session.votes.filter(vote => vote.restaurantId === restaurantId).length;
  };

  const getTotalVotes = () => {
    return session.votes.length;
  };

  const getVotePercentage = (restaurantId: string) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return (getVoteCount(restaurantId) / total) * 100;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">투표 진행 중</h2>
        <p className="text-gray-600">메뉴를 선택하고 투표해주세요</p>
      </div>

      {/* 후보 메뉴 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {session.rouletteResult.map((restaurant) => (
          <Card 
            key={restaurant.id} 
            className={`p-4 cursor-pointer transition-all ${
              selectedRestaurant === restaurant.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSelect(restaurant.id)}
          >
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">⭐ {restaurant.rating}</span>
              <span className="text-sm font-medium">{getVoteCount(restaurant.id)}표</span>
            </div>
            
            {/* 실시간 투표 바 */}
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getVotePercentage(restaurant.id)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* v0: 단일 디바이스 순차 투표. 외부 링크/QR 미사용 */}

      <div className="text-center">
        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={!selectedRestaurant}
          className="bg-green-500 hover:bg-green-600"
        >
          현재 선택 확정
        </Button>
      </div>
    </div>
  );
};