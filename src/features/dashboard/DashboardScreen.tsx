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
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BalanceCard } from '../../components/common/BalanceCard';
import { ContactCarousel } from '../../components/common/ContactCarousel';
import { TransactionItem } from '../../components/common/TransactionItem';
import {
  Bell,
  Trophy,
  Zap,
  Smartphone,
  Landmark,
  PiggyBank,
  Heart,
  Gift,
  ShieldAlert,
  ChevronRight,
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
  const { account, favouriteContacts, transactions, toggleHideBalance, notifications } = useBankStore();
  const { user } = useAuthStore();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. TOP HEADER: Profile & Status (Matching center phone in reference image) */}
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

      {/* 2. REUSABLE BALANCE CARD (Bright Lime-Green, matching reference image) */}
      <BalanceCard
        balance={account.balance}
        isBalanceHidden={account.isBalanceHidden}
        onToggleHide={toggleHideBalance}
        onOptions={onOpenAdmin}
        onSend={onNavigateToSend}
        onRequest={onNavigateToRequest}
        onPayment={onOpenScanner}
        onWithdraw={onNavigateToRemittance}
      />

      {/* 3. REUSABLE FAVOURITE CONTACTS CAROUSEL */}
      <ContactCarousel
        contacts={favouriteContacts}
        onAddContact={onNavigateToSend}
        onSelectContact={onNavigateToSend}
        onViewAll={onNavigateToSend}
      />

      {/* 4. RECENT TRANSACTIONS (Matching reference image) */}
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
          <Text style={styles.serviceDesc}>Electricity, Gas &amp; Water</Text>
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
          <Text style={styles.serviceName}>Savings Vaults</Text>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
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
    backgroundColor: 'rgba(213, 245, 74, 0.08)',
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
