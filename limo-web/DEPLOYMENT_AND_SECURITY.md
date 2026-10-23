# LIMO Web — Deployment, Security & Operations Guide

This document provides complete software engineering instructions for deploying, configuring, testing, and securing the **LIMO Full-Stack Web Application & Freelancing Marketplace** built with Next.js 15, TypeScript, Tailwind CSS, and PostgreSQL / Supabase.

---

## 1. Quick Start & Local Development

### Prerequisites
- **Node.js**: v20+ LTS (Tested on v24 LTS)
- **Package Manager**: npm, bun, or pnpm

### Setup
```bash
# Navigate to web root
cd limo-web

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Run automated test suite (15 unit tests)
npm test

# Run Next.js production build
npm run build

# Start local production server
npm start

# Or start Turbopack local dev server
npm run dev
```

---

## 2. Free-Tier Deployment on Vercel

1. Push your repository to GitHub (ensure `.env.local` is ignored in `.gitignore`).
2. Log in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New Project** and import the repository.
4. Set **Root Directory** to `limo-web`.
5. In **Environment Variables**, provide the public values from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe public anon key (never service-role key)
   - `NEXT_PUBLIC_APP_ENV`: `production`
   - `NEXT_PUBLIC_OTP_MODE`: `demo` or `supabase_twilio`
   - `NEXT_PUBLIC_PAYMENT_MODE`: `sandbox` or `stripe`
6. Click **Deploy**. Vercel will build and assign an SSL-enabled `.vercel.app` domain automatically.

---

## 3. Database Migration & PostgreSQL RLS

LIMO uses a unified relational database architecture shared between `limo-mobile` and `limo-web`.

### Running Migrations
1. In your Supabase Dashboard SQL Editor, run:
   - `../supabase/migrations/20261022000000_init_limo_schema.sql` (Creates 18 relational tables, enums, indexes, helper functions, and Row Level Security policies).
2. To seed demo clients, specialists, active contracts, and audit logs:
   - `../supabase/seed.sql`

### Row Level Security Verification
- **Profiles**: Publicly readable, editable only by the authenticated owner (`auth.uid() = id`).
- **User Roles**: Mutable only by administrators via `public.is_admin(auth.uid())`.
- **Proposals**: Freelancers can read and edit only their own bids; clients can read bids for their posted projects.
- **Messages**: Restricted to conversation participants via `conversation_participants` membership.
- **Payment Records & Audit Logs**: Clients and freelancers view only their related payments; admins hold auditable platform ledger access.

---

## 4. Security Review Checklist

| Security Area | Implementation Status | Notes |
|:---|:---:|:---|
| **Cryptographic OTP Generation** | ✅ Passed | Salted SHA-256 HMAC verification prevents plaintext exposure in logs and databases. |
| **Fresh OTP on Resend** | ✅ Passed | Every resend produces a fresh code and immediately invalidates the previous challenge. |
| **Expiry & Attempt Limits** | ✅ Passed | 5-minute countdown expiry, 60-second cooldown timer, and maximum 5 failed attempts enforced. |
| **Zero Plaintext Secrets** | ✅ Passed | No service-role keys or database passwords embedded in frontend bundles or assets. |
| **Row Level Security (RLS)** | ✅ Passed | 18 PostgreSQL tables protected with strict ownership and participation checks. |
| **Injection & XSS Protection** | ✅ Passed | Parameterized queries via Supabase client; React auto-escaping for HTML sanitization. |
| **Payment Ledger Integrity** | ✅ Passed | 10% platform fee calculations, transaction reference tracking (`TXN-LIMO-...`), and escrow custody status machine. |

---

## 5. Backup & Disaster Recovery Architecture

1. **Daily Automated Snapshots**:
   - Supabase automatically performs daily physical backups (WAL streaming) on PostgreSQL instances.
2. **Point-In-Time Recovery (PITR)**:
   - For production environments, PITR allows rollbacks to any second within the retention window.
3. **Manual Logical Backup**:
   ```bash
   pg_dump -h db.<project-ref>.supabase.co -U postgres -d postgres > limo_backup_$(date +%F).sql
   ```
4. **Disaster Recovery Rollback Strategy**:
   - Database restore via `psql -h <host> -U postgres -d postgres < backup.sql`
   - Vercel instant rollback: Revert deployment to previous immutable build hash with 1 click in Vercel console.

---

## 6. Feature Matrix

### Completed Features (Fully Functional)
- **Public Website**: Hero with CTAs, 7 Agency Services with detail modal, How-It-Works interactive flows, Featured Projects, Featured Freelancer Directory, Client vs Freelancer Benefits, Testimonials, Interactive FAQ, and Footer.
- **Direct Agency Quote Workflow**: Modal form with category selection, budget slider, timeline, validation, and real-time submission to `quote_requests`.
- **Projects Marketplace**: Search, category filters, budget range filter, skill checkboxes, sorting, and detail views (`/projects/[id]`).
- **Proposal Submission**: Freelancers submit proposed bids, estimated timelines, and cover letters; clients shortlist and accept bids with transactional state updates.
- **Freelancer Directory**: Search by skill, category, availability status, hourly rate filter, portfolio previews, and detailed profile pages (`/freelancers/[id]`).
- **Client Dashboard**: Projects overview, active contract milestones, deliverable review/revision requests, escrow approvals, and payment records ledger.
- **Freelancer Dashboard**: Active contracts, deliverable submission links, proposal statuses, and earnings breakdown with payout requests.
- **Admin Dashboard**: System metrics, user suspension/reinstatement, verification badge toggles, quote requests pipeline manager, dispute arbitration, and audit logs.
- **Real-Time Project Messaging**: Conversational sidebar, message history, read indicators, and live message dispatch.
- **Authentication**: Phone OTP challenge verification (5m expiry, 60s cooldown, attempts tracking, mock code preview) + Google OAuth one-click sign-in.
- **Theme Switcher**: Seamless light and dark mode with high-contrast electric-blue and cyan accents.
- **Automated Tests**: 15 Jest tests covering OTP security, project lifecycle, payment calculations, and role permissions.

### Demo-Only Features (Clearly Labeled)
- **SMS Provider Gateway**: Runs in `demo` mode with in-app sandbox code preview banner for frictionless testing. (Ready for Twilio / MessageBird webhook).
- **Payment Gateway**: Runs in `sandbox_escrow` mode with auditable mock transactions (`TXN-LIMO-...`). Ready for Stripe Connect onboarding.

### Unconfigured Features (Pending Production Credentials)
- Production Twilio Account SID & Auth Token (Requires paid SMS gateway for real carrier delivery).
- Production Stripe Connect Webhook Endpoint Secret (Requires active business entity and merchant account).
- Custom Domain DNS Configuration (e.g. `limo.dev` via Vercel CNAME / A-records).
