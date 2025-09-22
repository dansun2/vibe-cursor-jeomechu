'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLunchStore } from '@/lib/store';

export const ResultScreen = () => {
  const { session, actions } = useLunchStore();

  const handleReset = () => {
    actions.resetSession();
  };

  const handleExportCSV = () => {
    // 실제로는 endVoting에서 받은 results 사용
    // 여기서는 간단하게 현재 상태로 CSV 생성
    const mockResults = session.rouletteResult.map(restaurant => ({
      restaurant,
      votes: session.votes.filter(v => v.restaurantId === restaurant.id).length,
      percentage: (session.votes.filter(v => v.restaurantId === restaurant.id).length / Math.max(session.votes.length, 1)) * 100
    }));
    
    const csvContent = [
      ['메뉴', '득표수', '비율'].join(','),
      ...mockResults.map(result => 
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

  if (!session.finalResult) {
    return <div className="text-center">결과를 불러오는 중...</div>;
  }

  return (
    <div className="space-y-8">
      {/* 승자 발표 */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          오늘 점심은
        </h2>
        <h1 className="text-5xl font-bold text-red-500 mb-4">
          {session.finalResult.name}
        </h1>
        <p className="text-xl text-gray-600">
          축하합니다! {session.finalResult.description}
        </p>
      </div>

      {/* 가게 정보 */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <img 
            src={session.finalResult.imageUrl} 
            alt={session.finalResult.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-xl font-semibold">{session.finalResult.name}</h3>
            <p className="text-gray-600">{session.finalResult.address}</p>
            <p className="text-sm text-gray-500">⭐ {session.finalResult.rating}</p>
          </div>
        </div>
      </Card>

      {/* 전체 결과 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">전체 투표 결과</h3>
        <div className="space-y-2">
          {session.rouletteResult.map((restaurant) => {
            const votes = session.votes.filter(v => v.restaurantId === restaurant.id).length;
            const percentage = session.votes.length > 0 ? (votes / session.votes.length) * 100 : 0;
            
            return (
              <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">{restaurant.name}</span>
                <div className="flex items-center space-x-4">
                  <span>{votes}표</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600"
        >
          다시 하기
        </Button>
        <Button
          size="lg"
          onClick={handleExportCSV}
          variant="outline"
        >
          CSV 다운로드
        </Button>
      </div>
    </div>
  );
};