'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { store } from '@/lib/store';
import { AdCreative, RefundJob, AuditLog, BoardType } from '@/types';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileQuestion,
  RotateCcw,
  AlertTriangle,
  History,
  Lock,
  Trash2,
} from 'lucide-react';

export default function AdminPage() {
  const [ads, setAds] = useState<AdCreative[]>([]);
  const [refundJobs, setRefundJobs] = useState<RefundJob[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'moderation' | 'live' | 'refunds' | 'audit'>('moderation');

  const reloadData = () => {
    setAds(store.getAds());
    setRefundJobs(store.getRefundJobs());
    setAuditLogs(store.getAuditLogs());
  };

  useEffect(() => {
    reloadData();
    const unsub = store.subscribe(() => reloadData());
    return () => unsub();
  }, []);

  const handleApprove = (adId: string) => {
    store.moderateAd(adId, 'approved', feedbackInput[adId] || 'Approved by admin review');
    reloadData();
  };

  const handleReject = (adId: string) => {
    store.moderateAd(adId, 'rejected', feedbackInput[adId] || 'Violates destination policy or trademark guidelines');
    reloadData();
  };

  const handleRequestEvidence = (adId: string) => {
    store.moderateAd(
      adId,
      'pending_review',
      feedbackInput[adId] || 'Evidence of authorization or trademark ownership requested',
      true
    );
    reloadData();
  };

  const handleRemoveLive = (board: BoardType) => {
    const reason = prompt('Reason for removing live ad from spotlight:');
    if (reason) {
      store.removeLivePlacementForModeration(board, reason);
      reloadData();
    }
  };

  const compBoard = store.getBoard('companies');
  const socBoard = store.getBoard('social');

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-text">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-apple-border/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-apple-accent animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-apple-text">
                Admin Moderation & Security Console
              </h1>
            </div>
            <p className="text-xs text-apple-secondary mt-1">
              Verify destinations, enforce content guidelines, emergency takedowns, and refund reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-apple-subtle rounded-full border border-apple-border/80 text-xs">
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'moderation' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
              }`}
            >
              Moderation Queue
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'live' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
              }`}
            >
              Live Spotlights
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'refunds' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
              }`}
            >
              Refund Jobs ({refundJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'audit' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary'
              }`}
            >
              Audit Trail
            </button>
          </div>
        </div>

        {/* TAB 1: MODERATION QUEUE */}
        {activeTab === 'moderation' && (
          <div className="mt-8 space-y-4">
            <h2 className="text-base font-semibold text-apple-text">
              Creative Review Queue ({ads.length} total)
            </h2>

            <div className="bg-white rounded-3xl border border-apple-border/80 overflow-hidden shadow-apple-sm divide-y divide-apple-border/60">
              {ads.map((ad) => (
                <div key={ad.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-5 text-xs">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-apple-subtle border border-apple-border/60 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-apple-text text-sm truncate">{ad.title}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-apple-subtle capitalize border border-apple-border/50">
                          {ad.board} {ad.platform ? `• ${ad.platform}` : ''}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                            ad.moderationStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ad.moderationStatus === 'rejected'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ad.moderationStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-apple-secondary mt-1">{ad.tagline}</p>

                      <div className="mt-2 p-2 rounded-xl bg-apple-subtle/80 border border-apple-border/60 text-[11px] font-mono break-all text-apple-text">
                        Destination: {ad.destinationUrl}
                      </div>

                      {ad.moderatorFeedback && (
                        <div className="mt-2 text-[11px] text-apple-secondary italic">
                          Feedback: &ldquo;{ad.moderatorFeedback}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col gap-2 w-full md:w-64 flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Moderator feedback note..."
                      value={feedbackInput[ad.id] || ''}
                      onChange={(e) =>
                        setFeedbackInput({ ...feedbackInput, [ad.id]: e.target.value })
                      }
                      className="px-3 py-1.5 rounded-xl bg-apple-subtle border border-apple-border text-xs"
                    />

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => handleApprove(ad.id)}
                        className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-center flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(ad.id)}
                        className="py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-center flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleRequestEvidence(ad.id)}
                        className="py-1.5 px-2 rounded-xl bg-apple-subtle hover:bg-apple-border text-apple-text font-medium text-center flex items-center justify-center gap-1 border border-apple-border"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>Evidence</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE BILLBOARD SPOTLIGHTS & EMERGENCY REMOVAL */}
        {activeTab === 'live' && (
          <div className="mt-8 space-y-6">
            <h2 className="text-base font-semibold text-apple-text">
              Active Spotlight Controls & Vacant Spotlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Companies Spotlight */}
              <div className="p-6 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-apple-text text-sm">Companies Spotlight</span>
                  <span className="text-xs text-apple-secondary font-mono">
                    Floor: ₹{(compBoard.lastActivatedAmountPaise / 100).toFixed(0)}
                  </span>
                </div>

                {compBoard.currentPlacement ? (
                  <div className="p-4 rounded-2xl bg-apple-subtle border border-apple-border space-y-2 text-xs">
                    <div className="font-semibold text-apple-text">
                      {compBoard.currentPlacement.adRevision.title}
                    </div>
                    <div className="text-apple-secondary">
                      {compBoard.currentPlacement.adRevision.tagline}
                    </div>
                    <div className="text-[11px] text-apple-tertiary">
                      Advertiser ID: {compBoard.currentPlacement.advertiserId}
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleRemoveLive('companies')}
                        className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Emergency Removal (Leaves Spotlight Vacant)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-center text-xs">
                    Spotlight is currently vacant. Next takeover must exceed ₹
                    {(compBoard.lastActivatedAmountPaise / 100).toFixed(0)}.
                  </div>
                )}
              </div>

              {/* Social Spotlight */}
              <div className="p-6 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-apple-text text-sm">Social Spotlight</span>
                  <span className="text-xs text-apple-secondary font-mono">
                    Floor: ₹{(socBoard.lastActivatedAmountPaise / 100).toFixed(0)}
                  </span>
                </div>

                {socBoard.currentPlacement ? (
                  <div className="p-4 rounded-2xl bg-apple-subtle border border-apple-border space-y-2 text-xs">
                    <div className="font-semibold text-apple-text">
                      {socBoard.currentPlacement.adRevision.title}
                    </div>
                    <div className="text-apple-secondary">
                      {socBoard.currentPlacement.adRevision.tagline}
                    </div>
                    <div className="text-[11px] text-apple-tertiary">
                      Advertiser ID: {socBoard.currentPlacement.advertiserId}
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleRemoveLive('social')}
                        className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Emergency Removal (Leaves Spotlight Vacant)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-center text-xs">
                    Spotlight is currently vacant. Next takeover must exceed ₹
                    {(socBoard.lastActivatedAmountPaise / 100).toFixed(0)}.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REFUND JOBS */}
        {activeTab === 'refunds' && (
          <div className="mt-8 space-y-4">
            <h2 className="text-base font-semibold text-apple-text">
              Durable Refund Jobs & Reconciliation ({refundJobs.length})
            </h2>

            <div className="bg-white rounded-3xl border border-apple-border/80 overflow-hidden shadow-apple-sm">
              {refundJobs.length > 0 ? (
                <div className="divide-y divide-apple-border/60 text-xs">
                  {refundJobs.map((rf) => (
                    <div key={rf.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-apple-text">{rf.advertiserName}</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {rf.reason.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-emerald-600">
                            {rf.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-apple-secondary mt-0.5 font-mono">
                          Refund ID: {rf.id} • Order: {rf.orderId}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-semibold text-apple-text tabular-nums">
                          ₹{(rf.amountPaise / 100).toFixed(2)}
                        </span>
                        <span className="block text-[10px] text-emerald-600 font-medium">Reconciled</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-apple-secondary">
                  No pending refund jobs. All captured transactions are reconciled.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="mt-8 space-y-4">
            <h2 className="text-base font-semibold text-apple-text">
              Immutable Event Audit Log
            </h2>

            <div className="bg-white rounded-3xl border border-apple-border/80 overflow-hidden shadow-apple-sm">
              <div className="divide-y divide-apple-border/60 text-xs font-mono">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-apple-subtle/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-apple-accent">{log.action}</span>
                        <span className="text-apple-secondary">by {log.actor}</span>
                      </div>
                      <p className="text-apple-text font-sans text-xs mt-1">{log.details}</p>
                    </div>
                    <span className="text-[11px] text-apple-tertiary flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

