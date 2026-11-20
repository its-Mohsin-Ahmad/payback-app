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
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import {
  ArrowLeft,
  Building,
  CreditCard,
  Smartphone,
  Store,
  Copy,
  Check,
  ShieldCheck,
  Info,
  ArrowRight,
  CheckCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AddMoneyScreenProps {
  onGoBack: () => void;
  onNavigateToHistory: () => void;
}

type DepositMethod = 'bank' | 'debit_card' | 'wallet' | 'agent';

export const AddMoneyScreen: React.FC<AddMoneyScreenProps> = ({
  onGoBack,
  onNavigateToHistory,
}) => {
  const { account, addMoney } = useBankStore();

  const [selectedMethod, setSelectedMethod] = useState<DepositMethod>('bank');
  const [amountStr, setAmountStr] = useState('5000');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [depositTxId, setDepositTxId] = useState('');

  const parsedAmount = parseFloat(amountStr) || 0;
  const fee = 0; // 0 fee for deposits

  const presetAmounts = ['1000', '2500', '5000', '10000', '25000'];

  const copyToClipboard = (text: string, field: string) => {
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInitiateDeposit = () => {
    if (parsedAmount < 100) {
      Alert.alert('Minimum Deposit', 'The minimum deposit amount is PKR 100.');
      return;
    }
    if (parsedAmount > 100000) {
      Alert.alert('Limit Exceeded', 'Daily deposit limit for your tier is PKR 100,000.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeposit = () => {
    const methodName =
      selectedMethod === 'bank'
        ? '1Link Bank Transfer'
        : selectedMethod === 'debit_card'
        ? 'Debit/Credit Card'
        : selectedMethod === 'wallet'
        ? 'Easypaisa / JazzCash Cash-In'
        : 'Authorized Cash-In Agent';

    const result = addMoney(parsedAmount, methodName);

    if (result.success) {
      setDepositTxId(result.transactionId || `DEP_${Date.now()}`);
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    } else {
      Alert.alert('Deposit Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onGoBack}>
          <ArrowLeft size={22} color={Colors.primaryLime} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money to Wallet</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={onNavigateToHistory}>
          <Text style={styles.historyBtnText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Balance Banner */}
        <View style={styles.balanceBanner}>
          <Text style={styles.balanceBannerLabel}>Current Wallet Balance</Text>
          <Text style={styles.balanceBannerValue}>
            PKR {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* 1. Deposit Method Selection */}
        <Text style={styles.sectionHeading}>1. SELECT DEPOSIT METHOD</Text>
        <View style={styles.methodGrid}>
          {/* Method A: Bank Transfer */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'bank' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('bank')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'bank' && styles.methodIconBoxActive]}>
              <Building size={20} color={selectedMethod === 'bank' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <Text style={[styles.methodTitle, selectedMethod === 'bank' && styles.methodTitleActive]}>
              Bank Transfer
            </Text>
            <Text style={styles.methodSub}>Via 1Link / Raast (Instant & Free)</Text>
          </TouchableOpacity>

          {/* Method B: Debit/Credit Card */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'debit_card' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('debit_card')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'debit_card' && styles.methodIconBoxActive]}>
              <CreditCard size={20} color={selectedMethod === 'debit_card' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <Text style={[styles.methodTitle, selectedMethod === 'debit_card' && styles.methodTitleActive]}>
              Debit / Visa Card
            </Text>
            <Text style={styles.methodSub}>Top up using any bank card</Text>
          </TouchableOpacity>

          {/* Method C: Mobile Wallets */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'wallet' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('wallet')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'wallet' && styles.methodIconBoxActive]}>
              <Smartphone size={20} color={selectedMethod === 'wallet' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <Text style={[styles.methodTitle, selectedMethod === 'wallet' && styles.methodTitleActive]}>
              Other Wallets
            </Text>
            <Text style={styles.methodSub}>Easypaisa / JazzCash pull</Text>
          </TouchableOpacity>

          {/* Method D: Agent Cash-In */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'agent' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('agent')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'agent' && styles.methodIconBoxActive]}>
              <Store size={20} color={selectedMethod === 'agent' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <Text style={[styles.methodTitle, selectedMethod === 'agent' && styles.methodTitleActive]}>
              Cash-In Agent
            </Text>
            <Text style={styles.methodSub}>Deposit cash at retailer</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Amount Entry */}
        <Text style={styles.sectionHeading}>2. ENTER DEPOSIT AMOUNT</Text>
        <View style={styles.amountInputCard}>
          <Text style={styles.currencyPrefix}>PKR</Text>
          <TextInput
            style={styles.amountInput}
            keyboardType="number-pad"
            value={amountStr}
            onChangeText={setAmountStr}
            placeholder="0"
            placeholderTextColor={Colors.mutedGreen}
          />
        </View>

        {/* Quick Amount Chips */}
        <View style={styles.presetRow}>
          {presetAmounts.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.presetChip, amountStr === p && styles.presetChipActive]}
              activeOpacity={0.8}
              onPress={() => setAmountStr(p)}
            >
              <Text style={[styles.presetText, amountStr === p && styles.presetTextActive]}>
                +{parseInt(p).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Method Specific Instructions */}
        {selectedMethod === 'bank' && (
          <View style={styles.instructionCard}>
            <View style={styles.instructionHeader}>
              <Info size={16} color={Colors.primaryLime} />
              <Text style={styles.instructionTitle}>Your Dedicated Bank Deposit Details</Text>
            </View>
            <Text style={styles.instructionDesc}>
              Transfer funds from any Pakistani banking app (HBL, Meezan, UBL, Alfalah, etc.) to your PAYBACK account:
            </Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank Name:</Text>
              <Text style={styles.detailValue}>PAYBACK Microfinance / 1Link</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>IBAN:</Text>
              <TouchableOpacity
                style={styles.copyRow}
                onPress={() => copyToClipboard(account.iban, 'iban')}
              >
                <Text style={styles.copyValue}>{account.iban}</Text>
                {copiedField === 'iban' ? (
                  <Check size={14} color={Colors.primaryLime} />
                ) : (
                  <Copy size={14} color={Colors.mutedGreen} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number:</Text>
              <TouchableOpacity
                style={styles.copyRow}
                onPress={() => copyToClipboard(account.accountNumber, 'acc')}
              >
                <Text style={styles.copyValue}>{account.accountNumber}</Text>
                {copiedField === 'acc' ? (
                  <Check size={14} color={Colors.primaryLime} />
                ) : (
                  <Copy size={14} color={Colors.mutedGreen} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.feeBadge}>
              <ShieldCheck size={14} color={Colors.primaryLime} />
              <Text style={styles.feeBadgeText}>Fee: FREE (Zero Transaction Charges)</Text>
            </View>
          </View>
        )}

        {selectedMethod === 'debit_card' && (
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>Card Top-Up Sandbox</Text>
            <Text style={styles.instructionDesc}>
              Enter deposit amount to simulate instant funding from your connected Visa/Mastercard. Funds reflect immediately in your PAYBACK balance.
            </Text>
            <View style={styles.feeBadge}>
              <ShieldCheck size={14} color={Colors.primaryLime} />
              <Text style={styles.feeBadgeText}>Fee: FREE • 3D Secure Protected</Text>
            </View>
          </View>
        )}

        {/* Deposit Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deposit Amount</Text>
            <Text style={styles.summaryValue}>PKR {parsedAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryFree}>PKR 0.00 (FREE)</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryDivider]}>
            <Text style={styles.summaryTotalLabel}>Total Credited</Text>
            <Text style={styles.summaryTotalValue}>PKR {parsedAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Submit Deposit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.88}
          onPress={handleInitiateDeposit}
        >
          <Text style={styles.submitBtnText}>Proceed to Deposit</Text>
          <ArrowRight size={20} color={Colors.darkForest} strokeWidth={2.8} />
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={isConfirmModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Confirm Deposit</Text>
            <Text style={styles.modalSub}>Verify the funding details before confirming.</Text>

            <View style={styles.modalDataBox}>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Amount</Text>
                <Text style={styles.modalDataValLime}>PKR {parsedAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Method</Text>
                <Text style={styles.modalDataVal}>{selectedMethod.toUpperCase()}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Destination</Text>
                <Text style={styles.modalDataVal}>{account.maskedNumber}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Fee</Text>
                <Text style={styles.modalDataVal}>PKR 0.00</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsConfirmModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmDeposit}
              >
                <Text style={styles.modalConfirmText}>Confirm Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={isSuccessModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.successIconCircle}>
              <CheckCircle size={44} color={Colors.darkForest} strokeWidth={2.8} />
            </View>
            <Text style={styles.modalHeading}>Deposit Successful!</Text>
            <Text style={styles.successAmount}>PKR {parsedAmount.toLocaleString()}</Text>
            <Text style={styles.modalSub}>
              Funds have been added to your PAYBACK wallet balance.
            </Text>

            <View style={styles.modalDataBox}>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Transaction ID</Text>
                <Text style={styles.modalDataVal}>{depositTxId}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>New Balance</Text>
                <Text style={styles.modalDataValLime}>
                  PKR {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Status</Text>
                <Text style={styles.modalDataVal}>COMPLETED</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => {
                setIsSuccessModalOpen(false);
                onGoBack();
              }}
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
  historyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.cardGreen,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  historyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  balanceBanner: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  balanceBannerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
  },
  balanceBannerValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.mutedGreen,
    marginTop: 14,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodCard: {
    width: (width - 50) / 2,
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.15)',
  },
  methodCardActive: {
    borderColor: Colors.primaryLime,
    backgroundColor: '#2D450F',
  },
  methodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  methodIconBoxActive: {
    backgroundColor: Colors.primaryLime,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  methodTitleActive: {
    color: Colors.primaryLime,
  },
  methodSub: {
    fontSize: 10,
    color: Colors.mutedGreen,
    marginTop: 3,
    lineHeight: 14,
  },
  amountInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  presetChip: {
    flex: 1,
    backgroundColor: Colors.cardGreen,
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.12)',
  },
  presetChipActive: {
    backgroundColor: Colors.primaryLime,
    borderColor: Colors.primaryLime,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.mutedGreen,
  },
  presetTextActive: {
    color: Colors.darkForest,
    fontWeight: '900',
  },
  instructionCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  instructionDesc: {
    fontSize: 11,
    color: Colors.mutedGreen,
    lineHeight: 16,
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textWhite,
    marginTop: 2,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.darkForest,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 3,
  },
  copyValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  feeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(213, 245, 74, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
  },
  feeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  summaryCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.12)',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  summaryFree: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(213, 245, 74, 0.15)',
    paddingTop: 8,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
    height: 56,
    borderRadius: 28,
    gap: 10,
    marginTop: 20,
    shadowColor: Colors.primaryLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12,
    color: Colors.mutedGreen,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  modalDataBox: {
    width: '100%',
    backgroundColor: Colors.darkForest,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  modalDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalDataKey: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  modalDataVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  modalDataValLime: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkForest,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  modalConfirmBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginVertical: 4,
  },
  modalDoneBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalDoneText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
