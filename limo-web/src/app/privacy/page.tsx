'use client';

import React from 'react';
import { Lock, Shield, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-limo-blue">
          Legal & Trust
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-limo-navy dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • Effective version 1.0.0
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            1. Overview & Data Minimization
          </h2>
          <p>
            LIMO Platform Inc. (&ldquo;LIMO&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to least-privilege data handling and zero plaintext storage of user credentials. This Privacy Policy outlines how your personal information is collected, processed, and safeguarded when using the LIMO mobile application and website services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Authentication Data:</strong> Mobile phone number (used solely for SMS OTP verification challenge delivery), email address, and OAuth authentication tokens verified via server-side claims.</li>
            <li><strong>Profile Information:</strong> Public full name, professional headline, biographical overview, portfolio links, and skill proficiencies.</li>
            <li><strong>Project & Financial Records:</strong> Contract milestone agreements, deliverable links, payment status flags, and transaction identifiers. We do not store raw credit card numbers.</li>
            <li><strong>Communications:</strong> Encrypted project-based messages exchanged between clients, freelancers, and assigned moderators.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            3. OTP & Security Cryptography
          </h2>
          <p>
            In strict compliance with our security architecture, OTP codes generated during phone verification are hashed using salted cryptographic algorithms. Plaintext OTP codes are never logged, stored in persistent application databases, or exposed to unauthorized parties. Each OTP expires in five minutes and previous challenges are invalidated immediately upon resend.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            4. Row Level Security & Database Isolation
          </h2>
          <p>
            All persistent user data is protected by PostgreSQL Row Level Security (RLS) policies. Clients can access only their eligible project contracts; freelancers can access only their private bids and earnings; and administrators access records solely through authenticated, auditable roles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-limo-navy dark:text-white">
            5. Your Rights & Account Deletion
          </h2>
          <p>
            Under GDPR, CCPA, and global data privacy standards, you have the right to inspect, export, and permanently delete your profile and personal records. For self-service erasure, visit our Account Deletion portal.
          </p>
        </section>
      </div>
    </div>
  );
}
