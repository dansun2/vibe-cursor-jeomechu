'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLunchStore } from '@/lib/store';
import { Restaurant } from '../types';
import { useRouter } from 'next/navigation';

export const RouletteScreen = () => {
  const { session, actions } = useLunchStore();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const spinRoulette = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(-1);
    
    // 룰렛 애니메이션 시간
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 최종 후보 선택 및 전이
    const newSession = actions.runRoulette();
    setIsSpinning(false);
    // 새로운 상태 기준으로 라우팅
    if (newSession.mode === 'result' || (newSession.rouletteResult?.length ?? 0) <= 1) {
      router.push('/result');
    } else {
      router.push('/vote');
    }
  };

  const getRouletteAngle = (index: number) => {
    const anglePerItem = 360 / session.candidates.length;
    return index * anglePerItem;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="text-2xl font-bold text-center">후보 선정 중...</h2>
      
      <div className="relative w-80 h-80">
        {/* 룰렛 원형 */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 overflow-hidden">
          {session.candidates.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center text-white font-bold text-sm"
              style={{
                backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                transform: `rotate(${getRouletteAngle(index)}deg)`,
                clipPath: `polygon(0 0, 100% 0, 85% 100%)`
              }}
            >
              <span className="transform -rotate-90 text-xs">
                {restaurant.name}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* 룰렛 화살표 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
      </div>
      
      <Button
        size="lg"
        onClick={spinRoulette}
        disabled={isSpinning}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {isSpinning ? '룰렛 돌리는 중...' : '룰렛 돌리기'}
      </Button>
    </div>
  );
};