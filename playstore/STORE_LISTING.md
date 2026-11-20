# Google Play Store Listing & Production Publishing Guide
## PAYBACK — Banking Built Around You.

### Application Metadata
- **Application Name**: PAYBACK: Digital Wallet & Payments
- **Short Description**: Banking Built Around You. Instant Raast transfers, bill payments, and smart VISA card in Pakistan.
- **Default Language**: English (Pakistan / US)
- **Target Category**: Finance
- **Content Rating**: Everyone (PEGI 3 / ESRB Everyone)
- **Package ID**: `com.payback.mobile`
- **Primary Market**: Pakistan
- **Default Currency**: PKR (Pakistani Rupees)

---

### Google Play Store Listing (Copy & Paste Ready)

```markdown
PAYBACK — Banking Built Around You.

PAYBACK is Pakistan's premier digital wallet and modern mobile financial services application. Engineered with an exquisite forest-green and lime aesthetic, PAYBACK gives you total freedom over your money with instant zero-fee Raast transfers, 1Link interbank payments, utility bill settlements, mobile packages, government challans, and virtual VISA cards.

KEY FEATURES:

✨ INSTANT RAAST & INTERBANK TRANSFERS
Send money in seconds to any bank account in Pakistan, Raast ID, CNIC, or PAYBACK wallet with 0% transaction fee. Instant settlement powered by State Bank of Pakistan's Raast payment rails.

💳 SMART VIRTUAL & PHYSICAL VISA CARDS
Enjoy a contactless lime-green debit card designed for modern spending. Freeze or unfreeze your card with a single tap, adjust daily spending limits, and shop securely online.

⚡ ONE-TAP UTILITY BILL PAYMENTS
Pay electricity (LESCO, IESCO, K-Electric, MEPCO, PESCO), Sui gas (SNGPL, SSGC), water authorities (WASA), and high-speed internet (PTCL, StormFiber, Nayatel) with instant digital receipts.

📱 MOBILE EASYLOAD & BUNDLES MARKETPLACE
Recharge pre-paid airtime or pay post-paid bills for Jazz, Zong, Ufone, and Telenor. Subscribe to daily, weekly, and monthly 4G data, call, and hybrid packages with one click.

🏛️ GOVERNMENT TAXES & CHALLAN PAYMENTS
Clear your Federal Board of Revenue (FBR) taxes, e-Challans, and provincial vehicle token taxes directly through official 1Bill integration.

🌍 HOME REMITTANCE VIA SBP PRI
Receive international money transfers from the UK, UAE, USA, and Europe (Western Union, MoneyGram, Ria) directly into your PAYBACK wallet with zero deduction.

🔒 BIOMETRIC SECURITY & HARDWARE KEYSTORE
Protected by hardware-backed fingerprint and Face ID authentication, 4-digit transaction MPIN, and TLS 1.3 end-to-end banking encryption.

PAYBACK — Banking Built Around You.
Download now and elevate your daily financial life.
```

---

### Google Play Financial Services & Data Safety Declarations

| Data Category | Specific Types Collected | Purpose | Ephemeral or Stored | Encryption |
|---|---|---|---|---|
| **Personal Information** | Name, Mobile Number, Email, Nadra CNIC | Account registration, KYC compliance, customer support | Stored securely in database | Encrypted in Transit (TLS 1.3) & at Rest (AES-256) |
| **Financial Information** | Bank Account / IBAN, Transaction History, Card details (masked) | Payment processing, ledger reconciliation, regulatory reporting | Stored securely in double-entry ledger | Encrypted in Transit (TLS 1.3) & at Rest (AES-256) |
| **Device & App Identifiers** | Push notification token, Device ID | Fraud prevention, security alerts, device session management | Stored securely | Encrypted in Transit & at Rest |
| **Camera Access** | QR Camera Viewfinder | Scanning EMVCo Raast / 1Link merchant QR codes | Ephemeral (video stream is never recorded or uploaded) | Real-time on-device scanning |

---

### EAS Build & Release Instructions

#### 1. Generate Standalone Testing APK
```bash
npx eas-cli build -p android --profile preview
```

#### 2. Generate Production Signed Android App Bundle (.aab)
```bash
npx eas-cli build -p android --profile production
```
