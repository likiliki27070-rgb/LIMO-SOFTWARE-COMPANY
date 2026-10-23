'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  Users,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
          Our Mission & Architecture
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-limo-navy dark:text-white tracking-tight">
          Pioneering the Next Era of Software Development
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          LIMO was founded on a simple principle: modern engineering squads must combine the speed of world-class freelance talent with the rigorous standards and accountability of a top-tier software agency.
        </p>
      </div>

      {/* The Dual Business Model */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark shadow-sm space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-limo-navy dark:text-white">
            The LIMO Dual Business Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Unlike legacy freelancing directories that flood clients with spam proposals, or rigid agencies that overcharge with endless overhead, LIMO unites both paradigms into a cohesive, auditable platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
            <h3 className="text-lg font-bold text-limo-navy dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-limo-blue" />
              <span>1. Software Development Agency</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We provide turnkey software development services under the LIMO brand. Clients work directly with our dedicated architects, engineering leads, and QA specialists with strict SLA milestones, IP indemnity, and code warranty.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
            <h3 className="text-lg font-bold text-limo-navy dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>2. Freelancing Marketplace</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clients can publish individual projects, receive verified bids, and hire specialized freelance engineers on a milestone-based escrow system with zero bidding fees and complete transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-limo-navy dark:text-white text-center">
          Our Engineering Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-limo-blue flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-limo-navy dark:text-white">Radical Security</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero plaintext credentials, single-use cryptographic OTPs, and strict PostgreSQL Row Level Security for every table.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-limo-navy dark:text-white">Escrow Assurance</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every milestone is funded prior to development kickoff. Funds are released only upon genuine review and explicit client approval.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-limo-navy dark:text-white">Vetted Quality</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We review genuine GitHub contributions, architecture patterns, and verified skills before awarding platform verification.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-xl shadow-blue-500/20 transition"
        >
          <span>Explore Agency Services</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
