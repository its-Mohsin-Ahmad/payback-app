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
import { ArrowLeft, FileText, Download, Share2 } from 'lucide-react-native';

interface StatementsScreenProps {
  onGoBack: () => void;
}

export const StatementsScreen: React.FC<StatementsScreenProps> = ({ onGoBack }) => {
  const { account, transactions } = useBankStore();

  const months = [
    { id: '1', name: 'November 2026 (Current)', txCount: 6, totalVolume: 'PKR 48,220.00' },
    { id: '2', name: 'October 2026', txCount: 24, totalVolume: 'PKR 184,500.00' },
    { id: '3', name: 'September 2026', txCount: 19, totalVolume: 'PKR 142,300.00' },
    { id: '4', name: 'August 2026', txCount: 31, totalVolume: 'PKR 210,000.00' },
  ];

  const handleDownload = (monthName: string) => {
    Alert.alert(
      'Account Statement Generated',
      `Official PDF e-Statement for ${monthName} compiled with SBP digital certification stamp.\nSaved to Device Downloads.`
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
        <Text style={styles.headerTitle}>Account Statements</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.accountTitle}>Account Number</Text>
          <Text style={styles.ibanText}>{account.iban}</Text>
          <Text style={styles.balanceText}>
            Closing Balance: PKR {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Monthly E-Statements</Text>

        <View style={styles.monthsList}>
          {months.map((m) => (
            <View key={m.id} style={styles.monthCard}>
              <View style={styles.iconCircle}>
                <FileText size={22} color={Colors.primaryLime} />
              </View>

              <View style={styles.monthInfo}>
                <Text style={styles.monthName}>{m.name}</Text>
                <Text style={styles.monthMeta}>{m.txCount} Transactions • Volume: {m.totalVolume}</Text>
              </View>

              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => handleDownload(m.name)}
              >
                <Download size={18} color={Colors.darkForest} />
              </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  accountTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
  },
  ibanText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
    marginVertical: 4,
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  monthsList: {
    gap: 12,
  },
  monthCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  monthInfo: {
    flex: 1,
  },
  monthName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  monthMeta: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
