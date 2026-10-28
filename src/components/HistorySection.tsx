'use client';

import React, { useState, useMemo } from 'react';
import { BoardType, Placement, SocialPlatform } from '@/types';
import { store } from '@/lib/store';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ExternalLink,
  Filter,
  Gift,
  Mail,
  CheckCircle2,
  Bookmark,
  Users,
} from 'lucide-react';

interface HistorySectionProps {
  board: BoardType;
  history: Placement[];
}

const ITEMS_PER_PAGE = 6;

export function HistorySection({ board, history }: HistorySectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const isCompanies = board === 'companies';

  const [activeTab, setActiveTab] = useState<'directory' | 'archived' | 'saved'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Digest subscription state
  const [digestEmail, setDigestEmail] = useState('');
  const [digestSubscribed, setDigestSubscribed] = useState(false);

  const handleSubscribeDigest = (e: React.FormEvent) => {
    e.preventDefault();
    if (store.subscribeToDigest(digestEmail)) {
      setDigestSubscribed(true);
      setTimeout(() => setDigestSubscribed(false), 3000);
      setDigestEmail('');
    }
  };

  // Extract unique categories for Companies
  const categories = useMemo(() => {
    if (!isCompanies) return [];
    const set = new Set<string>();
    history.forEach((h) => {
      if (h.adRevision.category) set.add(h.adRevision.category);
    });
    return Array.from(set);
  }, [history, isCompanies]);

  // Filter items
  const filteredItems = useMemo(() => {
    const savedIds = new Set(store.getSavedToolIds());

    return history.filter((item) => {
      // 1. Saved Tab Filter
      if (activeTab === 'saved') {
        if (!savedIds.has(item.id)) return false;
      }

      // 2. Directory vs Archived filter
      if (activeTab === 'directory') {
        if (item.status === 'moderation_removed') return false;
      }

      // 3. Text search
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesTitle = item.adRevision.title.toLowerCase().includes(query);
        const matchesTagline = item.adRevision.tagline.toLowerCase().includes(query);
        const matchesHandle = item.adRevision.handleOrIdentifier?.toLowerCase().includes(query);
        const matchesDomain = item.adRevision.displayDomain?.toLowerCase().includes(query);
        const matchesCat = item.adRevision.category?.toLowerCase().includes(query);
        const matchesPerk = item.adRevision.founderPerk?.title.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTagline && !matchesHandle && !matchesDomain && !matchesCat && !matchesPerk) {
          return false;
        }
      }

      // 4. Platform filter (Social only)
      if (!isCompanies && selectedPlatform !== 'all') {
        if (item.adRevision.platform !== selectedPlatform) {
          return false;
        }
      }

      // 5. Category filter (Companies only)
      if (isCompanies && selectedCategory !== 'all') {
        if (item.adRevision.category !== selectedCategory) {
          return false;
        }
      }

      return true;
    });
  }, [history, searchQuery, selectedPlatform, selectedCategory, activeTab, isCompanies]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="mt-16 sm:mt-24 max-w-4xl mx-auto">
      {/* VISITOR VALUE 1: Weekly Founder Digest Banner */}
      <div className="mb-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white via-apple-subtle/80 to-blue-50/40 border border-apple-border/80 shadow-apple-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold mb-2">
            <Mail className="w-3 h-3" />
            <span>Weekly Founder Digest</span>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-apple-text tracking-tight">
            The Indian Founder Stack
          </h3>
          <p className="text-xs text-apple-secondary mt-1 leading-relaxed">
            Join 12,500+ Indian startup founders and CTOs. Delivered every Monday morning with 3 vetted software teardowns, exclusive credits, and hiring trends.
          </p>
        </div>

        <form onSubmit={handleSubscribeDigest} className="flex items-center gap-2 w-full md:w-auto">
          {digestSubscribed ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Subscribed! Check your inbox Monday.</span>
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                placeholder="founder@startup.in"
                className="px-3.5 py-2 text-xs rounded-full bg-white border border-apple-border text-apple-text placeholder-apple-tertiary focus:border-apple-accent transition-colors w-full md:w-56 shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-apple-text hover:bg-black text-white text-xs font-medium shadow-apple-sm transition-colors flex-shrink-0"
              >
                Get Digest
              </button>
            </>
          )}
        </form>
      </div>

      {/* Directory Section Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-apple-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-text">
              {isCompanies ? 'Curated Founders Directory' : 'Indian Tech Creators Directory'}
            </h2>
          </div>
          <p className="text-xs text-apple-secondary">
            {isCompanies
              ? 'Dependable 7-day verified software campaigns with exclusive perks. Ranked by investment.'
              : 'Verified tech creators, engineering leads, and builders sharing actionable playbooks.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex items-center p-1 bg-apple-subtle rounded-full border border-apple-border/80 text-xs self-start md:self-auto">
          <button
            onClick={() => {
              setActiveTab('directory');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'directory' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
            }`}
          >
            All Listings ({history.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('saved');
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'saved' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Saved</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('archived');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'archived' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
            }`}
          >
            Past Rounds
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-apple-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              isCompanies
                ? 'Search tools, perks, or categories...'
                : 'Search creators, handles, or topics...'
            }
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-apple-subtle border border-apple-border/80 text-apple-text placeholder-apple-tertiary focus:bg-white focus:border-apple-accent transition-all"
          />
        </div>

        {/* Platform Dropdown (Social only) */}
        {!isCompanies && (
          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium rounded-full bg-apple-subtle border border-apple-border/80 text-apple-text cursor-pointer hover:border-apple-borderHover focus:border-apple-accent transition-all"
            >
              <option value="all">All platforms</option>
              <option value="instagram">Instagram</option>
              <option value="x">X</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <ChevronDown className="w-3 h-3 text-apple-tertiary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Category Dropdown (Companies only) */}
        {isCompanies && categories.length > 0 && (
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium rounded-full bg-apple-subtle border border-apple-border/80 text-apple-text cursor-pointer hover:border-apple-borderHover focus:border-apple-accent transition-all"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-apple-tertiary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Directory Rows List */}
      <div className="mt-6 divide-y divide-apple-border/50">
        <AnimatePresence mode="popLayout">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => {
              const rupeeAmount = Math.round(item.amountPaise / 100);
              const startDate = new Date(item.activatedAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              });
              const redirectUrl = `/api/clicks/redirect?placementId=${item.id}&board=${board}&isSpotlight=false`;

              return (
                <motion.div
                  key={item.id}
                  layout={shouldReduceMotion ? false : 'position'}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-apple-subtle/40 px-2 sm:px-3 rounded-2xl transition-colors"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                    <div
                      className={`relative w-12 h-12 overflow-hidden flex-shrink-0 bg-apple-subtle border border-apple-border/60 ${
                        isCompanies ? 'rounded-2xl' : 'rounded-full'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.adRevision.mediaUrl}
                        alt={item.adRevision.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-apple-text truncate">
                          {item.adRevision.title}
                        </h4>

                        <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                          7-Day Campaign
                        </span>

                        {!isCompanies && item.adRevision.platform && (
                          <span className="text-[10px] text-apple-secondary font-medium px-1.5 py-0.5 rounded bg-apple-subtle capitalize">
                            {item.adRevision.platform}
                          </span>
                        )}

                        {isCompanies && item.adRevision.category && (
                          <span className="text-[10px] text-apple-secondary font-medium px-1.5 py-0.5 rounded bg-apple-subtle">
                            {item.adRevision.category}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-apple-secondary line-clamp-1 mt-0.5 max-w-lg">
                        {item.adRevision.tagline}
                      </p>

                      {/* Exclusive Founder Perk inline pill */}
                      {item.adRevision.founderPerk && (
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-medium">
                          <Gift className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="font-semibold">{item.adRevision.founderPerk.title}</span>
                          {item.adRevision.founderPerk.promoCode && (
                            <span className="font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-blue-200 text-blue-700">
                              {item.adRevision.founderPerk.promoCode}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-apple-tertiary mt-1.5 tabular-nums">
                        <span>Listed: {startDate}</span>
                        <span>•</span>
                        <span>Quality Score: {item.adRevision.qualityScore}/10</span>
                        {item.clicksCount > 0 && (
                          <>
                            <span>•</span>
                            <span>{item.clicksCount} verified redirects</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Investment & Action */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
                        Investment
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-apple-text tabular-nums">
                        ₹{rupeeAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-apple-subtle hover:bg-apple-border text-apple-text text-xs font-medium border border-apple-border transition-all shadow-apple-sm"
                    >
                      <span>Claim Perk</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-apple-subtle flex items-center justify-center text-apple-secondary mx-auto">
                <Filter className="w-4 h-4 text-apple-tertiary" />
              </div>
              <h3 className="text-sm font-semibold text-apple-text">
                {activeTab === 'saved'
                  ? 'No saved tools yet'
                  : 'No matching listings found'}
              </h3>
              <p className="text-xs text-apple-secondary max-w-xs mx-auto">
                {activeTab === 'saved'
                  ? 'Click the bookmark icon on any tool or creator card to save it for quick reference.'
                  : 'Try adjusting your search query or filters.'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 pt-4 border-t border-apple-border/60 flex items-center justify-between text-xs text-apple-secondary">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-full border border-apple-border bg-apple-subtle text-apple-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-apple-card transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-full border border-apple-border bg-apple-subtle text-apple-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-apple-card transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
