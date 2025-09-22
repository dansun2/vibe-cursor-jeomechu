'use client';

import { useLunchStore } from '@/lib/store';
import { Header } from '@/features/lunch-recommendation/components/Header';
import { Footer } from '@/features/lunch-recommendation/components/Footer';
import { WaitingScreen } from '@/features/lunch-recommendation/components/WaitingScreen';
import { RouletteScreen } from '@/features/lunch-recommendation/components/RouletteScreen';
import { VotingScreen } from '@/features/lunch-recommendation/components/VotingScreen';
import { ResultScreen } from '@/features/lunch-recommendation/components/ResultScreen';

export default function Home() {
  const { session } = useLunchStore();

  const renderCurrentScreen = () => {
    switch (session.mode) {
      case 'waiting':
        return <WaitingScreen />;
      case 'roulette':
        return <RouletteScreen />;
      case 'voting':
        return <VotingScreen />;
      case 'result':
        return <ResultScreen />;
      default:
        return <WaitingScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {renderCurrentScreen()}
      </main>
      <Footer />
    </div>
  );
}