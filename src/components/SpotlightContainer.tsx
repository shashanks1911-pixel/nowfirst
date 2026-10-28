'use client';

import React, { useEffect, useState } from 'react';
import { BoardType, Placement } from '@/types';
import { CompanyCard } from './CompanyCard';
import { SocialCard } from './SocialCard';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, AlertCircle, Clock, ShieldCheck, Flame, RotateCcw } from 'lucide-react';

interface SpotlightContainerProps {
  board: BoardType;
  currentPlacement: Placement | null;
  lastActivatedAmountPaise: number;
  minRequiredPaise: number;
  onOpenTakeoverModal: () => void;
  isTakeoverAnimating?: boolean;
}

export function SpotlightContainer({
  board,
  currentPlacement,
  lastActivatedAmountPaise,
  minRequiredPaise,
  onOpenTakeoverModal,
  isTakeoverAnimating = false,
}: SpotlightContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const isCompanies = board === 'companies';
  const minRequiredRupees = Math.round(minRequiredPaise / 100);
  const currentLeaderRupees = Math.round(lastActivatedAmountPaise / 100);

  // Time active calculation
  const [activeDurationText, setActiveDurationText] = useState<string>('');

  useEffect(() => {
    if (!currentPlacement) {
      setActiveDurationText('');
      return;
    }

    const updateDuration = () => {
      const start = new Date(currentPlacement.activatedAt).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;

      if (hours > 0) {
        setActiveDurationText(`${hours}h ${remainingMins}m active`);
      } else {
        setActiveDurationText(`${minutes}m active`);
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 60000);
    return () => clearInterval(interval);
  }, [currentPlacement]);

  return (
    <section className="relative w-full">
      {/* Weekly Round & Niche Indicator Pill */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-apple-subtle border border-apple-border/70 text-xs text-apple-secondary shadow-apple-sm">
          <span className="flex items-center gap-1 font-semibold text-apple-text">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Weekly Round #14</span>
          </span>
          <span className="text-apple-tertiary">•</span>
          <span>Indian Founders & Small Teams</span>
          <span className="text-apple-tertiary hidden sm:inline">•</span>
          <span className="text-[11px] text-apple-secondary hidden sm:inline">Floor resets weekly to ₹100</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-apple-text leading-[1.15]"
        >
          {isCompanies ? (
            <>One live spotlight. <br className="hidden sm:inline" />Dependable 7-day distribution.</>
          ) : (
            <>Indian tech creators. <br className="hidden sm:inline" />One live spotlight.</>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-3 text-sm sm:text-base text-apple-secondary font-normal max-w-2xl mx-auto leading-relaxed"
        >
          {isCompanies
            ? 'Discover vetted software and exclusive founder perks for Indian teams. Standard campaigns include guaranteed 7-day directory listing & weekly newsletter distribution. The live spotlight is an optional upgrade until outbid.'
            : 'Explore Indian builders and tech creators sharing engineering playbooks on X, LinkedIn, Instagram, and Facebook.'}
        </motion.p>
      </div>

      {/* Spotlight Card Wrapper with 600-900ms Takeover Choreography */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Subtle Takeover Highlight Pulse Glow */}
          {isTakeoverAnimating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -inset-1 rounded-[36px] bg-apple-accent/20 blur-md pointer-events-none -z-10"
            />
          )}

          <AnimatePresence mode="wait">
            {currentPlacement ? (
              <motion.div
                key={currentPlacement.id}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96, y: 14 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96, y: -14 }
                }
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {isCompanies ? (
                  <CompanyCard placement={currentPlacement} isSpotlight={true} />
                ) : (
                  <SocialCard placement={currentPlacement} isSpotlight={true} />
                )}
              </motion.div>
            ) : (
              /* Vacant Spotlight State (When moderation removes live placement) */
              <motion.div
                key="vacant-spotlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 md:p-10 rounded-3xl bg-apple-subtle/70 border border-dashed border-apple-border text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-apple-card border border-apple-border/80 flex items-center justify-center text-apple-secondary mx-auto shadow-apple-sm">
                  <AlertCircle className="w-6 h-6 text-apple-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-apple-text">Spotlight Currently Vacant</h3>
                  <p className="text-xs text-apple-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                    The previous placement was removed by moderation. Past placements are never reactivated.
                    The next placement must still exceed the last activated price of ₹{currentLeaderRupees.toLocaleString('en-IN')}.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onOpenTakeoverModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-accent text-white text-xs font-medium shadow-apple-sm hover:bg-apple-accentHover transition-colors"
                  >
                    <span>Claim Spotlight Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Panel Below Spotlight */}
        <div className="mt-4 p-4 rounded-2xl bg-apple-subtle/80 border border-apple-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
                Spotlight Bidding
              </span>
              <span className="text-base font-semibold text-apple-text tabular-nums">
                ₹{minRequiredRupees.toLocaleString('en-IN')}+
              </span>
            </div>

            <div className="h-6 w-px bg-apple-border" />

            <div>
              <span className="block text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
                Standard Campaign
              </span>
              <span className="text-xs text-apple-text font-medium tabular-nums">
                ₹499 (7-Day Guaranteed)
              </span>
            </div>

            {activeDurationText && (
              <>
                <div className="h-6 w-px bg-apple-border hidden md:block" />
                <div className="hidden md:flex items-center gap-1 text-apple-secondary">
                  <Clock className="w-3 h-3 text-apple-tertiary" />
                  <span>{activeDurationText}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onOpenTakeoverModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-apple-accent hover:bg-apple-accentHover active:bg-apple-accentActive text-white text-xs font-medium shadow-apple-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book Campaign / Spotlight</span>
          </button>
        </div>
      </div>
    </section>
  );
}
