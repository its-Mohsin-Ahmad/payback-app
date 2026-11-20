import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { BillCategoryType, BillItem } from '../../types';
import {
  ArrowLeft,
  Zap,
  Flame,
  Droplet,
  Wifi,
  Phone,
  Check,
  Building,
  ShieldCheck,
  Search,
  CheckCircle,
} from 'lucide-react-native';

interface BillPaymentsScreenProps {
  onGoBack: () => void;
}

export const BillPaymentsScreen: React.FC<BillPaymentsScreenProps> = ({ onGoBack }) => {
  const { bills, payBill, account } = useBankStore();
  const [selectedCategory, setSelectedCategory] = useState<BillCategoryType>('electricity');
  const [consumerNum, setConsumerNum] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('LESCO Electricity');

  // Payment confirmation modal
  const [activeBill, setActiveBill] = useState<BillItem | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastTxId, setLastTxId] = useState('');

  const categories = [
    { type: 'electricity' as BillCategoryType, label: 'Electricity', icon: Zap },
    { type: 'gas' as BillCategoryType, label: 'Gas', icon: Flame },
    { type: 'internet' as BillCategoryType, label: 'Internet', icon: Wifi },
    { type: 'water' as BillCategoryType, label: 'Water', icon: Droplet },
  ];

  const providersMap: Record<BillCategoryType, string[]> = {
    electricity: ['LESCO Electricity', 'IESCO Islamabad', 'K-Electric Karachi', 'MEPCO Multan', 'PESCO Peshawar', 'FESCO Faisalabad'],
    gas: ['SNGPL Sui Northern Gas', 'SSGC Sui Southern Gas'],
    internet: ['PTCL Flash Fiber', 'StormFiber', 'Nayatel Optical', 'Transworld Home'],
    water: ['WASA Lahore', 'KW&SB Karachi Water', 'WASA Rawalpindi', 'WASA Faisalabad'],
    telephone: ['PTCL Landline'],
  };

  const currentBills = bills.filter((b) => b.category === selectedCategory);

  const handlePay = (bill: BillItem) => {
    if (bill.amount > account.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to pay this bill.');
      return;
    }
    const res = payBill(bill.id);
    if (res.success) {
      setLastTxId(res.transactionId || 'PAYB-BL-481920');
      setActiveBill(bill);
      setIsSuccessOpen(true);
    } else {
      Alert.alert('Payment Failed', res.message);
    }
  };

  const handleFetchCustomBill = () => {
    if (consumerNum.trim().length < 8) {
      Alert.alert('Invalid Reference', 'Please enter a valid 14-digit consumer reference number.');
      return;
    }
    Alert.alert(
      'Bill Fetched via 1Link',
      `Biller: ${selectedProvider}\nConsumer: ${consumerNum}\nAmount Due: PKR 3,850.00\nDue Date: 30 Nov 2026\nStatus: Unpaid`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            const tempBill: BillItem = {
              id: `bill_${Date.now()}`,
              category: selectedCategory,
              providerName: selectedProvider,
              consumerNumber: consumerNum,
              consumerName: 'Janvis David',
              amount: 3850,
              dueDate: '30 Nov 2026',
              status: 'unpaid',
              icon: 'zap',
            };
            handlePay(tempBill);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Utility Bill Payments</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Selector Tabs */}
        <View style={styles.categoryRow}>
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.type;
            return (
              <TouchableOpacity
                key={cat.type}
                style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedCategory(cat.type);
                  setSelectedProvider(providersMap[cat.type][0]);
                }}
              >
                <View
                  style={[
                    styles.catIconCircle,
                    isSelected && { backgroundColor: Colors.darkForest },
                  ]}
                >
                  <IconComp
                    size={22}
                    color={isSelected ? Colors.primaryLime : Colors.mutedGreen}
                  />
                </View>
                <Text style={[styles.catLabel, isSelected && styles.catLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fetch Bill by Reference Number */}
        <View style={styles.fetchCard}>
          <Text style={styles.fetchCardTitle}>Pay by Consumer Reference</Text>
          <Text style={styles.fetchCardSub}>
            Select your provider and enter the consumer ID found on your paper or digital bill.
          </Text>

          {/* Provider Selector Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providerScroll}>
            {providersMap[selectedCategory].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.providerPill, selectedProvider === p && styles.providerPillActive]}
                onPress={() => setSelectedProvider(p)}
              >
                <Text style={[styles.providerPillText, selectedProvider === p && styles.providerPillTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Consumer / Reference Number</Text>
            <View style={styles.inputRow}>
              <Search size={18} color={Colors.mutedGreen} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 08112938475891"
                placeholderTextColor={Colors.mutedGreen}
                keyboardType="number-pad"
                value={consumerNum}
                onChangeText={setConsumerNum}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.fetchBtn} onPress={handleFetchCustomBill}>
            <Text style={styles.fetchBtnText}>Fetch &amp; Review Bill</Text>
          </TouchableOpacity>
        </View>

        {/* Saved & Due Bills */}
        <Text style={styles.sectionTitle}>Pending Due Bills</Text>

        <View style={styles.billsList}>
          {currentBills.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No pending bills in this category.</Text>
            </View>
          ) : (
            currentBills.map((b) => (
              <View key={b.id} style={styles.billRow}>
                <View style={styles.billIconCircle}>
                  <Building size={20} color={Colors.primaryLime} />
                </View>

                <View style={styles.billInfoCol}>
                  <Text style={styles.billProvider}>{b.providerName}</Text>
                  <Text style={styles.billConsumer}>ID: {b.consumerNumber}</Text>
                  <Text style={styles.billDueDate}>Due: {b.dueDate}</Text>
                </View>

                <View style={styles.billActionCol}>
                  <Text style={styles.billAmount}>PKR {b.amount.toLocaleString()}</Text>
                  {b.status === 'paid' ? (
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidBadgeText}>PAID</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.payNowBtn}
                      activeOpacity={0.85}
                      onPress={() => handlePay(b)}
                    >
                      <Text style={styles.payNowBtnText}>Pay Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={isSuccessOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            <View style={styles.successCircle}>
              <CheckCircle size={48} color={Colors.darkForest} strokeWidth={2.5} />
            </View>

            <Text style={styles.modalHeading}>Bill Payment Cleared!</Text>
            <Text style={styles.modalAmount}>
              PKR {activeBill?.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.modalSub}>Paid to {activeBill?.providerName}</Text>

            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Consumer Ref</Text>
                <Text style={styles.metaVal}>{activeBill?.consumerNumber}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Transaction Ref</Text>
                <Text style={styles.metaVal}>{lastTxId}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Biller Status</Text>
                <Text style={[styles.metaVal, { color: Colors.primaryLime }]}>Marked Paid (1Link)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setIsSuccessOpen(false)}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.12)',
  },
  categoryCardActive: {
    backgroundColor: Colors.primaryLime,
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  catLabelActive: {
    color: Colors.darkForest,
    fontWeight: '900',
  },
  fetchCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 20,
  },
  fetchCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  fetchCardSub: {
    fontSize: 12,
    color: Colors.mutedGreen,
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 18,
  },
  providerScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  providerPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.darkForest,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  providerPillActive: {
    borderColor: Colors.primaryLime,
    backgroundColor: Colors.cardGreen,
  },
  providerPillText: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '700',
  },
  providerPillTextActive: {
    color: Colors.primaryLime,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  textInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  fetchBtn: {
    backgroundColor: Colors.primaryLime,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fetchBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  billsList: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.mutedGreen,
    fontSize: 13,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  billIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfoCol: {
    flex: 1,
  },
  billProvider: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  billConsumer: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  billDueDate: {
    fontSize: 10,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  billActionCol: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.textWhite,
    marginBottom: 6,
  },
  paidBadge: {
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  payNowBtn: {
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  payNowBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successModalCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  modalAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginVertical: 6,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.mutedGreen,
    marginBottom: 20,
  },
  metaBox: {
    width: '100%',
    backgroundColor: Colors.darkForest,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaKey: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  modalDoneBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
