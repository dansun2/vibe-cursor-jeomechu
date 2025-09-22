'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function HomeClient() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/start');
  }, [router]);
  return null;
}

export default async function Page(_: Promise<{ params: {} }>) {
  return <HomeClient />;
}