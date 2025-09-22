'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLunchStore } from '@/lib/store';
import { ALL_CATEGORIES } from '../lib/mockData';
import { useState } from 'react';
import { StartFormSchema, LunchCategory } from '../types';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

export const WaitingScreen = () => {
  const { actions } = useLunchStore();
  const router = useRouter();
  const [participants, setParticipants] = useState<number>(2);
  const [maxCandidates, setMaxCandidates] = useState<number>(5);
  const [categories, setCategories] = useState<LunchCategory[]>(['korean']);
  const [error, setError] = useState<string | null>(null);

  const handleToggleCategory = (c: LunchCategory) => {
    setCategories(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleStart = () => {
    const result = StartFormSchema.safeParse({ participants, maxCandidates, categories });
    if (!result.success) {
      setError('입력을 확인해주세요. 인원 1+, 후보 1+, 카테고리 1+');
      return;
    }
    actions.startSession(result.data);
    router.push('/roulette');
  };

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

      <div className="w-full max-w-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="participants">인원수</Label>
            <Input
              id="participants"
              type="number"
              min={1}
              value={participants}
              onChange={e => setParticipants(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="maxCandidates">메뉴 갯수</Label>
            <Input
              id="maxCandidates"
              type="number"
              min={1}
              max={10}
              value={maxCandidates}
              onChange={e => setMaxCandidates(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label>카테고리</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {ALL_CATEGORIES.map(c => (
              <label key={c} className="flex items-center space-x-2 p-2 rounded border cursor-pointer">
                <Checkbox
                  checked={categories.includes(c)}
                  onCheckedChange={() => handleToggleCategory(c)}
                />
                <span className="text-sm">{c}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      
      <Button
        size="lg"
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
        onClick={handleStart}
      >
        시작하기
      </Button>
    </div>
  );
};