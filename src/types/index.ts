export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  cnicMasked: string;
  accountTier: 'Basic Wallet' | 'Asaan Digital' | 'Premium Elite';
  isBiometricEnabled: boolean;
  memberSince: string;
  dailyTransferLimit: number;
  monthlyTransferLimit: number;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  maskedNumber: string;
  iban: string;
  balance: number;
  currency: string;
  currencySymbol: string;
  isBalanceHidden: boolean;
  status: 'active' | 'frozen' | 'restricted';
  lastUpdated: string;
}

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory =
  | 'transfer'
  | 'bill'
  | 'recharge'
  | 'bundle'
  | 'qr_payment'
  | 'government'
  | 'remittance'
  | 'savings'
  | 'donation'
  | 'cashback'
  | 'withdrawal'
  | 'deposit';

export interface Transaction {
  id: string;
  title: string;
  counterparty: string;
  counterpartySub?: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId: string;
  fee: number;
  note?: string;
  paymentMethod?: string;
}

export interface VirtualCard {
  id: string;
  cardholderName: string;
  cardNumberMasked: string;
  cardNumberFull: string;
  expiryDate: string;
  cvv: string;
  cardBrand: 'VISA' | 'MasterCard' | 'PayPak';
  cardType: 'Debit' | 'Credit';
  isFrozen: boolean;
  dailyLimit: number;
  currentSpend: number;
  internationalPayments: boolean;
  onlinePayments: boolean;
  atmWithdrawals: boolean;
}

export interface QuickContact {
  id: string;
  name: string;
  handle?: string;
  phoneNumber: string;
  avatar: string;
  accountMasked: string;
  bankName?: string;
}

export type BillCategoryType = 'electricity' | 'gas' | 'water' | 'internet' | 'telephone';

export interface BillItem {
  id: string;
  category: BillCategoryType;
  providerName: string;
  consumerNumber: string;
  consumerName: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  icon: string;
}

export type MobileNetworkType = 'Jazz' | 'Zong' | 'Ufone' | 'Telenor';

export interface MobilePackage {
  id: string;
  network: MobileNetworkType;
  name: string;
  category: 'Internet' | 'All-in-One' | 'Calls' | 'SMS';
  validity: 'Daily' | 'Weekly' | 'Monthly';
  price: number;
  data: string;
  onNetMinutes: string;
  offNetMinutes: string;
  sms: string;
  description: string;
}

export interface GovernmentBill {
  id: string;
  department: 'FBR Tax' | 'Traffic Challan' | 'Vehicle Token' | 'e-Khidmat';
  challanNumber: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  category: 'Emergency' | 'Hajj/Umrah' | 'Tech' | 'Home' | 'General';
}

export interface CharityOrganization {
  id: string;
  name: string;
  category: 'Healthcare' | 'Education' | 'Food' | 'Disaster Relief';
  description: string;
  verified: boolean;
  logo: string;
}

export interface RewardPromotion {
  id: string;
  title: string;
  discountOrCashback: string;
  code: string;
  expiryDate: string;
  isRedeemed: boolean;
  category: 'Cashback' | 'Recharge' | 'Dining' | 'Travel';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'transaction' | 'security' | 'promo' | 'system';
}

export interface RemittanceRecord {
  id: string;
  senderName: string;
  sendingCountry: string;
  mtcnReference: string;
  amountForeign: number;
  foreignCurrency: string;
  exchangeRate: number;
  amountPkr: number;
  status: 'available' | 'claimed';
  date: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  status: 'success' | 'flagged';
}
