'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TakeoverModal } from '@/components/TakeoverModal';
import { store } from '@/lib/store';
import { BoardType, AdCreative, Placement, PaymentRecord, CampaignObjective } from '@/types';
import {
  Sparkles,
  BarChart3,
  CreditCard,
  Clock,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Gift,
  Zap,
} from 'lucide-react';

export default function AdvertiserDashboardPage() {
  const [boardFilter, setBoardFilter] = useState<'all' | 'companies' | 'social'>('all');
  const [ads, setAds] = useState<AdCreative[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoardForModal, setSelectedBoardForModal] = useState<BoardType>('companies');
  const [conversionSimulationNotice, setConversionSimulationNotice] = useState<string | null>(null);

  const reload = () => {
    setAds(store.getAds());
    setPayments(store.getPayments());
  };

  useEffect(() => {
    reload();
    const unsubscribe = store.subscribe(() => reload());
    return () => unsubscribe();
  }, []);

  const filteredAds = useMemo(() => {
    if (boardFilter === 'all') return ads;
    return ads.filter((a) => a.board === boardFilter);
  }, [ads, boardFilter]);

  const allPlacements = useMemo(() => {
    const comp = store.getBoard('companies');
    const soc = store.getBoard('social');
    const list: Placement[] = [];
    if (comp.currentPlacement) list.push(comp.currentPlacement);
    list.push(...comp.activeCampaigns);
    if (soc.currentPlacement) list.push(soc.currentPlacement);
    list.push(...soc.activeCampaigns);

    // Deduplicate by ID
    const seen = new Set<string>();
    const unique = list.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    if (boardFilter === 'all') return unique;
    return unique.filter((p) => p.board === boardFilter);
  }, [boardFilter, ads]);

  // Aggregate metrics
  const totalExpenditureRupees = useMemo(() => {
    return payments
      .filter((p) => p.status === 'activation_succeeded')
      .filter((p) => boardFilter === 'all' || p.board === boardFilter)
      .reduce((sum, p) => sum + Math.round(p.amountPaise / 100), 0);
  }, [payments, boardFilter]);

  const totalRefundedRupees = useMemo(() => {
    return payments
      .filter((p) => p.status === 'refunded')
      .filter((p) => boardFilter === 'all' || p.board === boardFilter)
      .reduce((sum, p) => sum + Math.round(p.amountPaise / 100), 0);
  }, [payments, boardFilter]);

  const totalClicks = useMemo(() => {
    return allPlacements.reduce((sum, p) => sum + p.clicksCount, 0);
  }, [allPlacements]);

  const totalConversions = useMemo(() => {
    return allPlacements.reduce((sum, p) => sum + p.conversionsCount, 0);
  }, [allPlacements]);

  // Calculated ROI Metrics
  const avgCpcRupees = useMemo(() => {
    if (totalClicks === 0) return 0;
    return Math.round((totalExpenditureRupees / totalClicks) * 10) / 10;
  }, [totalExpenditureRupees, totalClicks]);

  const avgCpaRupees = useMemo(() => {
    if (totalConversions === 0) return 0;
    return Math.round((totalExpenditureRupees / totalConversions) * 10) / 10;
  }, [totalExpenditureRupees, totalConversions]);

  // Simulate / Record Conversion Test Action
  const handleSimulateConversion = (placementId: string, objective: CampaignObjective) => {
    store.recordConversion(placementId, objective);
    setConversionSimulationNotice(`Simulated 1 ${objective.replace('_', ' ')} event for placement.`);
    setTimeout(() => setConversionSimulationNotice(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-text">
      <Header onOpenTakeoverModal={() => setIsModalOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-apple-border/70">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-apple-text">
              Performance & ROI Dashboard
            </h1>
            <p className="text-xs text-apple-secondary mt-1">
              Real-time measurement of exposure, cost-per-click (CPC), trial activations, and cost-per-acquisition (CPA).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedBoardForModal('companies');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-medium shadow-apple-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Launch Campaign</span>
            </button>
          </div>
        </div>

        {conversionSimulationNotice && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{conversionSimulationNotice} Performance metrics and CPA updated live.</span>
          </div>
        )}

        {/* Board Filter Tabs */}
        <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center p-1 bg-apple-subtle rounded-full border border-apple-border/70 text-xs">
            {(['all', 'companies', 'social'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBoardFilter(b)}
                className={`px-4 py-1.5 rounded-full font-medium capitalize transition-all ${
                  boardFilter === b
                    ? 'bg-white shadow-apple-pill text-apple-text'
                    : 'text-apple-secondary hover:text-apple-text'
                }`}
              >
                {b === 'all' ? 'All Boards' : b}
              </button>
            ))}
          </div>

          <span className="text-xs text-apple-tertiary">
            Showing {filteredAds.length} active creatives across {boardFilter}
          </span>
        </div>

        {/* PROVING ADVERTISER VALUE: 5-Metric ROI Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. Total Spend */}
          <div className="p-4 rounded-3xl bg-apple-card border border-apple-border/80 shadow-apple-sm">
            <span className="text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
              Total Spend
            </span>
            <div className="text-xl font-semibold text-apple-text tabular-nums mt-1">
              ₹{totalExpenditureRupees.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-apple-tertiary mt-1 block">
              Active campaigns & upgrades
            </span>
          </div>

          {/* 2. Measured Clicks */}
          <div className="p-4 rounded-3xl bg-apple-card border border-apple-border/80 shadow-apple-sm">
            <span className="text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
              Verified Clicks
            </span>
            <div className="text-xl font-semibold text-apple-text tabular-nums mt-1">
              {totalClicks}
            </div>
            <span className="text-[10px] text-apple-tertiary mt-1 block">
              Bot & repeat filtered
            </span>
          </div>

          {/* 3. Cost Per Click (CPC) */}
          <div className="p-4 rounded-3xl bg-apple-card border border-apple-border/80 shadow-apple-sm">
            <span className="text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
              Effective CPC
            </span>
            <div className="text-xl font-semibold text-apple-accent tabular-nums mt-1">
              ₹{avgCpcRupees > 0 ? avgCpcRupees : '—'}
            </div>
            <span className="text-[10px] text-apple-tertiary mt-1 block">
              Cost per relevant visit
            </span>
          </div>

          {/* 4. Conversions */}
          <div className="p-4 rounded-3xl bg-apple-card border border-apple-border/80 shadow-apple-sm">
            <span className="text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
              Attributed Conversions
            </span>
            <div className="text-xl font-semibold text-emerald-600 tabular-nums mt-1">
              {totalConversions}
            </div>
            <span className="text-[10px] text-apple-tertiary mt-1 block">
              Trials, leads & redemptions
            </span>
          </div>

          {/* 5. Cost Per Acquisition (CPA) */}
          <div className="p-4 rounded-3xl bg-apple-card border border-apple-border/80 shadow-apple-sm">
            <span className="text-[10px] uppercase tracking-wider text-apple-secondary font-medium">
              Effective CPA
            </span>
            <div className="text-xl font-semibold text-emerald-700 tabular-nums mt-1">
              ₹{avgCpaRupees > 0 ? avgCpaRupees : '—'}
            </div>
            <span className="text-[10px] text-apple-tertiary mt-1 block">
              Cost per acquisition
            </span>
          </div>
        </div>

        {/* Required Attribution Footnote */}
        <div className="mt-3 text-[11px] text-apple-secondary bg-apple-subtle/70 p-3 rounded-2xl border border-apple-border/60 leading-relaxed">
          <strong>Conversion Measurement Notice:</strong> A profile click does not prove a follow, and attributed conversions do not automatically prove incremental sales. Outbound visits filter search bots and 10-minute duplicate requests.
        </div>

        {/* SECTION 1: CAMPAIGN PERFORMANCE BREAKDOWN */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-apple-text">
              Active Campaigns & Deliverables Tracking
            </h2>
            <span className="text-xs text-apple-tertiary">
              Multi-channel distribution status
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-apple-border/80 overflow-hidden shadow-apple-sm divide-y divide-apple-border/60">
            {allPlacements.map((plc) => {
              const rupeeAmount = Math.round(plc.amountPaise / 100);
              const cpc = plc.clicksCount > 0 ? (rupeeAmount / plc.clicksCount).toFixed(1) : '—';
              const cpa = plc.conversionsCount > 0 ? (rupeeAmount / plc.conversionsCount).toFixed(1) : '—';

              return (
                <div key={plc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                          plc.isLive
                            ? 'bg-apple-badgeBg text-apple-accent border border-apple-accent/20'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {plc.isLive ? 'Hero Spotlight Leader' : '7-Day Directory Active'}
                      </span>
                      <span className="text-sm font-semibold text-apple-text truncate">
                        {plc.adRevision.title}
                      </span>
                      <span className="text-xs text-apple-tertiary capitalize">
                        ({plc.board})
                      </span>
                    </div>

                    <p className="text-xs text-apple-secondary mt-1">{plc.adRevision.tagline}</p>

                    {plc.adRevision.founderPerk && (
                      <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-[11px]">
                        <Gift className="w-3 h-3 text-blue-600" />
                        <span className="font-semibold">{plc.adRevision.founderPerk.title}</span>
                      </div>
                    )}

                    <div className="mt-2 text-[11px] text-apple-secondary flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-apple-text">Channels:</span>
                      {plc.distributionChannels.map((ch) => (
                        <span key={ch} className="px-2 py-0.5 rounded bg-apple-subtle text-apple-secondary">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Performance Numbers */}
                  <div className="grid grid-cols-4 gap-4 text-right flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <div>
                      <span className="block text-[10px] uppercase text-apple-secondary font-medium">
                        Spend
                      </span>
                      <span className="text-sm font-semibold text-apple-text tabular-nums">
                        ₹{rupeeAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase text-apple-secondary font-medium">
                        Clicks
                      </span>
                      <span className="text-sm font-semibold text-apple-accent tabular-nums">
                        {plc.clicksCount}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase text-apple-secondary font-medium">
                        CPC
                      </span>
                      <span className="text-sm font-semibold text-apple-text tabular-nums">
                        ₹{cpc}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase text-apple-secondary font-medium">
                        Conversions
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                        {plc.conversionsCount}
                      </span>
                      <span className="block text-[9px] text-apple-tertiary">CPA: ₹{cpa}</span>
                    </div>
                  </div>

                  {/* Interactive Test Action */}
                  <div className="flex md:flex-col items-center justify-end gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleSimulateConversion(plc.id, plc.adRevision.objective)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-apple-subtle hover:bg-apple-border text-apple-text text-[11px] font-medium border border-apple-border transition-colors shadow-apple-sm whitespace-nowrap"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Test Conversion</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: BILLING & REFUND RECONCILIATION */}
        <div className="mt-12">
          <h2 className="text-base sm:text-lg font-semibold text-apple-text mb-4">
            Payment & Refund Reconciliation
          </h2>

          <div className="bg-white rounded-3xl border border-apple-border/80 overflow-hidden shadow-apple-sm divide-y divide-apple-border/60 text-xs">
            {payments.map((pay) => (
              <div key={pay.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-apple-text">{pay.adTitle}</span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${
                        pay.status === 'activation_succeeded'
                          ? 'bg-emerald-50 text-emerald-700'
                          : pay.status === 'refunded'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {pay.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-apple-secondary mt-0.5 font-mono">
                    Order ID: {pay.orderId} • Objective: {pay.objective}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-semibold text-apple-text tabular-nums">
                    ₹{Math.round(pay.amountPaise / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-apple-secondary">{pay.currency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <TakeoverModal
        initialBoard={selectedBoardForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}
