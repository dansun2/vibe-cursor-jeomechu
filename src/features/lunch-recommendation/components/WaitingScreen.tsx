'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLunchStore } from '@/lib/store';
import { ALL_CATEGORIES } from '../lib/mockData';
import { useState } from 'react';
import { StartFormSchema, LunchCategory, RouletteMode } from '../types';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

export const WaitingScreen = () => {
  const { actions } = useLunchStore();
  const router = useRouter();
  const [participants, setParticipants] = useState<number>(2);
  const [maxCandidates] = useState<number>(5);
  const [categories] = useState<LunchCategory[]>(ALL_CATEGORIES);
  const [address, setAddress] = useState<string>('서울시 강남구 역삼동');
  const [rouletteMode, setRouletteMode] = useState<RouletteMode>('categoryOnly');
  const [error, setError] = useState<string | null>(null);

  // 카테고리 선택 UI 제거 (v1 최소 스펙: 기본값 사용)

  const handleStart = () => {
    const result = StartFormSchema.safeParse({ participants, maxCandidates, categories, address, rouletteMode });
    if (!result.success) {
      setError('입력을 확인해주세요. 인원 1+, 후보 1+, 카테고리 1+, 주소 필수');
      return;
    }
    actions.startSession(result.data);
    router.push('/roulette');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">
          점심 메뉴를 추천받아보세요
        </h2>
        <p className="text-gray-600">
          룰렛으로 후보를 선정하고 투표를 통해 <span className="text-orange-600">최종 메뉴</span>를 결정하세요
        </p>
      </div>

      <div className="w-full max-w-xl space-y-6">
        <div>
          <Label htmlFor="address" className="text-gray-800">주소</Label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="지역 또는 상세 주소"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="participants" className="text-gray-800">인원수</Label>
            <Input
              id="participants"
              type="number"
              min={1}
              value={participants}
              onChange={e => setParticipants(Number(e.target.value))}
            />
          </div>
        </div>

        {/* 카테고리 선택 UI 제거 (기본 카테고리 사용) */}

        <div>
          <Label className="text-gray-800">룰렛 모드</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {([
              { key: 'categoryOnly', label: '카테고리만 룰렛' },
              { key: 'categoryAndMenu', label: '카테고리 → 메뉴 룰렛' },
            ] as { key: RouletteMode; label: string }[]).map(({ key, label }) => (
              <label key={key} className={`flex items-center space-x-2 p-2 rounded border cursor-pointer ${rouletteMode === key ? 'border-orange-400 bg-orange-50' : ''}`}>
                <Checkbox
                  checked={rouletteMode === key}
                  onCheckedChange={() => setRouletteMode(key)}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      
      <Button
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
        onClick={handleStart}
      >
        시작하기
      </Button>
    </div>
  );
};