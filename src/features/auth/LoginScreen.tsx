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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';
import { useAuthStore } from '../../store/useAuthStore';
import { Eye, EyeOff, Fingerprint, Lock, Phone } from 'lucide-react-native';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('0300 8472910');
  const [pin, setPin] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const { login, biometricLogin, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    const res = await login(phoneNumber, pin);
    if (res.success) {
      onLoginSuccess();
    } else {
      Alert.alert('Login Failed', res.message || 'Please check your credentials.');
    }
  };

  const handleBiometrics = async () => {
    const res = await biometricLogin();
    if (res.success) {
      onLoginSuccess();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Top Brand Block */}
          <View style={styles.brandHeader}>
            <PaybackLogo size={56} showText={true} showTagline={true} theme="dark" glow />
          </View>

          {/* Form Surface */}
          <View style={styles.formCard}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSub}>Enter your mobile number and MPIN</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Mobile Number Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputRow}>
                <Phone size={18} color={Colors.mutedGreen} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="03xx xxxxxxx"
                  placeholderTextColor={Colors.mutedGreen}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* MPIN Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Secure MPIN / Password</Text>
                <TouchableOpacity onPress={() => Alert.alert('Forgot MPIN', 'An OTP reset link has been dispatched to your registered SIM.')}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <Lock size={18} color={Colors.mutedGreen} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={pin}
                  onChangeText={setPin}
                  placeholder="••••"
                  placeholderTextColor={Colors.mutedGreen}
                  secureTextEntry={!showPin}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity onPress={() => setShowPin(!showPin)} style={styles.eyeBtn}>
                  {showPin ? (
                    <EyeOff size={18} color={Colors.mutedGreen} />
                  ) : (
                    <Eye size={18} color={Colors.mutedGreen} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.88}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.darkForest} />
              ) : (
                <Text style={styles.loginBtnText}>Secure Login</Text>
              )}
            </TouchableOpacity>

            {/* Biometric Quick Login */}
            <TouchableOpacity
              style={styles.biometricBtn}
              activeOpacity={0.8}
              onPress={handleBiometrics}
            >
              <Fingerprint size={22} color={Colors.primaryLime} />
              <Text style={styles.biometricText}>Quick Biometric Login</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Register Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have a PAYBACK account?</Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text style={styles.registerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  formCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  welcomeSub: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.mutedGreen,
    marginTop: 4,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    backgroundColor: Colors.primaryLime,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.darkForest,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 10,
  },
  biometricText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  footerText: {
    color: Colors.mutedGreen,
    fontSize: 13,
  },
  registerLink: {
    color: Colors.primaryLime,
    fontSize: 13,
    fontWeight: '800',
  },
});
