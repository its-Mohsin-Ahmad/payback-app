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
import { ArrowLeft, Globe, CheckCircle, ShieldCheck } from 'lucide-react-native';

interface RemittanceScreenProps {
  onGoBack: () => void;
}

export const RemittanceScreen: React.FC<RemittanceScreenProps> = ({ onGoBack }) => {
  const { remittances, claimRemittance } = useBankStore();
  const [mtcnInput, setMtcnInput] = useState('');

  const handleClaim = (remId: string) => {
    const res = claimRemittance(remId);
    if (res.success) {
      Alert.alert('Home Remittance Credited', res.message, [{ text: 'Awesome', onPress: onGoBack }]);
    } else {
      Alert.alert('Error', res.message);
    }
  };

  const handleClaimByCode = () => {
    if (mtcnInput.trim().length < 8) {
      Alert.alert('Invalid Code', 'Please enter a valid 10-digit MTCN remittance tracking code.');
      return;
    }
    Alert.alert(
      'Remittance Located via SBP PRI Rail',
      `Sender: Sarah Jenkins (UK)\nGross Amount: GBP 150.00\nExchange Rate: 1 GBP = PKR 362.50\nNet Credited: PKR 54,375.00\nFee: 0 (Government of Pakistan PRI Rebate)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deposit to Wallet',
          onPress: () => {
            Alert.alert('Success', 'PKR 54,375.00 has been deposited to your PAYBACK wallet balance.');
            onGoBack();
          },
        },
      ]
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
        <Text style={styles.headerTitle}>Home Remittance</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Globe size={32} color={Colors.primaryLime} />
          <Text style={styles.heroTitle}>Receive Money From Abroad</Text>
          <Text style={styles.heroSub}>
            Zero fee under Pakistan Remittance Initiative (PRI). Claim instant credits from Western Union, MoneyGram, and Ria.
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Enter MTCN / Remittance Reference</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 712-401-9283"
              placeholderTextColor={Colors.mutedGreen}
              value={mtcnInput}
              onChangeText={setMtcnInput}
            />
          </View>

          <TouchableOpacity style={styles.claimBtn} onPress={handleClaimByCode}>
            <Text style={styles.claimBtnText}>Claim &amp; Deposit Instantly</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Incoming Foreign Remittances</Text>

        <View style={styles.remList}>
          {remittances.map((r) => (
            <View key={r.id} style={styles.remRow}>
              <View style={styles.remInfo}>
                <Text style={styles.senderText}>{r.senderName}</Text>
                <Text style={styles.countryText}>{r.sendingCountry}</Text>
                <Text style={styles.mtcnText}>MTCN: {r.mtcnReference}</Text>
                <Text style={styles.rateText}>1 {r.foreignCurrency} = PKR {r.exchangeRate}</Text>
              </View>

              <View style={styles.remActionCol}>
                <Text style={styles.amountPkr}>PKR {r.amountPkr.toLocaleString()}</Text>
                {r.status === 'claimed' ? (
                  <View style={styles.claimedBadge}>
                    <Text style={styles.claimedText}>DEPOSITED</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.claimActionBtn}
                    onPress={() => handleClaim(r.id)}
                  >
                    <Text style={styles.claimActionText}>Claim Funds</Text>
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
  heroCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginVertical: 14,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
    marginTop: 8,
  },
  heroSub: {
    fontSize: 12,
    color: Colors.mutedGreen,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputWrapper: {
    width: '100%',
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
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.2)',
  },
  claimBtn: {
    width: '100%',
    backgroundColor: Colors.primaryLime,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  remList: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  remRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  remInfo: {
    flex: 1,
  },
  senderText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  countryText: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  mtcnText: {
    fontSize: 11,
    color: Colors.primaryLime,
    marginTop: 2,
  },
  rateText: {
    fontSize: 10,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  remActionCol: {
    alignItems: 'flex-end',
  },
  amountPkr: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.textWhite,
    marginBottom: 6,
  },
  claimedBadge: {
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  claimedText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  claimActionBtn: {
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  claimActionText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
