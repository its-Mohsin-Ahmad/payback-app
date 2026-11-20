import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { PaybackCard } from '../../components/cards/PaybackCard';
import {
  ArrowLeft,
  Bell,
  ArrowUpRight,
  Plus,
  FileText,
  DollarSign,
  HandCoins,
  Snowflake,
  Gauge,
  ArrowDownToLine,
  ShieldCheck,
  CreditCard,
  Lock,
} from 'lucide-react-native';

interface CardsScreenProps {
  onGoBack: () => void;
  onNavigateToSend: () => void;
  onNavigateToBills: () => void;
  onNavigateToStatements: () => void;
  onNavigateToSavings: () => void;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({
  onGoBack,
  onNavigateToSend,
  onNavigateToBills,
  onNavigateToStatements,
  onNavigateToSavings,
}) => {
  const { card, toggleFreezeCard, updateCardLimit, addMoney } = useBankStore();

  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [newLimitInput, setNewLimitInput] = useState(card.dailyLimit.toString());

  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('5000');

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // 8 Quick Actions exactly matching the right phone in reference image!
  const quickActions = [
    {
      id: 'send',
      label: 'Send Money',
      icon: ArrowUpRight,
      action: onNavigateToSend,
    },
    {
      id: 'topup',
      label: 'Topup',
      icon: Plus,
      action: () => setIsTopupModalOpen(true),
    },
    {
      id: 'statements',
      label: 'Statements',
      icon: FileText,
      action: onNavigateToStatements,
    },
    {
      id: 'bills',
      label: 'Bills Pay',
      icon: DollarSign,
      action: onNavigateToBills,
    },
    {
      id: 'loans',
      label: 'Savings',
      icon: HandCoins,
      action: onNavigateToSavings,
    },
    {
      id: 'freeze',
      label: card.isFrozen ? 'Unfreeze' : 'Freeze Cards',
      icon: Snowflake,
      action: () => {
        toggleFreezeCard();
        Alert.alert(
          card.isFrozen ? 'Card Unfrozen' : 'Card Frozen',
          card.isFrozen
            ? 'Your PAYBACK card has been reactivated.'
            : 'Your card is now frozen and cannot be charged.'
        );
      },
    },
    {
      id: 'limits',
      label: 'Limit Request',
      icon: Gauge,
      action: () => setIsLimitModalOpen(true),
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: ArrowDownToLine,
      action: () => setIsTopupModalOpen(true),
    },
  ];

  const handleSaveLimit = () => {
    const val = parseFloat(newLimitInput);
    if (!val || val <= 0) {
      Alert.alert('Invalid Limit', 'Please enter a valid amount.');
      return;
    }
    updateCardLimit(val);
    setIsLimitModalOpen(false);
    Alert.alert('Limit Updated', `Your daily spending limit is now PKR ${val.toLocaleString()}`);
  };

  const handleTopup = () => {
    const val = parseFloat(topupAmount);
    if (!val || val <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid topup amount.');
      return;
    }
    addMoney(val, 'Linked Raast Bank Account');
    setIsTopupModalOpen(false);
    Alert.alert('Top Up Successful', `PKR ${val.toLocaleString()} added to your wallet card balance!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleButton}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cards</Text>

        <TouchableOpacity style={styles.circleButton}>
          <Bell size={20} color={Colors.primaryLime} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Virtual Card (Matching reference image right phone) */}
        <PaybackCard card={card} onPress={() => setIsDetailsModalOpen(true)} />

        {/* Card Status & Limits summary pill */}
        <View style={styles.cardStatusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Card Status</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: card.isFrozen ? '#EF4444' : Colors.primaryLime }]} />
              <Text style={styles.statusBadgeText}>{card.isFrozen ? 'FROZEN' : 'ACTIVE & VERIFIED'}</Text>
            </View>
          </View>
          <View style={styles.spendingBar}>
            <View
              style={[
                styles.spendingFill,
                { width: `${Math.min(100, (card.currentSpend / card.dailyLimit) * 100)}%` },
              ]}
            />
          </View>
          <View style={styles.spendingMetaRow}>
            <Text style={styles.spendingMeta}>Spent: PKR {card.currentSpend.toLocaleString()}</Text>
            <Text style={styles.spendingMeta}>Limit: PKR {card.dailyLimit.toLocaleString()}</Text>
          </View>
        </View>

        {/* Quick Actions (8 Dark Green Squircle Tiles, matching reference image) */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.actionSquare}
                activeOpacity={0.8}
                onPress={item.action}
              >
                <View style={styles.actionIconBox}>
                  <IconComponent size={20} color={Colors.primaryLime} strokeWidth={2.2} />
                </View>
                <Text style={styles.actionLabel} numberOfLines={1}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Cards Action Button (Matching reference image) */}
        <TouchableOpacity
          style={styles.addCardButton}
          activeOpacity={0.88}
          onPress={() =>
            Alert.alert(
              'Request Physical Debit Card',
              'A customized contactless PAYBACK VISA debit card will be delivered to your registered residential address in Pakistan via secure courier within 3-5 business days.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm Delivery', onPress: () => Alert.alert('Request Received', 'Your physical card tracking number is TCS-PK-981420') },
              ]
            )
          }
        >
          <Plus size={20} color={Colors.darkForest} strokeWidth={3} />
          <Text style={styles.addCardButtonText}>+ Add Cards</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Set Daily Limit Modal */}
      <Modal visible={isLimitModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Daily Card Spending Limit</Text>
            <Text style={styles.modalSub}>
              Protect your funds by specifying a daily limit for online, POS, and ATM transactions.
            </Text>

            <View style={styles.modalInputWrapper}>
              <Text style={styles.modalInputLabel}>Daily Limit (PKR)</Text>
              <TextInput
                style={styles.modalTextInput}
                keyboardType="number-pad"
                value={newLimitInput}
                onChangeText={setNewLimitInput}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsLimitModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleSaveLimit}>
                <Text style={styles.modalConfirmText}>Save Limit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Topup Card Modal */}
      <Modal visible={isTopupModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Deposit / Top Up Wallet</Text>
            <Text style={styles.modalSub}>
              Add funds directly into your PAYBACK wallet via linked bank account, Raast, or debit card.
            </Text>

            <View style={styles.modalInputWrapper}>
              <Text style={styles.modalInputLabel}>Deposit Amount (PKR)</Text>
              <TextInput
                style={styles.modalTextInput}
                keyboardType="number-pad"
                value={topupAmount}
                onChangeText={setTopupAmount}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsTopupModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleTopup}>
                <Text style={styles.modalConfirmText}>Confirm Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sensitive Card Details Modal */}
      <Modal visible={isDetailsModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <ShieldCheck size={36} color={Colors.primaryLime} />
            </View>
            <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Virtual Card Credentials</Text>
            <Text style={[styles.modalSub, { textAlign: 'center' }]}>
              Never share your CVV or Card Number with anyone.
            </Text>

            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Card Number</Text>
                <Text style={styles.detailVal}>{card.cardNumberFull}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Valid Thru</Text>
                <Text style={styles.detailVal}>{card.expiryDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>CVV / CVC</Text>
                <Text style={[styles.detailVal, { color: Colors.primaryLime }]}>{card.cvv}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Card Type</Text>
                <Text style={styles.detailVal}>{card.cardBrand} {card.cardType}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => setIsDetailsModalOpen(false)}
            >
              <Text style={styles.modalConfirmText}>Close</Text>
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
  circleButton: {
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
    paddingBottom: 110,
  },
  cardStatusCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.darkForest,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  spendingBar: {
    height: 4,
    backgroundColor: Colors.darkForest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  spendingFill: {
    height: '100%',
    backgroundColor: Colors.primaryLime,
  },
  spendingMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  spendingMeta: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginVertical: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  actionSquare: {
    width: (width - 40 - 24) / 4,
    backgroundColor: Colors.cardGreen,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.12)',
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textAlign: 'center',
  },
  addCardButton: {
    backgroundColor: Colors.primaryLime,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  addCardButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  },
  modalSub: {
    fontSize: 12,
    color: Colors.mutedGreen,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalInputWrapper: {
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalTextInput: {
    backgroundColor: Colors.darkForest,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.2)',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
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
  detailsBox: {
    backgroundColor: Colors.darkForest,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailKey: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textWhite,
  },
});
