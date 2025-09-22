'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLunchStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export const RouletteScreen = () => {
  const { session, actions } = useLunchStore();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingSessionRef = useRef<ReturnType<typeof actions.runRoulette> | null>(null);
  const drawBaseCandidatesRef = useRef(session.candidates);

  const spinRoulette = () => {
    if (isSpinning || session.candidates.length === 0) return;

    // 회전 중에도 같은 캔디데이트 세트를 유지하여 시각적 일관성 보장
    drawBaseCandidatesRef.current = session.candidates;

    // 결과를 미리 계산하여 목표 섹터를 정하고, 애니메이션 종료 후 라우팅
    const nextSession = actions.runRoulette();
    pendingSessionRef.current = nextSession;

    const baseCandidates = drawBaseCandidatesRef.current;
    const anglePer = 360 / Math.max(1, baseCandidates.length);

    // 타깃 인덱스 계산
    // 베이스 후보가 카테고리(예: id가 'cat:'로 시작)라면 새 세션의 lastSpinTargetId를 사용
    const baseLooksCategory = (baseCandidates[0]?.id || '').startsWith('cat:');
    const targetId = baseLooksCategory
      ? (nextSession.lastSpinTargetId ?? baseCandidates[0]?.id)
      : nextSession.mode === 'result'
        ? nextSession.finalResult?.id
        : nextSession.mode === 'voting' && nextSession.rouletteResult.length > 0
          ? nextSession.rouletteResult[0]?.id
          : (nextSession.lastSpinTargetId ?? baseCandidates[0]?.id);

    let targetIndex = Math.max(
      0,
      baseCandidates.findIndex((c) => c.id === targetId)
    );
    if (targetIndex === -1) targetIndex = 0;

    // 현재 회전 각도를 기준으로 목표 중심 각도까지의 델타 계산
    const centerDeg = targetIndex * anglePer + anglePer / 2; // 우측(0deg) 기준
    const desiredAtTopDeg = 270 - centerDeg; // 상단(12시=270deg)에 중심을 맞춤
    const currentMod = ((rotationDeg % 360) + 360) % 360;
    const rawDelta = desiredAtTopDeg - currentMod;
    const normalizedDelta = ((rawDelta % 360) + 360) % 360; // 0..360

    const extraSpins = 5 * 360; // 여분 회전(시각적 재미)
    const finalDeg = rotationDeg + extraSpins + normalizedDelta;

    setIsSpinning(true);
    // 트랜지션 켠 후 최종 각도 설정 → CSS transition으로 감속 회전
    requestAnimationFrame(() => {
      setRotationDeg(finalDeg);
    });
  };

  // 캔버스에 룰렛 베이스 그리기 (섹터 + 라벨)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 320; // CSS 픽셀
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;

    const candidates = isSpinning
      ? drawBaseCandidatesRef.current
      : session.candidates;

    const count = Math.max(1, candidates.length);
    const anglePer = (Math.PI * 2) / count;
    let start = 0; // 0 rad = 오른쪽(3시)

    // 배경 투명 클리어
    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < count; i += 1) {
      const end = start + anglePer;
      // 섹터
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(i * 360) / count}, 75%, 60%)`;
      ctx.fill();

      // 라벨
      const label = candidates[i]?.name ?? `#${i + 1}`;
      const mid = (start + end) / 2;
      const tx = cx + Math.cos(mid) * (radius * 0.6);
      const ty = cy + Math.sin(mid) * (radius * 0.6);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(mid);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 0);
      ctx.restore();

      start = end;
    }

    // 외곽선
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D1D5DB';
    ctx.stroke();
  }, [session.candidates, isSpinning]);

  // 회전 애니메이션 종료 처리 → 결과 화면 이동
  const handleTransitionEnd = () => {
    if (!isSpinning) return;
    setIsSpinning(false);
    const newSession = pendingSessionRef.current;
    pendingSessionRef.current = null;
    if (!newSession) return;
    // 다음 단계별 라우팅
    if (newSession.mode === 'rouletteMenu') {
      // 카테고리 확정 직후 추천 페이지로 이동하여 실데이터 TOP3 노출
      router.push('/recommend');
      return;
    }
    if (newSession.mode === 'voting') {
      router.push('/vote');
      return;
    }
    if (newSession.mode === 'result') {
      // 기존 결과 페이지 대신 추천 페이지로 이동하여 TOP3 노출
      router.push('/recommend');
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="text-2xl font-bold text-center">후보 선정 중...</h2>

      <div className="relative w-80 h-80 select-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-full will-change-transform"
          style={{
            transform: `rotate(${rotationDeg}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.9, 0.2, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        />

        {/* 룰렛 화살표 */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500" />
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