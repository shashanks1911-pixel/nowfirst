'use client';

import React, { useState } from 'react';
import { Placement, SocialPlatform } from '@/types';
import { store } from '@/lib/store';
import { ExternalLink, Bookmark, Sparkles, Users } from 'lucide-react';

interface SocialCardProps {
  placement: Placement;
  isSpotlight?: boolean;
  onVisit?: () => void;
}

const PLATFORM_LABELS: Record<SocialPlatform, { label: string; actionLabel: string }> = {
  instagram: {
    label: 'Instagram',
    actionLabel: 'View profile',
  },
  x: {
    label: 'X',
    actionLabel: 'View profile',
  },
  facebook: {
    label: 'Facebook',
    actionLabel: 'View page',
  },
  linkedin: {
    label: 'LinkedIn',
    actionLabel: 'View profile',
  },
};

export function SocialCard({ placement, isSpotlight = false, onVisit }: SocialCardProps) {
  const { adRevision, amountPaise, activatedAt, isLive } = placement;
  const rupeeAmount = Math.round(amountPaise / 100);
  const platform = (adRevision.platform as SocialPlatform) || 'x';
  const platformConfig = PLATFORM_LABELS[platform] || { label: 'Social', actionLabel: 'View destination' };

  const isPage =
    platform === 'facebook' ||
    (platform === 'linkedin' && adRevision.handleOrIdentifier?.toLowerCase().includes('company'));

  const actionText = isPage ? 'View page' : platformConfig.actionLabel;
  const [isSaved, setIsSaved] = useState(() => store.isToolSaved(placement.id));

  const handleToggleSave = () => {
    const saved = store.toggleSaveTool(placement.id);
    setIsSaved(saved);
  };

  const formattedTime = new Date(activatedAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  const redirectUrl = `/api/clicks/redirect?placementId=${placement.id}&board=social&isSpotlight=${isSpotlight}`;

  return (
    <article
      className={`relative w-full rounded-3xl bg-apple-card border border-apple-border/80 transition-all duration-300 ${
        isSpotlight
          ? 'p-6 md:p-8 shadow-apple-spotlight ring-1 ring-black/[0.03]'
          : 'p-4 md:p-5 shadow-apple-sm hover:border-apple-borderHover hover:shadow-apple-card'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
              isLive
                ? 'bg-apple-badgeBg text-apple-accent border border-apple-accent/20'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isLive ? 'Spotlight Leader' : '7-Day Verified Creator'}
          </span>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-apple-subtle text-apple-text border border-apple-border/60">
            {platformConfig.label}
          </span>

          {adRevision.targetAudience && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-apple-subtle text-apple-secondary border border-apple-border/50">
              <Users className="w-2.5 h-2.5 text-apple-tertiary" />
              <span>{adRevision.targetAudience}</span>
            </span>
          )}
        </div>

        <button
          onClick={handleToggleSave}
          title={isSaved ? 'Saved creator' : 'Save creator'}
          className={`p-1.5 rounded-full transition-colors ${
            isSaved
              ? 'text-apple-accent bg-apple-accentSubtle'
              : 'text-apple-tertiary hover:text-apple-text hover:bg-apple-subtle'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex items-start gap-4 md:gap-5">
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 bg-apple-subtle border border-apple-border/60 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={adRevision.mediaUrl}
            alt={adRevision.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold text-apple-text tracking-tight truncate ${
                isSpotlight ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
              }`}
            >
              {adRevision.title}
            </h3>
          </div>

          {adRevision.handleOrIdentifier && (
            <div className="text-xs text-apple-secondary mt-0.5 font-mono truncate">
              {adRevision.handleOrIdentifier}
            </div>
          )}

          <p
            className={`mt-2 text-apple-text/90 leading-relaxed font-normal ${
              isSpotlight ? 'text-sm md:text-base line-clamp-3' : 'text-xs md:text-sm line-clamp-2'
            }`}
          >
            {adRevision.tagline}
          </p>
        </div>
      </div>

      {/* Pinned Resource / Perk */}
      {adRevision.founderPerk && (
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-purple-50/70 to-indigo-50/60 border border-purple-200/70 flex items-start gap-2.5 text-xs">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-semibold text-purple-950 flex items-center gap-1.5">
              <span>{adRevision.founderPerk.title}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-1.5 py-0.5 rounded">
                Pinned
              </span>
            </div>
            <p className="text-purple-900/80 text-[11px] mt-0.5">
              {adRevision.founderPerk.description}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-5 pt-4 border-t border-apple-border/60 flex items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
            {isLive ? 'Spotlight Winning Bid' : 'Campaign Investment'}
          </span>
          <span
            className={`font-semibold text-apple-text tabular-nums ${
              isSpotlight ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
            }`}
          >
            ₹{rupeeAmount.toLocaleString('en-IN')}
          </span>
          {placement.conversionsCount > 0 && (
            <span className="block text-[10px] text-emerald-600 font-medium tabular-nums mt-0.5">
              {placement.conversionsCount} verified engagements
            </span>
          )}
        </div>

        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onVisit}
          className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
            isSpotlight
              ? 'px-5 py-2.5 bg-apple-text hover:bg-black text-white text-xs md:text-sm shadow-apple-sm'
              : 'px-3.5 py-1.5 bg-apple-subtle hover:bg-apple-border text-apple-text text-xs border border-apple-border'
          }`}
        >
          <span>{actionText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
