import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import {
  ArrowLeft,
  Search,
  Zap,
  Send,
  Building,
  Smartphone,
  Receipt,
  CreditCard,
  PlusCircle,
  ArrowDownCircle,
  FileText,
  History,
  ShieldCheck,
  Gift,
  Heart,
  PiggyBank,
  QrCode,
  Users,
  HelpCircle,
  Layers,
  ChevronRight,
  Flame,
  Droplets,
  Wifi,
  Phone,
  GraduationCap,
  Landmark,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ServicesHubScreenProps {
  onGoBack: () => void;
  onNavigateToSend: () => void;
  onNavigateToBills: () => void;
  onNavigateToMobile: () => void;
  onNavigateToAddMoney: () => void;
  onNavigateToWithdraw: () => void;
  onNavigateToCards: () => void;
  onNavigateToQR: () => void;
  onNavigateToRemittance: () => void;
  onNavigateToSavings: () => void;
  onNavigateToDonations: () => void;
  onNavigateToRewards: () => void;
  onNavigateToStatements: () => void;
  onNavigateToSupport: () => void;
  onNavigateToHistory: () => void;
}

type CategoryKey = 'all' | 'transfers' | 'mobile' | 'bills' | 'wallet' | 'cards' | 'more';

export const ServicesHubScreen: React.FC<ServicesHubScreenProps> = ({
  onGoBack,
  onNavigateToSend,
  onNavigateToBills,
  onNavigateToMobile,
  onNavigateToAddMoney,
  onNavigateToWithdraw,
  onNavigateToCards,
  onNavigateToQR,
  onNavigateToRemittance,
  onNavigateToSavings,
  onNavigateToDonations,
  onNavigateToRewards,
  onNavigateToStatements,
  onNavigateToSupport,
  onNavigateToHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');

  const categories: { key: CategoryKey; label: string; icon: any }[] = [
    { key: 'all', label: 'All Services', icon: Layers },
    { key: 'transfers', label: 'Transfers', icon: Send },
    { key: 'mobile', label: 'Mobile & Data', icon: Smartphone },
    { key: 'bills', label: 'Utility Bills', icon: Receipt },
    { key: 'wallet', label: 'Wallet Care', icon: PlusCircle },
    { key: 'cards', label: 'Cards', icon: CreditCard },
    { key: 'more', label: 'Lifestyle', icon: Gift },
  ];

  // Service items data
  const servicesList = [
    // CATEGORY A — MONEY TRANSFERS
    { id: 't1', category: 'transfers', name: 'PAYBACK to PAYBACK', sub: 'Instant zero-fee transfer', icon: Zap, status: 'Active', action: onNavigateToSend },
    { id: 't2', category: 'transfers', name: 'Send to Easypaisa', sub: 'Direct mobile wallet transfer', icon: Smartphone, status: 'Active', action: onNavigateToSend },
    { id: 't3', category: 'transfers', name: 'Send to JazzCash', sub: 'Direct mobile wallet transfer', icon: Smartphone, status: 'Active', action: onNavigateToSend },
    { id: 't4', category: 'transfers', name: 'Bank Transfers (1Link)', sub: 'To 35+ verified Pakistani banks', icon: Building, status: 'Active', action: onNavigateToSend },
    { id: 't5', category: 'transfers', name: 'Raast P2P Transfers', sub: 'State Bank instant settlement', icon: Zap, status: 'Active', action: onNavigateToSend },
    { id: 't6', category: 'transfers', name: 'CNIC Cash Pickup', sub: 'Transfer cash to any CNIC holder', icon: Users, status: 'Active', action: onNavigateToSend },
    { id: 't7', category: 'transfers', name: 'International Remittance', sub: 'Receive global remittances directly', icon: Landmark, status: 'Active', action: onNavigateToRemittance },
    { id: 't8', category: 'transfers', name: 'Request Money', sub: 'Send payment requests with link', icon: ArrowDownCircle, status: 'Active', action: onNavigateToSend },
    { id: 't9', category: 'transfers', name: 'Favourite Beneficiaries', sub: 'Manage saved quick-transfer contacts', icon: Users, status: 'Active', action: onNavigateToSend },
    { id: 't10', category: 'transfers', name: 'Transfer History', sub: 'Filterable payment ledger receipts', icon: History, status: 'Active', action: onNavigateToHistory },

    // CATEGORY B — MOBILE SERVICES
    { id: 'm1', category: 'mobile', name: 'Jazz Mobile Load', sub: 'Instant prepaid recharge', icon: Smartphone, status: 'Active', action: onNavigateToMobile },
    { id: 'm2', category: 'mobile', name: 'Zong Mobile Load', sub: 'Instant prepaid recharge', icon: Smartphone, status: 'Active', action: onNavigateToMobile },
    { id: 'm3', category: 'mobile', name: 'Ufone Mobile Load', sub: 'Instant prepaid recharge', icon: Smartphone, status: 'Active', action: onNavigateToMobile },
    { id: 'm4', category: 'mobile', name: 'Telenor Mobile Load', sub: 'Instant prepaid recharge', icon: Smartphone, status: 'Active', action: onNavigateToMobile },
    { id: 'm5', category: 'mobile', name: 'Postpaid Bill Payment', sub: 'Clear monthly corporate & personal bills', icon: Receipt, status: 'Active', action: onNavigateToMobile },
    { id: 'm6', category: 'mobile', name: 'Internet Data Bundles', sub: 'Daily, 3-day & weekly 4G packages', icon: Wifi, status: 'Active', action: onNavigateToMobile },
    { id: 'm7', category: 'mobile', name: 'Voice Call Packages', sub: 'On-net & all-network call minutes', icon: Phone, status: 'Active', action: onNavigateToMobile },
    { id: 'm8', category: 'mobile', name: 'SMS & Hybrid Bundles', sub: 'All-in-one monthly super cards', icon: Smartphone, status: 'Active', action: onNavigateToMobile },
    { id: 'm9', category: 'mobile', name: 'Weekly Super Bundles', sub: 'Heavy data & talk time combos', icon: Zap, status: 'Active', action: onNavigateToMobile },
    { id: 'm10', category: 'mobile', name: 'Monthly Freedom Bundles', sub: '30-day uninterrupted connectivity', icon: Gift, status: 'Active', action: onNavigateToMobile },

    // CATEGORY C — BILL PAYMENTS
    { id: 'b1', category: 'bills', name: 'Electricity Bills', sub: 'LESCO, K-Electric, IESCO, MEPCO, PESCO', icon: Zap, status: 'Active', action: onNavigateToBills },
    { id: 'b2', category: 'bills', name: 'Gas Utilities', sub: 'SNGPL & SSGC gas invoice settlement', icon: Flame, status: 'Active', action: onNavigateToBills },
    { id: 'b3', category: 'bills', name: 'Water Authorities', sub: 'WASA Lahore, Rawalpindi, KWSB Karachi', icon: Droplets, status: 'Active', action: onNavigateToBills },
    { id: 'b4', category: 'bills', name: 'Internet Broadband', sub: 'Nayatel, PTCL Flash, StormFiber', icon: Wifi, status: 'Active', action: onNavigateToBills },
    { id: 'b5', category: 'bills', name: 'Telephone Landline', sub: 'PTCL Evo & Landline direct bill', icon: Phone, status: 'Active', action: onNavigateToBills },
    { id: 'b6', category: 'bills', name: 'Education Fees', sub: 'School, College & University vouchers', icon: GraduationCap, status: 'Coming Soon', action: () => Alert.alert('Coming Soon', 'Education vouchers will be enabled with participating universities in the next update.') },
    { id: 'b7', category: 'bills', name: 'Government Taxes (1Bill)', sub: 'FBR tax, SECP, provincial excise duties', icon: Landmark, status: 'Active', action: onNavigateToBills },
    { id: 'b8', category: 'bills', name: 'Traffic Challans (e-Pay)', sub: 'Punjab, Sindh, Islamabad traffic fines', icon: Receipt, status: 'Active', action: onNavigateToBills },

    // CATEGORY D — WALLET SERVICES
    { id: 'w1', category: 'wallet', name: 'Add Money / Deposit', sub: 'Via 1Link bank transfer, Debit card, Agent', icon: PlusCircle, status: 'Active', action: onNavigateToAddMoney },
    { id: 'w2', category: 'wallet', name: 'Withdraw Funds', sub: 'Send to bank, cash-out agent, or ATM', icon: ArrowDownCircle, status: 'Active', action: onNavigateToWithdraw },
    { id: 'w3', category: 'wallet', name: 'Wallet Account Statements', sub: 'Download certified PDF e-statements', icon: FileText, status: 'Active', action: onNavigateToStatements },
    { id: 'w4', category: 'wallet', name: 'Account Limits & Tiers', sub: 'Biometric verification for higher limits', icon: ShieldCheck, status: 'Active', action: onNavigateToStatements },
    { id: 'w5', category: 'wallet', name: 'Linked Bank Accounts', sub: 'Auto-debit from linked Pakistani banks', icon: Building, status: 'Active', action: onNavigateToAddMoney },

    // CATEGORY E — CARDS
    { id: 'c1', category: 'cards', name: 'Virtual Visa Debit Card', sub: 'Instant card for online shopping & Netflix', icon: CreditCard, status: 'Active', action: onNavigateToCards },
    { id: 'c2', category: 'cards', name: 'Order Physical Card', sub: 'Delivered to your home in 3-5 days', icon: CreditCard, status: 'Active', action: onNavigateToCards },
    { id: 'c3', category: 'cards', name: 'Freeze / Unfreeze Card', sub: 'Instant one-tap toggle security', icon: ShieldCheck, status: 'Active', action: onNavigateToCards },
    { id: 'c4', category: 'cards', name: 'Card Spending Limits', sub: 'Set domestic & international limits', icon: CreditCard, status: 'Active', action: onNavigateToCards },

    // CATEGORY F — ADDITIONAL SERVICES
    { id: 'a1', category: 'more', name: 'Contactless QR Payments', sub: 'Scan Raast & merchant QR codes', icon: QrCode, status: 'Active', action: onNavigateToQR },
    { id: 'a2', category: 'more', name: 'Charity & Donations', sub: 'Edhi, Shaukat Khanum, Saylani & Indus', icon: Heart, status: 'Active', action: onNavigateToDonations },
    { id: 'a3', category: 'more', name: 'Savings Goals (Digital Gullak)', sub: 'Smart automated daily/monthly savings', icon: PiggyBank, status: 'Active', action: onNavigateToSavings },
    { id: 'a4', category: 'more', name: 'Cashback & Promo Codes', sub: 'Exclusive partner discounts & rewards', icon: Gift, status: 'Active', action: onNavigateToRewards },
    { id: 'a5', category: 'more', name: '24/7 Priority Support', sub: 'Live agent chat & dispute tracking', icon: HelpCircle, status: 'Active', action: onNavigateToSupport },
  ];

  const filteredServices = servicesList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onGoBack}>
          <ArrowLeft size={22} color={Colors.primaryLime} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAYBACK Services</Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.primaryLime} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transfers, bills, bundles, services..."
            placeholderTextColor={Colors.mutedGreen}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Slider */}
      <View style={styles.categorySliderWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categorySlider}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Icon size={14} color={isSelected ? Colors.darkForest : Colors.primaryLime} />
                <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Services List Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
          </Text>
          <Text style={styles.verifiedBadge}>✓ 100% SBP Regulated Rails</Text>
        </View>

        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => {
            const ServiceIcon = service.icon;
            const isComingSoon = service.status === 'Coming Soon';

            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, isComingSoon && styles.serviceCardDisabled]}
                activeOpacity={0.85}
                onPress={service.action}
              >
                <View style={styles.serviceIconContainer}>
                  <ServiceIcon size={22} color={Colors.primaryLime} />
                </View>

                <View style={styles.serviceInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {isComingSoon ? (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Soon</Text>
                      </View>
                    ) : (
                      <View style={styles.activeDot} />
                    )}
                  </View>
                  <Text style={styles.serviceSub}>{service.sub}</Text>
                </View>

                <ChevronRight size={18} color={Colors.mutedGreen} />
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <HelpCircle size={44} color={Colors.mutedGreen} />
            <Text style={styles.emptyTitle}>No matching services found</Text>
            <Text style={styles.emptySub}>
              Try searching for "Jazz", "Electricity", "Raast", or "Withdraw"
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkForest,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  searchInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  clearText: {
    color: Colors.mutedGreen,
    fontSize: 12,
    fontWeight: '700',
  },
  categorySliderWrapper: {
    marginBottom: 10,
  },
  categorySlider: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  categoryPillActive: {
    backgroundColor: Colors.primaryLime,
    borderColor: Colors.primaryLime,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  categoryPillTextActive: {
    color: Colors.darkForest,
    fontWeight: '900',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
  },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  servicesGrid: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.12)',
  },
  serviceCardDisabled: {
    opacity: 0.65,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  serviceInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryLime,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(213, 245, 74, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primaryLime,
    textTransform: 'uppercase',
  },
  serviceSub: {
    fontSize: 12,
    color: Colors.mutedGreen,
    marginTop: 2,
    lineHeight: 16,
  },
  emptyState: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginTop: 6,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.mutedGreen,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
