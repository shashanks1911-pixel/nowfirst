# NowFirst (Provisional) — The Real-Time Spotlight Billboard

> **Live Hosted Website:** [https://shashanks1911-pixel.github.io/nowfirst/](https://shashanks1911-pixel.github.io/nowfirst/)

NowFirst is an Apple-inspired, high-transparency advertising platform featuring two independent destinations:
- **Companies (`/companies`)**: Paid promotion of company websites, SaaS platforms, and enterprise tools.
- **Social (`/social`)**: Paid promotion of Instagram profiles, X profiles, Facebook Pages/profiles, and LinkedIn profiles/company pages.

Each destination features its own independent live spotlight and descending placement history. Paid position reflects payment, not product quality, popularity, verification, or platform endorsement.

---

## 1. Key Commercial Rules & Invariants

1. **Currency & Precision**: Indian Rupees (`INR`, `₹`). Stored on the server as 64-bit integer paise (₹1.00 = 100 paise).
2. **Initial Placement Minimum**: ₹100.00 (10,000 paise).
3. **Strict Minimum Increment**: Each new placement must exceed that board's last activated amount by at least ₹1.00 whole rupee.
4. **Fresh Purchases**: Payments do not accumulate. If a previous ₹100 advertiser returns to pay ₹150, they pay the full ₹150 (total spent: ₹250).
5. **No History Direct Purchases**: Placements only enter history by having been live first.
6. **Anti-Self-Challenge**: An advertiser cannot challenge or outbid their own current live placement on the same board. Any attempt triggers an immediate full automatic refund.
7. **Board Isolation**: Companies and Social boards are 100% independent. A ₹150 takeover on Social has zero impact on a ₹1,000 Companies leader.
8. **Displacement Policy**: An ad remains featured until a higher qualifying payment activates on the same board. This may happen immediately. Minimum exposure time is not guaranteed.
9. **Zero-Loss Race Condition Resolution**: If Advertiser A pays ₹120 to outbid a ₹100 leader, but Advertiser B pays ₹130 and confirms first, A cannot become live. A's payment is automatically enqueued for an immediate 100% refund, and A **never** enters public history.
10. **Vacant Spotlight Rule**: If moderation removes a live placement for policy violations, the spotlight becomes vacant. Historical placements are never reactivated. The next purchase must still exceed that board's last activated amount.

---

## 2. Operating Modes

### A. Demo Mode (Zero Credentials Required — Default)
- Pre-seeded with realistic companies and social creators across Instagram, X, Facebook, and LinkedIn.
- Simulates submissions, ownership attestation, moderation review, and Razorpay standard checkout.
- Interactive **Demo Lab Toolbar**:
  - **Simulate Takeover**: Triggers a competitor bot outbidding the live leader with Apple's 600–900ms takeover motion choreography.
  - **Simulate Outbid Race**: Directly tests the concurrent outbid scenario where payment completes after price increases → verifies 100% automatic refund and zero history entry.
  - **Pause / Resume Live Updates**: Holds incoming takeovers in a queue with a counter badge.
  - **Reset Demo**: Restores factory seeds with one click.
- State persists in `localStorage` across page reloads.

### B. Connected Test Mode
- Connects to Supabase PostgreSQL with Row-Level Security, Supabase Realtime subscriptions, and Razorpay Standard Checkout in test mode.
- Strictly isolated database tables with PostgreSQL row locks (`SELECT ... FOR UPDATE`) and partial unique index `WHERE is_live = true AND status = 'active'` enforcing at most one live placement per board.
- See `.env.example` and `supabase/migrations/20261028_init_nowfirst.sql`.

---

## 3. Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom Apple color tokens (`#FBFBFD`, `#F5F5F7`, `#1D1D1F`, `#0071E3`)
- **Motion**: Framer Motion / Motion for React (750ms spring takeover sequences, `layout` animations for descending history, and full `prefers-reduced-motion` compliance)
- **Database (Connected)**: Supabase PostgreSQL + Realtime
- **Payments**: Razorpay Standard Checkout in test mode
- **Testing**: Node.js native test runner (`node --test`)

---

## 4. Getting Started

### Installation & Run

```bash
# Install dependencies
npm install

# Run automated test suites (11 tests verifying URL normalizers & commercial rules)
npm test

# Run development server
npm run dev

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to explore the live website.

---

## 5. Automated Tests Suite

The automated test suite (`npm test`) verifies:
- Strict Instagram profile validation and rejection of `/p/`, `/reel/`, `/stories/`.
- X / Twitter normalization (normalizing `twitter.com` → `x.com`) and rejection of `/status/`.
- Facebook Page & numeric ID preservation (`profile.php?id=...`).
- LinkedIn personal `/in/` and company `/company/` profile validation.
- Company website validation (rejecting social profiles on company board).
- Board isolation and independent price floors.
- Successful takeover and demotion to history with timestamps.
- Anti-self-challenge guard triggering automated full refund.
- Outbid race condition resolution (100% refund, no history entry).
- Vacant spotlight preservation of price floor upon moderation takedown.
- Returning advertiser rules (paying full amount and appearing in history multiple times).

