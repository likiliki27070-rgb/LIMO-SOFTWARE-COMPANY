# LIMO Mobile — Build, Deployment & Security Architecture Guide

This document contains full engineering instructions for building, testing, distributing, and securing the **LIMO Mobile Application** across Android and iOS platforms.

---

## 1. Prerequisites

- **Node.js**: v20+ LTS (Tested on v24 LTS)
- **Package Manager**: npm or bun
- **Expo CLI**: bundled via `npx expo`
- **EAS CLI**: `npm install -g eas-cli` (or use via `npx eas-cli`)
- **Android**: Android Studio & SDK Platform 34+ (for local builds)
- **iOS**: macOS with Xcode 15+ & CocoaPods (for local iOS builds)

---

## 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure parameters:
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Safe public anon key (never service-role key).
   - `EXPO_PUBLIC_APP_ENV`: `development` | `staging` | `production`
   - `EXPO_PUBLIC_OTP_MODE`: `demo` (preview codes in app) or `supabase_twilio` (real SMS).
   - `EXPO_PUBLIC_PAYMENT_MODE`: `sandbox` (auditable local escrow ledger) or `stripe`.

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Start universal Expo dev server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS required)
npm run ios

# Run in web browser preview
npm run web

# Execute test suite (18 unit tests)
npm test
```

---

## 4. Android Build Instructions

### Option A: Cloud Build with EAS (Recommended — Free & No Android Studio Required)

1. Log in to Expo Application Services:
   ```bash
   npx eas-cli login
   ```
2. Configure project if not already linked:
   ```bash
   npx eas-cli project:init
   ```
3. Build standalone APK for direct installation or testing:
   ```bash
   npx eas-cli build --platform android --profile preview
   ```
4. Build production Android App Bundle (`.aab`) for Google Play Store:
   ```bash
   npx eas-cli build --platform android --profile production
   ```
5. Submit directly to Google Play Store internal testing:
   ```bash
   npx eas-cli submit --platform android
   ```

### Option B: Local Android Build (Continuous Native Generation)

1. Generate native project files:
   ```bash
   npx expo prebuild --platform android
   ```
2. Build debug APK locally:
   ```bash
   cd android
   ./gradlew assembleDebug
   # Output: android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Build release APK locally:
   ```bash
   ./gradlew assembleRelease
   # Output: android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 5. iOS Build Instructions

### Option A: Cloud Build with EAS (Recommended — No macOS Required for Cloud Build)

1. Log in to your Apple Developer account in EAS:
   ```bash
   npx eas-cli credentials
   ```
2. Build Simulator build (`.tar.gz` for iOS Simulator):
   ```bash
   npx eas-cli build --platform ios --profile development
   ```
3. Build Ad-Hoc / Internal Test build:
   ```bash
   npx eas-cli build --platform ios --profile preview
   ```
4. Build Production `.ipa` for TestFlight / App Store:
   ```bash
   npx eas-cli build --platform ios --profile production
   ```
5. Submit directly to TestFlight:
   ```bash
   npx eas-cli submit --platform ios
   ```

### Option B: Local iOS Build (macOS + Xcode Required)

1. Generate native iOS project files:
   ```bash
   npx expo prebuild --platform ios
   ```
2. Install CocoaPods:
   ```bash
   cd ios && pod install && cd ..
   ```
3. Run on connected iPhone or iOS Simulator:
   ```bash
   npx expo run:ios --configuration Release
   ```

---

## 6. Security Review Checklist

| Security Area | Implementation Status | Notes |
|:---|:---:|:---|
| **Plaintext OTP Avoidance** | ✅ Passed | Plaintext OTP is never logged or exposed in production; HMAC cryptographic hash challenges enforce single-use validation. |
| **Fresh OTP on Resend** | ✅ Passed | Every resend generates a fresh code and immediately invalidates previous challenges. |
| **Rate Limiting & Cooldown** | ✅ Passed | 60-second cooldown timer and 5-minute expiry countdown enforced on all verification flows. |
| **Brute Force Protection** | ✅ Passed | Maximum 5 failed verification attempts before challenge lockout. |
| **Server-Side Role Authority** | ✅ Passed | Frontend persona switcher only changes active session view; database enforces roles via PostgreSQL RLS. |
| **No Privileged Keys in Frontend** | ✅ Passed | Only `EXPO_PUBLIC_SUPABASE_ANON_KEY` is referenced. Service role key is strictly backend-only. |
| **Row Level Security (RLS)** | ✅ Passed | 18 PostgreSQL tables protected with strict ownership and participation checks. |
| **Biometric / Secure Storage** | ✅ Passed | Async storage with fallback and zero credential leak on memory clear. |
| **Payment Security** | ✅ Passed | Payment ledger strictly tracks transactional statuses; no raw credit card details collected or stored. |

---

## 7. Feature Matrix

### Completed Features (Fully Functional)
- **Role-Based Navigation**: Dynamic Client, Freelancer, and Admin tab navigation and dashboards.
- **Phone OTP Verification**: Cryptographic challenge generator, resend countdown, attempt limits, instant demo code inspector.
- **Google OAuth Flow**: One-tap authentication entry point with profile sync.
- **Project Marketplace**: Browse, filter by category and skill, view budget ranges, timelines, and proposal count.
- **Project Posting**: Clients can post new projects with category selection, budget range, and timeline.
- **Proposal Submission & Management**: Freelancers submit price, timeline, and cover letter; clients review and shortlist/accept.
- **Project Lifecycle Engine**: State machine handling `draft` -> `open` -> `proposal_review` -> `in_progress` -> `submitted_for_review` -> `completed` / `disputed`.
- **Milestone & Deliverable Tracking**: Milestone progress, deliverable submission links, and client approval workflow.
- **Real-Time Project Messaging**: Conversation rooms per project with participant metadata and instant reply sync.
- **LIMO Agency Direct Quote Modal**: Client inquiry submission for website development, mobile apps, AI, and maintenance.
- **Admin Moderation & Dispute Center**: Platform audit logs, dispute arbitration, user suspension, and verification badges.
- **Auditable Payment Sandbox Ledger**: 10% platform fee calculation, escrow custody records, milestone payment release.
- **Dark & Light Mode**: Seamless theme switching with high-contrast electric-blue accents.

### Demo-Only Features (Clearly Labeled)
- **SMS Provider Gateway**: Simulated in `demo` mode with in-app OTP preview toast and countdown timers. (Ready for Twilio / MessageBird webhook).
- **Payment Gateway**: Operates in `sandbox_escrow` mode with auditable mock transactions (`TXN-...`). Ready for Stripe Connect onboarding.

### Unconfigured Features (Pending Production Credentials)
- Production Twilio Account SID & Auth Token (Requires paid SMS gateway).
- Production Apple Developer Team ID & Google Play Service Account (Requires paid developer accounts for store publishing).
- Production Stripe Connect Webhook Endpoint Secret (Requires active business entity).
