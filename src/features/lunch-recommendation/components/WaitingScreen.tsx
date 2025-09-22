'use client';

import { Button } from '@/components/ui/button';
import { useLunchStore } from '@/lib/store';

export const WaitingScreen = () => {
  const { actions } = useLunchStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          점심 메뉴를 추천받아보세요
        </h2>
        <p className="text-gray-600">
          룰렛으로 후보를 선정하고 투표를 통해 최종 메뉴를 결정하세요
        </p>
      </div>
      
      <Button
        size="lg"
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
        onClick={actions.startSession}
      >
        시작하기
      </Button>
    </div>
  );
};