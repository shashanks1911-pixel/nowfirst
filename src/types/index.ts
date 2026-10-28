export type BoardType = 'companies' | 'social';

export type SocialPlatform = 'instagram' | 'x' | 'facebook' | 'linkedin';

export type ModerationStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended';

export type PlacementStatus = 'active' | 'outbid' | 'moderation_removed' | 'campaign_active';

export type CampaignTier = 'standard' | 'spotlight_upgrade' | 'partner_bundle';

export type CampaignObjective =
  | 'trial_signups'
  | 'qualified_leads'
  | 'purchases'
  | 'awareness'
  | 'profile_discovery'
  | 'newsletter_subscribers';

export type PaymentStatus =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'activation_succeeded'
  | 'activation_failed_refund_pending'
  | 'refund_pending'
  | 'refunded'
  | 'refund_attention_required'
  | 'failed';

export interface FounderPerk {
  title: string; // e.g. "Extended 45-Day Pro Trial" or "₹10,000 Cloud Credits"
  description: string;
  promoCode?: string;
  claimUrl?: string;
}

export interface AdCreative {
  id: string;
  advertiserId: string;
  advertiserName: string;
  advertiserEmail: string;
  board: BoardType;
  title: string; // Company Name or Creator Display Name
  tagline: string; // Short description
  destinationUrl: string; // External website or profile URL
  mediaUrl: string; // Avatar / Company Logo image URL

  // Audience & Value Enhancements
  targetAudience: string; // e.g. "Indian SaaS Founders & Engineers"
  objective: CampaignObjective;
  founderPerk?: FounderPerk; // Immediate utility for visitors
  qualityScore: number; // 1-10 rating based on relevance & offer value

  // Companies specific
  category?: string;
  displayDomain?: string;

  // Social specific
  platform?: SocialPlatform;
  handleOrIdentifier?: string; // @handle or Page name / headline

  // Moderation & Snapshot
  ownershipAttested: boolean;
  moderationStatus: ModerationStatus;
  moderatorFeedback?: string;
  evidenceRequested?: boolean;
  revisionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface Placement {
  id: string;
  board: BoardType;
  adId: string;
  adRevision: AdCreative;
  advertiserId: string;
  advertiserName: string;
  campaignTier: CampaignTier;
  amountPaise: number; // Stored in integer paise (₹100 = 10000 paise)
  status: PlacementStatus;
  isLive: boolean; // True if occupying the #1 live hero spotlight
  campaignActiveUntil: string; // End date of dependable standard campaign
  activatedAt: string;
  endedAt?: string;

  // Performance & Attribution Metrics
  impressionsCount: number;
  clicksCount: number;
  spotlightClicksCount: number;
  directoryClicksCount: number;
  partnerClicksCount: number;
  conversionsCount: number; // Trial signups, demo leads, purchases
  historyClicksCount: number;

  // Distribution Channels
  distributionChannels: string[];
}

export interface WeeklyRound {
  id: string;
  roundNumber: number;
  name: string; // e.g. "Round 14: Oct 28 – Nov 4"
  board: BoardType;
  startDate: string;
  endDate: string;
  basePricePaise: number; // ₹100 base
  isActive: boolean;
  winnerPlacementId?: string;
}

export interface BoardState {
  id: BoardType;
  title: string;
  currentRound: WeeklyRound;
  minInitialAmountPaise: number; // e.g. 10000 paise (₹100)
  minIncrementPaise: number; // e.g. 100 paise (₹1)
  lastActivatedAmountPaise: number;
  currentPlacement: Placement | null; // Currently occupying live #1 spotlight
  activeCampaigns: Placement[]; // Dependable listings running for their 7/14 day period
  history: Placement[]; // Historical placements
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string; // Razorpay order id or simulated
  paymentId?: string; // Razorpay payment id
  advertiserId: string;
  advertiserName: string;
  advertiserEmail: string;
  board: BoardType;
  campaignTier: CampaignTier;
  objective: CampaignObjective;
  adId: string;
  adTitle: string;
  amountPaise: number;
  currency: string;
  status: PaymentStatus;
  failureReason?: string;
  refundJobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundJob {
  id: string;
  paymentId: string;
  orderId: string;
  advertiserName: string;
  amountPaise: number;
  reason: 'outbid_race_condition' | 'self_challenge_rejected' | 'moderation_pre_activation' | 'manual_admin';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  lastError?: string;
  gatewayRefundId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutboundClickRecord {
  id: string;
  placementId: string;
  board: BoardType;
  isSpotlight: boolean;
  channel: 'spotlight' | 'directory' | 'partner_newsletter';
  platform?: SocialPlatform;
  ipHash: string;
  userAgent?: string;
  isValid: boolean;
  filterReason: 'none' | 'bot_user_agent' | 'cooldown_rate_limit' | 'prefetch';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}
