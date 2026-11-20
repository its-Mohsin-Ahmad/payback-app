import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { CharityOrganization } from '../../types';
import { ArrowLeft, Heart, ShieldCheck, Check } from 'lucide-react-native';

interface DonationsScreenProps {
  onGoBack: () => void;
}

export const DonationsScreen: React.FC<DonationsScreenProps> = ({ onGoBack }) => {
  const { charities, donateToCharity, account } = useBankStore();

  const [selectedCharity, setSelectedCharity] = useState<CharityOrganization | null>(null);
  const [donateAmount, setDonateAmount] = useState('1000');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDonate = () => {
    if (!selectedCharity) return;
    const amt = parseFloat(donateAmount) || 0;
    if (amt <= 0 || amt > account.balance) {
      Alert.alert('Invalid Amount', 'Check your balance or enter a valid donation amount.');
      return;
    }

    const res = donateToCharity(selectedCharity.id, amt);
    if (res.success) {
      Alert.alert(
        'Donation Sent',
        `${res.message}\nReference: ${res.transactionId}\nTax deduction certificate dispatched to your email.`,
        [{ text: 'JazakAllah', onPress: () => setIsModalOpen(false) }]
      );
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
        <Text style={styles.headerTitle}>Donations &amp; Zakat</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Heart size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Verified Pakistani Charities</Text>
            <Text style={styles.bannerSub}>
              100% direct contribution with zero administrative deductions. Certified Zakat eligible.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Partner Organizations</Text>

        <View style={styles.charitiesList}>
          {charities.map((ch) => (
            <View key={ch.id} style={styles.charityCard}>
              <Image source={{ uri: ch.logo }} style={styles.charityLogo} />

              <View style={styles.charityInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.charityName}>{ch.name}</Text>
                  {ch.verified && <ShieldCheck size={16} color={Colors.primaryLime} />}
                </View>
                <Text style={styles.categoryBadge}>{ch.category}</Text>
                <Text style={styles.charityDesc}>{ch.description}</Text>

                <TouchableOpacity
                  style={styles.donateBtn}
                  onPress={() => {
                    setSelectedCharity(ch);
                    setIsModalOpen(true);
                  }}
                >
                  <Text style={styles.donateBtnText}>Donate Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Donation Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Donate to {selectedCharity?.name}</Text>

            <View style={styles.chipsRow}>
              {[500, 1000, 2500, 5000].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.chip, donateAmount === val.toString() && styles.chipActive]}
                  onPress={() => setDonateAmount(val.toString())}
                >
                  <Text style={[styles.chipText, donateAmount === val.toString() && styles.chipTextActive]}>
                    PKR {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Custom Amount (PKR)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={donateAmount}
                onChangeText={setDonateAmount}
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleDonate}>
                <Text style={styles.confirmText}>Confirm Donation</Text>
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
  charitiesList: {
    gap: 14,
  },
  charityCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    flexDirection: 'row',
    gap: 14,
  },
  charityLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.darkForest,
  },
  charityInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  charityName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
    flex: 1,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryLime,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  charityDesc: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 10,
  },
  donateBtn: {
    backgroundColor: Colors.primaryLime,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.darkForest,
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
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  chipActive: {
    borderColor: Colors.primaryLime,
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.mutedGreen,
  },
  chipTextActive: {
    color: Colors.primaryLime,
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
