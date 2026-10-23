'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CommunityRulesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
          Platform Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
          Community & Platform Conduct Rules
        </h1>
        <p className="text-xs text-slate-400">
          Enforced by automated audit logs and human moderation
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
          <h2 className="text-base font-bold text-limo-navy dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>1. Authentic Representation</span>
          </h2>
          <p>
            Specialists must provide genuine links to portfolios, GitHub repositories, and verifiable experience. Plagiarizing source code, misrepresenting agency affiliations, or using automated proposal bots is strictly prohibited.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
          <h2 className="text-base font-bold text-limo-navy dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>2. Milestone Delivery Integrity</span>
          </h2>
          <p>
            When submitting deliverables for client review, specialists must provide testable staging environments, repository commits, or documented design assets. Empty submissions to circumvent contract deadlines are grounds for immediate review.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-3">
          <h2 className="text-base font-bold text-limo-navy dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>3. Anti-Harassment & Professionalism</span>
          </h2>
          <p>
            Project messaging must maintain high professional standards. Discriminatory language, harassment, extortion, or defamatory reviews will result in account suspension and escrow forfeiture upon admin review.
          </p>
        </div>
      </div>
    </div>
  );
}
