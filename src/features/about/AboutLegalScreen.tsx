import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react-native';

interface AboutLegalScreenProps {
  onGoBack: () => void;
}

export const AboutLegalScreen: React.FC<AboutLegalScreenProps> = ({ onGoBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About &amp; Regulatory</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Presentation */}
        <View style={styles.brandHero}>
          <PaybackLogo size={64} showText={true} showTagline={true} theme="dark" glow />
          <Text style={styles.versionBadge}>v1.0.0 Production Release</Text>
        </View>

        {/* Regulatory Disclosure */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <ShieldCheck size={20} color={Colors.primaryLime} />
            <Text style={styles.cardTitle}>Regulatory &amp; Legal Framework</Text>
          </View>
          <Text style={styles.cardBody}>
            PAYBACK is a digital wallet and electronic money application intended for financial transactions within the Islamic Republic of Pakistan. All inter-bank fund transfers, Raast payments, utility bill settlements, and mobile airtime recharges operate via licensed payment systems and partner institutions authorized by the State Bank of Pakistan (SBP).
          </Text>
        </View>

        {/* Legal Policies */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal Documents</Text>

          <TouchableOpacity
            style={styles.policyRow}
            onPress={() => Linking.openURL('https://its-mohsin-ahmad.github.io/payback/')}
          >
            <Text style={styles.policyText}>Official Website</Text>
            <ExternalLink size={16} color={Colors.primaryLime} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.policyRow}
            onPress={() => Linking.openURL('https://its-mohsin-ahmad.github.io/payback/privacy.html')}
          >
            <Text style={styles.policyText}>Privacy Policy (Google Play Compliant)</Text>
            <ExternalLink size={16} color={Colors.primaryLime} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.policyRow}
            onPress={() => Linking.openURL('https://its-mohsin-ahmad.github.io/payback/terms.html')}
          >
            <Text style={styles.policyText}>Terms &amp; Conditions of Service</Text>
            <ExternalLink size={16} color={Colors.primaryLime} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.policyRow}>
            <Text style={styles.policyText}>Customer Fund Protection: 100% Escrow Reserve</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          © 2026 PAYBACK Financial Services Ltd. All Rights Reserved.
        </Text>
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
  brandHero: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLime,
    marginTop: 8,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  cardBody: {
    fontSize: 12,
    color: Colors.mutedGreen,
    lineHeight: 18,
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  policyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(200, 243, 58, 0.08)',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 20,
    opacity: 0.8,
  },
});
