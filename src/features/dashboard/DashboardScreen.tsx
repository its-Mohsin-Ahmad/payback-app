import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Bell,
  Eye,
  EyeOff,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  ArrowDownToLine,
  Plus,
  ChevronRight,
  Trophy,
  Zap,
  Smartphone,
  Landmark,
  PiggyBank,
  Heart,
  Gift,
  ShieldAlert,
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
}) => {
  const { account, card, favouriteContacts, transactions, toggleHideBalance, notifications } = useBankStore();
  const { user } = useAuthStore();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. TOP HEADER: Profile & Status (Matching reference image) */}
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
            <Text style={styles.profileName}>{user?.fullName || 'Janvis David'}</Text>
            <Text style={styles.profileHandle}>@{user?.username || 'janvisd'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.8}
            onPress={onNavigateToRewards}
          >
            <Trophy size={18} color={Colors.primaryLime} />
          </TouchableOpacity>

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

      {/* 2. LARGE LIME-GREEN BALANCE CARD (Recreating center phone in reference image) */}
      <View style={styles.balanceCardAnchor}>
        <LinearGradient
          colors={['#D9FF4D', '#C8F33A', '#BCE828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          {/* Card Top Row: Label & Eye & More */}
          <View style={styles.cardTopRow}>
            <View style={styles.balanceLabelGroup}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity onPress={toggleHideBalance} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {account.isBalanceHidden ? (
                  <EyeOff size={16} color={Colors.darkForest} />
                ) : (
                  <Eye size={16} color={Colors.darkForest} />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onOpenAdmin} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MoreHorizontal size={20} color={Colors.darkForest} />
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <Text style={styles.balanceAmount}>
            {account.isBalanceHidden
              ? '••••••••'
              : `PKR ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </Text>

          {/* Growth Tag */}
          <View style={styles.growthBadge}>
            <Text style={styles.growthBadgeText}>↑ 24%  Last week</Text>
          </View>

          {/* 4 Large Rounded Action Buttons inside the Lime Card */}
          <View style={styles.actionButtonsRow}>
            {/* 1. Send */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.85}
              onPress={onNavigateToSend}
            >
              <View style={styles.actionIconCircle}>
                <ArrowUpRight size={22} color={Colors.brightLime} strokeWidth={2.4} />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>

            {/* 2. Request */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.85}
              onPress={onNavigateToRequest}
            >
              <View style={styles.actionIconCircle}>
                <ArrowDownLeft size={22} color={Colors.brightLime} strokeWidth={2.4} />
              </View>
              <Text style={styles.actionLabel}>Request</Text>
            </TouchableOpacity>

            {/* 3. Payment */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.85}
              onPress={onOpenScanner}
            >
              <View style={styles.actionIconCircle}>
                <ScanLine size={22} color={Colors.brightLime} strokeWidth={2.4} />
              </View>
              <Text style={styles.actionLabel}>Payment</Text>
            </TouchableOpacity>

            {/* 4. Withdraw */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.85}
              onPress={onNavigateToRemittance}
            >
              <View style={styles.actionIconCircle}>
                <ArrowDownToLine size={22} color={Colors.brightLime} strokeWidth={2.4} />
              </View>
              <Text style={styles.actionLabel}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Subtle Downward Tab Pill under card */}
        <View style={styles.downwardTabPill}>
          <View style={styles.downwardTabPillInner} />
        </View>
      </View>

      {/* 3. FAVOURITE CONTACTS (Matching reference image) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Favourite Contacts</Text>
        <TouchableOpacity onPress={onNavigateToSend}>
          <Text style={styles.viewAllText}>View all &gt;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contactsScroll}
      >
        {/* Add Contact Button */}
        <TouchableOpacity
          style={styles.addContactBtn}
          activeOpacity={0.8}
          onPress={onNavigateToSend}
        >
          <View style={styles.addContactCircle}>
            <Plus size={20} color={Colors.primaryLime} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        {/* Contacts */}
        {favouriteContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            activeOpacity={0.8}
            onPress={onNavigateToSend}
          >
            <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
            <Text style={styles.contactName} numberOfLines={1}>
              {contact.name}
            </Text>
            <Text style={styles.contactMasked}>{contact.accountMasked}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 4. TRANSACTIONS SECTION (Matching reference image) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <TouchableOpacity onPress={onNavigateToHistory}>
          <Text style={styles.viewAllText}>View all &gt;</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dateSubheader}>Today</Text>

      <View style={styles.transactionList}>
        {transactions.slice(0, 3).map((tx) => (
          <TouchableOpacity
            key={tx.id}
            style={styles.txRow}
            activeOpacity={0.8}
            onPress={onNavigateToHistory}
          >
            <View style={styles.txIconBox}>
              {tx.type === 'credit' ? (
                <ArrowDownLeft size={18} color={Colors.primaryLime} strokeWidth={2.5} />
              ) : (
                <ArrowUpRight size={18} color="#FF6B6B" strokeWidth={2.5} />
              )}
            </View>

            <View style={styles.txDetails}>
              <Text style={styles.txTitle} numberOfLines={1}>
                {tx.title}
              </Text>
              <Text style={styles.txSub}>
                TrxID: {tx.referenceId}
              </Text>
            </View>

            <View style={styles.txAmountCol}>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.type === 'credit' ? Colors.primaryLime : '#FF6B6B' },
                ]}
              >
                {tx.type === 'credit' ? '+' : '-'}PKR {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.txTime}>{tx.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 5. QUICK SERVICES MARKETPLACE */}
      <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Financial Services</Text>
      </View>

      <View style={styles.serviceGrid}>
        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85} onPress={onNavigateToBills}>
          <View style={styles.serviceIconWrapper}>
            <Zap size={22} color={Colors.primaryLime} />
          </View>
          <Text style={styles.serviceName}>Bill Payments</Text>
          <Text style={styles.serviceDesc}>Electricity, Gas & Water</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85} onPress={onNavigateToRecharge}>
          <View style={styles.serviceIconWrapper}>
            <Smartphone size={22} color={Colors.primaryLime} />
          </View>
          <Text style={styles.serviceName}>Mobile Load</Text>
          <Text style={styles.serviceDesc}>Jazz, Zong, Ufone, Telenor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85} onPress={onNavigateToGovernment}>
          <View style={styles.serviceIconWrapper}>
            <Landmark size={22} color={Colors.primaryLime} />
          </View>
          <Text style={styles.serviceName}>Govt. Challans</Text>
          <Text style={styles.serviceDesc}>FBR, Traffic, Token Tax</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85} onPress={onNavigateToSavings}>
          <View style={styles.serviceIconWrapper}>
            <PiggyBank size={22} color={Colors.primaryLime} />
          </View>
          <Text style={styles.serviceName}>Savings Goals</Text>
          <Text style={styles.serviceDesc}>Lock funds for goals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85} onPress={onNavigateToDonations}>
          <View style={styles.serviceIconWrapper}>
            <Heart size={22} color={Colors.primaryLime} />
          </View>
          <Text style={styles.serviceName}>Donations</Text>
          <Text style={styles.serviceDesc}>Edhi, SKMCH, Saylani</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85} onPress={onNavigateToRewards}>
          <View style={styles.serviceIconWrapper}>
            <Gift size={22} color={Colors.primaryLime} />
          </View>
          <Text style={styles.serviceName}>Cashback</Text>
          <Text style={styles.serviceDesc}>Exclusive promos</Text>
        </TouchableOpacity>
      </View>

      {/* Admin shortcut pill */}
      <TouchableOpacity style={styles.adminPill} activeOpacity={0.8} onPress={onOpenAdmin}>
        <ShieldAlert size={16} color={Colors.primaryLime} />
        <Text style={styles.adminPillText}>Admin Ledger & Systems Control Portal</Text>
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
    paddingBottom: 110, // safe distance above floating bottom nav
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
  profileName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  profileHandle: {
    fontSize: 12,
    color: Colors.mutedGreen,
    fontWeight: '600',
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
  balanceCardAnchor: {
    position: 'relative',
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.darkForest,
    opacity: 0.85,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.darkForest,
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.darkForest,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  growthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brightLime,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
  },
  actionIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.darkForest,
  },
  downwardTabPill: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 44,
    height: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downwardTabPillInner: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.darkForest,
    opacity: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  contactsScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 6,
  },
  addContactBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  addContactCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.cardGreen,
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItem: {
    alignItems: 'center',
    width: 68,
  },
  contactAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
  },
  contactName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textWhite,
    marginTop: 6,
  },
  contactMasked: {
    fontSize: 10,
    color: Colors.mutedGreen,
  },
  dateSubheader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionList: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  txSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  txTime: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 40 - 12) / 2,
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  serviceIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  serviceDesc: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  adminPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(200, 243, 58, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  adminPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
});
