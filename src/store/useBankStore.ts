import { create } from 'zustand';
import {
  BankAccount,
  Transaction,
  VirtualCard,
  QuickContact,
  BillItem,
  MobilePackage,
  GovernmentBill,
  SavingsGoal,
  CharityOrganization,
  RewardPromotion,
  NotificationItem,
  RemittanceRecord,
  AdminAuditLog,
} from '../types';

interface BankState {
  account: BankAccount;
  card: VirtualCard;
  favouriteContacts: QuickContact[];
  transactions: Transaction[];
  bills: BillItem[];
  mobilePackages: MobilePackage[];
  governmentBills: GovernmentBill[];
  savingsGoals: SavingsGoal[];
  charities: CharityOrganization[];
  rewards: RewardPromotion[];
  notifications: NotificationItem[];
  remittances: RemittanceRecord[];
  auditLogs: AdminAuditLog[];

  // Actions
  toggleHideBalance: () => void;
  toggleFreezeCard: () => void;
  updateCardLimit: (newLimit: number) => void;
  updateCardPin: (newPin: string) => boolean;

  sendMoney: (params: {
    recipientName: string;
    accountNumber: string;
    amount: number;
    destinationType?: 'wallet' | 'bank' | 'raast' | 'cnic';
    bankName?: string;
    note?: string;
  }) => { success: boolean; message: string; transactionId?: string };

  requestMoney: (params: {
    recipientName: string;
    phoneNumber: string;
    amount: number;
    note?: string;
  }) => { success: boolean; message: string; requestId?: string };

  payBill: (billId: string) => { success: boolean; message: string; transactionId?: string };

  rechargeMobile: (params: {
    network: 'Jazz' | 'Zong' | 'Ufone' | 'Telenor';
    phoneNumber: string;
    amount: number;
    isPostpaid?: boolean;
  }) => { success: boolean; message: string; transactionId?: string };

  subscribePackage: (packageId: string, phoneNumber: string) => { success: boolean; message: string; transactionId?: string };

  payGovernmentBill: (billId: string) => { success: boolean; message: string; transactionId?: string };

  claimRemittance: (remittanceId: string) => { success: boolean; message: string; transactionId?: string };

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => void;
  depositToSavingsGoal: (goalId: string, amount: number) => { success: boolean; message: string };

  donateToCharity: (charityId: string, amount: number) => { success: boolean; message: string; transactionId?: string };

  redeemReward: (rewardId: string) => { success: boolean; message: string };

  addMoney: (amount: number, method: string) => { success: boolean; message: string; transactionId?: string };

  withdrawMoney: (amount: number, method: string) => { success: boolean; message: string; transactionId?: string };

  scanAndPayQR: (qrData: {
    merchantName: string;
    merchantId: string;
    amount: number;
    description: string;
  }) => { success: boolean; message: string; transactionId?: string };

  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useBankStore = create<BankState>((set, get) => ({
  account: {
    id: 'acc_payback_pk_01',
    accountNumber: 'PK82PAYB0000000000005890',
    maskedNumber: '******5890',
    iban: 'PK82 PAYB 0000 0000 0000 5890',
    balance: 23590.73, // Exact balance matching the reference image!
    currency: 'PKR',
    currencySymbol: 'PKR',
    isBalanceHidden: false,
    status: 'active',
    lastUpdated: 'Just now',
  },

  card: {
    id: 'crd_payback_elite_01',
    cardholderName: 'Janvis David', // Exact cardholder name from reference image!
    cardNumberMasked: '7820 5500 0835 3501', // Exact number from reference image!
    cardNumberFull: '7820 5500 0835 3501',
    expiryDate: '12/30', // Exact valid thru from reference image!
    cvv: '894',
    cardBrand: 'VISA',
    cardType: 'Credit',
    isFrozen: false,
    dailyLimit: 250000,
    currentSpend: 42500,
    internationalPayments: true,
    onlinePayments: true,
    atmWithdrawals: true,
  },

  favouriteContacts: [
    {
      id: 'c_01',
      name: 'Alina',
      handle: '@alina',
      phoneNumber: '+92 301 9988766',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      accountMasked: '******66',
      bankName: 'PAYBACK Wallet',
    },
    {
      id: 'c_02',
      name: 'Mark',
      handle: '@mark_w',
      phoneNumber: '+92 321 4455637',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      accountMasked: '******37',
      bankName: 'Meezan Bank',
    },
    {
      id: 'c_03',
      name: 'Kuraishi H.',
      handle: '@kuraishi',
      phoneNumber: '+92 333 7788920',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      accountMasked: '******20',
      bankName: 'Bank Alfalah',
    },
    {
      id: 'c_04',
      name: 'Zainab B.',
      handle: '@zainab',
      phoneNumber: '+92 345 1122334',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      accountMasked: '******34',
      bankName: 'HBL Raast',
    },
  ],

  transactions: [
    {
      id: 'tx_01',
      title: 'Send Money to Kuraishi H.',
      counterparty: 'Kuraishi H.',
      counterpartySub: 'Bank Alfalah • TrxID: CJ4901TUZ0',
      amount: 450.00,
      type: 'debit',
      category: 'transfer',
      date: 'Today',
      time: '05:29 PM',
      status: 'completed',
      referenceId: 'CJ4901TUZ0',
      fee: 0,
      note: 'Dinner split bill',
      paymentMethod: 'PAYBACK Wallet',
    },
    {
      id: 'tx_02',
      title: 'Receive from Alina',
      counterparty: 'Alina',
      counterpartySub: 'PAYBACK Wallet • TrxID: CJ790Z8UX4',
      amount: 1250.00,
      type: 'credit',
      category: 'transfer',
      date: 'Today',
      time: '12:37 PM',
      status: 'completed',
      referenceId: 'CJ790Z8UX4',
      fee: 0,
      note: 'Shopping contribution',
      paymentMethod: 'Raast Direct',
    },
    {
      id: 'tx_03',
      title: 'LESCO Electricity Bill',
      counterparty: 'LESCO Power Utility',
      counterpartySub: 'Consumer: 08112938475891',
      amount: 5420.00,
      type: 'debit',
      category: 'bill',
      date: 'Yesterday',
      time: '04:15 PM',
      status: 'completed',
      referenceId: 'PAYB-BL-489102',
      fee: 0,
      note: 'October 2026 Home Electric Bill',
      paymentMethod: 'PAYBACK Direct Debit',
    },
    {
      id: 'tx_04',
      title: 'Jazz Super 4G Bundle',
      counterparty: 'Jazz Mobile Network',
      counterpartySub: '0300 8472910',
      amount: 890.00,
      type: 'debit',
      category: 'bundle',
      date: '18 Nov 2026',
      time: '11:00 AM',
      status: 'completed',
      referenceId: 'PAYB-MB-772918',
      fee: 0,
      note: 'Monthly Mega 50GB',
      paymentMethod: 'Direct Recharge',
    },
    {
      id: 'tx_05',
      title: 'Home Remittance Received',
      counterparty: 'David Warner (UK)',
      counterpartySub: 'Western Union MTCN: 984-291-8841',
      amount: 14500.00,
      type: 'credit',
      category: 'remittance',
      date: '17 Nov 2026',
      time: '02:45 PM',
      status: 'completed',
      referenceId: 'WU-PK-984291',
      fee: 0,
      note: 'Family Support PKR Transfer',
      paymentMethod: 'Prize Bond / Remittance Rail',
    },
    {
      id: 'tx_06',
      title: 'Donation - Shaukat Khanum',
      counterparty: 'SKMCH Cancer Hospital',
      counterpartySub: 'Zakat & Donation Fund',
      amount: 2000.00,
      type: 'debit',
      category: 'donation',
      date: '16 Nov 2026',
      time: '08:20 PM',
      status: 'completed',
      referenceId: 'PAYB-DN-339182',
      fee: 0,
      note: 'Monthly Sadaqah',
      paymentMethod: 'PAYBACK Charity Hub',
    },
  ],

  bills: [
    {
      id: 'bill_01',
      category: 'electricity',
      providerName: 'LESCO Electricity',
      consumerNumber: '08112938475891',
      consumerName: 'Janvis David',
      amount: 6850.00,
      dueDate: '28 Nov 2026',
      status: 'unpaid',
      icon: 'zap',
    },
    {
      id: 'bill_02',
      category: 'electricity',
      providerName: 'IESCO Islamabad',
      consumerNumber: '04918274659102',
      consumerName: 'Janvis David',
      amount: 4200.00,
      dueDate: '30 Nov 2026',
      status: 'unpaid',
      icon: 'zap',
    },
    {
      id: 'bill_03',
      category: 'gas',
      providerName: 'SNGPL Sui Northern',
      consumerNumber: '998471928471',
      consumerName: 'Janvis David',
      amount: 1450.00,
      dueDate: '02 Dec 2026',
      status: 'unpaid',
      icon: 'flame',
    },
    {
      id: 'bill_04',
      category: 'internet',
      providerName: 'PTCL Flash Fiber',
      consumerNumber: '04238910291',
      consumerName: 'Janvis David',
      amount: 3250.00,
      dueDate: '25 Nov 2026',
      status: 'unpaid',
      icon: 'wifi',
    },
    {
      id: 'bill_05',
      category: 'water',
      providerName: 'WASA Water Authority',
      consumerNumber: 'WASA-LHR-9841',
      consumerName: 'Janvis David',
      amount: 850.00,
      dueDate: '05 Dec 2026',
      status: 'unpaid',
      icon: 'droplet',
    },
  ],

  mobilePackages: [
    {
      id: 'pkg_01',
      network: 'Jazz',
      name: 'Monthly Mega Super 50GB',
      category: 'Internet',
      validity: 'Monthly',
      price: 1199,
      data: '50 GB (25GB 2am-2pm)',
      onNetMinutes: '5000 Mins',
      offNetMinutes: '500 Mins',
      sms: '5000 SMS',
      description: 'The ultimate monthly all-round bundle for high data users.',
    },
    {
      id: 'pkg_02',
      network: 'Jazz',
      name: 'Weekly Super Duper',
      category: 'All-in-One',
      validity: 'Weekly',
      price: 440,
      data: '10 GB High Speed',
      onNetMinutes: '1500 Mins',
      offNetMinutes: '100 Mins',
      sms: '1500 SMS',
      description: 'Weekly convenience bundle with calls to all networks.',
    },
    {
      id: 'pkg_03',
      network: 'Zong',
      name: 'Monthly Pro Max 60GB',
      category: 'Internet',
      validity: 'Monthly',
      price: 1350,
      data: '60 GB Ultra 4G',
      onNetMinutes: 'Unlimited Zong',
      offNetMinutes: '600 Mins',
      sms: 'Unlimited SMS',
      description: 'Zong lightning fast 4G with heavy social data streaming.',
    },
    {
      id: 'pkg_04',
      network: 'Ufone',
      name: 'Super Card Gold',
      category: 'All-in-One',
      validity: 'Monthly',
      price: 1200,
      data: '30 GB + Unlimited WhatsApp',
      onNetMinutes: 'Unlimited Ufone/PTCL',
      offNetMinutes: '600 Mins',
      sms: 'Unlimited SMS',
      description: 'Befikr monthly connectivity for calls and internet.',
    },
    {
      id: 'pkg_05',
      network: 'Telenor',
      name: 'EasyCard 1000',
      category: 'All-in-One',
      validity: 'Monthly',
      price: 990,
      data: '25 GB Data',
      onNetMinutes: '3000 Mins',
      offNetMinutes: '350 Mins',
      sms: '3000 SMS',
      description: 'Telenor signature digital easycard bundle.',
    },
  ],

  governmentBills: [
    {
      id: 'gov_01',
      department: 'Traffic Challan',
      challanNumber: 'LHR-CH-2026-99182',
      title: 'Overspeeding - Ring Road Lahore',
      amount: 1500,
      dueDate: '27 Nov 2026',
      status: 'unpaid',
    },
    {
      id: 'gov_02',
      department: 'Vehicle Token',
      challanNumber: 'ET-PB-V-481920',
      title: 'Annual Token Tax (LEA-24-8192)',
      amount: 4800,
      dueDate: '15 Dec 2026',
      status: 'unpaid',
    },
    {
      id: 'gov_03',
      department: 'FBR Tax',
      challanNumber: 'FBR-CPR-2026-441829',
      title: 'Advance Tax on Digital Services',
      amount: 1250,
      dueDate: '30 Nov 2026',
      status: 'unpaid',
    },
  ],

  savingsGoals: [
    {
      id: 'goal_01',
      name: 'Hajj & Umrah Pilgrimage',
      targetAmount: 500000,
      savedAmount: 185000,
      targetDate: 'May 2027',
      category: 'Hajj/Umrah',
    },
    {
      id: 'goal_02',
      name: 'Emergency Rainy Day Fund',
      targetAmount: 100000,
      savedAmount: 64000,
      targetDate: 'Dec 2026',
      category: 'Emergency',
    },
    {
      id: 'goal_03',
      name: 'MacBook M4 Pro Upgrade',
      targetAmount: 350000,
      savedAmount: 220000,
      targetDate: 'Jan 2027',
      category: 'Tech',
    },
  ],

  charities: [
    {
      id: 'ch_01',
      name: 'Shaukat Khanum Memorial Hospital',
      category: 'Healthcare',
      description: 'Free cancer diagnosis & compassionate treatment for underprivileged patients across Pakistan.',
      verified: true,
      logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=120',
    },
    {
      id: 'ch_02',
      name: 'Edhi Foundation Pakistan',
      category: 'Disaster Relief',
      description: 'World largest volunteer ambulance service, orphanages, and emergency relief network.',
      verified: true,
      logo: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=120',
    },
    {
      id: 'ch_03',
      name: 'Indus Hospital & Health Network',
      category: 'Healthcare',
      description: '100% free multidisciplinary healthcare of global standards for millions in Pakistan.',
      verified: true,
      logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=120',
    },
    {
      id: 'ch_04',
      name: 'Saylani Welfare International Trust',
      category: 'Food',
      description: 'Providing free daily meals, clean water RO plants, and technical vocational education.',
      verified: true,
      logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120',
    },
  ],

  rewards: [
    {
      id: 'rw_01',
      title: '5% Instant Cashback on Utility Bills',
      discountOrCashback: '5% Cashback',
      code: 'PAYBACKBIZ',
      expiryDate: '30 Nov 2026',
      isRedeemed: false,
      category: 'Cashback',
    },
    {
      id: 'rw_02',
      title: 'PKR 100 Free Recharge on First Bundle',
      discountOrCashback: 'PKR 100 Off',
      code: 'RECHARGE100',
      expiryDate: '15 Dec 2026',
      isRedeemed: false,
      category: 'Recharge',
    },
    {
      id: 'rw_03',
      title: '20% Off on Foodpanda with PAYBACK Card',
      discountOrCashback: '20% Discount',
      code: 'FOODPAYBACK',
      expiryDate: '31 Dec 2026',
      isRedeemed: false,
      category: 'Dining',
    },
  ],

  notifications: [
    {
      id: 'notif_01',
      title: 'Payment Successful',
      description: 'Transferred PKR 450.00 to Kuraishi H. (Ref: CJ4901TUZ0)',
      timestamp: 'Today, 05:29 PM',
      isRead: false,
      type: 'transaction',
    },
    {
      id: 'notif_02',
      title: 'Money Received via Raast',
      description: 'Received PKR 1,250.00 from Alina into your PAYBACK wallet.',
      timestamp: 'Today, 12:37 PM',
      isRead: false,
      type: 'transaction',
    },
    {
      id: 'notif_03',
      title: 'Security Alert: Biometric Login',
      description: 'Biometric authorization verified successfully on your primary device.',
      timestamp: 'Yesterday, 09:15 AM',
      isRead: true,
      type: 'security',
    },
    {
      id: 'notif_04',
      title: 'Exclusive Offer: 0% Fee',
      description: 'Enjoy zero fee on all inter-bank fund transfers through Raast this month.',
      timestamp: '15 Nov 2026',
      isRead: true,
      type: 'promo',
    },
  ],

  remittances: [
    {
      id: 'rem_01',
      senderName: 'David Warner',
      sendingCountry: 'United Kingdom (GBP)',
      mtcnReference: '984-291-8841',
      amountForeign: 40.00,
      foreignCurrency: 'GBP',
      exchangeRate: 362.50,
      amountPkr: 14500.00,
      status: 'claimed',
      date: '17 Nov 2026',
    },
    {
      id: 'rem_02',
      senderName: 'Usman Ghani',
      sendingCountry: 'United Arab Emirates (AED)',
      mtcnReference: '712-401-9283',
      amountForeign: 500.00,
      foreignCurrency: 'AED',
      exchangeRate: 76.20,
      amountPkr: 38100.00,
      status: 'available',
      date: '20 Nov 2026',
    },
  ],

  auditLogs: [
    {
      id: 'aud_01',
      action: 'SYSTEM_LEDGER_RECONCILE',
      performedBy: 'Automated SBP Batch Engine',
      timestamp: '2026-11-20 04:00:00',
      details: 'Double-entry balance check passed for 48,209 customer accounts. Discrepancies: 0.',
      status: 'success',
    },
    {
      id: 'aud_02',
      action: 'USER_KYC_VERIFICATION',
      performedBy: 'Compliance Officer (EMP-882)',
      timestamp: '2026-11-19 14:22:10',
      details: 'Janvis David Nadra CNIC 35201-xxxxxxx-7 biometric match verified via 1Link biometric gate.',
      status: 'success',
    },
  ],

  // ── Actions ──
  toggleHideBalance: () => {
    set((state) => ({
      account: { ...state.account, isBalanceHidden: !state.account.isBalanceHidden },
    }));
  },

  toggleFreezeCard: () => {
    set((state) => {
      const nextState = !state.card.isFrozen;
      return {
        card: { ...state.card, isFrozen: nextState },
        notifications: [
          {
            id: `notif_${Date.now()}`,
            title: nextState ? 'Card Frozen' : 'Card Unfrozen',
            description: nextState
              ? 'Your PAYBACK virtual card has been temporarily frozen.'
              : 'Your PAYBACK virtual card is active and ready for payments.',
            timestamp: 'Just now',
            isRead: false,
            type: 'security',
          },
          ...state.notifications,
        ],
      };
    });
  },

  updateCardLimit: (newLimit: number) => {
    set((state) => ({
      card: { ...state.card, dailyLimit: newLimit },
    }));
  },

  updateCardPin: (newPin: string) => {
    if (newPin.length === 4) {
      return true;
    }
    return false;
  },

  sendMoney: ({ recipientName, accountNumber, amount, destinationType = 'wallet', bankName = 'PAYBACK Wallet', note }) => {
    const { account, transactions } = get();

    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than PKR 0.' };
    }
    if (amount > account.balance) {
      return { success: false, message: 'Insufficient wallet balance.' };
    }

    const txId = `CJ${Math.random().toString(36).substring(2, 8).toUpperCase()}PK`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Send Money to ${recipientName}`,
      counterparty: recipientName,
      counterpartySub: `${bankName} • ${accountNumber}`,
      amount,
      type: 'debit',
      category: 'transfer',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: note || 'Fund Transfer',
      paymentMethod: `${destinationType.toUpperCase()} Transfer`,
    };

    set({
      account: { ...account, balance: account.balance - amount },
      transactions: [newTx, ...transactions],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'Transfer Sent Successfully',
          description: `PKR ${amount.toLocaleString()} sent to ${recipientName} (Ref: ${txId})`,
          timestamp: 'Just now',
          isRead: false,
          type: 'transaction',
        },
        ...get().notifications,
      ],
    });

    return { success: true, message: 'Transfer completed successfully', transactionId: txId };
  },

  requestMoney: ({ recipientName, phoneNumber, amount, note }) => {
    const reqId = `REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      success: true,
      message: `Payment request of PKR ${amount.toLocaleString()} sent to ${recipientName} (${phoneNumber})`,
      requestId: reqId,
    };
  },

  payBill: (billId: string) => {
    const { account, bills, transactions } = get();
    const targetBill = bills.find((b) => b.id === billId);

    if (!targetBill) {
      return { success: false, message: 'Bill record not found.' };
    }
    if (targetBill.status === 'paid') {
      return { success: false, message: 'This bill has already been paid.' };
    }
    if (targetBill.amount > account.balance) {
      return { success: false, message: 'Insufficient balance to pay this bill.' };
    }

    const txId = `PAYB-BL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `${targetBill.providerName} Bill Payment`,
      counterparty: targetBill.providerName,
      counterpartySub: `Consumer: ${targetBill.consumerNumber}`,
      amount: targetBill.amount,
      type: 'debit',
      category: 'bill',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: `Utility Bill for ${targetBill.consumerName}`,
      paymentMethod: 'PAYBACK Direct Debit',
    };

    set({
      account: { ...account, balance: account.balance - targetBill.amount },
      bills: bills.map((b) => (b.id === billId ? { ...b, status: 'paid' as const } : b)),
      transactions: [newTx, ...transactions],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'Bill Paid Successfully',
          description: `PKR ${targetBill.amount.toLocaleString()} paid for ${targetBill.providerName}`,
          timestamp: 'Just now',
          isRead: false,
          type: 'transaction',
        },
        ...get().notifications,
      ],
    });

    return { success: true, message: 'Bill paid successfully', transactionId: txId };
  },

  rechargeMobile: ({ network, phoneNumber, amount }) => {
    const { account, transactions } = get();
    if (amount <= 0 || amount > account.balance) {
      return { success: false, message: 'Insufficient balance for recharge.' };
    }

    const txId = `PAYB-RC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `${network} Easyload Recharge`,
      counterparty: `${network} Pakistan`,
      counterpartySub: phoneNumber,
      amount,
      type: 'debit',
      category: 'recharge',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: `Mobile Airtime Recharge`,
      paymentMethod: 'Instant Easyload Rail',
    };

    set({
      account: { ...account, balance: account.balance - amount },
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: 'Mobile recharge successful', transactionId: txId };
  },

  subscribePackage: (packageId: string, phoneNumber: string) => {
    const { account, mobilePackages, transactions } = get();
    const pkg = mobilePackages.find((p) => p.id === packageId);
    if (!pkg) return { success: false, message: 'Package not found' };
    if (pkg.price > account.balance) return { success: false, message: 'Insufficient balance for this bundle' };

    const txId = `PAYB-PKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `${pkg.network} ${pkg.name}`,
      counterparty: `${pkg.network} Mobile`,
      counterpartySub: phoneNumber,
      amount: pkg.price,
      type: 'debit',
      category: 'bundle',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: pkg.description,
      paymentMethod: 'Bundle Activation API',
    };

    set({
      account: { ...account, balance: account.balance - pkg.price },
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: 'Bundle activated successfully!', transactionId: txId };
  },

  payGovernmentBill: (billId: string) => {
    const { account, governmentBills, transactions } = get();
    const govBill = governmentBills.find((g) => g.id === billId);
    if (!govBill) return { success: false, message: 'Government challan not found' };
    if (govBill.amount > account.balance) return { success: false, message: 'Insufficient wallet balance' };

    const txId = `GOV-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: govBill.title,
      counterparty: `Government of Pakistan (${govBill.department})`,
      counterpartySub: `Challan: ${govBill.challanNumber}`,
      amount: govBill.amount,
      type: 'debit',
      category: 'government',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      paymentMethod: '1Link 1Bill Gov Gateway',
    };

    set({
      account: { ...account, balance: account.balance - govBill.amount },
      governmentBills: governmentBills.map((g) => (g.id === billId ? { ...g, status: 'paid' as const } : g)),
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: 'Challan payment cleared with treasury.', transactionId: txId };
  },

  claimRemittance: (remittanceId: string) => {
    const { account, remittances, transactions } = get();
    const rem = remittances.find((r) => r.id === remittanceId);
    if (!rem || rem.status === 'claimed') return { success: false, message: 'Remittance unavailable or already claimed.' };

    const txId = `WU-CLAIM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Home Remittance Received`,
      counterparty: rem.senderName,
      counterpartySub: `MTCN: ${rem.mtcnReference} (${rem.foreignCurrency} ${rem.amountForeign})`,
      amount: rem.amountPkr,
      type: 'credit',
      category: 'remittance',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      paymentMethod: 'PRI Home Remittance SBP Hub',
    };

    set({
      account: { ...account, balance: account.balance + rem.amountPkr },
      remittances: remittances.map((r) => (r.id === remittanceId ? { ...r, status: 'claimed' as const } : r)),
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: `PKR ${rem.amountPkr.toLocaleString()} credited to your wallet!`, transactionId: txId };
  },

  addSavingsGoal: (goalData) => {
    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      ...goalData,
      savedAmount: 0,
    };
    set((state) => ({ savingsGoals: [newGoal, ...state.savingsGoals] }));
  },

  depositToSavingsGoal: (goalId: string, amount: number) => {
    const { account, savingsGoals } = get();
    if (amount <= 0 || amount > account.balance) return { success: false, message: 'Insufficient balance' };

    set({
      account: { ...account, balance: account.balance - amount },
      savingsGoals: savingsGoals.map((g) =>
        g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g
      ),
    });

    return { success: true, message: `PKR ${amount.toLocaleString()} moved into your savings vault.` };
  },

  donateToCharity: (charityId: string, amount: number) => {
    const { account, charities, transactions } = get();
    const ch = charities.find((c) => c.id === charityId);
    if (!ch) return { success: false, message: 'Charity organization not found.' };
    if (amount <= 0 || amount > account.balance) return { success: false, message: 'Insufficient balance.' };

    const txId = `PAYB-DN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Donation to ${ch.name}`,
      counterparty: ch.name,
      counterpartySub: ch.category,
      amount,
      type: 'debit',
      category: 'donation',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: 'Verified Charity Contribution',
      paymentMethod: 'PAYBACK Charity Fund',
    };

    set({
      account: { ...account, balance: account.balance - amount },
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: `Thank you for your donation of PKR ${amount.toLocaleString()}!`, transactionId: txId };
  },

  redeemReward: (rewardId: string) => {
    const { rewards } = get();
    set({
      rewards: rewards.map((r) => (r.id === rewardId ? { ...r, isRedeemed: true } : r)),
    });
    return { success: true, message: 'Promo code applied to your account!' };
  },

  addMoney: (amount: number, method: string) => {
    const { account, transactions } = get();
    if (amount <= 0) return { success: false, message: 'Enter a valid amount.' };

    const txId = `DEP-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: 'Wallet Deposit / Top Up',
      counterparty: method,
      counterpartySub: `Ref: ${txId}`,
      amount,
      type: 'credit',
      category: 'deposit',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      paymentMethod: method,
    };

    set({
      account: { ...account, balance: account.balance + amount },
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: `PKR ${amount.toLocaleString()} deposited successfully!`, transactionId: txId };
  },

  withdrawMoney: (amount: number, method: string) => {
    const { account, transactions } = get();
    if (amount <= 0 || amount > account.balance) return { success: false, message: 'Insufficient balance.' };

    const txId = `WDR-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: 'Cash Withdrawal',
      counterparty: method,
      counterpartySub: `Ref: ${txId}`,
      amount,
      type: 'debit',
      category: 'withdrawal',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 10,
      paymentMethod: method,
    };

    set({
      account: { ...account, balance: account.balance - amount - 10 },
      transactions: [newTx, ...transactions],
    });

    return { success: true, message: `PKR ${amount.toLocaleString()} withdrawal processed!`, transactionId: txId };
  },

  scanAndPayQR: ({ merchantName, merchantId, amount, description }) => {
    const { account, transactions } = get();
    if (amount <= 0 || amount > account.balance) return { success: false, message: 'Insufficient balance.' };

    const txId = `QR-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `QR Payment to ${merchantName}`,
      counterparty: merchantName,
      counterpartySub: `Merchant ID: ${merchantId}`,
      amount,
      type: 'debit',
      category: 'qr_payment',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: description,
      paymentMethod: 'EMVCo Raast Merchant QR',
    };

    set({
      account: { ...account, balance: account.balance - amount },
      transactions: [newTx, ...transactions],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'QR Merchant Payment Approved',
          description: `PKR ${amount.toLocaleString()} paid to ${merchantName}`,
          timestamp: 'Just now',
          isRead: false,
          type: 'transaction',
        },
        ...get().notifications,
      ],
    });

    return { success: true, message: 'QR payment settled instantly!', transactionId: txId };
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  clearAllNotifications: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },
}));
