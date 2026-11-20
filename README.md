# PAYBACK — Complete Digital Wallet & Mobile Financial Services Application

**Tagline:** Banking Built Around You.  
**Package ID:** `com.payback.mobile`  
**Primary Market:** Pakistan  
**Default Currency:** PKR (Pakistani Rupees)  
**Primary Platform:** Android (Google Play Release) | Secondary Platform: iOS  
**Design Reference:** Premium Lime-Green (`#C8F33A`) and Dark Forest-Green (`#102000` / `#101C05`) Visual Identity  

---

## 🎨 Strict Visual Design System

The application strictly implements the design system from the visual design specification:

- **Primary Lime**: `#C8F33A`
- **Bright Lime**: `#D9FF4D`
- **Light Lime**: `#E9FF9C`
- **Dark Forest**: `#102000`
- **Deep Green**: `#172900`
- **Card Green**: `#263D08`
- **Secondary Green**: `#3D590A`
- **Text White**: `#FFFFFF`
- **Muted Green**: `#A9BD76`
- **Background**: `#101C05`

---

## 📱 Complete Application Screens & Features

### Core Primary Screens (with Persistent Floating Bottom Navigation)
1. **Home Dashboard** (`src/features/dashboard/DashboardScreen.tsx`):
   - Recreates the center phone from the design specification!
   - Profile avatar with user greeting: Janvis David (`@janvisd`), trophy & notification bell.
   - Large rounded bright lime-green balance card (`#D9FF4D` - `#C8F33A`):
     - Total Balance: `PKR 23,590.73` with privacy eye toggle and options menu.
     - `↑ 24% Last week` growth badge.
     - 4 large circular dark green action buttons: **Send**, **Request**, **Payment**, and **Withdraw**.
     - Subtle downward tab pill under the card.
   - **Favourite Contacts**: Horizontal carousel with `+` add button, contact avatars (Alina `******66`, Mark `******37`, Kuraishi H. `******20`).
   - **Transactions**: Today's activity (Send Money to Kuraishi H. `-PKR 450.00`, Receive from Alina `+PKR 1,250.00`).
   - Quick service shortcuts for Bills, Mobile Load, Government Challans, Savings, and Charity.
   - Admin ledger & systems control portal shortcut.

2. **Cards Management** (`src/features/cards/CardsScreen.tsx`):
   - Recreates the right phone from the design specification!
   - Large bright lime-green VISA card with embossed dark green text:
     - Cardholder Name: **Janvis David**
     - Contactless radiation waves, "Credit"
     - "Valid thru 12/30"
     - Masked Number: `7820 5500 0835 3501`
     - Subtle `PAYBACK` typography watermark.
   - **8 Quick Actions** in dark green squircle tiles:
     1. Send Money
     2. Topup
     3. Statements
     4. Bills Pay
     5. Savings/Loans
     6. Freeze Cards (one-tap instant freeze/unfreeze)
     7. Limit Request (daily spending limit modal)
     8. Deposits
   - `+ Add Cards` physical debit card delivery request button.

3. **QR Scan & Pay** (`src/features/qr/QRScannerModal.tsx`):
   - Prominent elevated circular button in the center of the bottom navigation bar.
   - Full-screen viewfinder with animated lime laser scan line.
   - Flashlight toggle, gallery QR import simulation, and merchant scan preview.
   - Review merchant details (e.g. Al-Fatah Supermarket), authorize payment, and display real-time transaction receipt.

4. **Transaction History** (`src/features/transactions/TransactionsScreen.tsx`):
   - Total activity overview (Total Received vs Total Spent in PKR).
   - Filter tabs: **All**, **Received**, **Sent**, **Bills**, and **Recharge**.
   - Real-time search by name, reference ID, or counterparty.
   - Transaction detail modal with shareable digital receipt.

5. **Search & Services Hub** (`src/features/search/SearchScreen.tsx`):
   - Dedicated search hub for billers, utility providers, government services, mobile bundles, and contacts.
   - Trending searches in Pakistan (LESCO, Jazz Bundle, Raast ID, Traffic Challan, Edhi, PTCL).

### Money Management & Service Modules
6. **Send Money** (`src/features/transfers/TransferScreen.tsx`):
   - Recreates the left phone from the design specification!
   - Lime-green header card with "Transfer from" account pill (`******5890`, `PKR 23,590.73`).
   - Large amount display (editable via custom numeric keypad).
   - Transfer Limits progress bar (`PKR 250,000.00`).
   - Quick Send recipient selector.
   - Dark green custom numeric keypad (1-9, backspace, 0, check).
   - Glowing lime curved **"Hold To Send"** button with interactive authorization progress and digital receipt.
   - Multi-destination support: PAYBACK Wallet, 1Link Commercial Banks, Raast ID, and CNIC.

7. **Utility Bill Payments** (`src/features/payments/BillPaymentsScreen.tsx`):
   - Electricity (LESCO, IESCO, K-Electric, MEPCO, PESCO, FESCO).
   - Sui Gas (SNGPL, SSGC).
   - High-Speed Internet (PTCL Flash Fiber, StormFiber, Nayatel, Transworld).
   - Water Authorities (WASA Lahore, KW&SB Karachi, WASA Rawalpindi).
   - Consumer reference fetch, due date display, and instant settlement.

8. **Mobile Load & Bundle Marketplace** (`src/features/mobile/MobileLoadScreen.tsx`):
   - Easyload recharge for **Jazz**, **Zong**, **Ufone**, and **Telenor**.
   - Quick amount chips (+100, +200, +500, +1000, +2000).
   - Bundle Marketplace with filtering for Daily, Weekly, and Monthly Internet, Calls, SMS, and All-in-One packages.

9. **Government Payments Center** (`src/features/government/GovernmentPaymentsScreen.tsx`):
   - FBR Federal Tax payments, provincial Vehicle Token taxes, and Traffic Police e-Challans via 1Bill.

10. **Home Remittance** (`src/features/remittance/RemittanceScreen.tsx`):
    - Pakistan Remittance Initiative (PRI) compliant incoming international remittance claim (Western Union, MoneyGram, Ria) with real-time exchange rates and zero fee.

11. **Savings Goals** (`src/features/savings/SavingsGoalsScreen.tsx`):
    - Create customized savings vaults (Hajj/Umrah, Emergency Fund, Tech Upgrade) with progress bars and lock rules.

12. **Donations & Charity** (`src/features/donations/DonationsScreen.tsx`):
    - Verified Pakistani organizations: Shaukat Khanum Cancer Hospital, Edhi Foundation, Indus Hospital, Saylani Welfare.

13. **Rewards & Cashback Club** (`src/features/rewards/RewardsScreen.tsx`):
    - Cashback offers on bills, food delivery discounts with PAYBACK card, and promo codes.

14. **Account Statements** (`src/features/statements/StatementsScreen.tsx`):
    - Monthly PDF e-statement generation and download.

15. **Notifications Center** (`src/features/notifications/NotificationsScreen.tsx`):
    - Real-time transaction alerts, security notices, and promotional updates with mark-all-read.

16. **User Profile & Account Limits** (`src/features/profile/ProfileScreen.tsx`):
    - Verified identity tier, Nadra CNIC, IBAN, daily/monthly limits.

17. **Security Center** (`src/features/security/SecurityScreen.tsx`):
    - Biometric toggle (Fingerprint / Face ID), 4-digit transaction MPIN management, trusted device sessions, fraud reporting.

18. **Help & Complaints** (`src/features/support/SupportScreen.tsx`):
    - 24/7 Priority Resolution Desk, ticket registration, and comprehensive FAQs.

19. **About & Regulatory Disclosures** (`src/features/about/AboutLegalScreen.tsx`):
    - SBP compliance disclosures, customer fund escrow protection, Privacy Policy, Terms & Conditions.

20. **Admin Financial Ledger & Operations Portal** (`src/features/admin/AdminDashboardScreen.tsx`):
    - Role-based internal compliance view with real-time gateway health (1Link Switch, Raast Hub, Nadra Verisys), double-entry reconciliation engine, and immutable SBP audit logs.

---

## 🛠️ Architecture & State Management

- **Zustand Ledger Store** (`src/store/useBankStore.ts`): Immutable double-entry transaction architecture, idempotency keys, real-time balance deductions/credits, and complete financial state.
- **Authentication Store** (`src/store/useAuthStore.ts`): SBP KYC compliance, mobile OTP simulation, Nadra CNIC verification, MPIN hashing simulation, and biometrics.
- **Strict Theme System** (`src/theme/colors.ts`): Reusable palette tokens, gradients, and glow effects.
- **TypeScript Type System** (`src/types/index.ts`): Fully typed domain models for accounts, transactions, cards, bills, bundles, and audit logs.

---

## 🚀 Running & Testing the App

### Start Local Development Server
```bash
npm start
```

### Run on Android Device / Emulator
```bash
npm run android
```

### Run Typecheck
```bash
npx tsc --noEmit
```

---

## 📦 Google Play Store Production Build

### 1. Build Standalone Testing APK
```bash
npx eas-cli build -p android --profile preview
```

### 2. Build Production Signed Google Play App Bundle (.aab)
```bash
npx eas-cli build -p android --profile production
```
