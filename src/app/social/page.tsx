'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SpotlightContainer } from '@/components/SpotlightContainer';
import { HistorySection } from '@/components/HistorySection';
import { TakeoverModal } from '@/components/TakeoverModal';
import { TakeoverBanner } from '@/components/TakeoverBanner';
import { DemoToolbar } from '@/components/DemoToolbar';
import { store } from '@/lib/store';
import { BoardState, Placement } from '@/types';

export default function SocialPage() {
  const [boardState, setBoardState] = useState<BoardState>(() => store.getBoard('social'));
  const [minRequiredPaise, setMinRequiredPaise] = useState<number>(() =>
    store.getMinRequiredAmountPaise('social')
  );

  // Takeover modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Takeover animation state
  const [newLeaderBanner, setNewLeaderBanner] = useState<Placement | null>(null);
  const [isTakeoverAnimating, setIsTakeoverAnimating] = useState(false);

  // Pause Live Updates state
  const [isPaused, setIsPaused] = useState(false);
  const [queuedBoardState, setQueuedBoardState] = useState<BoardState | null>(null);
  const [queuedCount, setQueuedCount] = useState(0);

  // Subscribe to real-time events from the store
  useEffect(() => {
    const unsubscribe = store.subscribe((event) => {
      if (event.board !== 'social') return;

      const freshBoard = store.getBoard('social');
      const freshMin = store.getMinRequiredAmountPaise('social');

      if (isPaused) {
        // Queue the update while paused
        setQueuedBoardState({ ...freshBoard });
        setQueuedCount((prev) => prev + 1);
        return;
      }

      // Live update
      setBoardState({ ...freshBoard });
      setMinRequiredPaise(freshMin);

      if (event.type === 'TAKEOVER' && event.payload) {
        setNewLeaderBanner(event.payload);
        setIsTakeoverAnimating(true);
        setTimeout(() => setIsTakeoverAnimating(false), 900);
      }
    });

    return () => unsubscribe();
  }, [isPaused]);

  // Flush queued updates when resuming or clicking queue pill
  const handleFlushQueue = () => {
    if (queuedBoardState) {
      setBoardState(queuedBoardState);
      setMinRequiredPaise(store.getMinRequiredAmountPaise('social'));
      setQueuedBoardState(null);
      setQueuedCount(0);
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      handleFlushQueue();
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-text">
      <Header
        onOpenTakeoverModal={() => setIsModalOpen(true)}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        queuedUpdatesCount={queuedCount}
        onFlushQueue={handleFlushQueue}
      />

      <TakeoverBanner
        placement={newLeaderBanner}
        onDismiss={() => setNewLeaderBanner(null)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {/* Spotlight Section */}
        <SpotlightContainer
          board="social"
          currentPlacement={boardState.currentPlacement}
          lastActivatedAmountPaise={boardState.lastActivatedAmountPaise}
          minRequiredPaise={minRequiredPaise}
          onOpenTakeoverModal={() => setIsModalOpen(true)}
          isTakeoverAnimating={isTakeoverAnimating}
        />

        {/* Descending History Section */}
        <HistorySection board="social" history={boardState.history} />
      </main>

      <Footer />

      {/* Floating Demo Control Bar */}
      <DemoToolbar
        board="social"
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Submission & Checkout Modal */}
      <TakeoverModal
        initialBoard="social"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          const fresh = store.getBoard('social');
          setBoardState({ ...fresh });
          setMinRequiredPaise(store.getMinRequiredAmountPaise('social'));
        }}
      />
    </div>
  );
}

