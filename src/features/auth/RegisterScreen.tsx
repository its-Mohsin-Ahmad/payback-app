import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowLeft, Check, ShieldCheck, User, Phone, Mail, Lock, CreditCard } from 'lucide-react-native';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const { register, isLoading } = useAuthStore();

  const handleNextStep1 = () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your full name as per CNIC.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert('Required', 'Please enter a valid Pakistani mobile number.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit code sent to your SIM.');
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (cnic.replace(/-/g, '').length < 13) {
      Alert.alert('Invalid CNIC', 'Please enter your 13-digit Nadra CNIC number.');
      return;
    }
    setStep(4);
  };

  const handleFinishRegister = async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'Please set a 4-digit MPIN.');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('Mismatch', 'PINs do not match.');
      return;
    }

    const res = await register(fullName, phoneNumber, email, pin, cnic);
    if (res.success) {
      Alert.alert('Account Created', 'Your PAYBACK wallet has been created successfully!', [
        { text: 'Launch Wallet', onPress: onRegisterSuccess },
      ]);
    } else {
      Alert.alert('Error', res.message || 'Registration failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => (step > 1 ? setStep((step - 1) as any) : onNavigateToLogin())}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color={Colors.primaryLime} />
            </TouchableOpacity>
            <PaybackLogo size={36} showText={false} theme="dark" />
            <View style={{ width: 40 }} />
          </View>

          {/* Stepper Indicator */}
          <View style={styles.stepperContainer}>
            {[1, 2, 3, 4].map((s) => (
              <View key={s} style={styles.stepIndicatorCol}>
                <View
                  style={[
                    styles.stepBadge,
                    step >= s && styles.stepBadgeActive,
                    step > s && styles.stepBadgeDone,
                  ]}
                >
                  {step > s ? (
                    <Check size={14} color={Colors.darkForest} strokeWidth={3} />
                  ) : (
                    <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>{s}</Text>
                  )}
                </View>
                <Text style={styles.stepLabel}>
                  {s === 1 ? 'Personal' : s === 2 ? 'Verify' : s === 3 ? 'CNIC' : 'MPIN'}
                </Text>
              </View>
            ))}
          </View>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create Your Account</Text>
              <Text style={styles.cardSub}>Step 1: Enter your personal details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name (As per CNIC)</Text>
                <View style={styles.inputRow}>
                  <User size={18} color={Colors.mutedGreen} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Janvis David"
                    placeholderTextColor={Colors.mutedGreen}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.inputRow}>
                  <Phone size={18} color={Colors.mutedGreen} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="0300 1234567"
                    placeholderTextColor={Colors.mutedGreen}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address (Optional)</Text>
                <View style={styles.inputRow}>
                  <Mail size={18} color={Colors.mutedGreen} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="you@email.com"
                    placeholderTextColor={Colors.mutedGreen}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNextStep1}>
                <Text style={styles.primaryBtnText}>Continue to Verification</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Verify Mobile Number</Text>
              <Text style={styles.cardSub}>We sent a 4-digit OTP code to {phoneNumber}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Enter 4-Digit Code</Text>
                <TextInput
                  style={[styles.textInput, styles.otpInput]}
                  placeholder="• • • •"
                  placeholderTextColor={Colors.mutedGreen}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  setOtp('4829');
                  Alert.alert('Simulated SMS OTP', 'Your OTP is 4829');
                }}
                style={{ alignSelf: 'center', marginBottom: 16 }}
              >
                <Text style={styles.resendLink}>Resend OTP Code</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNextStep2}>
                <Text style={styles.primaryBtnText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3: Identity / CNIC Verification */}
          {step === 3 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Identity Verification</Text>
              <Text style={styles.cardSub}>NADRA KYC compliance required by State Bank of Pakistan</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>13-Digit CNIC Number</Text>
                <View style={styles.inputRow}>
                  <CreditCard size={18} color={Colors.mutedGreen} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="35201-1234567-1"
                    placeholderTextColor={Colors.mutedGreen}
                    keyboardType="number-pad"
                    value={cnic}
                    onChangeText={setCnic}
                  />
                </View>
              </View>

              <View style={styles.complianceBox}>
                <ShieldCheck size={20} color={Colors.primaryLime} />
                <Text style={styles.complianceText}>
                  Your data is encrypted end-to-end and validated through official NADRA telecommunication verification gateway.
                </Text>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNextStep3}>
                <Text style={styles.primaryBtnText}>Verify Identity</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 4: Secure MPIN Setup */}
          {step === 4 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Setup Secure MPIN</Text>
              <Text style={styles.cardSub}>This 4-digit code will authorize transactions and login</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Create 4-Digit MPIN</Text>
                <View style={styles.inputRow}>
                  <Lock size={18} color={Colors.mutedGreen} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••"
                    placeholderTextColor={Colors.mutedGreen}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    value={pin}
                    onChangeText={setPin}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm 4-Digit MPIN</Text>
                <View style={styles.inputRow}>
                  <Lock size={18} color={Colors.mutedGreen} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••"
                    placeholderTextColor={Colors.mutedGreen}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleFinishRegister}
                disabled={isLoading}
              >
                <Text style={styles.primaryBtnText}>Complete Registration</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Login Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  stepIndicatorCol: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkForest,
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    borderColor: Colors.primaryLime,
    backgroundColor: Colors.cardGreen,
  },
  stepBadgeDone: {
    backgroundColor: Colors.primaryLime,
    borderColor: Colors.primaryLime,
  },
  stepNum: {
    color: Colors.mutedGreen,
    fontSize: 12,
    fontWeight: '800',
  },
  stepNumActive: {
    color: Colors.primaryLime,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  cardSub: {
    fontSize: 13,
    color: Colors.mutedGreen,
    marginTop: 4,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  otpInput: {
    backgroundColor: Colors.darkForest,
    height: 56,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 10,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  resendLink: {
    color: Colors.primaryLime,
    fontSize: 13,
    fontWeight: '700',
  },
  complianceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(200, 243, 58, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  complianceText: {
    flex: 1,
    fontSize: 11,
    color: Colors.mutedGreen,
    lineHeight: 16,
  },
  primaryBtn: {
    backgroundColor: Colors.primaryLime,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.darkForest,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  footerText: {
    color: Colors.mutedGreen,
    fontSize: 13,
  },
  loginLink: {
    color: Colors.primaryLime,
    fontSize: 13,
    fontWeight: '800',
  },
});
