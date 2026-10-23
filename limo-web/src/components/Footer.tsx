'use client';

import React from 'react';
import Link from 'next/link';
import { LimoWordmark } from './LimoWordmark';
import { ShieldCheck, Lock, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-limo-borderDark bg-white dark:bg-limo-navyDark text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <LimoWordmark size="md" />
            <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              LIMO connects ambitious companies with vetted freelance talent while delivering turn-key software engineering, mobile applications, and AI systems through dedicated squads.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                All Systems Operational • Auditable Escrow Active
              </span>
            </div>
          </div>

          {/* Agency Services Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-limo-navy dark:text-white mb-4">
              Software Agency
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services#website-development" className="hover:text-limo-blue transition">
                  Website Development
                </Link>
              </li>
              <li>
                <Link href="/services#web-applications" className="hover:text-limo-blue transition">
                  Web Applications
                </Link>
              </li>
              <li>
                <Link href="/services#mobile-applications" className="hover:text-limo-blue transition">
                  Mobile Apps (React Native)
                </Link>
              </li>
              <li>
                <Link href="/services#ui-ux-design" className="hover:text-limo-blue transition">
                  UI/UX Design Systems
                </Link>
              </li>
              <li>
                <Link href="/services#ai-integration" className="hover:text-limo-blue transition">
                  AI & LLM Integration
                </Link>
              </li>
              <li>
                <Link href="/services#custom-software" className="hover:text-limo-blue transition">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link href="/services#maintenance-support" className="hover:text-limo-blue transition">
                  Maintenance & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-limo-navy dark:text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/projects" className="hover:text-limo-blue transition">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="hover:text-limo-blue transition">
                  Verified Talent Directory
                </Link>
              </li>
              <li>
                <Link href="/auth/login?role=client" className="hover:text-limo-blue transition">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/auth/login?role=freelancer" className="hover:text-limo-blue transition">
                  Apply as Freelancer
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-limo-blue transition">
                  Payment Protection & Escrow
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-limo-navy dark:text-white mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-limo-blue transition">
                  About LIMO
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-limo-blue transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-limo-blue transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-limo-blue transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/community-rules" className="hover:text-limo-blue transition">
                  Community Rules
                </Link>
              </li>
              <li>
                <Link href="/account-deletion" className="hover:text-limo-blue transition">
                  Account Deletion
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted Transactions • PostgreSQL RLS Security • Zero Plaintext Secrets</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} LIMO Platform Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
