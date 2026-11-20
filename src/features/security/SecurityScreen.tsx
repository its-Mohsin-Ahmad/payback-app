import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ArrowLeft,
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Smartphone,
  Lock,
  History,
  AlertTriangle,
} from 'lucide-react-native';

interface SecurityScreenProps {
  onGoBack: () => void;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ onGoBack }) => {
  const { user, toggleBiometrics } = useAuthStore();
  const [biometricsActive, setBiometricsActive] = useState(user?.isBiometricEnabled ?? true);

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleToggleBio = (val: boolean) => {
    setBiometricsActive(val);
    toggleBiometrics(val);
  };

  const handleChangePin = () => {
    if (newPin.length < 4) {
      Alert.alert('Invalid PIN', 'MPIN must be 4 digits.');
      return;
    }
    Alert.alert('MPIN Updated', 'Your transaction authorization MPIN has been updated successfully.');
    setIsPinModalOpen(false);
    setOldPin('');
    setNewPin('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Center</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <ShieldCheck size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Bank-Grade Encryption</Text>
            <Text style={styles.bannerSub}>
              Protected by Hardware Keystore, RSA-4096 signatures, and SBP digital safety guidelines.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Authentication &amp; Access</Text>

        <View style={styles.card}>
          {/* Biometrics Toggle */}
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Fingerprint size={20} color={Colors.primaryLime} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Biometric Authentication</Text>
              <Text style={styles.rowSub}>Use fingerprint or FaceID for logins &amp; transactions</Text>
            </View>
            <Switch
              value={biometricsActive}
              onValueChange={handleToggleBio}
              trackColor={{ false: Colors.darkForest, true: Colors.primaryLime }}
              thumbColor={biometricsActive ? Colors.darkForest : Colors.mutedGreen}
            />
          </View>

          <View style={styles.divider} />

          {/* Change MPIN */}
          <TouchableOpacity style={styles.row} onPress={() => setIsPinModalOpen(true)}>
            <View style={styles.iconCircle}>
              <KeyRound size={20} color={Colors.primaryLime} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Change 4-Digit MPIN</Text>
              <Text style={styles.rowSub}>Update your secure transaction authorization PIN</Text>
            </View>
            <Text style={styles.actionLink}>Update</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Trusted Devices &amp; Sessions</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Smartphone size={20} color={Colors.primaryLime} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>Primary Android Device</Text>
              <Text style={styles.rowSub}>Samsung SM-S928B • Active Now (Karachi, PK)</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>THIS DEVICE</Text>
            </View>
          </View>
        </View>

        {/* Suspicious Activity Report */}
        <TouchableOpacity
          style={styles.dangerReportBtn}
          onPress={() =>
            Alert.alert(
              'Report Suspicious Activity',
              'Our 24/7 fraud monitoring desk has received your alert. Your account freeze protocol is available if needed.',
              [
                { text: 'Freeze Wallet Now', style: 'destructive', onPress: () => Alert.alert('Wallet Frozen', 'Your account is safeguarded.') },
                { text: 'Cancel', style: 'cancel' },
              ]
            )
          }
        >
          <AlertTriangle size={18} color="#FF6B6B" />
          <Text style={styles.dangerReportText}>Report Suspicious Activity or Fraud</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change MPIN Modal */}
      <Modal visible={isPinModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Transaction MPIN</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Current 4-Digit MPIN</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={oldPin}
                onChangeText={setOldPin}
                placeholder="••••"
                placeholderTextColor={Colors.mutedGreen}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>New 4-Digit MPIN</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={newPin}
                onChangeText={setNewPin}
                placeholder="••••"
                placeholderTextColor={Colors.mutedGreen}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsPinModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleChangePin}>
                <Text style={styles.modalConfirmText}>Save MPIN</Text>
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
  card: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  rowSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  activePill: {
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(200, 243, 58, 0.08)',
  },
  dangerReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.darkForest,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    marginTop: 10,
  },
  dangerReportText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF6B6B',
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
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 6,
    textAlign: 'center',
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
});
