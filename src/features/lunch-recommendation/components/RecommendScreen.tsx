'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLunchStore } from '@/lib/store';
import { useMemo } from 'react';
import { useKakaoRestaurants } from '@/features/lunch-recommendation/hooks/useKakaoRestaurants';
import { getCategoryLabel } from '../lib/mockData';
import { useRouter } from 'next/navigation';

function derivePseudoRating(distanceMeters?: number, seed?: string): number {
  // Kakao Places API에는 별점이 없으므로, 거리 기반 + 씨드 가중치로 임시 점수 생성
  // 가까울수록 높은 점수. 0~3000m 구간을 5.0~3.5로 매핑, 추가로 씨드로 0~0.4 가산
  const base = (() => {
    const d = typeof distanceMeters === 'number' ? Math.max(0, Math.min(3000, distanceMeters)) : 1500;
    const mapped = 5 - (d / 3000) * 1.5; // 5.0 .. 3.5
    return mapped;
  })();
  const jitter = (() => {
    if (!seed) return 0.2;
    let h = 0;
    for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return (h % 401) / 1000; // 0.000..0.400
  })();
  const score = Math.max(3.0, Math.min(5.0, base + jitter));
  return Math.round(score * 10) / 10;
}

export const RecommendScreen = () => {
  const { session, actions } = useLunchStore();
  const router = useRouter();
  const address = session.address || '';
  const selectedCategoryLabel = session.selectedCategory && session.selectedCategory !== 'etc'
    ? getCategoryLabel(session.selectedCategory)
    : undefined; // 기타는 키워드 미전달 → 일반 음식점 검색

  // FD6(음식점) + 선택 카테고리 라벨 키워드(기타 제외)로 실제 데이터 검색
  const { data, loading, error, refetch } = useKakaoRestaurants({
    address,
    category: 'FD6',
    radiusMeters: 1500,
    limit: 10,
    keyword: selectedCategoryLabel,
  });

  const top3 = useMemo(() => {
    const withRating = (data || []).map((p) => ({
      ...p,
      rating: derivePseudoRating(p.distanceMeters, p.id),
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(p.id)}/300/200`,
    }));
    return withRating
      .sort((a, b) => (b.rating as number) - (a.rating as number))
      .slice(0, 3);
  }, [data]);

  const pushTop3ToVote = () => {
    const candidates = top3.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.categoryName || '',
      imageUrl: (p as any).imageUrl,
      rating: (p as any).rating,
      address: p.roadAddress || p.address,
      category: session.selectedCategory,
    }));
    const newSession = actions.startVotingWithCandidates(candidates);
    if (newSession.mode === 'voting') {
      router.push('/vote');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-orange-600">추천 식당 TOP 3</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50" onClick={refetch}>새로고침</Button>
          <Button onClick={pushTop3ToVote} disabled={loading || top3.length === 0} className="bg-orange-500 hover:bg-orange-600 text-white">이 후보로 투표하기</Button>
        </div>
      </div>

      {loading && <div>주변 식당을 불러오는 중...</div>}
      {error && <div className="text-red-500">오류: {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((p) => (
          <Card key={p.id} className="p-4 space-y-3 border-orange-100 hover:shadow-sm transition-shadow">
            <img
              src={(p as any).imageUrl}
              alt={p.name}
              className="w-full h-40 object-cover rounded"
            />
            <div className="space-y-1">
              <div className="text-lg font-semibold text-gray-900">{p.name}</div>
              <div className="text-sm text-gray-600">{p.roadAddress || p.address}</div>
              <div className="text-sm text-gray-500">⭐ <span className="text-orange-600 font-medium">{(p as any).rating}</span> · {p.distanceMeters ?? '?'}m</div>
            </div>
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 text-sm underline"
              >
                카카오 상세 보기
              </a>
            )}
          </Card>
        ))}
      </div>

      {!loading && top3.length === 0 && (
        <div className="text-gray-600">주변에서 식당을 찾지 못했어요. <span className="text-orange-600">반경을 넓혀보세요.</span></div>
      )}
    </div>
  );
};
