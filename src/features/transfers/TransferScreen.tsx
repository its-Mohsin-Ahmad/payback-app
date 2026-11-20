import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ArrowLeft,
  Bell,
  MoreHorizontal,
  Plus,
  Delete,
  Check,
  Building,
  Smartphone,
  CreditCard,
  Hash,
  ShieldCheck,
  Share2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface TransferScreenProps {
  onGoBack: () => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({ onGoBack }) => {
  const { account, favouriteContacts, sendMoney } = useBankStore();
  const { user } = useAuthStore();

  const [amountStr, setAmountStr] = useState('1500');
  const [selectedContact, setSelectedContact] = useState(favouriteContacts[0]);
  const [destinationType, setDestinationType] = useState<'wallet' | 'bank' | 'raast' | 'cnic'>('wallet');

  // Custom modal for entering other recipient
  const [isCustomRecipientOpen, setIsCustomRecipientOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAccount, setCustomAccount] = useState('');
  const [customBank, setCustomBank] = useState('Meezan Bank');

  // Hold to send animation
  const holdProgress = useRef(new Animated.Value(0)).current;
  const [isHolding, setIsHolding] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastTxId, setLastTxId] = useState('');

  const parsedAmount = parseFloat(amountStr) || 0;

  // Keypad click handler
  const handleKeyPress = (val: string) => {
    if (val === 'backspace') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === 'clear') {
      setAmountStr('0');
    } else {
      setAmountStr((prev) => (prev === '0' ? val : prev + val));
    }
  };

  // Hold-to-send animation
  const handleHoldStart = () => {
    if (parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount to transfer.');
      return;
    }
    if (parsedAmount > account.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance in your wallet.');
      return;
    }

    setIsHolding(true);
    Animated.timing(holdProgress, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        completeTransfer();
      }
    });
  };

  const handleHoldEnd = () => {
    if (!isSuccessModalOpen) {
      setIsHolding(false);
      Animated.timing(holdProgress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const completeTransfer = () => {
    const recipientName = customName.trim() || selectedContact?.name || 'Alina';
    const recipientAcc = customAccount.trim() || selectedContact?.accountMasked || '******66';

    const res = sendMoney({
      recipientName,
      accountNumber: recipientAcc,
      amount: parsedAmount,
      destinationType,
      bankName: destinationType === 'bank' ? customBank : 'PAYBACK Wallet',
      note: 'Fund Transfer',
    });

    if (res.success) {
      setLastTxId(res.transactionId || 'CJ4901TUZ0');
      setIsSuccessModalOpen(true);
    } else {
      Alert.alert('Transfer Failed', res.message);
    }
    setIsHolding(false);
    holdProgress.setValue(0);
  };

  const holdWidth = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. LIME-GREEN HEADER CARD (Exact recreation of left phone header in reference image) */}
      <View style={styles.headerCardContainer}>
        <LinearGradient
          colors={['#D9FF4D', '#C8F33A', '#BCE828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          {/* Top Bar inside Lime Card: Back, Title, Bell */}
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={onGoBack} style={styles.circleIconButton}>
              <ArrowLeft size={20} color={Colors.darkForest} strokeWidth={2.5} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Send Money</Text>

            <TouchableOpacity style={styles.circleIconButton}>
              <Bell size={20} color={Colors.darkForest} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Transfer From Account Surface Pill */}
          <View style={styles.transferFromCard}>
            <Text style={styles.transferFromLabel}>Transfer from</Text>

            <View style={styles.accountRow}>
              <Image
                source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                style={styles.senderAvatar}
              />
              <View style={styles.accountInfo}>
                <Text style={styles.accountTitle}>My Account</Text>
                <Text style={styles.accountMasked}>{account.maskedNumber}</Text>
              </View>

              <View style={styles.accountBalanceBadge}>
                <Text style={styles.accountBalanceText}>
                  PKR {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>

              <TouchableOpacity style={styles.moreBtn}>
                <MoreHorizontal size={18} color={Colors.darkForest} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 2. BODY: Amount Display, Limits, Quick Send & Keypad (Deep Forest Background) */}
      <View style={styles.bodyContent}>
        {/* Large Amount Display */}
        <View style={styles.amountDisplayArea}>
          <Text style={styles.amountText}>
            PKR {parseFloat(amountStr || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Transfer Limits Slider Indicator (Matching reference image) */}
        <View style={styles.limitContainer}>
          <View style={styles.limitHeaderRow}>
            <Text style={styles.limitLabel}>Transfer Limits</Text>
            <Text style={styles.limitValue}>PKR 250,000.00</Text>
          </View>
          <View style={styles.limitProgressBar}>
            <View
              style={[
                styles.limitProgressFill,
                { width: `${Math.min(100, (parsedAmount / 250000) * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Quick Send Recipient Selector (Matching reference image) */}
        <View style={styles.quickSendHeaderRow}>
          <Text style={styles.quickSendTitle}>Quick Send</Text>
          <TouchableOpacity onPress={() => setIsCustomRecipientOpen(true)}>
            <Text style={styles.viewAllLink}>View all &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipientsRow}>
          {/* Add custom recipient */}
          <TouchableOpacity
            style={styles.addRecipientBtn}
            onPress={() => setIsCustomRecipientOpen(true)}
          >
            <Plus size={20} color={Colors.primaryLime} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Quick contacts */}
          {favouriteContacts.slice(0, 3).map((contact) => {
            const isSelected = selectedContact?.id === contact.id;
            return (
              <TouchableOpacity
                key={contact.id}
                style={styles.recipientItem}
                activeOpacity={0.8}
                onPress={() => setSelectedContact(contact)}
              >
                <Image
                  source={{ uri: contact.avatar }}
                  style={[
                    styles.recipientAvatar,
                    isSelected && styles.recipientAvatarActive,
                  ]}
                />
                <Text style={styles.recipientName} numberOfLines={1}>
                  {contact.name}
                </Text>
                <Text style={styles.recipientSub}>{contact.accountMasked}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Numeric Keypad (Dark Green & Rounded, matching reference image) */}
        <View style={styles.keypadGrid}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <TouchableOpacity
              key={digit}
              style={styles.keyButton}
              activeOpacity={0.7}
              onPress={() => handleKeyPress(digit)}
            >
              <Text style={styles.keyText}>{digit}</Text>
            </TouchableOpacity>
          ))}

          {/* Backspace */}
          <TouchableOpacity
            style={styles.keyButton}
            activeOpacity={0.7}
            onPress={() => handleKeyPress('backspace')}
          >
            <Delete size={22} color={Colors.textWhite} />
          </TouchableOpacity>

          {/* 0 */}
          <TouchableOpacity
            style={styles.keyButton}
            activeOpacity={0.7}
            onPress={() => handleKeyPress('0')}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>

          {/* Check / Next */}
          <TouchableOpacity
            style={[styles.keyButton, styles.checkKeyButton]}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Amount Set', `PKR ${parsedAmount.toLocaleString()} ready to send.`)}
          >
            <Check size={22} color={Colors.primaryLime} strokeWidth={3} />
          </TouchableOpacity>
        </View>

        {/* Curved Glowing "Hold To Send" Button (Matching reference image) */}
        <View style={styles.holdButtonAnchor}>
          <TouchableOpacity
            style={styles.holdButton}
            activeOpacity={0.9}
            onPressIn={handleHoldStart}
            onPressOut={handleHoldEnd}
          >
            {/* Animated progress fill */}
            <Animated.View style={[styles.holdProgressOverlay, { width: holdWidth }]} />

            <Text style={styles.holdButtonText}>
              {isHolding ? 'Holding to Authorize...' : 'Hold To Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recipient Input Modal (For Bank, Raast, or CNIC transfer) */}
      <Modal visible={isCustomRecipientOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Transfer Destination</Text>

            {/* Destination Type Pills */}
            <View style={styles.typeSelectorRow}>
              {(['wallet', 'bank', 'raast', 'cnic'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typePill, destinationType === type && styles.typePillActive]}
                  onPress={() => setDestinationType(type)}
                >
                  <Text style={[styles.typePillText, destinationType === type && styles.typePillTextActive]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalInputWrapper}>
              <Text style={styles.modalInputLabel}>Recipient Full Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter full name"
                placeholderTextColor={Colors.mutedGreen}
                value={customName}
                onChangeText={setCustomName}
              />
            </View>

            <View style={styles.modalInputWrapper}>
              <Text style={styles.modalInputLabel}>
                {destinationType === 'raast'
                  ? 'Raast ID / Mobile Number'
                  : destinationType === 'cnic'
                  ? 'Nadra CNIC (13 Digits)'
                  : destinationType === 'bank'
                  ? 'IBAN or Account Number'
                  : 'PAYBACK Account / Mobile'}
              </Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder={destinationType === 'bank' ? 'PK82 MEZN 0001...' : '03xx xxxxxxx'}
                placeholderTextColor={Colors.mutedGreen}
                value={customAccount}
                onChangeText={setCustomAccount}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsCustomRecipientOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => setIsCustomRecipientOpen(false)}
              >
                <Text style={styles.modalConfirmText}>Confirm Recipient</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Receipt Modal */}
      <Modal visible={isSuccessModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.receiptCard}>
            <View style={styles.receiptCheckCircle}>
              <Check size={36} color={Colors.darkForest} strokeWidth={3} />
            </View>

            <Text style={styles.receiptTitle}>Transfer Successful!</Text>
            <Text style={styles.receiptAmount}>
              PKR {parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.receiptSub}>
              Sent to {customName.trim() || selectedContact?.name || 'Alina'}
            </Text>

            <View style={styles.receiptDetailsBox}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptMetaKey}>Transaction ID</Text>
                <Text style={styles.receiptMetaVal}>{lastTxId}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptMetaKey}>Payment Rail</Text>
                <Text style={styles.receiptMetaVal}>{destinationType.toUpperCase()} Instant Rail</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptMetaKey}>Date & Time</Text>
                <Text style={styles.receiptMetaVal}>Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptMetaKey}>Service Fee</Text>
                <Text style={[styles.receiptMetaVal, { color: Colors.primaryLime }]}>PKR 0.00 (Free)</Text>
              </View>
            </View>

            <View style={styles.receiptActionsRow}>
              <TouchableOpacity
                style={styles.receiptShareBtn}
                onPress={() => Alert.alert('Share Receipt', `Receipt for Ref: ${lastTxId} copied.`)}
              >
                <Share2 size={18} color={Colors.primaryLime} />
                <Text style={styles.receiptShareText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.receiptDoneBtn}
                onPress={() => {
                  setIsSuccessModalOpen(false);
                  onGoBack();
                }}
              >
                <Text style={styles.receiptDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
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
  headerCardContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerCard: {
    borderRadius: 28,
    padding: 18,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  circleIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(16, 32, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.darkForest,
  },
  transferFromCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 18,
    padding: 12,
  },
  transferFromLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.darkForest,
    opacity: 0.7,
    marginBottom: 6,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.darkForest,
  },
  accountInfo: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.darkForest,
  },
  accountMasked: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.darkForest,
    opacity: 0.8,
  },
  accountBalanceBadge: {
    backgroundColor: Colors.darkForest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  accountBalanceText: {
    color: Colors.brightLime,
    fontSize: 11,
    fontWeight: '800',
  },
  moreBtn: {
    padding: 4,
  },
  bodyContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  amountDisplayArea: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textWhite,
    letterSpacing: -0.5,
  },
  limitContainer: {
    marginBottom: 12,
  },
  limitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  limitLabel: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '600',
  },
  limitValue: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '700',
  },
  limitProgressBar: {
    height: 3,
    backgroundColor: Colors.cardGreen,
    borderRadius: 2,
    overflow: 'hidden',
  },
  limitProgressFill: {
    height: '100%',
    backgroundColor: Colors.primaryLime,
  },
  quickSendHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickSendTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  viewAllLink: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  recipientsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  addRecipientBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.cardGreen,
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientItem: {
    alignItems: 'center',
    width: 58,
  },
  recipientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  recipientAvatarActive: {
    borderColor: Colors.primaryLime,
  },
  recipientName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textWhite,
    marginTop: 4,
  },
  recipientSub: {
    fontSize: 9,
    color: Colors.mutedGreen,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  keyButton: {
    width: (width - 40 - 24) / 3,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.1)',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  checkKeyButton: {
    backgroundColor: Colors.cardGreen,
    borderColor: Colors.borderLime,
  },
  holdButtonAnchor: {
    marginTop: 10,
    alignItems: 'center',
  },
  holdButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLime,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  holdProgressOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#A9E315',
  },
  holdButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.darkForest,
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 16,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  typePillActive: {
    backgroundColor: Colors.primaryLime,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.mutedGreen,
  },
  typePillTextActive: {
    color: Colors.darkForest,
  },
  modalInputWrapper: {
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalTextInput: {
    backgroundColor: Colors.darkForest,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.2)',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: Colors.mutedGreen,
    fontWeight: '700',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: Colors.darkForest,
    fontWeight: '800',
  },
  receiptCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  receiptCheckCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  receiptAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 6,
  },
  receiptSub: {
    fontSize: 13,
    color: Colors.mutedGreen,
    marginTop: 4,
    marginBottom: 20,
  },
  receiptDetailsBox: {
    width: '100%',
    backgroundColor: Colors.darkForest,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptMetaKey: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  receiptMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  receiptActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  receiptShareBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkForest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  receiptShareText: {
    color: Colors.primaryLime,
    fontWeight: '800',
  },
  receiptDoneBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptDoneText: {
    color: Colors.darkForest,
    fontWeight: '900',
  },
});
