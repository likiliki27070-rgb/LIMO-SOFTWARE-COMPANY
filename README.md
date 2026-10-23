<p align="center">
  <img width="1400" height="480" alt="limo-banner" src="https://github.com/user-attachments/assets/368dd6a4-6da9-4a57-b4bf-4cfb74a2f12d" />
</p>

# LIMO — Professional Software Agency & Freelancing Marketplace

<p align="center">
  <strong>Build Better. Work Smarter. Grow Together.</strong>
</p>

LIMO is a dual-engine digital platform combining a **Software Development Agency** (Website Dev, Web SaaS, Mobile Apps, UI/UX Systems, AI/LLMs, Custom Software, Maintenance) with an **Escrow-Protected Freelancing Marketplace**.

---

## 📁 Repository Structure

```
.
├── limo-mobile/           # Universal Mobile App (React Native, Expo Router, TypeScript)
├── limo-web/              # Next.js 15 Web Application & Public Marketplace (Tailwind CSS)
├── supabase/              # PostgreSQL Schemas, Migrations & Seed Data
│   ├── migrations/        # 20261022000000_init_limo_schema.sql (18 Relational Tables + RLS)
│   └── seed.sql           # Verified Profiles, Contracts, Milestones & Ledgers
└── .gitignore             # Root security filter (protects credentials & build artifacts)
```

---

## 🚀 Quick Start

### 1. Web Application (`limo-web`)

```bash
cd limo-web
npm install
npm test            # Run 15 automated Jest tests
npm run build       # Build optimized Next.js production bundle
npm start           # Run on http://localhost:3000
```

### 2. Mobile Application (`limo-mobile`)

```bash
cd limo-mobile
npm install
npm test            # Run 18 automated Jest tests
npx tsc --noEmit    # Type-check with 0 errors
npx expo start      # Launch Expo dev server (iOS, Android, Web preview)
```

### 3. Database Deployment (`supabase`)

1. Open your Supabase SQL Editor: [https://supabase.com/dashboard/project/lrjmkfblhmczqxfqdohd/sql/new](https://supabase.com/dashboard/project/lrjmkfblhmczqxfqdohd/sql/new)
2. Execute `supabase/migrations/20261022000000_init_limo_schema.sql`.
3. Execute `supabase/seed.sql`.

---

## 🛡️ Security & Authentication

- **Phone OTP**: 6-digit cryptographically generated OTP, 5-minute expiry, 60s resend cooldown, max 5 failed attempts, zero plaintext logging.
- **Google OAuth**: Verified token flow with provider boundary.
- **Role Isolation**: Dedicated dashboards for **Clients**, **Freelancers**, and **Platform Administrators**.
- **Auditable Escrow**: 10% platform commission calculation with transactional state transitions.
- **Data Protection**: Supabase Row Level Security (RLS) policies protecting tenant isolation and private messaging.

---

## 📜 Documentation

- [Mobile Build & EAS Distribution Guide](file:///d:/private/first%20demo%20%20for%20startup/limo-mobile/BUILD_AND_DEPLOY.md)
- [Web Deployment & Security Architecture Guide](file:///d:/private/first%20demo%20%20for%20startup/limo-web/DEPLOYMENT_AND_SECURITY.md)

---

## ⚖️ License
Proprietary — All rights reserved by LIMO.
