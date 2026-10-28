'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SegmentedNav } from './SegmentedNav';
import { ShieldCheck, Sparkles, Pause, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { store } from '@/lib/store';

interface HeaderProps {
  onOpenTakeoverModal?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  queuedUpdatesCount?: number;
  onFlushQueue?: () => void;
}

export function Header({
  onOpenTakeoverModal,
  isPaused = false,
  onTogglePause,
  queuedUpdatesCount = 0,
  onFlushQueue,
}: HeaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsAdmin(sessionStorage.getItem('nowfirst_admin_authenticated') === 'true');
    }
  }, []);

  const isCompanies = pathname === '/' || pathname.startsWith('/companies');
  const currentBoard = isCompanies ? 'Companies' : 'Social';

  return (
    <header className="sticky top-0 z-40 bg-apple-bg/90 backdrop-blur-md border-b border-apple-border/60">
      {/* Top Demo Mode Notice Banner */}
      <div className="bg-apple-subtle border-b border-apple-border/40 px-4 py-1.5 text-center text-xs text-apple-secondary flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-medium text-apple-text">
          <span className="w-1.5 h-1.5 rounded-full bg-apple-accent animate-pulse" />
          Demo Mode:
        </span>
        <span>Simulated payments & real-time takeovers active. Never charges real money.</span>
        <button
          onClick={() => setShowConfigModal(true)}
          className="text-apple-accent hover:underline font-medium text-xs ml-1"
        >
          View Setup / Connected Test Mode
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/companies" className="group flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-apple-text text-white flex items-center justify-center font-bold text-xs tracking-tight group-hover:bg-apple-accent transition-colors">
              NF
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-apple-text leading-tight">
                NowFirst
              </span>
              <span className="text-[10px] text-apple-secondary uppercase tracking-widest font-medium">
                Live Billboard
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Segmented Navigation */}
        <div className="hidden sm:block">
          <SegmentedNav />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Pause / Live Updates Control */}
          {onTogglePause && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onTogglePause}
                title={isPaused ? 'Click to resume live updates' : 'Click to pause incoming takeover animations'}
                aria-pressed={isPaused}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                  isPaused
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                <span className="hidden md:inline">{isPaused ? 'Updates Paused' : 'Live'}</span>
                {isPaused ? <Play className="w-3 h-3 ml-0.5" /> : <Pause className="w-3 h-3 ml-0.5" />}
              </button>

              {isPaused && queuedUpdatesCount > 0 && onFlushQueue && (
                <button
                  onClick={onFlushQueue}
                  className="px-2 py-0.5 text-xs font-medium text-apple-accent bg-apple-accentSubtle hover:bg-apple-accent/20 rounded-full transition-colors tabular-nums"
                >
                  {queuedUpdatesCount} new
                </button>
              )}
            </div>
          )}

          {/* Links */}
          <Link
            href="/rules"
            className="text-xs font-medium text-apple-secondary hover:text-apple-text transition-colors hidden md:block"
          >
            Rules
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-apple-secondary hover:text-apple-text transition-colors hidden md:block"
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-medium text-apple-accent hover:text-apple-accentHover transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-apple-accent" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Primary CTA */}
          {onOpenTakeoverModal && (
            <button
              onClick={onOpenTakeoverModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-accent hover:bg-apple-accentHover active:bg-apple-accentActive text-white text-xs font-medium shadow-apple-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take Spotlight</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Segmented Nav Row */}
      <div className="sm:hidden px-4 pb-2.5 flex justify-center">
        <SegmentedNav />
      </div>

      {/* Mode & Setup Explainer Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-apple-float border border-apple-border text-left">
            <div className="flex items-center justify-between pb-3 border-b border-apple-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-apple-accentSubtle flex items-center justify-center text-apple-accent">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-apple-text">Platform Operating Modes</h3>
                  <p className="text-xs text-apple-secondary">Demo Mode vs. Connected Test Mode</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full bg-apple-subtle text-apple-secondary hover:text-apple-text flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-apple-text">
              <div className="p-3.5 rounded-2xl bg-apple-subtle/80 border border-apple-border/60">
                <div className="flex items-center gap-2 font-semibold text-apple-text mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Mode 1: Demo Mode (Active Now)
                </div>
                <p className="text-apple-secondary leading-relaxed">
                  Requires <strong>zero external credentials</strong>. Pre-seeded with realistic companies and social creators. Supports live bidding, takeovers with 750ms Apple motion choreography, outbid race condition simulation with automatic refund, anti-self-challenge guard, and one-click reset.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-apple-subtle/80 border border-apple-border/60">
                <div className="flex items-center gap-2 font-semibold text-apple-text mb-1">
                  <span className="w-2 h-2 rounded-full bg-apple-accent" />
                  Mode 2: Connected Test Mode
                </div>
                <p className="text-apple-secondary leading-relaxed mb-2">
                  Connects to persistent Supabase PostgreSQL database with Row-Level Security, Supabase Realtime subscriptions, and Razorpay standard checkout test keys.
                </p>
                <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-apple-border/60 text-apple-secondary space-y-1">
                  <div>NEXT_PUBLIC_APP_MODE=connected</div>
                  <div>NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...</div>
                  <div>NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...</div>
                  <div>RAZORPAY_KEY_SECRET=...</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    store.resetDemo();
                    setShowConfigModal(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-apple-border hover:bg-apple-subtle text-apple-secondary text-xs transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo State</span>
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-1.5 rounded-full bg-apple-accent text-white text-xs font-medium shadow-sm hover:bg-apple-accentHover"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

