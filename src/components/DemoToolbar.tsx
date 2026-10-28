'use client';

import React, { useState } from 'react';
import { BoardType } from '@/types';
import { store } from '@/lib/store';
import { Zap, RefreshCw, Pause, Play, RotateCcw, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoToolbarProps {
  board: BoardType;
  isPaused: boolean;
  onTogglePause: () => void;
  onTakeoverTriggered?: () => void;
}

const BOT_COMPANIES = [
  {
    name: 'Kalam AI Speech',
    domain: 'kalam.ai',
    tagline: 'Multilingual Indic voice models with 98% accuracy on Hindi, Tamil, and Hinglish audio streams.',
    category: 'Artificial Intelligence',
    targetAudience: 'Product Engineers & Call Center Teams',
    perk: {
      title: '500 Free Audio Minutes',
      description: 'Zero setup cost for transcription and translation APIs.',
      promoCode: 'KALAM500',
    },
    media: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'ZetaFlow Deploy',
    domain: 'zetaflow.dev',
    tagline: 'Self-hosted CI/CD runners deployed on AWS Mumbai with 4x faster Docker builds.',
    category: 'Developer Tools',
    targetAudience: 'DevOps Leads & Startups',
    perk: {
      title: '2 Free Concurrent Runners',
      description: 'Lifetime free tier for open source and bootstrap projects.',
      promoCode: 'ZETA_FREE',
    },
    media: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
  },
];

export function DemoToolbar({
  board,
  isPaused,
  onTogglePause,
  onTakeoverTriggered,
}: DemoToolbarProps) {
  const [simulating, setSimulating] = useState(false);
  const [conversionNotice, setConversionNotice] = useState(false);

  const handleSimulateBotTakeover = () => {
    setSimulating(true);

    setTimeout(() => {
      const minRequiredPaise = store.getMinRequiredAmountPaise(board);
      const bidPaise = minRequiredPaise + 2000; // Bid min + ₹20
      const bot = BOT_COMPANIES[Math.floor(Math.random() * BOT_COMPANIES.length)];

      const ad = store.createAdCreative({
        advertiserId: `adv_bot_${Date.now()}`,
        advertiserName: bot.name,
        advertiserEmail: `founder@${bot.domain}`,
        board,
        title: bot.name,
        tagline: bot.tagline,
        destinationUrl: `https://${bot.domain}`,
        displayDomain: bot.domain,
        category: bot.category,
        targetAudience: bot.targetAudience,
        objective: 'trial_signups',
        founderPerk: bot.perk,
        mediaUrl: bot.media,
        ownershipAttested: true,
        moderationStatus: 'approved',
      });

      store.executeTakeover({
        board,
        adCreativeId: ad.id,
        amountPaise: bidPaise,
        advertiserId: ad.advertiserId,
        advertiserName: ad.advertiserName,
        advertiserEmail: ad.advertiserEmail,
      });

      setSimulating(false);
      try {
        confetti({
          particleCount: 45,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#0071E3', '#86868B'],
        });
      } catch (e) {}

      if (onTakeoverTriggered) onTakeoverTriggered();
    }, 600);
  };

  const handleSimulateConversion = () => {
    const livePlacement = store.getBoard(board).currentPlacement;
    if (livePlacement) {
      store.recordConversion(livePlacement.id, livePlacement.adRevision.objective);
      setConversionNotice(true);
      setTimeout(() => setConversionNotice(false), 2000);
    }
  };

  const handleAdvanceRound = () => {
    store.advanceWeeklyRound(board);
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-fit px-2 py-1.5 rounded-full bg-apple-text/95 backdrop-blur-md shadow-apple-float border border-white/10 flex items-center gap-1.5 sm:gap-2 text-white text-xs">
      <span className="text-[11px] font-medium text-neutral-400 pl-2 hidden sm:inline">
        Demo Lab:
      </span>

      {/* Simulate Bot Takeover */}
      <button
        onClick={handleSimulateBotTakeover}
        disabled={simulating}
        title="Simulates competitor taking the #1 spotlight while preserving the previous campaign in the directory"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-accent hover:bg-apple-accentHover active:bg-apple-accentActive text-white font-medium transition-colors disabled:opacity-50"
      >
        <Zap className="w-3.5 h-3.5" />
        <span>{simulating ? 'Simulating...' : 'Simulate Takeover'}</span>
      </button>

      {/* Test Conversion */}
      <button
        onClick={handleSimulateConversion}
        title="Simulate a visitor claiming an exclusive perk or signing up for a trial"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 font-medium transition-colors"
      >
        <Target className="w-3 h-3 text-emerald-400" />
        <span className="hidden md:inline">
          {conversionNotice ? 'Conversion Added!' : '+1 Conversion'}
        </span>
      </button>

      {/* Advance Weekly Round */}
      <button
        onClick={handleAdvanceRound}
        title="Advance to next weekly round, resetting the spotlight floor back to ₹100 base"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span className="hidden lg:inline">Next Round (Reset Floor)</span>
      </button>

      {/* Toggle Pause / Live */}
      <button
        onClick={onTogglePause}
        title={isPaused ? 'Click to resume live updates' : 'Click to pause incoming takeover animations'}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full font-medium transition-colors ${
          isPaused
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            : 'bg-white/10 hover:bg-white/20 text-neutral-300'
        }`}
      >
        {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        <span className="hidden md:inline">{isPaused ? 'Resume' : 'Pause'}</span>
      </button>

      {/* Reset Demo */}
      <button
        onClick={() => store.resetDemo()}
        title="Reset demo data to initial seeds"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        <span className="hidden md:inline">Reset</span>
      </button>
    </div>
  );
}
