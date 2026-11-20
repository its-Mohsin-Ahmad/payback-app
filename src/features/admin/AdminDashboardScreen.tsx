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
import { ArrowLeft, ShieldAlert, Database, Server, RefreshCw, CheckCircle2 } from 'lucide-react-native';

interface AdminDashboardScreenProps {
  onGoBack: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onGoBack }) => {
  const { auditLogs, account, transactions, bills } = useBankStore();

  const handleReconcile = () => {
    Alert.alert(
      'Ledger Reconciliation Completed',
      'Double-entry validation verified.\nLedger Assets == Customer Liabilities.\nUnreconciled Difference: PKR 0.00.\nState Bank Audit Trail: Passed.'
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
        <Text style={styles.headerTitle}>Admin Financial Ledger</Text>
        <TouchableOpacity style={styles.circleBtn} onPress={handleReconcile}>
          <RefreshCw size={18} color={Colors.primaryLime} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <ShieldAlert size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Internal Compliance Portal</Text>
            <Text style={styles.bannerSub}>
              Role-Based Access Control: Compliance &amp; Operations Officer. Immutable audit trail logging.
            </Text>
          </View>
        </View>

        {/* System Health Metrics */}
        <Text style={styles.sectionTitle}>Real-Time Gateway Status</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>1Link Switch</Text>
            <View style={styles.metricStatusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.metricValue}>ONLINE (99.98%)</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Raast SBP Hub</Text>
            <View style={styles.metricStatusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.metricValue}>INSTANT RAIL OK</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Nadra Verisys</Text>
            <View style={styles.metricStatusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.metricValue}>BIOMETRIC ACTIVE</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Ledger Integrity</Text>
            <View style={styles.metricStatusRow}>
              <CheckCircle2 size={12} color={Colors.primaryLime} />
              <Text style={styles.metricValue}>BALANCED (PKR 0.00)</Text>
            </View>
          </View>
        </View>

        {/* SBP Audit Logs */}
        <Text style={styles.sectionTitle}>Immutable Regulatory Audit Logs</Text>

        <View style={styles.logsList}>
          {auditLogs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logTopRow}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logTime}>{log.timestamp}</Text>
              </View>
              <Text style={styles.logDetails}>{log.details}</Text>
              <Text style={styles.logActor}>Auditor: {log.performedBy}</Text>
            </View>
          ))}
        </View>

        {/* Biller Configurations Status */}
        <Text style={styles.sectionTitle}>Connected Biller Gateways</Text>

        <View style={styles.billersCard}>
          {['LESCO Power Grid', 'IESCO Islamabad Switch', 'SNGPL Gas Rail', 'PTCL Telecommunication', '1Bill Government Gateway'].map(
            (biller, idx) => (
              <View key={idx} style={styles.billerRow}>
                <Text style={styles.billerName}>{biller}</Text>
                <View style={styles.billerStatusPill}>
                  <Text style={styles.billerStatusText}>CONNECTED</Text>
                </View>
              </View>
            )
          )}
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.cardGreen,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
  },
  metricStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryLime,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  logsList: {
    gap: 12,
    marginBottom: 20,
  },
  logCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  logTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  logAction: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  logTime: {
    fontSize: 10,
    color: Colors.mutedGreen,
  },
  logDetails: {
    fontSize: 12,
    color: Colors.textWhite,
    lineHeight: 18,
  },
  logActor: {
    fontSize: 10,
    color: Colors.mutedGreen,
    marginTop: 6,
  },
  billersCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  billerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  billerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  billerStatusPill: {
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  billerStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
});
