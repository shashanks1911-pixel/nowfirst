'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { RefreshCw, MessageSquare, Shield, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportUrl, setReportUrl] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(sessionStorage.getItem('nowfirst_admin_authenticated') === 'true');
    }
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportModalOpen(false);
      setReportUrl('');
      setReportReason('');
    }, 2000);
  };

  return (
    <footer className="mt-20 border-t border-apple-border/60 bg-apple-subtle/50 text-apple-secondary text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Disclosures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b border-apple-border/50">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-apple-text mb-2">
              Displacement & Commercial Terms
            </h4>
            <p className="leading-relaxed text-apple-secondary/90">
              Your ad stays featured until a higher payment activates on this board. This may happen immediately.
              Minimum exposure time, traffic, followers, and results are not guaranteed. Being outbid after activation
              does not itself trigger a refund.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-apple-text mb-2">
              Performance & Attribution Notice
            </h4>
            <p className="leading-relaxed text-apple-secondary/90">
              Outbound clicks measure visitor redirects from this website with automated bot and rapid duplicate
              filtering. A click is not proof of a destination profile view, follow, lead, or sale. Do not attribute
              follower growth to a placement.
            </p>
          </div>
        </div>

        {/* Links & Brand Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-apple-text">NowFirst</span>
            <span className="text-apple-tertiary">•</span>
            <span>Independent Live Spotlights for Companies & Creators</span>
          </div>

          <div className="flex items-center gap-6 text-xs flex-wrap justify-center">
            <Link href="/companies" className="hover:text-apple-text transition-colors">
              Companies
            </Link>
            <Link href="/social" className="hover:text-apple-text transition-colors">
              Social
            </Link>
            <Link href="/rules" className="hover:text-apple-text transition-colors">
              Commercial Rules
            </Link>
            <Link href="/dashboard" className="hover:text-apple-text transition-colors">
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-apple-accent hover:underline font-medium transition-colors">
                Admin Console
              </Link>
            )}
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-apple-secondary hover:text-apple-text transition-colors underline"
            >
              Report / Contact
            </button>
            <button
              onClick={() => {
                store.resetDemo();
                window.location.reload();
              }}
              title="Reset demo data to factory defaults"
              className="inline-flex items-center gap-1 hover:text-apple-text transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center sm:text-left text-[11px] text-apple-tertiary">
          © {new Date().getFullYear()} NowFirst. Built with precision. Currency INR (₹). Stored in integer paise.
        </div>
      </div>

      {/* Functional Report / Contact Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-apple-float border border-apple-border text-left">
            <div className="flex items-center justify-between pb-3 border-b border-apple-border">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-apple-accent" />
                <h3 className="text-sm font-semibold text-apple-text">Report Unsafe Content or Contact</h3>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-7 h-7 rounded-full bg-apple-subtle text-apple-secondary hover:text-apple-text flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-semibold text-apple-text">Report Received</h4>
                <p className="text-xs text-apple-secondary">Our moderation team will review this notice promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-apple-text mb-1">
                    Ad Title or Destination URL
                  </label>
                  <input
                    type="text"
                    required
                    value={reportUrl}
                    onChange={(e) => setReportUrl(e.target.value)}
                    placeholder="e.g. Apex Design Systems or domain"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-apple-subtle/80 border border-apple-border focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-apple-text mb-1">
                    Reason for report or inquiry
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe trademark infringement, impersonation, deceptive link, or general support inquiry..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-apple-subtle/80 border border-apple-border focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-full border border-apple-border hover:bg-apple-subtle text-apple-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-apple-accent text-white text-xs font-medium shadow-sm hover:bg-apple-accentHover"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}

