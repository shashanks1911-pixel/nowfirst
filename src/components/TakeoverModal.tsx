'use client';

import React, { useState } from 'react';
import { BoardType, SocialPlatform, AdCreative, CampaignTier, CampaignObjective } from '@/types';
import { validateAndNormalizeSocialUrl, validateCompanyWebsiteUrl } from '@/lib/socialUrlNormalizer';
import { store, TakeoverResult } from '@/lib/store';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Gift,
  Target,
  Layers,
  ArrowRight,
  Info,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TakeoverModalProps {
  initialBoard: BoardType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: TakeoverResult) => void;
}

export function TakeoverModal({
  initialBoard,
  isOpen,
  onClose,
  onSuccess,
}: TakeoverModalProps) {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [step, setStep] = useState<'tier' | 'creative' | 'attestation' | 'bidding' | 'checkout' | 'result'>('tier');

  // Package & Objectives
  const [campaignTier, setCampaignTier] = useState<CampaignTier>('spotlight_upgrade');
  const [objective, setObjective] = useState<CampaignObjective>(
    initialBoard === 'companies' ? 'trial_signups' : 'profile_discovery'
  );

  // Creative form fields
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [category, setCategory] = useState('Developer Tools');
  const [targetAudience, setTargetAudience] = useState('Indian SaaS Founders & Tech Teams');
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>('x');
  const [handleOrId, setHandleOrId] = useState('');
  const [normalizedUrl, setNormalizedUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  // Founder Perk (Visitor Value)
  const [perkTitle, setPerkTitle] = useState('Extended 30-Day Free Trial');
  const [perkDescription, setPerkDescription] = useState('Exclusive extended trial plus ₹5,000 initial billing credit.');
  const [perkCode, setPerkCode] = useState('NOWFIRST30');

  // Ownership & Account
  const [ownershipAttested, setOwnershipAttested] = useState(false);
  const [advertiserName, setAdvertiserName] = useState('Kavita Nair');
  const [advertiserEmail, setAdvertiserEmail] = useState('kavita@indiefounders.in');

  // Created Ad State
  const [createdAd, setCreatedAd] = useState<AdCreative | null>(null);

  // Bidding & Payment
  const minRequiredPaise = store.getMinRequiredAmountPaise(board);
  const minRequiredRupees = Math.round(minRequiredPaise / 100);

  // Dynamic default amount depending on package
  const defaultAmount = campaignTier === 'standard' ? 499 : campaignTier === 'partner_bundle' ? 1499 : minRequiredRupees;
  const [bidRupees, setBidRupees] = useState<number>(defaultAmount);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [takeoverResult, setTakeoverResult] = useState<TakeoverResult | null>(null);

  if (!isOpen) return null;

  // Step 1: Validate Creative and Destination
  const handleValidateCreative = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() || !tagline.trim() || !urlInput.trim()) {
      setValidationError('Please fill in all required creative fields.');
      return;
    }

    if (board === 'social') {
      const result = validateAndNormalizeSocialUrl(urlInput, socialPlatform);
      if (!result.isValid || !result.normalizedUrl) {
        setValidationError(result.errorMessage || 'Invalid social profile URL.');
        return;
      }
      setNormalizedUrl(result.normalizedUrl);
      setHandleOrId(result.handleOrIdentifier || '');
    } else {
      const result = validateCompanyWebsiteUrl(urlInput);
      if (!result.isValid || !result.normalizedUrl) {
        setValidationError(result.errorMessage || 'Invalid company website URL.');
        return;
      }
      setNormalizedUrl(result.normalizedUrl);
    }

    if (!mediaUrl.trim()) {
      if (board === 'companies') {
        setMediaUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80');
      } else {
        setMediaUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
      }
    }

    setStep('attestation');
  };

  // Step 2: Confirm Ownership Attestation & Quality Gate Review
  const handleConfirmAttestation = () => {
    if (!ownershipAttested) {
      setValidationError('You must attest ownership or authorization before submitting.');
      return;
    }

    // Submit ad to store
    const newAd = store.createAdCreative({
      advertiserId: `adv_${advertiserName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'guest'}`,
      advertiserName: advertiserName.trim() || 'Advertiser',
      advertiserEmail: advertiserEmail.trim() || 'advertiser@example.com',
      board,
      title: title.trim(),
      tagline: tagline.trim(),
      destinationUrl: normalizedUrl,
      mediaUrl: mediaUrl.trim(),
      targetAudience: targetAudience.trim() || 'Indian Founders & Small Teams',
      objective,
      founderPerk: perkTitle.trim()
        ? {
            title: perkTitle.trim(),
            description: perkDescription.trim(),
            promoCode: perkCode.trim() || undefined,
          }
        : undefined,
      category: board === 'companies' ? category : undefined,
      displayDomain: board === 'companies' ? new URL(normalizedUrl).hostname.replace(/^www\./, '') : undefined,
      platform: board === 'social' ? socialPlatform : undefined,
      handleOrIdentifier: board === 'social' ? handleOrId : undefined,
      ownershipAttested: true,
      moderationStatus: 'approved', // Pre-approved in demo mode
    });

    setCreatedAd(newAd);
    // Sync price default
    if (campaignTier === 'standard') setBidRupees(499);
    else if (campaignTier === 'partner_bundle') setBidRupees(1499);
    else setBidRupees(minRequiredRupees);

    setStep('bidding');
  };

  // Step 4: Execute Payment & Takeover
  const handleExecutePayment = (simulateRace: boolean = false, simulateSelfChallenge: boolean = false) => {
    if (!createdAd) return;
    setPaymentProcessing(true);

    setTimeout(() => {
      const targetAdvertiserId = simulateSelfChallenge
        ? (store.getBoard(board).currentPlacement?.advertiserId || createdAd.advertiserId)
        : createdAd.advertiserId;

      const result = store.executeTakeover({
        board,
        adCreativeId: createdAd.id,
        campaignTier,
        amountPaise: Math.round(bidRupees * 100),
        advertiserId: targetAdvertiserId,
        advertiserName: createdAd.advertiserName,
        advertiserEmail: createdAd.advertiserEmail,
        simulateOutbidRace: simulateRace,
      });

      setPaymentProcessing(false);
      setTakeoverResult(result);
      setStep('result');

      if (result.success) {
        try {
          confetti({
            particleCount: 65,
            spread: 55,
            origin: { y: 0.6 },
            colors: ['#0071E3', '#1D1D1F', '#F5F5F7'],
          });
        } catch (e) {}
        onSuccess(result);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 shadow-apple-float border border-apple-border text-left my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-apple-border/70">
          <div>
            <h3 className="text-lg font-semibold text-apple-text">
              {step === 'tier'
                ? 'Choose Campaign Structure'
                : step === 'checkout'
                ? 'Test-Mode Checkout'
                : step === 'result'
                ? 'Placement Confirmation'
                : 'Configure Your Campaign'}
            </h3>
            <p className="text-xs text-apple-secondary mt-0.5">
              Audience: Indian Founders & Small Teams • Currency INR (₹)
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-apple-subtle text-apple-secondary hover:text-apple-text flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-3 rounded-2xl bg-apple-dangerSubtle border border-apple-danger/20 text-xs text-apple-danger flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 0: CAMPAIGN TIER SELECTION (Dependable vs Spotlight Upgrade) */}
        {step === 'tier' && (
          <div className="mt-5 space-y-4 text-xs">
            <div className="space-y-3">
              <span className="block font-semibold text-apple-text text-sm">
                Select Distribution Package:
              </span>

              {/* Tier 1: Standard Campaign (The Dependable Baseline) */}
              <div
                onClick={() => setCampaignTier('standard')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  campaignTier === 'standard'
                    ? 'border-apple-accent bg-apple-accentSubtle/50 shadow-apple-sm ring-1 ring-apple-accent/20'
                    : 'border-apple-border bg-apple-subtle/50 hover:bg-apple-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-apple-accent" />
                    <span className="font-semibold text-apple-text text-sm">
                      Dependable Standard Campaign
                    </span>
                  </div>
                  <span className="font-semibold text-apple-text text-sm tabular-nums">
                    ₹499 (Flat)
                  </span>
                </div>
                <p className="text-apple-secondary mt-1 text-[11px] leading-relaxed">
                  Guaranteed <strong>7-Day Verified Listing</strong> in the Curated Founders Directory and inclusion in the <strong>Weekly Founder Digest</strong>. Full performance analytics with trial/lead tracking.
                </p>
              </div>

              {/* Tier 2: Spotlight Upgrade (Hero live position until outbid) */}
              <div
                onClick={() => setCampaignTier('spotlight_upgrade')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  campaignTier === 'spotlight_upgrade'
                    ? 'border-apple-accent bg-apple-accentSubtle/50 shadow-apple-sm ring-1 ring-apple-accent/20'
                    : 'border-apple-border bg-apple-subtle/50 hover:bg-apple-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-apple-text text-sm">
                      Standard + Spotlight Upgrade (Recommended)
                    </span>
                  </div>
                  <span className="font-semibold text-apple-text text-sm tabular-nums">
                    ₹{minRequiredRupees}+
                  </span>
                </div>
                <p className="text-apple-secondary mt-1 text-[11px] leading-relaxed">
                  Includes everything in Standard (7-day directory listing & digest) <strong>PLUS the live #1 Billboard Spotlight</strong> until outbid. <em>When outbid, your 7-day standard campaign continues uninterrupted!</em>
                </p>
              </div>

              {/* Tier 3: Partner Multi-Channel Distribution Bundle */}
              <div
                onClick={() => setCampaignTier('partner_bundle')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  campaignTier === 'partner_bundle'
                    ? 'border-apple-accent bg-apple-accentSubtle/50 shadow-apple-sm ring-1 ring-apple-accent/20'
                    : 'border-apple-border bg-apple-subtle/50 hover:bg-apple-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-apple-text text-sm">
                      Partner Multi-Channel Bundle
                    </span>
                  </div>
                  <span className="font-semibold text-apple-text text-sm tabular-nums">
                    ₹1,499
                  </span>
                </div>
                <p className="text-apple-secondary mt-1 text-[11px] leading-relaxed">
                  Single booking covers 3 destinations: NowFirst Web Directory, Spotlight eligibility, and dedicated sponsor placement in <strong>&ldquo;The Indian Founder Stack&rdquo; newsletter (12,500+ subscribers)</strong>.
                </p>
              </div>
            </div>

            {/* Campaign Objective Selection */}
            <div className="pt-2">
              <label className="block font-medium text-apple-text mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-apple-accent" />
                <span>Primary Campaign Objective</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'trial_signups', label: 'Extended Trials / Signups' },
                  { id: 'qualified_leads', label: 'B2B Demo Leads' },
                  { id: 'purchases', label: 'Direct Purchases' },
                  { id: 'awareness', label: 'Founder Discovery' },
                ].map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setObjective(obj.id as CampaignObjective)}
                    className={`py-2 px-3 rounded-xl text-left border text-xs transition-all ${
                      objective === obj.id
                        ? 'border-apple-accent bg-apple-accentSubtle text-apple-text font-semibold'
                        : 'border-apple-border/70 bg-apple-subtle text-apple-secondary hover:text-apple-text'
                    }`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep('creative')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-medium shadow-apple-sm transition-all"
              >
                <span>Continue to Creative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: CREATIVE FORM & PERK ENTRY */}
        {step === 'creative' && (
          <form onSubmit={handleValidateCreative} className="mt-5 space-y-4 text-xs">
            {/* Board Selector */}
            <div>
              <label className="block font-medium text-apple-text mb-1">Destination Board</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-apple-subtle rounded-2xl border border-apple-border/70">
                <button
                  type="button"
                  onClick={() => setBoard('companies')}
                  className={`py-2 rounded-xl font-medium transition-all ${
                    board === 'companies'
                      ? 'bg-white shadow-apple-pill text-apple-text'
                      : 'text-apple-secondary hover:text-apple-text'
                  }`}
                >
                  Companies & Software
                </button>
                <button
                  type="button"
                  onClick={() => setBoard('social')}
                  className={`py-2 rounded-xl font-medium transition-all ${
                    board === 'social'
                      ? 'bg-white shadow-apple-pill text-apple-text'
                      : 'text-apple-secondary hover:text-apple-text'
                  }`}
                >
                  Social Profiles & Pages
                </button>
              </div>
            </div>

            {/* Platform Selection for Social */}
            {board === 'social' && (
              <div>
                <label className="block font-medium text-apple-text mb-1">Social Platform</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['x', 'instagram', 'facebook', 'linkedin'] as SocialPlatform[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSocialPlatform(p)}
                      className={`py-2 rounded-xl text-center capitalize border font-medium transition-all ${
                        socialPlatform === p
                          ? 'border-apple-accent bg-apple-accentSubtle text-apple-accent font-semibold'
                          : 'border-apple-border/70 bg-apple-subtle text-apple-secondary hover:text-apple-text'
                      }`}
                    >
                      {p === 'x' ? 'X' : p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* URL Input */}
            <div>
              <label className="block font-medium text-apple-text mb-1">
                {board === 'companies' ? 'Website URL (HTTPS)' : 'Profile / Page URL'}
              </label>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={
                  board === 'companies'
                    ? 'https://yourstartup.in'
                    : socialPlatform === 'x'
                    ? 'https://x.com/yourhandle'
                    : 'https://instagram.com/yourhandle'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-subtle/70 border border-apple-border/80 text-apple-text focus:bg-white focus:border-apple-accent transition-colors font-mono"
              />
            </div>

            {/* Title / Name */}
            <div>
              <label className="block font-medium text-apple-text mb-1">
                {board === 'companies' ? 'Company / Product Name' : 'Creator Display Name'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pulse MicroVM Cloud"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-subtle/70 border border-apple-border/80 text-apple-text focus:bg-white focus:border-apple-accent transition-colors"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block font-medium text-apple-text mb-1">
                High-Impact One-Liner (Max 140 chars)
              </label>
              <textarea
                rows={2}
                maxLength={140}
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Firecracker MicroVMs provisioned in under 150ms on Delhi and Bengaluru datacenters..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-subtle/70 border border-apple-border/80 text-apple-text focus:bg-white focus:border-apple-accent transition-colors resize-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block font-medium text-apple-text mb-1">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Indian DevOps & Backend Engineers"
                className="w-full px-3.5 py-2 rounded-xl bg-apple-subtle/70 border border-apple-border/80 text-apple-text focus:bg-white focus:border-apple-accent transition-colors"
              />
            </div>

            {/* VISITOR VALUE: Exclusive Founder Perk / Offer */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/60 border border-blue-200 space-y-2.5">
              <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                <Gift className="w-3.5 h-3.5 text-blue-600" />
                <span>Exclusive Founder Perk (Reason for Visitors to Convert)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-blue-900 font-medium">Perk Headline</label>
                  <input
                    type="text"
                    value={perkTitle}
                    onChange={(e) => setPerkTitle(e.target.value)}
                    placeholder="e.g. ₹10,000 Free Cloud Credits"
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-apple-text text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-blue-900 font-medium">Promo Code</label>
                  <input
                    type="text"
                    value={perkCode}
                    onChange={(e) => setPerkCode(e.target.value)}
                    placeholder="e.g. FOUNDERINDIA"
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-apple-text text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-blue-900 font-medium">Perk Description</label>
                <input
                  type="text"
                  value={perkDescription}
                  onChange={(e) => setPerkDescription(e.target.value)}
                  placeholder="e.g. Extended 30-day trial with full API access for Indian startups."
                  className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-apple-text text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('tier')}
                className="px-4 py-2 rounded-full border border-apple-border text-apple-secondary hover:text-apple-text text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-medium shadow-apple-sm transition-all"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW & ATTESTATION */}
        {step === 'attestation' && (
          <div className="mt-5 space-y-5 text-xs">
            <div>
              <h4 className="font-semibold text-apple-text text-sm mb-2">Review Card & Perk Preview</h4>
              <div className="p-4 rounded-3xl bg-apple-subtle/70 border border-apple-border/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-apple-subtle border border-apple-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl} alt={title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-apple-text text-sm truncate block">{title}</span>
                    <span className="text-xs text-apple-secondary">{tagline}</span>
                  </div>
                </div>

                {perkTitle && (
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold">{perkTitle}</span>
                    </div>
                    {perkCode && <span className="font-mono text-[11px] font-bold">{perkCode}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Ownership Attestation & Deliverables SLA */}
            <div className="p-4 rounded-2xl bg-apple-subtle/80 border border-apple-border/70 space-y-3">
              <div className="flex items-start gap-2.5">
                <input
                  id="attestation-checkbox-v2"
                  type="checkbox"
                  checked={ownershipAttested}
                  onChange={(e) => setOwnershipAttested(e.target.checked)}
                  className="mt-0.5 rounded border-apple-border text-apple-accent focus:ring-apple-accent"
                />
                <label htmlFor="attestation-checkbox-v2" className="text-xs text-apple-text leading-relaxed select-none">
                  <strong>Ownership Attestation & Deliverables SLA:</strong> I confirm that I own or am authorized to promote this brand. I acknowledge that I receive a guaranteed minimum 7-day Curated Directory listing. If outbid from the live spotlight, my standard directory campaign continues running until expiry. If any service underdelivery occurs, a prorated refund or campaign extension is guaranteed.
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-apple-border/50">
                <div>
                  <label className="block text-[11px] text-apple-secondary">Advertiser Name</label>
                  <input
                    type="text"
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-apple-border/80 text-apple-text text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-apple-secondary">Receipt & Leads Email</label>
                  <input
                    type="email"
                    value={advertiserEmail}
                    onChange={(e) => setAdvertiserEmail(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-apple-border/80 text-apple-text text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('creative')}
                className="px-4 py-2 rounded-full border border-apple-border text-apple-secondary hover:text-apple-text text-xs"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmAttestation}
                disabled={!ownershipAttested}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-accent hover:bg-apple-accentHover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium shadow-apple-sm transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BIDDING & CHECKOUT */}
        {step === 'bidding' && (
          <div className="mt-5 space-y-4 text-xs">
            {campaignTier === 'spotlight_upgrade' ? (
              <div>
                <label className="block font-medium text-apple-text mb-1">
                  Spotlight Upgrade Placement Amount (INR ₹)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-apple-text">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={minRequiredRupees}
                      step={1}
                      value={bidRupees}
                      onChange={(e) => setBidRupees(Math.max(minRequiredRupees, parseInt(e.target.value, 10) || minRequiredRupees))}
                      className="w-full pl-8 pr-4 py-2.5 text-base font-semibold text-apple-text rounded-xl bg-apple-subtle border border-apple-border focus:bg-white focus:border-apple-accent transition-colors tabular-nums"
                    />
                  </div>
                  <div className="text-right flex-shrink-0 text-[11px] text-apple-secondary">
                    <span>Min to take spotlight:</span>
                    <div className="font-semibold text-apple-text tabular-nums">₹{minRequiredRupees.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-apple-subtle border border-apple-border flex justify-between items-center">
                <div>
                  <span className="font-semibold text-apple-text block">
                    {campaignTier === 'partner_bundle' ? 'Partner Multi-Channel Bundle' : 'Dependable Standard Campaign'}
                  </span>
                  <span className="text-[11px] text-apple-secondary">Fixed 7-day distribution investment</span>
                </div>
                <span className="text-lg font-bold text-apple-text tabular-nums">
                  ₹{bidRupees.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Itemized Total */}
            <div className="p-3.5 rounded-2xl bg-apple-subtle/80 border border-apple-border/70 space-y-1.5">
              <div className="flex justify-between text-apple-secondary">
                <span>Placement Package</span>
                <span className="font-medium text-apple-text capitalize">{campaignTier.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-apple-secondary">
                <span>Primary Objective</span>
                <span className="font-medium text-apple-text capitalize">{objective.replace('_', ' ')}</span>
              </div>
              <div className="pt-1.5 border-t border-apple-border/50 flex justify-between font-semibold text-apple-text text-sm">
                <span>Total Payable</span>
                <span className="tabular-nums">₹{bidRupees.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Test Simulation Buttons */}
            <div className="space-y-2 pt-1">
              <span className="block font-medium text-apple-text text-xs">Simulate Razorpay Test Payment:</span>

              {/* Standard Success */}
              <button
                type="button"
                disabled={paymentProcessing}
                onClick={() => handleExecutePayment(false, false)}
                className="w-full py-3 px-4 rounded-2xl bg-apple-accent hover:bg-apple-accentHover active:bg-apple-accentActive text-white text-xs font-semibold shadow-apple-sm transition-all flex items-center justify-between disabled:opacity-50"
              >
                <span>Pay ₹{bidRupees.toLocaleString('en-IN')} & Launch Campaign (Standard Success)</span>
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Concurrent Outbid Race */}
              {campaignTier === 'spotlight_upgrade' && (
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => handleExecutePayment(true, false)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-apple-subtle hover:bg-apple-border text-apple-text text-xs font-medium border border-apple-border transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <div className="text-left">
                    <span className="font-semibold block">Simulate Concurrent Outbid Race</span>
                    <span className="text-[11px] text-apple-secondary block">
                      Tests higher competitor activating first → verifies auto-refund & zero history entry
                    </span>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </button>
              )}
            </div>

            {paymentProcessing && (
              <div className="p-3 text-center text-xs text-apple-secondary flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-apple-accent animate-ping" />
                <span>Securing atomic database lock and validating order...</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: RESULT */}
        {step === 'result' && takeoverResult && (
          <div className="mt-5 space-y-4 text-xs">
            {takeoverResult.success ? (
              <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-semibold text-emerald-950">Campaign Activated!</h4>
                <p className="text-emerald-800 text-xs leading-relaxed max-w-sm mx-auto">
                  {takeoverResult.message}
                </p>
                <div className="pt-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full bg-apple-text hover:bg-black text-white text-xs font-medium shadow-apple-sm transition-colors"
                  >
                    View Live Billboard & Directory
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 text-center space-y-2">
                <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
                <h4 className="text-base font-semibold text-amber-950">
                  {takeoverResult.code === 'OUTBID_RACE_CONDITION'
                    ? 'Payment Out-Raced: Full Refund Processed'
                    : 'Takeover Rejected: Automatic Refund'}
                </h4>
                <p className="text-amber-800 text-xs leading-relaxed max-w-sm mx-auto">
                  {takeoverResult.message}
                </p>
                <div className="pt-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full bg-apple-text hover:bg-black text-white text-xs font-medium shadow-apple-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
