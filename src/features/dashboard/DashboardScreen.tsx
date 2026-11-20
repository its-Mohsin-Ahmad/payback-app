import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BalanceCard } from '../../components/common/BalanceCard';
import { ContactCarousel } from '../../components/common/ContactCarousel';
import { TransactionItem } from '../../components/common/TransactionItem';
import {
  Bell,
  ShieldCheck,
  Zap,
  Smartphone,
  Landmark,
  PiggyBank,
  Heart,
  Gift,
  ShieldAlert,
  ChevronRight,
  Flame,
  Wifi,
  QrCode,
  Building,
  Grid,
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  ArrowDownToLine,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onNavigateToSend: () => void;
  onNavigateToRequest: () => void;
  onNavigateToBills: () => void;
  onNavigateToRecharge: () => void;
  onNavigateToGovernment: () => void;
  onNavigateToRemittance: () => void;
  onNavigateToSavings: () => void;
  onNavigateToDonations: () => void;
  onNavigateToRewards: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToProfile: () => void;
  onNavigateToHistory: () => void;
  onOpenScanner: () => void;
  onOpenAdmin: () => void;
  onNavigateToAddMoney: () => void;
  onNavigateToWithdraw: () => void;
  onNavigateToServices: () => void;
  onNavigateToSecurity: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToSend,
  onNavigateToRequest,
  onNavigateToBills,
  onNavigateToRecharge,
  onNavigateToGovernment,
  onNavigateToRemittance,
  onNavigateToSavings,
  onNavigateToDonations,
  onNavigateToRewards,
  onNavigateToNotifications,
  onNavigateToProfile,
  onNavigateToHistory,
  onOpenScanner,
  onOpenAdmin,
  onNavigateToAddMoney,
  onNavigateToWithdraw,
  onNavigateToServices,
  onNavigateToSecurity,
}) => {
  const { account, favouriteContacts, transactions, toggleHideBalance, notifications, savingsGoals, rewards } = useBankStore();
  const { user } = useAuthStore();

  const [activePromoIndex, setActivePromoIndex] = useState(0);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const promoBanners = [
    {
      id: 'p1',
      badge: 'CASHBACK SPECIAL',
      title: 'Get 10% Cashback on Electricity Bills',
      desc: 'Pay any LESCO, K-Electric or IESCO bill via PAYBACK and receive up to PKR 500 back instantly.',
      actionText: 'Pay Bill Now',
      action: onNavigateToBills,
    },
    {
      id: 'p2',
      badge: 'RAAST INSTANT',
      title: 'Send Money Free via Raast ID',
      desc: 'Zero-fee nationwide transfers directly to any Pakistani mobile number or bank account.',
      actionText: 'Send via Raast',
      action: onNavigateToSend,
    },
    {
      id: 'p3',
      badge: 'SAVINGS GOALS',
      title: 'Start a Digital Gullak Fund',
      desc: 'Automate your daily savings with Shariah-compliant high-yield profit sharing.',
      actionText: 'Explore Goals',
      action: onNavigateToSavings,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. TOP HEADER: Profile & Greeting & Security/Notification Icons */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.profileRow}
          activeOpacity={0.8}
          onPress={onNavigateToProfile}
        >
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.profileAvatar}
          />
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.profileName}>{user?.fullName || 'Janvis David'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRightIcons}>
          {/* Security Shield Icon */}
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.8}
            onPress={onNavigateToSecurity}
          >
            <ShieldCheck size={18} color={Colors.primaryLime} />
          </TouchableOpacity>

          {/* Notifications Bell */}
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.8}
            onPress={onNavigateToNotifications}
          >
            <Bell size={18} color={Colors.primaryLime} />
            {unreadNotifs > 0 && <View style={styles.badgeDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. REUSABLE BALANCE CARD (Bright Lime-Green, matching reference image) */}
      <BalanceCard
        balance={account.balance}
        isBalanceHidden={account.isBalanceHidden}
        onToggleHide={toggleHideBalance}
        onOptions={onOpenAdmin}
        onSend={onNavigateToSend}
        onRequest={onNavigateToRequest}
        onPayment={onOpenScanner}
        onWithdraw={onNavigateToWithdraw}
        onAddMoney={onNavigateToAddMoney}
        accountStatus={user?.accountTier || 'Premium Elite'}
      />

      {/* 3. QUICK DEPOSIT / CASH-OUT PILLS */}
      <View style={styles.quickDepositRow}>
        <TouchableOpacity
          style={styles.quickPillBtn}
          activeOpacity={0.85}
          onPress={onNavigateToAddMoney}
        >
          <PlusCircle size={16} color={Colors.darkForest} strokeWidth={2.5} />
          <Text style={styles.quickPillText}>Deposit Funds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickPillBtn, styles.quickPillBtnDark]}
          activeOpacity={0.85}
          onPress={onNavigateToWithdraw}
        >
          <ArrowDownToLine size={16} color={Colors.primaryLime} strokeWidth={2.2} />
          <Text style={styles.quickPillTextDark}>ATM / Bank Cash-Out</Text>
        </TouchableOpacity>
      </View>

      {/* 4. REUSABLE FAVOURITE CONTACTS CAROUSEL */}
      <ContactCarousel
        contacts={favouriteContacts}
        onAddContact={onNavigateToSend}
        onSelectContact={onNavigateToSend}
        onViewAll={onNavigateToSend}
      />

      {/* 5. POPULAR SERVICES GRID (8 items as specified) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <TouchableOpacity onPress={onNavigateToServices}>
          <Text style={styles.viewAllText}>View All (40+) &gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.popularServicesGrid}>
        {/* 1. Mobile Load */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onNavigateToRecharge}>
          <View style={styles.popularIconBox}>
            <Smartphone size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>Mobile Load</Text>
        </TouchableOpacity>

        {/* 2. Electricity Bills */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onNavigateToBills}>
          <View style={styles.popularIconBox}>
            <Zap size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>Electricity</Text>
        </TouchableOpacity>

        {/* 3. Gas Utilities */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onNavigateToBills}>
          <View style={styles.popularIconBox}>
            <Flame size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>Gas Bills</Text>
        </TouchableOpacity>

        {/* 4. Internet Broadband */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onNavigateToBills}>
          <View style={styles.popularIconBox}>
            <Wifi size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>Internet</Text>
        </TouchableOpacity>

        {/* 5. Bank Transfer */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onNavigateToSend}>
          <View style={styles.popularIconBox}>
            <Building size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>Bank Transfer</Text>
        </TouchableOpacity>

        {/* 6. Raast P2P */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onNavigateToSend}>
          <View style={styles.popularIconBox}>
            <Sparkles size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>Raast ID</Text>
        </TouchableOpacity>

        {/* 7. QR Pay */}
        <TouchableOpacity style={styles.popularCard} activeOpacity={0.85} onPress={onOpenScanner}>
          <View style={styles.popularIconBox}>
            <QrCode size={20} color={Colors.primaryLime} />
          </View>
          <Text style={styles.popularLabel}>QR Pay</Text>
        </TouchableOpacity>

        {/* 8. More Services Hub */}
        <TouchableOpacity style={[styles.popularCard, styles.popularCardMore]} activeOpacity={0.85} onPress={onNavigateToServices}>
          <View style={[styles.popularIconBox, styles.popularIconBoxMore]}>
            <Grid size={20} color={Colors.darkForest} strokeWidth={2.5} />
          </View>
          <Text style={[styles.popularLabel, { color: Colors.primaryLime, fontWeight: '900' }]}>
            All Services
          </Text>
        </TouchableOpacity>
      </View>

      {/* 6. PROMOTIONAL BANNERS CAROUSEL */}
      <View style={styles.promoContainer}>
        <View style={styles.promoCard}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>{promoBanners[activePromoIndex].badge}</Text>
          </View>
          <Text style={styles.promoTitle}>{promoBanners[activePromoIndex].title}</Text>
          <Text style={styles.promoDesc}>{promoBanners[activePromoIndex].desc}</Text>

          <TouchableOpacity
            style={styles.promoActionBtn}
            activeOpacity={0.85}
            onPress={promoBanners[activePromoIndex].action}
          >
            <Text style={styles.promoActionText}>{promoBanners[activePromoIndex].actionText}</Text>
            <ChevronRight size={14} color={Colors.darkForest} />
          </TouchableOpacity>
        </View>

        {/* Carousel Dots */}
        <View style={styles.carouselDots}>
          {promoBanners.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActivePromoIndex(i)}
              style={[styles.carouselDot, activePromoIndex === i && styles.carouselDotActive]}
            />
          ))}
        </View>
      </View>

      {/* 7. RECENT TRANSACTIONS (Matching reference image) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <TouchableOpacity onPress={onNavigateToHistory}>
          <Text style={styles.viewAllText}>View all &gt;</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dateSubheader}>Today</Text>

      <View style={styles.transactionList}>
        {transactions.slice(0, 3).map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onPress={onNavigateToHistory}
          />
        ))}
      </View>

      {/* 8. SAVINGS GOALS PREVIEW */}
      <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Savings Goals (Digital Gullak)</Text>
        <TouchableOpacity onPress={onNavigateToSavings}>
          <Text style={styles.viewAllText}>Manage &gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalsPreviewList}>
        {savingsGoals.slice(0, 2).map((goal) => {
          const progressPct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          return (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCard}
              activeOpacity={0.85}
              onPress={onNavigateToSavings}
            >
              <View style={styles.goalTopRow}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalSub}>Target: PKR {goal.targetAmount.toLocaleString()}</Text>
                </View>
                <Text style={styles.goalAmount}>PKR {goal.savedAmount.toLocaleString()}</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{progressPct}% Saved</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Admin Portal Shortcut */}
      <TouchableOpacity style={styles.adminPill} activeOpacity={0.8} onPress={onOpenAdmin}>
        <ShieldAlert size={16} color={Colors.primaryLime} />
        <Text style={styles.adminPillText}>Admin Ledger &amp; Systems Control Portal</Text>
        <ChevronRight size={14} color={Colors.mutedGreen} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.primaryLime,
  },
  greetingText: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brightLime,
  },
  quickDepositRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  quickPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
    height: 44,
    borderRadius: 22,
    gap: 8,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  quickPillBtnDark: {
    backgroundColor: Colors.cardGreen,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  quickPillTextDark: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  popularServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  popularCard: {
    width: (width - 70) / 4,
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.12)',
  },
  popularCardMore: {
    backgroundColor: '#2A420D',
    borderColor: Colors.primaryLime,
  },
  popularIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  popularIconBoxMore: {
    backgroundColor: Colors.primaryLime,
  },
  popularLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  promoContainer: {
    marginBottom: 18,
  },
  promoCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(213, 245, 74, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  promoBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: 12,
    color: Colors.mutedGreen,
    lineHeight: 16,
    marginBottom: 12,
  },
  promoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLime,
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 4,
  },
  promoActionText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(213, 245, 74, 0.25)',
  },
  carouselDotActive: {
    width: 18,
    backgroundColor: Colors.primaryLime,
  },
  dateSubheader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginBottom: 8,
  },
  transactionList: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    gap: 12,
  },
  goalsPreviewList: {
    gap: 10,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.15)',
  },
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  goalSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.darkForest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primaryLime,
  },
  progressPercent: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginTop: 4,
    textAlign: 'right',
  },
  adminPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardGreen,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  adminPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
});
