'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLunchStore } from '@/lib/store';
import { Restaurant } from '../types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export const VotingScreen = () => {
  const { session, actions } = useLunchStore();
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const { toast } = useToast();

  // URL 복사 함수
  const copyShareLink = async () => {
    const currentUrl = window.location.href;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      toast({
        title: "링크가 복사되었습니다",
        description: "다른 사람들에게 공유해보세요!",
      });
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
    actions.selectCandidate(restaurantId);
  };

  const handleConfirm = () => {
    if (selectedRestaurant) {
      // 단일 사용자 투표이므로 선택 즉시 확정하고 결과 페이지로 이동
      const newSession = actions.confirmCurrentVoter();
      if (newSession.mode === 'result') {
        router.push('/result');
      }
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
        <h2 className="text-2xl font-bold mb-2 text-orange-600">투표 진행 중</h2>
        <p className="text-gray-600 mb-4">메뉴를 선택하고 <span className="text-orange-600">투표</span>해주세요</p>
        
        {/* 공유 버튼 */}
        <Button
          variant="outline"
          onClick={copyShareLink}
          className="mb-4 border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          🔗 링크 복사하기
        </Button>
      </div>

      {/* 후보 메뉴 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {session.rouletteResult.map((restaurant) => (
          <Card 
            key={restaurant.id} 
            className={`p-4 cursor-pointer transition-all ${
              selectedRestaurant === restaurant.id ? 'ring-2 ring-orange-500' : ''
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
                className="bg-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getVotePercentage(restaurant.id)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* 단일 사용자 투표이므로 확정 버튼 활성화 */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={!selectedRestaurant}
          className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
        >
          현재 선택 확정
        </Button>
      </div>
    </div>
  );
};