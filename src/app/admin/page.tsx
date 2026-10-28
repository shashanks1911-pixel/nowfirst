'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

const DEFAULT_MASTER_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'nowfirst_admin_2026';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Change PIN Modal
  const [isChangePinOpen, setIsChangePinOpen] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinChangeMessage, setPinChangeMessage] = useState<string>('');

  // Console Data State
  const [ads, setAds] = useState<AdCreative[]>([]);
  const [refundJobs, setRefundJobs] = useState<RefundJob[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'moderation' | 'live' | 'refunds' | 'audit'>('moderation');

  // Verify key helper
  const verifyKey = (input: string): boolean => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    const customPin = typeof window !== 'undefined' ? localStorage.getItem('nowfirst_custom_admin_pin') : null;
    return trimmed === DEFAULT_MASTER_KEY || (customPin !== null && trimmed === customPin);
  };

  // Check existing session or URL parameter ?key=... on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check existing session
    const savedAuth = sessionStorage.getItem('nowfirst_admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setAuthChecking(false);
      return;
    }

    // 2. Check URL parameter ?key=...
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get('key');
      if (urlKey && verifyKey(urlKey)) {
        sessionStorage.setItem('nowfirst_admin_authenticated', 'true');
        setIsAuthenticated(true);
        // Strip the key parameter from the URL bar cleanly
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    } catch {
      // Ignored in SSR
    }

    setAuthChecking(false);
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setAuthError('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Reload data when authenticated
  const reloadData = () => {
    setAds(store.getAds());
    setRefundJobs(store.getRefundJobs());
    setAuditLogs(store.getAuditLogs());
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    reloadData();
    const unsub = store.subscribe(() => reloadData());
    return () => unsub();
  }, [isAuthenticated]);

  // Handle Authentication Submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil && Date.now() < lockoutUntil) {
      return;
    }

    if (verifyKey(passcodeInput)) {
      sessionStorage.setItem('nowfirst_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      setFailedAttempts(0);
      setPasscodeInput('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 30000; // 30 seconds
        setLockoutUntil(lockoutTime);
        setLockoutRemaining(30);
        setAuthError('Too many failed attempts. Security lockout active for 30 seconds.');
      } else {
        setAuthError(`Invalid administrative passkey. (${5 - newAttempts} attempts remaining)`);
      }
    }
  };

  // Sign out / Lock console
  const handleSignOut = () => {
    sessionStorage.removeItem('nowfirst_admin_authenticated');
    setIsAuthenticated(false);
    setPasscodeInput('');
    setAuthError('');
  };

  // Save new custom PIN
  const handleSaveCustomPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 6) {
      setPinChangeMessage('Passkey must be at least 6 characters long.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMessage('Passkeys do not match.');
      return;
    }

    localStorage.setItem('nowfirst_custom_admin_pin', newPin);
    setPinChangeMessage('Passkey successfully updated!');
    setTimeout(() => {
      setIsChangePinOpen(false);
      setNewPin('');
      setConfirmPin('');
      setPinChangeMessage('');
    }, 1500);
  };

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

  // Prevent flicker during initial check
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-bg text-apple-secondary text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-apple-accent animate-ping" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // GATE: RESTRICTED ACCESS SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-apple-bg text-apple-text">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-white rounded-3xl border border-apple-border/80 shadow-apple-card p-6 sm:p-8 text-center space-y-6">
            {/* Lock Icon */}
            <div className="w-14 h-14 rounded-2xl bg-apple-subtle border border-apple-border/70 flex items-center justify-center text-apple-accent mx-auto shadow-apple-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-apple-text">
                Admin Access Restricted
              </h1>
              <p className="text-xs sm:text-sm text-apple-secondary mt-1.5 max-w-xs mx-auto">
                This moderation and security console is reserved exclusively for the site owner.
              </p>
            </div>

            {/* Passkey Input Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-apple-secondary mb-1.5">
                  Administrative Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin passkey..."
                    value={passcodeInput}
                    disabled={Boolean(lockoutUntil)}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-apple-subtle border border-apple-border focus:border-apple-accent focus:bg-white text-sm outline-none transition-all pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-tertiary hover:text-apple-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {authError}
                    {lockoutRemaining > 0 && ` (${lockoutRemaining}s)`}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={Boolean(lockoutUntil) || !passcodeInput.trim()}
                className="w-full py-2.5 rounded-full bg-apple-accent hover:bg-apple-accentHover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-all shadow-apple-sm flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Console</span>
              </button>
            </form>

            <div className="pt-2 border-t border-apple-border/50 flex flex-col gap-2">
              <div className="text-[11px] text-apple-tertiary">
                Default project key: <code className="bg-apple-subtle px-1.5 py-0.5 rounded font-mono text-apple-secondary">nowfirst_admin_2026</code>
              </div>
              <div>
                <Link
                  href="/companies"
                  className="inline-flex items-center gap-1 text-xs text-apple-secondary hover:text-apple-text transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Live Billboard</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // AUTHENTICATED: FULL ADMIN CONSOLE
  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-text">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Admin Header with Verified Status & Lock Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-apple-border/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-apple-text">
                Admin Moderation & Security Console
              </h1>
            </div>
            <p className="text-xs text-apple-secondary mt-1">
              Verify destinations, enforce content guidelines, emergency takedowns, and refund reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Owner Verified</span>
            </span>

            <button
              onClick={() => setIsChangePinOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-apple-subtle hover:bg-apple-border text-apple-text text-xs font-medium border border-apple-border transition-colors shadow-apple-sm"
            >
              <KeyRound className="w-3.5 h-3.5 text-apple-secondary" />
              <span>Change Passkey</span>
            </button>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-apple-subtle hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-apple-secondary text-xs font-medium border border-apple-border transition-colors shadow-apple-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock & Sign Out</span>
            </button>
          </div>
        </div>

        {/* Change PIN Modal */}
        {isChangePinOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-apple-card border border-apple-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm text-apple-text">
                  <KeyRound className="w-4 h-4 text-apple-accent" />
                  <span>Update Admin Passkey</span>
                </div>
                <button
                  onClick={() => setIsChangePinOpen(false)}
                  className="text-apple-tertiary hover:text-apple-secondary text-xs"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCustomPin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-apple-secondary mb-1">New Passkey (min 6 chars)</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new passkey..."
                    className="w-full px-3 py-2 rounded-xl bg-apple-subtle border border-apple-border font-mono text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-apple-secondary mb-1">Confirm New Passkey</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Confirm new passkey..."
                    className="w-full px-3 py-2 rounded-xl bg-apple-subtle border border-apple-border font-mono text-xs outline-none"
                  />
                </div>

                {pinChangeMessage && (
                  <div className={`p-2 rounded-lg text-xs ${pinChangeMessage.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {pinChangeMessage}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePinOpen(false)}
                    className="px-3 py-1.5 rounded-full text-apple-secondary hover:text-apple-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white font-medium"
                  >
                    Save Passkey
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center gap-1.5 p-1 bg-apple-subtle rounded-full border border-apple-border/80 text-xs w-fit">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'moderation' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            Moderation Queue
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'live' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            Live Spotlights
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'refunds' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            Refund Jobs ({refundJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-white shadow-apple-pill text-apple-text' : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            Audit Trail
          </button>
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
