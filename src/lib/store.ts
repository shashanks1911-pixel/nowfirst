import type {
  BoardType,
  BoardState,
  Placement,
  AdCreative,
  PaymentRecord,
  RefundJob,
  AuditLog,
  OutboundClickRecord,
  SocialPlatform,
  CampaignTier,
  CampaignObjective,
  WeeklyRound,
  FounderPerk,
} from '../types/index.ts';

// Initial Seed Data: Companies (Software & Infrastructure for Indian Founders & Small Teams)
const INITIAL_COMPANIES_LIVE_AD: AdCreative = {
  id: 'ad_comp_live_01',
  advertiserId: 'adv_apex_01',
  advertiserName: 'Apex Studio India',
  advertiserEmail: 'founders@apexstudio.design',
  board: 'companies',
  title: 'Apex Design Engine',
  tagline: 'Precision React and Tailwind component libraries built for Indian SaaS and fintech teams.',
  destinationUrl: 'https://apexstudio.design',
  displayDomain: 'apexstudio.design',
  category: 'Design & Frontend',
  targetAudience: 'Indian SaaS Founders & Frontend Engineers',
  objective: 'trial_signups',
  founderPerk: {
    title: 'Extended 45-Day Pro Trial',
    description: 'Complimentary full access to all 250+ enterprise components and Figma tokens.',
    promoCode: 'NOWFIRST45',
    claimUrl: 'https://apexstudio.design/redeem?code=NOWFIRST45',
  },
  qualityScore: 9.4,
  mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  ownershipAttested: true,
  moderationStatus: 'approved',
  revisionNumber: 1,
  createdAt: '2026-10-28T02:00:00Z',
  updatedAt: '2026-10-28T02:00:00Z',
};

const INITIAL_COMPANIES_LIVE_PLACEMENT: Placement = {
  id: 'plc_comp_live_01',
  board: 'companies',
  adId: INITIAL_COMPANIES_LIVE_AD.id,
  adRevision: INITIAL_COMPANIES_LIVE_AD,
  advertiserId: INITIAL_COMPANIES_LIVE_AD.advertiserId,
  advertiserName: INITIAL_COMPANIES_LIVE_AD.advertiserName,
  campaignTier: 'spotlight_upgrade',
  amountPaise: 15000, // ₹150.00
  status: 'active',
  isLive: true,
  campaignActiveUntil: '2026-11-04T00:00:00Z', // 7 days dependable campaign
  activatedAt: '2026-10-28T03:30:00Z',
  impressionsCount: 1420,
  clicksCount: 84,
  spotlightClicksCount: 68,
  directoryClicksCount: 16,
  partnerClicksCount: 0,
  conversionsCount: 12, // 12 trial signups ($12.50 per acquisition)
  historyClicksCount: 0,
  distributionChannels: ['Web Hero Spotlight', 'Curated Founder Directory', 'Weekly Founder Digest'],
};

const INITIAL_COMPANIES_DIRECTORY: Placement[] = [
  {
    id: 'plc_comp_dir_03',
    board: 'companies',
    adId: 'ad_comp_dir_03',
    adRevision: {
      id: 'ad_comp_dir_03',
      advertiserId: 'adv_chronos_03',
      advertiserName: 'Chronos Cloud Bangalore',
      advertiserEmail: 'sales@chronoscloud.io',
      board: 'companies',
      title: 'Chronos Realtime Database',
      tagline: 'Distributed time-series storage with sub-millisecond query execution on Mumbai AWS region.',
      destinationUrl: 'https://chronoscloud.io',
      displayDomain: 'chronoscloud.io',
      category: 'Developer Tools',
      targetAudience: 'Backend Engineers & CTOs',
      objective: 'trial_signups',
      founderPerk: {
        title: '₹10,000 Free Cloud Credits',
        description: 'First 6 months free for Indian startups incorporated within the last 3 years.',
        promoCode: 'CHRONOS_INDIA',
      },
      qualityScore: 9.1,
      mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
      ownershipAttested: true,
      moderationStatus: 'approved',
      revisionNumber: 1,
      createdAt: '2026-10-27T18:00:00Z',
      updatedAt: '2026-10-27T18:00:00Z',
    },
    advertiserId: 'adv_chronos_03',
    advertiserName: 'Chronos Cloud Bangalore',
    campaignTier: 'partner_bundle',
    amountPaise: 13500, // ₹135.00
    status: 'campaign_active',
    isLive: false,
    campaignActiveUntil: '2026-11-03T19:00:00Z',
    activatedAt: '2026-10-27T19:00:00Z',
    endedAt: '2026-10-28T03:30:00Z',
    impressionsCount: 2840,
    clicksCount: 142,
    spotlightClicksCount: 94,
    directoryClicksCount: 32,
    partnerClicksCount: 16,
    conversionsCount: 19,
    historyClicksCount: 24,
    distributionChannels: ['Curated Founder Directory', 'Partner Newsletter (12.5k Subscribers)', 'Weekly Founder Digest'],
  },
  {
    id: 'plc_comp_dir_02',
    board: 'companies',
    adId: 'ad_comp_dir_02',
    adRevision: {
      id: 'ad_comp_dir_02',
      advertiserId: 'adv_monolith_02',
      advertiserName: 'Monolith AI',
      advertiserEmail: 'team@monolith.ai',
      board: 'companies',
      title: 'Monolith Code Auditor',
      tagline: 'Autonomous code reviews and automated Indian data compliance auditing for GitHub monorepos.',
      destinationUrl: 'https://monolith.ai',
      displayDomain: 'monolith.ai',
      category: 'Artificial Intelligence',
      targetAudience: 'Engineering Teams & Security Leads',
      objective: 'qualified_leads',
      founderPerk: {
        title: 'Free Monorepo Security Audit',
        description: 'Complete automated audit of up to 50,000 LOC with CVE vulnerability report.',
        promoCode: 'MONO_AUDIT',
      },
      qualityScore: 8.8,
      mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80',
      ownershipAttested: true,
      moderationStatus: 'approved',
      revisionNumber: 1,
      createdAt: '2026-10-27T12:00:00Z',
      updatedAt: '2026-10-27T12:00:00Z',
    },
    advertiserId: 'adv_monolith_02',
    advertiserName: 'Monolith AI',
    campaignTier: 'standard',
    amountPaise: 12000, // ₹120.00
    status: 'campaign_active',
    isLive: false,
    campaignActiveUntil: '2026-11-03T13:00:00Z',
    activatedAt: '2026-10-27T13:00:00Z',
    endedAt: '2026-10-27T19:00:00Z',
    impressionsCount: 3100,
    clicksCount: 210,
    spotlightClicksCount: 140,
    directoryClicksCount: 52,
    partnerClicksCount: 18,
    conversionsCount: 26,
    historyClicksCount: 30,
    distributionChannels: ['Curated Founder Directory', 'Weekly Founder Digest'],
  },
  {
    id: 'plc_comp_dir_01',
    board: 'companies',
    adId: 'ad_comp_dir_01',
    adRevision: {
      id: 'ad_comp_dir_01',
      advertiserId: 'adv_artisan_01',
      advertiserName: 'KwikBill Systems',
      advertiserEmail: 'hello@kwikbill.in',
      board: 'companies',
      title: 'KwikBill GST & Invoicing',
      tagline: 'Automated e-invoicing, GST filing, and recurring Razorpay mandate management for Indian startups.',
      destinationUrl: 'https://kwikbill.in',
      displayDomain: 'kwikbill.in',
      category: 'Fintech & Billing',
      targetAudience: 'Indian Founders & Finance Heads',
      objective: 'trial_signups',
      founderPerk: {
        title: '3 Months Free Invoicing',
        description: 'Zero transaction charges on the first 1,000 GST compliant invoices.',
        promoCode: 'KWIK_FOUNDER',
      },
      qualityScore: 9.2,
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      ownershipAttested: true,
      moderationStatus: 'approved',
      revisionNumber: 1,
      createdAt: '2026-10-27T08:00:00Z',
      updatedAt: '2026-10-27T08:00:00Z',
    },
    advertiserId: 'adv_artisan_01',
    advertiserName: 'KwikBill Systems',
    campaignTier: 'standard',
    amountPaise: 10000, // ₹100.00
    status: 'campaign_active',
    isLive: false,
    campaignActiveUntil: '2026-11-03T08:30:00Z',
    activatedAt: '2026-10-27T08:30:00Z',
    endedAt: '2026-10-27T13:00:00Z',
    impressionsCount: 1820,
    clicksCount: 95,
    spotlightClicksCount: 65,
    directoryClicksCount: 20,
    partnerClicksCount: 10,
    conversionsCount: 14,
    historyClicksCount: 13,
    distributionChannels: ['Curated Founder Directory', 'Weekly Founder Digest'],
  },
];

// Initial Seed Data: Social (Indian Tech Founders & Builders)
const INITIAL_SOCIAL_LIVE_AD: AdCreative = {
  id: 'ad_soc_live_01',
  advertiserId: 'adv_aarav_01',
  advertiserName: 'Aarav Sharma',
  advertiserEmail: 'aarav@buildinpublic.com',
  board: 'social',
  platform: 'x',
  handleOrIdentifier: '@aarav_builds',
  title: 'Aarav Sharma',
  tagline: 'Bootstrapping a $20k MRR developer tool from Pune. Writing weekly deep-dives on systems architecture & traction.',
  destinationUrl: 'https://x.com/aarav_builds',
  targetAudience: 'Indie Hackers & Fullstack Developers',
  objective: 'profile_discovery',
  founderPerk: {
    title: 'Free Micro-SaaS Playbook',
    description: 'Pinned resource link: The 0 to $10k MRR bootstrapping guide for Indian developers.',
  },
  qualityScore: 9.3,
  mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  ownershipAttested: true,
  moderationStatus: 'approved',
  revisionNumber: 1,
  createdAt: '2026-10-28T04:00:00Z',
  updatedAt: '2026-10-28T04:00:00Z',
};

const INITIAL_SOCIAL_LIVE_PLACEMENT: Placement = {
  id: 'plc_soc_live_01',
  board: 'social',
  adId: INITIAL_SOCIAL_LIVE_AD.id,
  adRevision: INITIAL_SOCIAL_LIVE_AD,
  advertiserId: INITIAL_SOCIAL_LIVE_AD.advertiserId,
  advertiserName: INITIAL_SOCIAL_LIVE_AD.advertiserName,
  campaignTier: 'spotlight_upgrade',
  amountPaise: 14000, // ₹140.00
  status: 'active',
  isLive: true,
  campaignActiveUntil: '2026-11-04T00:00:00Z',
  activatedAt: '2026-10-28T04:15:00Z',
  impressionsCount: 980,
  clicksCount: 62,
  spotlightClicksCount: 52,
  directoryClicksCount: 10,
  partnerClicksCount: 0,
  conversionsCount: 18,
  historyClicksCount: 0,
  distributionChannels: ['Web Hero Spotlight', 'Creator Directory', 'Weekly Founder Digest'],
};

const INITIAL_SOCIAL_DIRECTORY: Placement[] = [
  {
    id: 'plc_soc_dir_04',
    board: 'social',
    adId: 'ad_soc_dir_04',
    adRevision: {
      id: 'ad_soc_dir_04',
      advertiserId: 'adv_priya_04',
      advertiserName: 'Priya Mehta',
      advertiserEmail: 'priya@archdesign.studio',
      board: 'social',
      platform: 'instagram',
      handleOrIdentifier: '@priya.productdesign',
      title: 'Priya Mehta',
      tagline: 'Principal Product Designer at Razorpay. Sharing micro-interactions and mobile UX teardowns for Indian apps.',
      destinationUrl: 'https://instagram.com/priya.productdesign/',
      targetAudience: 'Product Designers & Startup Founders',
      objective: 'profile_discovery',
      founderPerk: {
        title: 'Free Mobile UX Audit Checklist',
        description: 'Link in bio: 40-point checklist for optimizing payment flows on UPI and Indian gateways.',
      },
      qualityScore: 9.0,
      mediaUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      ownershipAttested: true,
      moderationStatus: 'approved',
      revisionNumber: 1,
      createdAt: '2026-10-27T20:00:00Z',
      updatedAt: '2026-10-27T20:00:00Z',
    },
    advertiserId: 'adv_priya_04',
    advertiserName: 'Priya Mehta',
    campaignTier: 'standard',
    amountPaise: 13000,
    status: 'campaign_active',
    isLive: false,
    campaignActiveUntil: '2026-11-03T20:30:00Z',
    activatedAt: '2026-10-27T20:30:00Z',
    endedAt: '2026-10-28T04:15:00Z',
    impressionsCount: 1640,
    clicksCount: 110,
    spotlightClicksCount: 78,
    directoryClicksCount: 22,
    partnerClicksCount: 10,
    conversionsCount: 31,
    historyClicksCount: 16,
    distributionChannels: ['Creator Directory', 'Weekly Founder Digest'],
  },
  {
    id: 'plc_soc_dir_03',
    board: 'social',
    adId: 'ad_soc_dir_03',
    adRevision: {
      id: 'ad_soc_dir_03',
      advertiserId: 'adv_vikram_03',
      advertiserName: 'Vikram Joshi',
      advertiserEmail: 'vikram@fintech.io',
      board: 'social',
      platform: 'linkedin',
      handleOrIdentifier: 'vikram-joshi-product',
      title: 'Vikram Joshi',
      tagline: 'VP Product at FinPay. Scaling cross-border payment rails across Southeast Asia and India.',
      destinationUrl: 'https://www.linkedin.com/in/vikram-joshi-product/',
      targetAudience: 'Fintech Operators & Product Managers',
      objective: 'newsletter_subscribers',
      founderPerk: {
        title: 'Weekly Fintech Regulatory Brief',
        description: 'Fortnightly breakdown on RBI payment regulations, account aggregators, and OCEN.',
      },
      qualityScore: 8.9,
      mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      ownershipAttested: true,
      moderationStatus: 'approved',
      revisionNumber: 1,
      createdAt: '2026-10-27T14:00:00Z',
      updatedAt: '2026-10-27T14:00:00Z',
    },
    advertiserId: 'adv_vikram_03',
    advertiserName: 'Vikram Joshi',
    campaignTier: 'partner_bundle',
    amountPaise: 12000,
    status: 'campaign_active',
    isLive: false,
    campaignActiveUntil: '2026-11-03T14:45:00Z',
    activatedAt: '2026-10-27T14:45:00Z',
    endedAt: '2026-10-27T20:30:00Z',
    impressionsCount: 1450,
    clicksCount: 78,
    spotlightClicksCount: 48,
    directoryClicksCount: 18,
    partnerClicksCount: 12,
    conversionsCount: 22,
    historyClicksCount: 13,
    distributionChannels: ['Creator Directory', 'Partner Newsletter (12.5k Subscribers)', 'Weekly Founder Digest'],
  },
  {
    id: 'plc_soc_dir_02',
    board: 'social',
    adId: 'ad_soc_dir_02',
    adRevision: {
      id: 'ad_soc_dir_02',
      advertiserId: 'adv_cleanenergy_02',
      advertiserName: 'DevFolio India Hub',
      advertiserEmail: 'community@devfolio.co',
      board: 'social',
      platform: 'facebook',
      handleOrIdentifier: 'DevfolioIndia',
      title: 'Devfolio Developer Community',
      tagline: 'Connecting 150k+ software engineers, hackathons, and early-stage startup hiring across India.',
      destinationUrl: 'https://facebook.com/DevfolioIndia',
      targetAudience: 'Software Developers & Hackathon Builders',
      objective: 'profile_discovery',
      founderPerk: {
        title: 'Founder Grant Application Guide',
        description: 'Resource repository for applying to non-dilutive Web3 & Open Source developer grants.',
      },
      qualityScore: 8.7,
      mediaUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=400&q=80',
      ownershipAttested: true,
      moderationStatus: 'approved',
      revisionNumber: 1,
      createdAt: '2026-10-27T10:00:00Z',
      updatedAt: '2026-10-27T10:00:00Z',
    },
    advertiserId: 'adv_cleanenergy_02',
    advertiserName: 'DevFolio India Hub',
    campaignTier: 'standard',
    amountPaise: 11000,
    status: 'campaign_active',
    isLive: false,
    campaignActiveUntil: '2026-11-03T10:30:00Z',
    activatedAt: '2026-10-27T10:30:00Z',
    endedAt: '2026-10-27T14:45:00Z',
    impressionsCount: 920,
    clicksCount: 52,
    spotlightClicksCount: 34,
    directoryClicksCount: 12,
    partnerClicksCount: 6,
    conversionsCount: 9,
    historyClicksCount: 10,
    distributionChannels: ['Creator Directory', 'Weekly Founder Digest'],
  },
];

export interface TakeoverResult {
  success: boolean;
  code?: 'ACTIVATED' | 'OUTBID_RACE_CONDITION' | 'SELF_CHALLENGE_REJECTED' | 'INVALID_AMOUNT' | 'UNAPPROVED_CREATIVE';
  message: string;
  placement?: Placement;
  refundJob?: RefundJob;
  refundAmountPaise?: number;
}

export type StoreEvent = 'TAKEOVER' | 'OUTBID' | 'REFUND' | 'MODERATION' | 'RESET' | 'SAVED_CHANGE' | 'ROUND_CHANGE';
export type StoreListener = (event: { type: StoreEvent; board: BoardType; payload?: any }) => void;

class NowFirstStore {
  private companiesBoard: BoardState;
  private socialBoard: BoardState;
  private ads: AdCreative[] = [];
  private payments: PaymentRecord[] = [];
  private refundJobs: RefundJob[] = [];
  private auditLogs: AuditLog[] = [];
  private outboundClicks: OutboundClickRecord[] = [];
  private clickCooldowns: Map<string, number> = new Map();
  private savedToolIds: Set<string> = new Set();
  private subscribers: Set<string> = new Set();
  private listeners: Set<StoreListener> = new Set();
  private isBrowser: boolean = typeof window !== 'undefined';
  private storageKey = 'nowfirst_v2_store';

  constructor() {
    const defaultRoundCompanies: WeeklyRound = {
      id: 'round_comp_14',
      roundNumber: 14,
      name: 'Weekly Round #14: Oct 28 – Nov 4',
      board: 'companies',
      startDate: '2026-10-28T00:00:00Z',
      endDate: '2026-11-04T00:00:00Z',
      basePricePaise: 10000, // ₹100 base for new round
      isActive: true,
    };

    const defaultRoundSocial: WeeklyRound = {
      id: 'round_soc_14',
      roundNumber: 14,
      name: 'Weekly Round #14: Oct 28 – Nov 4',
      board: 'social',
      startDate: '2026-10-28T00:00:00Z',
      endDate: '2026-11-04T00:00:00Z',
      basePricePaise: 10000,
      isActive: true,
    };

    this.companiesBoard = {
      id: 'companies',
      title: 'Companies',
      currentRound: defaultRoundCompanies,
      minInitialAmountPaise: 10000, // ₹100
      minIncrementPaise: 100, // ₹1
      lastActivatedAmountPaise: INITIAL_COMPANIES_LIVE_PLACEMENT.amountPaise,
      currentPlacement: { ...INITIAL_COMPANIES_LIVE_PLACEMENT },
      activeCampaigns: [...INITIAL_COMPANIES_DIRECTORY],
      history: [...INITIAL_COMPANIES_DIRECTORY],
      updatedAt: new Date().toISOString(),
    };

    this.socialBoard = {
      id: 'social',
      title: 'Social',
      currentRound: defaultRoundSocial,
      minInitialAmountPaise: 10000, // ₹100
      minIncrementPaise: 100, // ₹1
      lastActivatedAmountPaise: INITIAL_SOCIAL_LIVE_PLACEMENT.amountPaise,
      currentPlacement: { ...INITIAL_SOCIAL_LIVE_PLACEMENT },
      activeCampaigns: [...INITIAL_SOCIAL_DIRECTORY],
      history: [...INITIAL_SOCIAL_DIRECTORY],
      updatedAt: new Date().toISOString(),
    };

    this.ads = [
      INITIAL_COMPANIES_LIVE_AD,
      ...INITIAL_COMPANIES_DIRECTORY.map((h) => h.adRevision),
      INITIAL_SOCIAL_LIVE_AD,
      ...INITIAL_SOCIAL_DIRECTORY.map((h) => h.adRevision),
    ];

    this.payments = [
      {
        id: 'pay_comp_live_01',
        orderId: 'order_comp_live_01',
        paymentId: 'pay_test_comp_live_01',
        advertiserId: INITIAL_COMPANIES_LIVE_AD.advertiserId,
        advertiserName: INITIAL_COMPANIES_LIVE_AD.advertiserName,
        advertiserEmail: INITIAL_COMPANIES_LIVE_AD.advertiserEmail,
        board: 'companies',
        campaignTier: 'spotlight_upgrade',
        objective: 'trial_signups',
        adId: INITIAL_COMPANIES_LIVE_AD.id,
        adTitle: INITIAL_COMPANIES_LIVE_AD.title,
        amountPaise: 15000,
        currency: 'INR',
        status: 'activation_succeeded',
        createdAt: '2026-10-28T03:30:00Z',
        updatedAt: '2026-10-28T03:30:00Z',
      },
      {
        id: 'pay_soc_live_01',
        orderId: 'order_soc_live_01',
        paymentId: 'pay_test_soc_live_01',
        advertiserId: INITIAL_SOCIAL_LIVE_AD.advertiserId,
        advertiserName: INITIAL_SOCIAL_LIVE_AD.advertiserName,
        advertiserEmail: INITIAL_SOCIAL_LIVE_AD.advertiserEmail,
        board: 'social',
        campaignTier: 'spotlight_upgrade',
        objective: 'profile_discovery',
        adId: INITIAL_SOCIAL_LIVE_AD.id,
        adTitle: INITIAL_SOCIAL_LIVE_AD.title,
        amountPaise: 14000,
        currency: 'INR',
        status: 'activation_succeeded',
        createdAt: '2026-10-28T04:15:00Z',
        updatedAt: '2026-10-28T04:15:00Z',
      },
    ];

    this.auditLogs = [
      {
        id: 'log_01',
        action: 'ROUND_START',
        actor: 'system',
        entityType: 'round',
        entityId: 'round_comp_14',
        details: 'Weekly Round #14 initialized for Indian Founder Tools.',
        timestamp: '2026-10-28T00:00:00Z',
      },
    ];

    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (!this.isBrowser) return;
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.companiesBoard) this.companiesBoard = parsed.companiesBoard;
        if (parsed.socialBoard) this.socialBoard = parsed.socialBoard;
        if (parsed.ads) this.ads = parsed.ads;
        if (parsed.payments) this.payments = parsed.payments;
        if (parsed.refundJobs) this.refundJobs = parsed.refundJobs;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        if (parsed.savedToolIds) this.savedToolIds = new Set(parsed.savedToolIds);
        if (parsed.subscribers) this.subscribers = new Set(parsed.subscribers);
      }
    } catch (e) {
      console.warn('Failed to parse stored NowFirst state', e);
    }
  }

  private saveToStorage() {
    if (!this.isBrowser) return;
    try {
      const state = {
        companiesBoard: this.companiesBoard,
        socialBoard: this.socialBoard,
        ads: this.ads,
        payments: this.payments,
        refundJobs: this.refundJobs,
        auditLogs: this.auditLogs,
        savedToolIds: Array.from(this.savedToolIds),
        subscribers: Array.from(this.subscribers),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save NowFirst state', e);
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: { type: StoreEvent; board: BoardType; payload?: any }) {
    this.saveToStorage();
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Listener callback failed', err);
      }
    });
  }

  // --- Read Methods ---

  public getBoard(board: BoardType): BoardState {
    return board === 'companies' ? this.companiesBoard : this.socialBoard;
  }

  public getMinRequiredAmountPaise(board: BoardType): number {
    const b = this.getBoard(board);
    if (b.lastActivatedAmountPaise === 0) {
      return b.minInitialAmountPaise;
    }
    return b.lastActivatedAmountPaise + b.minIncrementPaise;
  }

  public getAds(advertiserId?: string): AdCreative[] {
    if (advertiserId) {
      return this.ads.filter((a) => a.advertiserId === advertiserId);
    }
    return [...this.ads];
  }

  public getPayments(advertiserId?: string): PaymentRecord[] {
    if (advertiserId) {
      return this.payments.filter((p) => p.advertiserId === advertiserId);
    }
    return [...this.payments];
  }

  public getRefundJobs(): RefundJob[] {
    return [...this.refundJobs];
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public isToolSaved(toolId: string): boolean {
    return this.savedToolIds.has(toolId);
  }

  public toggleSaveTool(toolId: string): boolean {
    if (this.savedToolIds.has(toolId)) {
      this.savedToolIds.delete(toolId);
    } else {
      this.savedToolIds.add(toolId);
    }
    this.emit({ type: 'SAVED_CHANGE', board: 'companies', payload: toolId });
    return this.savedToolIds.has(toolId);
  }

  public getSavedToolIds(): string[] {
    return Array.from(this.savedToolIds);
  }

  public subscribeToDigest(email: string): boolean {
    if (!email || !email.includes('@')) return false;
    this.subscribers.add(email.trim().toLowerCase());
    this.saveToStorage();
    return true;
  }

  // --- Reset Weekly Round (Fixing permanently escalating price floor) ---

  public advanceWeeklyRound(board: BoardType): WeeklyRound {
    const b = this.getBoard(board);
    const nextRoundNumber = b.currentRound.roundNumber + 1;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 3600 * 1000);

    const newRound: WeeklyRound = {
      id: `round_${board}_${nextRoundNumber}`,
      roundNumber: nextRoundNumber,
      name: `Weekly Round #${nextRoundNumber}: Active Now`,
      board,
      startDate: now.toISOString(),
      endDate: nextWeek.toISOString(),
      basePricePaise: 10000, // Resets bidding floor back to base ₹100!
      isActive: true,
      winnerPlacementId: b.currentPlacement?.id,
    };

    // Reset lastActivatedAmountPaise so new advertisers can compete starting at base ₹100
    b.currentRound = newRound;
    b.lastActivatedAmountPaise = 0; // Fresh floor for new round!
    b.updatedAt = new Date().toISOString();

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'NEW_WEEKLY_ROUND_STARTED',
      actor: 'system',
      entityType: 'round',
      entityId: newRound.id,
      details: `${board.toUpperCase()} Round #${nextRoundNumber} initiated. Spotlight floor reset to ₹100 base.`,
      timestamp: new Date().toISOString(),
    });

    this.emit({ type: 'ROUND_CHANGE', board, payload: newRound });
    return newRound;
  }

  // --- Submissions & Quality Score Gate ---

  public createAdCreative(ad: Omit<AdCreative, 'id' | 'createdAt' | 'updatedAt' | 'revisionNumber' | 'qualityScore'> & { qualityScore?: number }): AdCreative {
    // Quality scoring algorithm (Google Ads precedent)
    // Considers presence of exclusive founder perk, clear headline, and audience fit
    let score = ad.qualityScore || 8.5;
    if (ad.founderPerk?.title) score += 0.8;
    if (ad.tagline.length > 30) score += 0.4;
    score = Math.min(9.9, Math.round(score * 10) / 10);

    const newAd: AdCreative = {
      ...ad,
      qualityScore: score,
      id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      revisionNumber: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.ads.unshift(newAd);

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'AD_CREATED',
      actor: newAd.advertiserName,
      entityType: 'ad',
      entityId: newAd.id,
      details: `New ${newAd.board} ad submitted for "${newAd.title}" (Quality Score: ${score}/10, Objective: ${newAd.objective})`,
      timestamp: new Date().toISOString(),
    });

    this.emit({ type: 'MODERATION', board: newAd.board, payload: newAd });
    return newAd;
  }

  public moderateAd(adId: string, status: 'approved' | 'rejected' | 'suspended' | 'pending_review', feedback?: string, evidenceRequested?: boolean): AdCreative | null {
    const ad = this.ads.find((a) => a.id === adId);
    if (!ad) return null;

    ad.moderationStatus = status;
    ad.moderatorFeedback = feedback;
    ad.evidenceRequested = evidenceRequested;
    ad.updatedAt = new Date().toISOString();

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: `AD_MODERATED_${status.toUpperCase()}`,
      actor: 'Admin Moderator',
      entityType: 'ad',
      entityId: ad.id,
      details: `Ad "${ad.title}" set to ${status}${feedback ? `: "${feedback}"` : ''}`,
      timestamp: new Date().toISOString(),
    });

    this.emit({ type: 'MODERATION', board: ad.board, payload: ad });
    return ad;
  }

  // --- Campaign Booking & Spotlight Takeover Execution ---

  /**
   * REVISED PRODUCT ARCHITECTURE:
   * Brand chooses:
   * 1. Standard Campaign (Guaranteed 7-day Directory & Launch Board placement)
   * 2. Spotlight Upgrade (Claim #1 live spotlight position until outbid)
   * 3. Partner Multi-Channel Bundle (Directory + Spotlight + Partner Newsletter to 12.5k founders)
   *
   * CRITICAL REVISION:
   * If a brand is outbid from the live spotlight, their underlying 7-day standard campaign
   * REMAINS LIVE in the Curated Directory & Weekly Digest! They never lose all exposure!
   */
  public executeTakeover(params: {
    board: BoardType;
    adCreativeId: string;
    campaignTier?: CampaignTier;
    amountPaise: number;
    advertiserId: string;
    advertiserName: string;
    advertiserEmail: string;
    simulateOutbidRace?: boolean;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  }): TakeoverResult {
    const boardState = this.getBoard(params.board);
    const ad = this.ads.find((a) => a.id === params.adCreativeId);

    if (!ad) {
      return { success: false, code: 'UNAPPROVED_CREATIVE', message: 'Creative not found' };
    }

    if (ad.moderationStatus !== 'approved') {
      return {
        success: false,
        code: 'UNAPPROVED_CREATIVE',
        message: 'Content must be approved by moderation before checkout and activation.',
      };
    }

    const tier: CampaignTier = params.campaignTier || 'spotlight_upgrade';
    const minRequiredPaise = this.getMinRequiredAmountPaise(params.board);
    const orderId = params.razorpayOrderId || `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const paymentId = params.razorpayPaymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Create payment record
    const paymentRecord: PaymentRecord = {
      id: `pay_rec_${Date.now()}`,
      orderId,
      paymentId,
      advertiserId: params.advertiserId,
      advertiserName: params.advertiserName,
      advertiserEmail: params.advertiserEmail,
      board: params.board,
      campaignTier: tier,
      objective: ad.objective,
      adId: ad.id,
      adTitle: ad.title,
      amountPaise: params.amountPaise,
      currency: 'INR',
      status: 'captured',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payments.unshift(paymentRecord);

    // ANTI-SELF-CHALLENGE GUARD (Spotlight live only)
    if (boardState.currentPlacement && boardState.currentPlacement.advertiserId === params.advertiserId) {
      paymentRecord.status = 'activation_failed_refund_pending';
      const refundJob: RefundJob = {
        id: `rfnd_${Date.now()}`,
        paymentId: paymentRecord.id,
        orderId: paymentRecord.orderId,
        advertiserName: params.advertiserName,
        amountPaise: params.amountPaise,
        reason: 'self_challenge_rejected',
        status: 'completed',
        attempts: 1,
        gatewayRefundId: `rfnd_sim_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.refundJobs.unshift(refundJob);
      paymentRecord.status = 'refunded';
      paymentRecord.refundJobId = refundJob.id;

      this.auditLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'TAKEOVER_REJECTED_SELF_CHALLENGE',
        actor: params.advertiserName,
        entityType: 'board',
        entityId: params.board,
        details: `Self-challenge rejected on ${params.board} board. Full ₹${(params.amountPaise / 100).toFixed(2)} refund issued.`,
        timestamp: new Date().toISOString(),
      });

      this.emit({ type: 'REFUND', board: params.board, payload: { refundJob, reason: 'self_challenge_rejected' } });
      return {
        success: false,
        code: 'SELF_CHALLENGE_REJECTED',
        message: 'You cannot challenge your own active live placement on this board. A full refund of ₹' + (params.amountPaise / 100).toFixed(0) + ' has been processed.',
        refundJob,
        refundAmountPaise: params.amountPaise,
      };
    }

    // RACE CONDITION GUARD (Spotlight out-raced check)
    const isOutbidBeforeLock = (params.amountPaise < minRequiredPaise && tier === 'spotlight_upgrade') || params.simulateOutbidRace === true;

    if (isOutbidBeforeLock) {
      paymentRecord.status = 'activation_failed_refund_pending';
      const refundJob: RefundJob = {
        id: `rfnd_${Date.now()}`,
        paymentId: paymentRecord.id,
        orderId: paymentRecord.orderId,
        advertiserName: params.advertiserName,
        amountPaise: params.amountPaise,
        reason: 'outbid_race_condition',
        status: 'completed',
        attempts: 1,
        gatewayRefundId: `rfnd_sim_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.refundJobs.unshift(refundJob);
      paymentRecord.status = 'refunded';
      paymentRecord.refundJobId = refundJob.id;

      this.auditLogs.unshift({
        id: `log_${Date.now()}`,
        action: 'TAKEOVER_OUTBID_RACE_REFUND',
        actor: params.advertiserName,
        entityType: 'board',
        entityId: params.board,
        details: `Bid of ₹${(params.amountPaise / 100).toFixed(2)} was out-raced by a concurrent takeover. Ad never activated; 100% refund confirmed.`,
        timestamp: new Date().toISOString(),
      });

      this.emit({ type: 'REFUND', board: params.board, payload: { refundJob, reason: 'outbid_race_condition' } });
      return {
        success: false,
        code: 'OUTBID_RACE_CONDITION',
        message: 'The spotlight price increased before your payment completed. Your ad was not activated and did not enter history. A full automatic refund of ₹' + (params.amountPaise / 100).toFixed(0) + ' has been confirmed.',
        refundJob,
        refundAmountPaise: params.amountPaise,
      };
    }

    // SUCCESSFUL ACTIVATION
    // Determine channels
    const channels = ['Web Hero Spotlight', 'Curated Founder Directory', 'Weekly Founder Digest'];
    if (tier === 'partner_bundle') {
      channels.push('Partner Newsletter (12.5k Subscribers)', 'Founders Community Showcase');
    }

    const campaignExpiry = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(); // 7 days

    // If there was an existing leader, demote them from spotlight
    // BUT CRITICAL REVISION: They remain in activeCampaigns (Directory & Digest)!
    if (boardState.currentPlacement) {
      const demoted: Placement = {
        ...boardState.currentPlacement,
        status: 'campaign_active', // Still active in dependable directory!
        isLive: false,
        endedAt: new Date().toISOString(),
      };
      // Keep in history and ensure present in active campaigns
      boardState.history.unshift(demoted);
      const existingIdx = boardState.activeCampaigns.findIndex((c) => c.id === demoted.id);
      if (existingIdx >= 0) {
        boardState.activeCampaigns[existingIdx] = demoted;
      } else {
        boardState.activeCampaigns.unshift(demoted);
      }
    }

    // Insert new live placement
    const newPlacement: Placement = {
      id: `plc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      board: params.board,
      adId: ad.id,
      adRevision: { ...ad },
      advertiserId: params.advertiserId,
      advertiserName: params.advertiserName,
      campaignTier: tier,
      amountPaise: params.amountPaise,
      status: 'active',
      isLive: true,
      campaignActiveUntil: campaignExpiry,
      activatedAt: new Date().toISOString(),
      impressionsCount: 0,
      clicksCount: 0,
      spotlightClicksCount: 0,
      directoryClicksCount: 0,
      partnerClicksCount: 0,
      conversionsCount: 0,
      historyClicksCount: 0,
      distributionChannels: channels,
    };

    boardState.currentPlacement = newPlacement;
    boardState.lastActivatedAmountPaise = params.amountPaise;
    boardState.activeCampaigns.unshift(newPlacement);
    boardState.updatedAt = new Date().toISOString();

    paymentRecord.status = 'activation_succeeded';

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'TAKEOVER_SUCCESS',
      actor: params.advertiserName,
      entityType: 'placement',
      entityId: newPlacement.id,
      details: `New leader on ${params.board} board: "${ad.title}" for ₹${(params.amountPaise / 100).toFixed(0)} (${tier})`,
      timestamp: new Date().toISOString(),
    });

    this.emit({ type: 'TAKEOVER', board: params.board, payload: newPlacement });

    return {
      success: true,
      code: 'ACTIVATED',
      message: `Congratulations! "${ad.title}" is now live in the #1 spotlight, plus guaranteed 7-day placement in the Curated Founder Directory & Weekly Digest.`,
      placement: newPlacement,
    };
  }

  // --- Telemetry, Clicks & Conversions Attribution ---

  public recordOutboundClick(params: {
    placementId: string;
    board: BoardType;
    isSpotlight: boolean;
    channel?: 'spotlight' | 'directory' | 'partner_newsletter';
    ip?: string;
    userAgent?: string;
  }): { redirected: boolean; counted: boolean; reason: string } {
    const userAgent = params.userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
    const ip = params.ip ?? 'client';
    const isBot = /(bot|crawler|spider|facebookexternalhit|LinkedInBot|Twitterbot|curl|wget)/i.test(userAgent);
    const cooldownKey = `${ip}:${params.placementId}`;
    const lastClickTime = this.clickCooldowns.get(cooldownKey) || 0;
    const isCooldown = Date.now() - lastClickTime < 10 * 60 * 1000; // 10 minutes

    let counted = true;
    let filterReason: OutboundClickRecord['filterReason'] = 'none';

    if (isBot) {
      counted = false;
      filterReason = 'bot_user_agent';
    } else if (isCooldown) {
      counted = false;
      filterReason = 'cooldown_rate_limit';
    } else {
      this.clickCooldowns.set(cooldownKey, Date.now());
    }

    const channel = params.channel || (params.isSpotlight ? 'spotlight' : 'directory');

    const clickRecord: OutboundClickRecord = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      placementId: params.placementId,
      board: params.board,
      isSpotlight: params.isSpotlight,
      channel,
      ipHash: `hash_${ip.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12)}`,
      userAgent: userAgent,
      isValid: counted,
      filterReason,
      createdAt: new Date().toISOString(),
    };
    this.outboundClicks.push(clickRecord);

    if (counted) {
      const boardState = this.getBoard(params.board);
      const updatePlacementClicks = (p: Placement) => {
        p.clicksCount += 1;
        if (channel === 'spotlight') p.spotlightClicksCount += 1;
        else if (channel === 'partner_newsletter') p.partnerClicksCount += 1;
        else p.directoryClicksCount += 1;
      };

      if (boardState.currentPlacement && boardState.currentPlacement.id === params.placementId) {
        updatePlacementClicks(boardState.currentPlacement);
      }
      const dirItem = boardState.activeCampaigns.find((h) => h.id === params.placementId);
      if (dirItem) updatePlacementClicks(dirItem);

      this.saveToStorage();
    }

    return { redirected: true, counted, reason: filterReason };
  }

  // --- Record / Simulate Conversions (Trials, Leads, Purchases) ---

  public recordConversion(placementId: string, objective: CampaignObjective): boolean {
    const comp = this.companiesBoard;
    const soc = this.socialBoard;

    let target: Placement | null | undefined =
      comp.currentPlacement?.id === placementId
        ? comp.currentPlacement
        : comp.activeCampaigns.find((p) => p.id === placementId) ||
          soc.currentPlacement?.id === placementId
        ? soc.currentPlacement
        : soc.activeCampaigns.find((p) => p.id === placementId);

    if (target) {
      target.conversionsCount += 1;
      this.saveToStorage();
      this.emit({ type: 'SAVED_CHANGE', board: target.board, payload: target });
      return true;
    }
    return false;
  }

  // --- Vacant Spotlight Moderation Removal ---

  public removeLivePlacementForModeration(board: BoardType, reason: string): boolean {
    const boardState = this.getBoard(board);
    if (!boardState.currentPlacement) return false;

    const removedPlacement = boardState.currentPlacement;
    removedPlacement.isLive = false;
    removedPlacement.status = 'moderation_removed';
    removedPlacement.endedAt = new Date().toISOString();

    boardState.history.unshift(removedPlacement);
    boardState.currentPlacement = null;
    boardState.updatedAt = new Date().toISOString();

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'LIVE_PLACEMENT_REMOVED_MODERATION',
      actor: 'Admin Moderator',
      entityType: 'placement',
      entityId: removedPlacement.id,
      details: `Live ad "${removedPlacement.adRevision.title}" removed for: ${reason}. Spotlight is now vacant. Threshold remains ₹${(boardState.lastActivatedAmountPaise / 100).toFixed(0)}.`,
      timestamp: new Date().toISOString(),
    });

    this.emit({ type: 'MODERATION', board, payload: { removedPlacement, reason } });
    return true;
  }

  // --- Reset Demo ---

  public resetDemo(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }

    const defaultRoundCompanies: WeeklyRound = {
      id: 'round_comp_14',
      roundNumber: 14,
      name: 'Weekly Round #14: Oct 28 – Nov 4',
      board: 'companies',
      startDate: '2026-10-28T00:00:00Z',
      endDate: '2026-11-04T00:00:00Z',
      basePricePaise: 10000,
      isActive: true,
    };

    const defaultRoundSocial: WeeklyRound = {
      id: 'round_soc_14',
      roundNumber: 14,
      name: 'Weekly Round #14: Oct 28 – Nov 4',
      board: 'social',
      startDate: '2026-10-28T00:00:00Z',
      endDate: '2026-11-04T00:00:00Z',
      basePricePaise: 10000,
      isActive: true,
    };

    this.companiesBoard = {
      id: 'companies',
      title: 'Companies',
      currentRound: defaultRoundCompanies,
      minInitialAmountPaise: 10000,
      minIncrementPaise: 100,
      lastActivatedAmountPaise: INITIAL_COMPANIES_LIVE_PLACEMENT.amountPaise,
      currentPlacement: { ...INITIAL_COMPANIES_LIVE_PLACEMENT },
      activeCampaigns: [...INITIAL_COMPANIES_DIRECTORY],
      history: [...INITIAL_COMPANIES_DIRECTORY],
      updatedAt: new Date().toISOString(),
    };

    this.socialBoard = {
      id: 'social',
      title: 'Social',
      currentRound: defaultRoundSocial,
      minInitialAmountPaise: 10000,
      minIncrementPaise: 100,
      lastActivatedAmountPaise: INITIAL_SOCIAL_LIVE_PLACEMENT.amountPaise,
      currentPlacement: { ...INITIAL_SOCIAL_LIVE_PLACEMENT },
      activeCampaigns: [...INITIAL_SOCIAL_DIRECTORY],
      history: [...INITIAL_SOCIAL_DIRECTORY],
      updatedAt: new Date().toISOString(),
    };

    this.ads = [
      INITIAL_COMPANIES_LIVE_AD,
      ...INITIAL_COMPANIES_DIRECTORY.map((h) => h.adRevision),
      INITIAL_SOCIAL_LIVE_AD,
      ...INITIAL_SOCIAL_DIRECTORY.map((h) => h.adRevision),
    ];

    this.payments = this.payments.slice(0, 2);
    this.refundJobs = [];
    this.savedToolIds.clear();

    this.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'DEMO_RESET',
      actor: 'User',
      entityType: 'store',
      entityId: 'all',
      details: 'Demo environment reset to factory seed values with Indian founder software focus.',
      timestamp: new Date().toISOString(),
    });

    this.emit({ type: 'RESET', board: 'companies' });
    this.emit({ type: 'RESET', board: 'social' });
  }
}

// Global Singleton Instance
export const store = new NowFirstStore();
