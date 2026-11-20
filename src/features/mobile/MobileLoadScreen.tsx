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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { MobileNetworkType, MobilePackage } from '../../types';
import {
  ArrowLeft,
  Smartphone,
  Check,
  Zap,
  Globe,
  MessageSquare,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';

interface MobileLoadScreenProps {
  onGoBack: () => void;
}

export const MobileLoadScreen: React.FC<MobileLoadScreenProps> = ({ onGoBack }) => {
  const { account, mobilePackages, rechargeMobile, subscribePackage } = useBankStore();

  const [activeTab, setActiveTab] = useState<'recharge' | 'packages'>('recharge');
  const [selectedNetwork, setSelectedNetwork] = useState<MobileNetworkType>('Jazz');
  const [phoneNumber, setPhoneNumber] = useState('0300 8472910');
  const [amountStr, setAmountStr] = useState('500');

  const networks: MobileNetworkType[] = ['Jazz', 'Zong', 'Ufone', 'Telenor'];

  const quickAmounts = [100, 200, 500, 1000, 2000];

  const handleRecharge = () => {
    const amt = parseFloat(amountStr);
    if (!amt || amt < 50) {
      Alert.alert('Invalid Amount', 'Minimum mobile recharge amount is PKR 50.');
      return;
    }
    if (amt > account.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds for this recharge.');
      return;
    }

    const res = rechargeMobile({
      network: selectedNetwork,
      phoneNumber,
      amount: amt,
    });

    if (res.success) {
      Alert.alert(
        'Recharge Successful',
        `PKR ${amt.toLocaleString()} loaded to ${phoneNumber} (${selectedNetwork}) successfully!\nRef: ${res.transactionId}`,
        [{ text: 'Great', onPress: onGoBack }]
      );
    } else {
      Alert.alert('Failed', res.message);
    }
  };

  const handleSubscribe = (pkg: MobilePackage) => {
    if (pkg.price > account.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to subscribe to this bundle.');
      return;
    }

    Alert.alert(
      'Confirm Bundle Activation',
      `Subscribe to ${pkg.network} ${pkg.name} for PKR ${pkg.price} on ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            const res = subscribePackage(pkg.id, phoneNumber);
            if (res.success) {
              Alert.alert('Bundle Activated!', `Your bundle has been activated on ${phoneNumber}.`);
            } else {
              Alert.alert('Error', res.message);
            }
          },
        },
      ]
    );
  };

  const filteredPackages = mobilePackages.filter((p) => p.network === selectedNetwork);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile Load &amp; Bundles</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Top Tab Mode: Recharge vs Packages */}
      <View style={styles.modeTabBar}>
        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'recharge' && styles.modeTabActive]}
          onPress={() => setActiveTab('recharge')}
        >
          <Text style={[styles.modeTabText, activeTab === 'recharge' && styles.modeTabTextActive]}>
            Mobile Easyload
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'packages' && styles.modeTabActive]}
          onPress={() => setActiveTab('packages')}
        >
          <Text style={[styles.modeTabText, activeTab === 'packages' && styles.modeTabTextActive]}>
            Bundle Marketplace
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Network Selector */}
        <Text style={styles.sectionTitle}>Select Telecom Network</Text>
        <View style={styles.networkRow}>
          {networks.map((net) => {
            const isSelected = selectedNetwork === net;
            return (
              <TouchableOpacity
                key={net}
                style={[styles.networkPill, isSelected && styles.networkPillActive]}
                onPress={() => setSelectedNetwork(net)}
              >
                <Text style={[styles.networkText, isSelected && styles.networkTextActive]}>
                  {net}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab 1: Easyload Recharge */}
        {activeTab === 'recharge' && (
          <View style={styles.rechargeCard}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Phone Number</Text>
              <View style={styles.inputRow}>
                <Smartphone size={18} color={Colors.mutedGreen} />
                <TextInput
                  style={styles.textInput}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="03xx xxxxxxx"
                  placeholderTextColor={Colors.mutedGreen}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Recharge Amount (PKR)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.currencyPrefix}>PKR</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  value={amountStr}
                  onChangeText={setAmountStr}
                  placeholder="Amount"
                  placeholderTextColor={Colors.mutedGreen}
                />
              </View>
            </View>

            {/* Quick Amount Chips */}
            <View style={styles.quickAmountsRow}>
              {quickAmounts.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={styles.quickChip}
                  onPress={() => setAmountStr(q.toString())}
                >
                  <Text style={styles.quickChipText}>+{q}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.rechargeBtn} onPress={handleRecharge}>
              <Text style={styles.rechargeBtnText}>Instant Load PKR {amountStr}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab 2: Packages Marketplace */}
        {activeTab === 'packages' && (
          <View style={styles.packagesContainer}>
            {filteredPackages.map((pkg) => (
              <View key={pkg.id} style={styles.packageCard}>
                <View style={styles.pkgTopRow}>
                  <View>
                    <Text style={styles.pkgName}>{pkg.name}</Text>
                    <View style={styles.pkgBadge}>
                      <Clock size={12} color={Colors.primaryLime} />
                      <Text style={styles.pkgBadgeText}>{pkg.validity}</Text>
                    </View>
                  </View>

                  <Text style={styles.pkgPrice}>PKR {pkg.price}</Text>
                </View>

                <Text style={styles.pkgDesc}>{pkg.description}</Text>

                <View style={styles.pkgSpecsRow}>
                  <View style={styles.specItem}>
                    <Globe size={14} color={Colors.mutedGreen} />
                    <Text style={styles.specText}>{pkg.data}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Smartphone size={14} color={Colors.mutedGreen} />
                    <Text style={styles.specText}>{pkg.onNetMinutes}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <MessageSquare size={14} color={Colors.mutedGreen} />
                    <Text style={styles.specText}>{pkg.sms}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.subscribeBtn}
                  activeOpacity={0.88}
                  onPress={() => handleSubscribe(pkg)}
                >
                  <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  modeTabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.cardGreen,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  modeTabActive: {
    backgroundColor: Colors.primaryLime,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  modeTabTextActive: {
    color: Colors.darkForest,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
    marginTop: 18,
    marginBottom: 10,
  },
  networkRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  networkPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  networkPillActive: {
    borderColor: Colors.primaryLime,
    backgroundColor: 'rgba(200, 243, 58, 0.12)',
  },
  networkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  networkTextActive: {
    color: Colors.primaryLime,
    fontWeight: '900',
  },
  rechargeCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  textInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.mutedGreen,
  },
  rechargeBtn: {
    backgroundColor: Colors.primaryLime,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rechargeBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  packagesContainer: {
    gap: 14,
  },
  packageCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  pkgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pkgName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  pkgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pkgBadgeText: {
    fontSize: 11,
    color: Colors.primaryLime,
    fontWeight: '700',
  },
  pkgPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryLime,
  },
  pkgDesc: {
    fontSize: 12,
    color: Colors.mutedGreen,
    lineHeight: 18,
    marginBottom: 12,
  },
  pkgSpecsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.darkForest,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 11,
    color: Colors.textWhite,
    fontWeight: '600',
  },
  subscribeBtn: {
    backgroundColor: Colors.primaryLime,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
