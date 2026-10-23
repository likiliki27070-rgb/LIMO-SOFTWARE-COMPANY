<img width="1400" height="480" alt="limo-banner" src="https://github.com/user-attachments/assets/3743db9f-4e05-41f0-8068-4af95ac92c24" />[README.md](https://github.com/user-attachments/files/33878284/README.md)

LIMO is```{=html}
<p align="center">
```
`<img src="docs/images/limo-banner.svg" alt="LIMO — Software Development and Freelancing Platform" width="100%">`{=html}
```{=html}
</p>
```
```{=html}
<h1 align="center">
```
LIMO --- Software Development & Freelancing Platform
```{=html}
</h1>
```
```{=html}
<p align="center">
```
`<strong>`{=html}Build. Collaborate.
Deliver.`</strong>`{=html}`<br>`{=html}A connected platform for clients,
freelancers, and digital teams.
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<img alt="Status" src="https://img.shields.io/badge/status-in%20development-blue">`{=html}
`<img alt="Platform" src="https://img.shields.io/badge/platform-web%20%2B%20mobile-0891b2">`{=html}
`<img alt="Stack" src="https://img.shields.io/badge/TypeScript-ready-3178C6">`{=html}
```{=html}
</p>
```
## 1. About LIMO

**LIMO** is a startup concept combining a software development agency
and a freelancing marketplace. It aims to help individuals and
businesses discover digital services, post project requirements, connect
with freelancers, and manage delivery through a professional website and
mobile app.

-   **Website:** service pages, marketplace discovery, project
    management, and administration.
-   **Mobile app:** project discovery, proposals, messaging,
    notifications, and account management.
-   **Shared backend:** consistent project data and authorization rules
    across both platforms.

> **Project status:** This README describes the intended product and a
> suggested setup. It does not mean every feature is already
> implemented. Always check the repository's actual code and scripts.

## 2. Product vision

Make it easier for clients to find technology services and for
freelancers to discover relevant work, communicate clearly, and manage
delivery through a single, secure workflow.

## 3. Full benefits

### Benefits for clients

-   **Easier service discovery:** explore software development services
    and submit project inquiries in one place.
-   **Structured project briefs:** describe goals, scope, skills, budget
    range, and expected timeline.
-   **Proposal comparison:** review freelancer proposals and portfolios
    in a consistent workflow.
-   **Clearer project progress:** track milestones, status, and
    deliverables.
-   **Centralized communication:** keep project-related messages
    associated with the project.
-   **Cross-device access:** use the website for detailed work and the
    mobile app for updates on the go.

### Benefits for freelancers

-   **Professional profile:** showcase skills, experience, services, and
    portfolio examples.
-   **Project discovery:** browse opportunities and filter by relevant
    category or skills.
-   **Proposal tracking:** manage submissions and see their status.
-   **Organized delivery:** coordinate milestones, messages, and
    deliverables.
-   **Better visibility:** make services discoverable to potential
    clients, depending on marketplace adoption.

### Benefits for the LIMO business

-   **Two connected offerings:** combine agency services and marketplace
    workflows under one brand.
-   **More structured operations:** use dashboards and project workflows
    to reduce manual coordination.
-   **Potential revenue options:** service contracts, clearly disclosed
    marketplace fees, business plans, or maintenance agreements.
-   **Incremental growth:** start with essential features and expand
    based on customer feedback.
-   **Shared foundation:** a common backend can reduce duplication
    between web and mobile.

### Benefits for the product and team

-   **Consistent data:** both apps can use the same authorized backend
    records.
-   **Security by design:** server-side permissions and private storage
    can help reduce unauthorized access when implemented correctly.
-   **Maintainability:** TypeScript, documented setup, and automated
    tests can make changes easier to review.
-   **Responsive experience:** interfaces can be optimized for desktop,
    tablet, and mobile.
-   **Measurable improvement:** product feedback and usage metrics can
    help guide development.

These are intended benefits, not guaranteed business outcomes. Results
depend on implementation quality, user adoption, support, and operating
processes.

## 4. Main features

### Agency services

-   Service catalogue and detail pages
-   Project inquiry and contact form
-   Portfolio and case studies
-   Company information and support details

### Freelance marketplace

-   Project creation and browsing
-   Search/filter by category, skills, budget range, and status
-   Freelancer profiles and portfolios
-   Proposal submission and review
-   Project status and milestone tracking

### Collaboration

-   Project-specific messaging
-   Notifications for relevant project activity
-   Private file and deliverable uploads
-   Activity history for important updates

### Separate dashboards

-   **Client:** projects, proposals, milestones, conversations.
-   **Freelancer:** opportunities, proposals, active projects,
    portfolio.
-   **Admin:** moderation, reports, user management, platform
    operations.

Backend rules must enforce permissions. Hiding a frontend page alone is
not security.

## 5. Authentication

The planned sign-in options are limited to: 1. **Mobile number + SMS
OTP** 2. **Google sign-in**

For SMS OTP, every resend must issue a fresh OTP and immediately
invalidate the previous one. Apply short expiry periods, resend
cooldowns, attempt limits, and rate limits. Verify codes on the server
or through a trusted authentication provider---never only in frontend
code.

Google sign-in should use a trusted OAuth flow with server-validated
sessions. Keep OAuth secrets out of client code.

**Cost note:** Testing may include limited free verification, but live
SMS delivery commonly costs money. Check current provider pricing and
country support before launch.

## 6. Suggested technology stack

  Layer              Suggested option
  ------------------ ----------------------------------------------
  Website            Next.js + TypeScript
  UI                 Tailwind CSS
  Mobile             React Native + Expo + TypeScript
  Backend/database   Supabase + PostgreSQL, or equivalent
  Authentication     Managed auth with phone OTP and Google OAuth
  Realtime           Supabase Realtime or equivalent
  File storage       Private object storage with access controls
  Source control     Git + GitHub
  Website hosting    Vercel or suitable alternative

This is a proposed stack, not a statement about the current code. Free
tiers have usage limits and can change.

## 7. Architecture

```{=html}
<p align="center">
```
`<img src="docs/images/limo-architecture.svg" alt="LIMO website and mobile app sharing a backend, database, private storage, and realtime services" width="100%">`{=html}
```{=html}
</p>
```
The intended architecture uses separate web/mobile interfaces connected
to a shared backend. The backend handles authentication, validation,
business rules, and authorization. The database stores profiles,
projects, proposals, and milestones; private storage holds project
files; realtime services can support messages and project updates.

## 8. Suggested repository structure

``` text
limo/
├── web/                 # Next.js website
├── mobile/              # React Native + Expo app
├── shared/              # optional shared types/validation
├── supabase/            # optional migrations/config
├── docs/images/         # README graphics
├── .env.example
└── README.md
```

Your repository may be structured differently. Use the actual folders
and scripts in your project.

## 9. Run the website locally

### Prerequisites

-   Install a supported Node.js LTS version and Git.
-   Clone a repository you own or have permission to access.
-   Configure backend/auth services if the app requires them.

### Step 1 --- Clone

``` bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

### Step 2 --- Install dependencies

If the website is in `web/`:

``` bash
cd web
npm install
```

If `package.json` is at the repository root, run `npm install` there
instead.

### Step 3 --- Configure environment variables

Create `.env.local` from the project's example file and fill in values
from your configured providers. Example names only:

``` dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
SMS_PROVIDER_API_KEY=
```

Use only variables required by your code. Never commit real secrets.
Privileged keys must remain server-side and must never be exposed with a
`NEXT_PUBLIC_` prefix.

### Step 4 --- Start the website

Check `package.json` for the available scripts. If it defines `dev`,
run:

``` bash
npm run dev
```

Open the local URL shown in the terminal. A default Next.js app commonly
uses `http://localhost:3000`.

## 10. Run the mobile app locally

### Prerequisites

-   Node.js LTS and Git
-   Expo Go on a compatible device, or an Android/iOS emulator
-   Configured backend and authentication settings

### Step 1 --- Install dependencies

From the repository root, if the app is in `mobile/`:

``` bash
cd mobile
npm install
```

### Step 2 --- Configure the app

Follow the mobile project's environment convention and provider
instructions. Never put privileged service keys or provider secrets in a
mobile bundle. For a physical phone, `localhost` usually means the phone
itself; use the development server's LAN address or a reachable
development backend.

### Step 3 --- Start Expo

If the project uses Expo and has the usual script:

``` bash
npx expo start
```

Follow the terminal instructions to open it in Expo Go or an emulator.
To clear Expo's local bundler cache:

``` bash
npx expo start --clear
```

These commands are examples for a typical Expo setup; follow the actual
project's scripts if they differ.

## 11. Run website and mobile together

1.  Open terminal 1 and start the website from its folder.
2.  Open terminal 2 and start Expo from the mobile folder.
3.  Confirm both apps use the intended development backend.
4.  Test authentication, role permissions, project creation, messaging,
    and updates on both platforms.

One root command will start both only if the repository is configured
for that workflow.

## 12. Security checklist

-   [ ] Enforce roles in backend/database rules.
-   [ ] Enable and test Row Level Security (RLS) or equivalent.
-   [ ] Restrict access to private projects, messages, and files.
-   [ ] Verify OTP resend invalidates the prior code.
-   [ ] Apply OTP expiry, attempt limits, cooldowns, and rate limits.
-   [ ] Keep privileged keys server-side.
-   [ ] Use private storage and controlled download URLs.
-   [ ] Validate input on the server.
-   [ ] Verify payment webhooks if payments are introduced.
-   [ ] Avoid logging OTPs, passwords, tokens, or sensitive data.
-   [ ] Keep dependencies updated and review security advisories.
-   [ ] Keep the repository private by default until secrets are
    checked.

No app can be guaranteed completely bug-free or perfectly secure;
testing and maintenance are ongoing responsibilities.

## 13. Roadmap

-   [ ] **Foundation:** UI design, web/mobile setup, shared backend,
    authentication.
-   [ ] **Marketplace:** profiles, dashboards, services, projects,
    proposals, permissions.
-   [ ] **Collaboration:** milestones, messaging, notifications, private
    uploads.
-   [ ] **Operations:** moderation, reports, support workflows, payment
    sandbox.
-   [ ] **Launch readiness:** security testing, performance, monitoring,
    backups, policies, staging tests.

## 14. Payments and business model

Potential revenue streams include agency contracts, clearly disclosed
marketplace fees, optional business plans, and maintenance/support
agreements.

Start payment development in sandbox mode. Do not claim real transfers,
escrow, refunds, or payment protection until the provider integration
and operational workflows are implemented and tested. Never store raw
card details directly.

## 15. Deployment

A possible setup is a web host such as Vercel, a configured
backend/database provider, and mobile app distribution after testing. A
free provider subdomain may be available, but custom domains, live SMS,
higher backend usage, storage, monitoring, and app-store distribution
can cost money. Check current provider terms before launch.

## 16. Contributing

Once the repository's contribution process is established: 1. Discuss
major changes in an issue. 2. Create a focused branch. 3. Follow
formatting and testing conventions. 4. Never commit secrets or private
customer data. 5. Submit a pull request with a summary and test results.

## 17. License

Choose a license that matches LIMO's intended ownership and distribution
model. MIT permits broad reuse, including commercial reuse, subject to
its terms. If the code should remain proprietary, do not use MIT by
default. Until a license is added, do not assume the code is licensed
for reuse.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}LIMO --- Build better digital products,
together.`</strong>`{=html}
```{=html}
</p>
```
 a software development agency and freelancing marketplace connecting clients with skilled developers to build websites, mobile apps, and digital solutions through a secure, modern web and mobile platform.


<img width="1400" height="480" alt="limo-banner" src="https://github.com/user-attachments/assets/368dd6a4-6da9-4a57-b4bf-4cfb74a2f12d" />
 ![limo-architecture](https://github.com/user-attachments/assets/9d7f9540-a8d0-4dfe-ac6a-b0b663474f16)

![Uploading li![limo-architecture](https://github.com/user-attachments/assets/76d3cec3-03cb-427a-ad0a-4f99f8eb7d2e)mo-banner.svg…]()

