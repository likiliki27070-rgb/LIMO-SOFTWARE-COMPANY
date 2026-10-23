'use client';

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • Effective version 1.0.0
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By registering for an account, posting projects, submitting proposals, or utilizing LIMO Agency direct software development services, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            2. Escrow Architecture & Milestone Approval
          </h2>
          <p>
            Clients agree to fund agreed milestone amounts into platform escrow prior to development commencement. Freelancers acknowledge that funds are released only when the client explicitly clicks &ldquo;Approve Milestone&rdquo; or upon formal administrative resolution of a dispute.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            3. Intellectual Property Transfer
          </h2>
          <p>
            The freelancer covenants and agrees that upon receipt of full payment release for a project milestone, all right, title, and interest in and to the custom software, source code, designs, and documentation transfer unencumbered to the client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            4. Anti-Circumvention Policy
          </h2>
          <p>
            To maintain escrow protection and platform security, users agree not to solicit, solicit off-platform payments, or conduct transactions outside of the LIMO payment infrastructure during an active engagement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            5. Dispute Arbitration
          </h2>
          <p>
            In the event of irreconcilable project disagreement regarding quality or timeline adherence, either party may initiate platform dispute arbitration. Decisions rendered by authorized LIMO moderation teams based on submitted deliverables and chat transcripts are final.
          </p>
        </section>
      </div>
    </div>
  );
}
