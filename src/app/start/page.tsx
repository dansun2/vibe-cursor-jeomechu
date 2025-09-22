'use client';

import { WaitingScreen } from '@/features/lunch-recommendation/components/WaitingScreen';

export default async function Page(_: Promise<{ params: {} }>) {
  return <WaitingScreen />;
}


