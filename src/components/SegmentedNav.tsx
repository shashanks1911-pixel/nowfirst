'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

interface SegmentedNavProps {
  className?: string;
}

export function SegmentedNav({ className = '' }: SegmentedNavProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const isCompanies = pathname === '/' || pathname.startsWith('/companies');
  const isSocial = pathname.startsWith('/social');

  const tabs = [
    { href: '/companies', label: 'Companies', active: isCompanies },
    { href: '/social', label: 'Social', active: isSocial },
  ];

  return (
    <div
      role="tablist"
      aria-label="Destinations"
      className={`inline-flex items-center p-1 bg-apple-subtle rounded-full border border-apple-border/70 shadow-apple-sm ${className}`}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          role="tab"
          aria-selected={tab.active}
          className={`relative z-10 px-5 py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors duration-200 outline-none select-none ${
            tab.active ? 'text-apple-text' : 'text-apple-secondary hover:text-apple-text'
          }`}
        >
          {tab.active && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : 'activeNavIndicator'}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 32,
              }}
              className="absolute inset-0 bg-white rounded-full shadow-apple-pill border border-apple-border/40 -z-10"
            />
          )}
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}

