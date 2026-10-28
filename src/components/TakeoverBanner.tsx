'use client';

import React, { useEffect, useState } from 'react';
import { Placement } from '@/types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface TakeoverBannerProps {
  placement: Placement | null;
  onDismiss: () => void;
}

export function TakeoverBanner({ placement, onDismiss }: TakeoverBannerProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!placement) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [placement, onDismiss]);

  if (!placement) return null;

  const rupeeAmount = Math.round(placement.amountPaise / 100);

  return (
    <AnimatePresence>
      <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -20, scale: 0.96 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -15, scale: 0.96 }
          }
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="pointer-events-auto max-w-lg w-full p-3.5 rounded-full bg-apple-text/95 backdrop-blur-md text-white shadow-apple-float border border-white/10 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0 pl-1">
            <div className="w-7 h-7 rounded-full bg-apple-accent flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-xs truncate">
              <span className="font-semibold">{placement.adRevision.title}</span>
              <span className="text-neutral-300 ml-1">
                took the {placement.board === 'companies' ? 'Companies' : 'Social'} spotlight for{' '}
              </span>
              <span className="font-semibold text-white tabular-nums">
                ₹{rupeeAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors flex-shrink-0 pr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

