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
import { SavingsGoal } from '../../types';
import { ArrowLeft, PiggyBank, Plus, Target, Check } from 'lucide-react-native';

interface SavingsGoalsScreenProps {
  onGoBack: () => void;
}

export const SavingsGoalsScreen: React.FC<SavingsGoalsScreenProps> = ({ onGoBack }) => {
  const { savingsGoals, addSavingsGoal, depositToSavingsGoal, account } = useBankStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('100000');
  const [targetDate, setTargetDate] = useState('December 2027');

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmt, setDepositAmt] = useState('5000');

  const handleCreate = () => {
    if (!goalName.trim()) {
      Alert.alert('Required', 'Please enter a goal name.');
      return;
    }
    const target = parseFloat(targetAmount) || 50000;
    addSavingsGoal({
      name: goalName,
      targetAmount: target,
      targetDate,
      category: 'General',
    });
    setIsCreateOpen(false);
    setGoalName('');
    Alert.alert('Goal Created', 'Your new savings vault has been established!');
  };

  const handleDeposit = () => {
    if (!selectedGoal) return;
    const amt = parseFloat(depositAmt) || 0;
    if (amt <= 0 || amt > account.balance) {
      Alert.alert('Invalid', 'Check your balance or enter a valid amount.');
      return;
    }
    const res = depositToSavingsGoal(selectedGoal.id, amt);
    if (res.success) {
      Alert.alert('Funds Saved', res.message);
      setIsDepositOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savings Vaults</Text>
        <TouchableOpacity style={styles.circleBtn} onPress={() => setIsCreateOpen(true)}>
          <Plus size={20} color={Colors.primaryLime} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <PiggyBank size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Goal-Based Digital Vaults</Text>
            <Text style={styles.bannerSub}>
              Lock funds safely away from daily spending to achieve your big dreams.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Active Goals</Text>

        <View style={styles.goalsContainer}>
          {savingsGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
            return (
              <View key={g.id} style={styles.goalCard}>
                <View style={styles.goalTopRow}>
                  <Text style={styles.goalName}>{g.name}</Text>
                  <Text style={styles.goalPct}>{pct}%</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.savedText}>
                    PKR {g.savedAmount.toLocaleString()} saved
                  </Text>
                  <Text style={styles.targetText}>
                    Target: PKR {g.targetAmount.toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addFundsBtn}
                  onPress={() => {
                    setSelectedGoal(g);
                    setIsDepositOpen(true);
                  }}
                >
                  <Text style={styles.addFundsBtnText}>+ Deposit Funds</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal visible={isCreateOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create New Savings Vault</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Goal Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Dream House Downpayment"
                placeholderTextColor={Colors.mutedGreen}
                value={goalName}
                onChangeText={setGoalName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Target Amount (PKR)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={targetAmount}
                onChangeText={setTargetAmount}
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsCreateOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreate}>
                <Text style={styles.confirmText}>Create Vault</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deposit Modal */}
      <Modal visible={isDepositOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Deposit to {selectedGoal?.name}</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Deposit Amount (PKR)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={depositAmt}
                onChangeText={setDepositAmt}
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsDepositOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleDeposit}>
                <Text style={styles.confirmText}>Confirm Deposit</Text>
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
  banner: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginVertical: 14,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  bannerSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  goalsContainer: {
    gap: 14,
  },
  goalCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  goalPct: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.darkForest,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryLime,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  savedText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  targetText: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  addFundsBtn: {
    backgroundColor: Colors.darkForest,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  addFundsBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  textInput: {
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.2)',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: Colors.mutedGreen,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: Colors.darkForest,
    fontWeight: '800',
  },
});
