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
  Store,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Clock,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WithdrawMoneyScreenProps {
  onGoBack: () => void;
  onNavigateToHistory: () => void;
}

type WithdrawMethod = 'bank' | 'agent' | 'atm';

export const WithdrawMoneyScreen: React.FC<WithdrawMoneyScreenProps> = ({
  onGoBack,
  onNavigateToHistory,
}) => {
  const { account, withdrawMoney } = useBankStore();

  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>('bank');
  const [amountStr, setAmountStr] = useState('3000');
  const [pinStr, setPinStr] = useState('');

  // Selected Bank info
  const [selectedBank, setSelectedBank] = useState('Meezan Bank');
  const [bankAccountNum, setBankAccountNum] = useState('02010103498124');

  // Modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [withdrawTxId, setWithdrawTxId] = useState('');
  const [generatedOtpCode, setGeneratedOtpCode] = useState('');

  const parsedAmount = parseFloat(amountStr) || 0;

  // Fee calculation (standard SBP rate: Bank = 0 free for under 25k, ATM = PKR 23.44, Agent = 0.5%)
  const fee =
    selectedMethod === 'bank'
      ? 0
      : selectedMethod === 'atm'
      ? 23.44
      : Math.round(parsedAmount * 0.005);

  const totalDeduction = parsedAmount + fee;

  const presetAmounts = ['1000', '2000', '5000', '10000', '20000'];

  const handleInitiateWithdraw = () => {
    if (parsedAmount < 500) {
      Alert.alert('Minimum Withdrawal', 'The minimum withdrawal amount is PKR 500.');
      return;
    }
    if (totalDeduction > account.balance) {
      Alert.alert('Insufficient Funds', 'Your wallet balance is insufficient for this withdrawal and fee.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    if (pinStr.length < 4) {
      Alert.alert('MPIN Required', 'Please enter your 4-digit secret MPIN to authorize withdrawal.');
      return;
    }

    const methodName =
      selectedMethod === 'bank'
        ? `1Link Bank Withdrawal (${selectedBank})`
        : selectedMethod === 'atm'
        ? 'Cardless 1Link ATM Cash-Out'
        : 'PAYBACK Retail Cash-Out Agent';

    const result = withdrawMoney(parsedAmount, methodName);

    if (result.success) {
      setWithdrawTxId(result.transactionId || `WTH_${Date.now()}`);
      setGeneratedOtpCode(`${Math.floor(100000 + Math.random() * 900000)}`);
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
      setPinStr('');
    } else {
      Alert.alert('Withdrawal Failed', result.message);
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
        <Text style={styles.headerTitle}>Withdraw Money</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={onNavigateToHistory}>
          <Text style={styles.historyBtnText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card Banner */}
        <View style={styles.balanceBanner}>
          <Text style={styles.balanceBannerLabel}>Available For Withdrawal</Text>
          <Text style={styles.balanceBannerValue}>
            PKR {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* 1. Method Selection */}
        <Text style={styles.sectionHeading}>1. CHOOSE WITHDRAWAL CHANNEL</Text>
        <View style={styles.methodList}>
          {/* Channel A: Bank Withdrawal */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'bank' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('bank')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'bank' && styles.methodIconBoxActive]}>
              <Building size={20} color={selectedMethod === 'bank' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodTitle, selectedMethod === 'bank' && styles.methodTitleActive]}>
                Transfer to Bank Account
              </Text>
              <Text style={styles.methodSub}>Send to any verified Pakistani bank (Instant • Zero Fee)</Text>
            </View>
            <View style={styles.radioCircle}>
              {selectedMethod === 'bank' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* Channel B: Cardless ATM */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'atm' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('atm')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'atm' && styles.methodIconBoxActive]}>
              <CreditCard size={20} color={selectedMethod === 'atm' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodTitle, selectedMethod === 'atm' && styles.methodTitleActive]}>
                Cardless 1Link ATM Cash-Out
              </Text>
              <Text style={styles.methodSub}>Withdraw from 18,000+ ATMs across Pakistan with OTP</Text>
            </View>
            <View style={styles.radioCircle}>
              {selectedMethod === 'atm' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* Channel C: Retail Agent */}
          <TouchableOpacity
            style={[styles.methodCard, selectedMethod === 'agent' && styles.methodCardActive]}
            activeOpacity={0.85}
            onPress={() => setSelectedMethod('agent')}
          >
            <View style={[styles.methodIconBox, selectedMethod === 'agent' && styles.methodIconBoxActive]}>
              <Store size={20} color={selectedMethod === 'agent' ? Colors.darkForest : Colors.primaryLime} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodTitle, selectedMethod === 'agent' && styles.methodTitleActive]}>
                Authorized Retail Agent
              </Text>
              <Text style={styles.methodSub}>Collect cash at any nearby PAYBACK or partner merchant</Text>
            </View>
            <View style={styles.radioCircle}>
              {selectedMethod === 'agent' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* 2. Method Details */}
        {selectedMethod === 'bank' && (
          <View style={styles.bankDetailCard}>
            <Text style={styles.bankDetailTitle}>Beneficiary Account</Text>
            <View style={styles.bankRow}>
              <Building size={16} color={Colors.primaryLime} />
              <TextInput
                style={styles.bankInput}
                value={selectedBank}
                onChangeText={setSelectedBank}
                placeholder="Bank Name (e.g. Meezan Bank)"
                placeholderTextColor={Colors.mutedGreen}
              />
            </View>
            <View style={styles.bankRow}>
              <CreditCard size={16} color={Colors.primaryLime} />
              <TextInput
                style={styles.bankInput}
                value={bankAccountNum}
                onChangeText={setBankAccountNum}
                placeholder="Account / IBAN Number"
                placeholderTextColor={Colors.mutedGreen}
              />
            </View>
          </View>
        )}

        {/* 3. Amount Input */}
        <Text style={styles.sectionHeading}>2. ENTER WITHDRAWAL AMOUNT</Text>
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

        {/* Presets */}
        <View style={styles.presetRow}>
          {presetAmounts.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.presetChip, amountStr === p && styles.presetChipActive]}
              activeOpacity={0.8}
              onPress={() => setAmountStr(p)}
            >
              <Text style={[styles.presetText, amountStr === p && styles.presetTextActive]}>
                {parseInt(p).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fee & Limits Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Withdrawal Amount</Text>
            <Text style={styles.summaryValue}>PKR {parsedAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Fee</Text>
            <Text style={fee === 0 ? styles.summaryFree : styles.summaryValue}>
              {fee === 0 ? 'FREE (PKR 0.00)' : `PKR ${fee.toFixed(2)}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryDivider]}>
            <Text style={styles.summaryTotalLabel}>Total Deduction</Text>
            <Text style={styles.summaryTotalValue}>
              PKR {totalDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.88}
          onPress={handleInitiateWithdraw}
        >
          <Text style={styles.submitBtnText}>Review Withdrawal</Text>
          <ArrowRight size={20} color={Colors.darkForest} strokeWidth={2.8} />
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation & MPIN Modal */}
      <Modal visible={isConfirmModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Confirm Withdrawal</Text>
            <Text style={styles.modalSub}>
              Enter your 4-digit secret MPIN to authenticate this transaction.
            </Text>

            <View style={styles.modalDataBox}>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Amount</Text>
                <Text style={styles.modalDataValLime}>PKR {parsedAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Channel</Text>
                <Text style={styles.modalDataVal}>{selectedMethod.toUpperCase()}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Fee</Text>
                <Text style={styles.modalDataVal}>PKR {fee.toFixed(2)}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Total Debit</Text>
                <Text style={styles.modalDataValLime}>PKR {totalDeduction.toFixed(2)}</Text>
              </View>
            </View>

            {/* MPIN Input */}
            <View style={styles.pinWrapper}>
              <Text style={styles.pinLabel}>ENTER 4-DIGIT MPIN</Text>
              <TextInput
                style={styles.pinInput}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                placeholder="••••"
                placeholderTextColor={Colors.mutedGreen}
                value={pinStr}
                onChangeText={setPinStr}
              />
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
                onPress={handleConfirmWithdraw}
              >
                <Text style={styles.modalConfirmText}>Authorize</Text>
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
            <Text style={styles.modalHeading}>Withdrawal Authorized!</Text>
            <Text style={styles.successAmount}>PKR {parsedAmount.toLocaleString()}</Text>

            {selectedMethod === 'atm' ? (
              <View style={styles.otpTokenBox}>
                <View style={styles.otpHeaderRow}>
                  <Clock size={16} color={Colors.darkForest} />
                  <Text style={styles.otpHeaderTitle}>1Link ATM OTP Code (Valid 15 Mins)</Text>
                </View>
                <Text style={styles.otpCodeText}>{generatedOtpCode}</Text>
                <Text style={styles.otpInstruction}>
                  Enter this OTP at any 1Link ATM after selecting "Cardless Cash Withdrawal".
                </Text>
              </View>
            ) : (
              <Text style={styles.modalSub}>
                Transaction processed successfully. Funds have been debited from your wallet.
              </Text>
            )}

            <View style={styles.modalDataBox}>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Transaction ID</Text>
                <Text style={styles.modalDataVal}>{withdrawTxId}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataKey}>Remaining Balance</Text>
                <Text style={styles.modalDataValLime}>
                  PKR {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
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
  methodList: {
    gap: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodIconBoxActive: {
    backgroundColor: Colors.primaryLime,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  methodTitleActive: {
    color: Colors.primaryLime,
  },
  methodSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
    lineHeight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryLime,
  },
  bankDetailCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
    gap: 10,
  },
  bankDetailTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
    textTransform: 'uppercase',
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkForest,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  bankInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '600',
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
    marginBottom: 16,
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
  pinWrapper: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.mutedGreen,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  pinInput: {
    width: '60%',
    height: 48,
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryLime,
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: Colors.borderLime,
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
  otpTokenBox: {
    width: '100%',
    backgroundColor: Colors.primaryLime,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginVertical: 14,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  otpHeaderTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.darkForest,
    textTransform: 'uppercase',
  },
  otpCodeText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.darkForest,
    letterSpacing: 6,
  },
  otpInstruction: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.darkForest,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
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
