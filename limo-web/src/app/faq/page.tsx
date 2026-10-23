'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Clients',
    q: 'How does LIMO protect my payments to freelancers?',
    a: 'Every project milestone requires advance escrow funding. The funds are held in auditable platform escrow and are never released to the freelancer until you review the submitted code, staging links, or design deliverables and click "Approve Milestone".',
  },
  {
    category: 'Clients',
    q: 'What is the intellectual property policy for completed projects?',
    a: 'Upon full milestone payment release, all intellectual property, source code, repositories, copyrights, design tokens, and digital assets transfer completely and exclusively to the client.',
  },
  {
    category: 'Clients',
    q: 'Can I switch from an individual freelancer to a LIMO agency squad?',
    a: 'Yes. If your project requirements expand beyond a single developer, our solutions architect can transition the codebase into a managed LIMO squad with dedicated front-end, back-end, mobile, and QA engineers.',
  },
  {
    category: 'Freelancers',
    q: 'Are there any tokens or fees required to submit proposals?',
    a: 'None whatsoever. Unlike legacy platforms with connect tokens, LIMO permits verified specialists to pitch freely on projects that match their verified skills. A transparent 10% platform commission is deducted only upon successful milestone release.',
  },
  {
    category: 'Freelancers',
    q: 'How quickly do earnings reach my bank account after approval?',
    a: 'Approved milestone funds are immediately credited to your platform balance. You can request direct ACH bank transfers or Stripe payouts which process within 24–48 business hours.',
  },
  {
    category: 'Freelancers',
    q: 'How do I obtain the LIMO Verified Badge?',
    a: 'You can submit your portfolio and GitHub profile during onboarding. Our technical moderation committee reviews real code samples, architecture patterns, and past performance before awarding the badge.',
  },
  {
    category: 'Escrow & Payments',
    q: 'How does the platform escrow calculate fees?',
    a: 'LIMO charges a flat 10% platform fee on completed milestones. For example, on a $4,000 milestone, $400 is allocated to platform operations, security, and dispute insurance, and $3,600 is paid directly to the freelancer.',
  },
  {
    category: 'Escrow & Payments',
    q: 'What is the dispute mediation procedure?',
    a: 'If deliverables do not meet agreed contract specifications and the freelancer cannot resolve revisions within a reasonable timeframe, either party can open a formal dispute. Platform administrators inspect all commit logs, deliverables, and message logs to execute an impartial resolution (refund to client or release to freelancer).',
  },
  {
    category: 'Agency Services',
    q: 'What is included in a LIMO Agency software contract?',
    a: 'Agency engagements include dedicated senior full-stack architects, guaranteed delivery timelines, automated CI/CD deployment pipelines, comprehensive test coverage, code documentation, and post-launch maintenance options.',
  },
  {
    category: 'Agency Services',
    q: 'What technologies does the LIMO agency team specialize in?',
    a: 'Our core stacks are Next.js, React, React Native / Expo, TypeScript, PostgreSQL, Supabase, Tailwind CSS, Python (LLM / RAG), and AWS/Vercel distributed cloud infrastructures.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', 'Clients', 'Freelancers', 'Escrow & Payments', 'Agency Services'];

  const filteredFaqs = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          Everything you need to know about escrow protection, agency services, talent vetting, and platform fees.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-limo-blue text-white shadow-sm'
                : 'bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-limo-borderDark bg-white dark:bg-limo-cardDark overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-limo-navy dark:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-limo-blue px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 shrink-0">
                    {faq.category}
                  </span>
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-limo-blue' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
