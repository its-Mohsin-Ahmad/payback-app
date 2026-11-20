import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { GovernmentBill } from '../../types';
import { ArrowLeft, Landmark, ShieldCheck, CheckCircle } from 'lucide-react-native';

interface GovernmentPaymentsScreenProps {
  onGoBack: () => void;
}

export const GovernmentPaymentsScreen: React.FC<GovernmentPaymentsScreenProps> = ({ onGoBack }) => {
  const { governmentBills, payGovernmentBill, account } = useBankStore();

  const handlePay = (bill: GovernmentBill) => {
    if (bill.amount > account.balance) {
      Alert.alert('Insufficient Balance', 'Not enough wallet funds.');
      return;
    }
    const res = payGovernmentBill(bill.id);
    if (res.success) {
      Alert.alert('Payment Cleared', `Challan ${bill.challanNumber} paid to National Treasury via 1Link 1Bill!`);
    } else {
      Alert.alert('Error', res.message);
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
        <Text style={styles.headerTitle}>Government Payments</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerCard}>
          <Landmark size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Federal &amp; Provincial Taxes</Text>
            <Text style={styles.bannerSub}>
              Direct 1Link 1Bill settlement for FBR, Traffic Police Challans, Excise &amp; Taxation Vehicle Tokens.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pending Public Invoices</Text>

        <View style={styles.billsList}>
          {governmentBills.map((bill) => (
            <View key={bill.id} style={styles.billRow}>
              <View style={styles.billInfoCol}>
                <Text style={styles.deptBadge}>{bill.department}</Text>
                <Text style={styles.billTitle}>{bill.title}</Text>
                <Text style={styles.challanNum}>PSID / Challan: {bill.challanNumber}</Text>
                <Text style={styles.dueDate}>Due: {bill.dueDate}</Text>
              </View>

              <View style={styles.actionCol}>
                <Text style={styles.amountText}>PKR {bill.amount.toLocaleString()}</Text>
                {bill.status === 'paid' ? (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>CLEARED</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => handlePay(bill)}
                  >
                    <Text style={styles.payBtnText}>Pay PSID</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  bannerCard: {
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
  billsList: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  billInfoCol: {
    flex: 1,
  },
  deptBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLime,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  challanNum: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  dueDate: {
    fontSize: 10,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  actionCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.textWhite,
    marginBottom: 6,
  },
  paidBadge: {
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  payBtn: {
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  payBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
