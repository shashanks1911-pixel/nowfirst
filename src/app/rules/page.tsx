'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  ShieldCheck,
  Scale,
  RefreshCw,
  Coins,
  AlertCircle,
  Eye,
  FileText,
  HelpCircle,
} from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-text">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Header */}
        <div className="pb-8 border-b border-apple-border/70 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-subtle border border-apple-border/70 text-xs font-semibold text-apple-accent mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Commercial Rules & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-apple-text">
            Commercial Guidelines & Operating Rules
          </h1>
          <p className="text-sm text-apple-secondary mt-2 max-w-2xl leading-relaxed">
            NowFirst operates two independent, high-transparency advertising spotlights.
            These rules define pricing, displacement, content moderation, and race condition resolutions.
          </p>
        </div>

        {/* Rules Breakdown */}
        <div className="mt-10 space-y-10 text-xs sm:text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-apple-text flex items-center gap-2">
              <Coins className="w-4 h-4 text-apple-accent" />
              <span>1. Two Independent Destinations</span>
            </h2>
            <div className="p-5 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-2.5 text-apple-secondary leading-relaxed">
              <p>
                NowFirst maintains two separate, non-overlapping boards:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-apple-text">
                <li>
                  <strong>Companies (`/companies`):</strong> Dedicated to commercial products, websites, SaaS platforms, and enterprise brands. Placements must lead to a product or company website.
                </li>
                <li>
                  <strong>Social (`/social`):</strong> Dedicated to creators and founders promoting their verified public profiles on Instagram, X, Facebook, and LinkedIn.
                </li>
              </ul>
              <p>
                Each board maintains its own independent live spotlight and price threshold. A payment of ₹150 on the Social board does not alter the Companies ranking or price floor.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-apple-text flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-apple-accent" />
              <span>2. Commercial Bidding & Fresh Payments</span>
            </h2>
            <div className="p-5 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-2.5 text-apple-secondary leading-relaxed">
              <ul className="list-disc pl-5 space-y-1 text-apple-text">
                <li><strong>Currency:</strong> Indian Rupees (INR, ₹). Stored on the server as integer paise.</li>
                <li><strong>Initial Board Minimum:</strong> ₹100.00 (10,000 paise).</li>
                <li><strong>Minimum Increment:</strong> Each new qualifying bid must exceed the last activated price by at least ₹1.00 whole rupee.</li>
                <li><strong>Fresh Purchases:</strong> Payments do not accumulate. If an advertiser previously paid ₹100 and returns later to bid ₹150, they pay the full ₹150 (total spent: ₹250).</li>
                <li><strong>No History Direct Buys:</strong> A lower payment cannot purchase a spot directly in history. Placements only enter history by having been live first.</li>
                <li><strong>Anti-Self-Challenge:</strong> An active advertiser cannot challenge their own current live placement on the same board. Any accidental attempt triggers an immediate 100% refund.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-apple-text flex items-center gap-2">
              <Eye className="w-4 h-4 text-apple-accent" />
              <span>3. Displacement Policy & Disclosures</span>
            </h2>
            <div className="p-5 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-3 text-apple-secondary leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-apple-subtle border border-apple-border/60 text-apple-text font-medium text-xs">
                &ldquo;Your ad stays featured until a higher payment activates on this board. This may happen immediately. Minimum exposure time, traffic, followers, and results are not guaranteed. Being outbid after activation does not itself trigger a refund.&rdquo;
              </div>
              <p>
                When a qualifying higher payment activates, the previous placement is immediately retired to that board&apos;s descending historical placement table with its final activation and termination timestamps.
              </p>
              <div className="p-3.5 rounded-2xl bg-apple-subtle border border-apple-border/60 text-apple-text font-medium text-xs">
                For Social placements: &ldquo;Payment promotes this profile on our Social board until a higher payment activates. Visitors choose whether to visit or follow. Followers and engagement are not guaranteed.&rdquo;
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-apple-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-apple-accent" />
              <span>4. Concurrency Race Conditions & Automatic Refunds</span>
            </h2>
            <div className="p-5 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-2.5 text-apple-secondary leading-relaxed">
              <p>
                Because checkouts occur concurrently, multiple users may initiate payment at similar times.
              </p>
              <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs leading-relaxed">
                <strong>Guaranteed Zero-Loss Resolution:</strong> If Advertiser A begins paying ₹120 to beat a ₹100 spot, but Advertiser B pays ₹130 and confirms first, when A&apos;s payment confirms, A cannot become live. A&apos;s payment is automatically enqueued for an immediate 100% refund, and A never enters public history.
              </div>
              <p>
                This ensures no advertiser ever pays without either claiming the live spotlight or receiving a full automatic refund.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-apple-text flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-apple-accent" />
              <span>5. Content Moderation & Vacant Spotlights</span>
            </h2>
            <div className="p-5 rounded-3xl bg-white border border-apple-border/80 shadow-apple-sm space-y-2.5 text-apple-secondary leading-relaxed">
              <p>
                All creative content (headlines, descriptions, destinations, logos) must be reviewed and approved by automated or human moderators before checkout can begin.
              </p>
              <p>
                If a live placement is subsequently found to violate trademark policies, impersonate others, or contain malicious URLs, moderators can remove it immediately. In this event, the spotlight becomes <strong>vacant</strong>. Historical placements are <strong>not reactivated</strong>, and the next advertiser must still exceed that board&apos;s last activated price.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

