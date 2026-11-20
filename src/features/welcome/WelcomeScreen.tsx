import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  QrCode,
  Sparkles,
  Lock,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(30)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating icons idle loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 10,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* TOP SECTION: Full-screen Lime-Green Gradient Background with Floating Finance Icons */}
      <LinearGradient
        colors={[Colors.brightLime, Colors.primaryLime, '#B8E52A']}
        style={styles.heroSection}
      >
        {/* Floating Money & Payment Element 1 */}
        <Animated.View
          style={[
            styles.floatingBadge,
            styles.floatLeft,
            { transform: [{ translateY: floatAnim1 }] },
          ]}
        >
          <View style={styles.floatingIconCircle}>
            <Zap size={18} color={Colors.primaryLime} />
          </View>
          <Text style={styles.floatingText}>Instant Raast</Text>
        </Animated.View>

        {/* Floating Money & Payment Element 2 */}
        <Animated.View
          style={[
            styles.floatingBadge,
            styles.floatRight,
            { transform: [{ translateY: floatAnim2 }] },
          ]}
        >
          <View style={styles.floatingIconCircle}>
            <CreditCard size={18} color={Colors.primaryLime} />
          </View>
          <Text style={styles.floatingText}>Visa Debit</Text>
        </Animated.View>

        {/* Floating Money & Payment Element 3 */}
        <Animated.View
          style={[
            styles.floatingBadge,
            styles.floatBottomLeft,
            { transform: [{ translateY: floatAnim2 }] },
          ]}
        >
          <View style={styles.floatingIconCircle}>
            <QrCode size={18} color={Colors.primaryLime} />
          </View>
          <Text style={styles.floatingText}>QR Payments</Text>
        </Animated.View>

        {/* Center PAYBACK Logo & Glowing Emblem */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoHalo}>
            <PaybackLogo size={90} showText={true} showTagline={true} theme="lime" glow={true} />
          </View>
        </Animated.View>
      </LinearGradient>

      {/* BOTTOM SECTION: Dark Forest-Green Lower Card */}
      <View style={styles.bottomSection}>
        <Animated.View
          style={{
            transform: [{ translateY: contentTranslate }],
          }}
        >
          {/* Main Heading */}
          <View style={styles.headingBlock}>
            <View style={styles.welcomePill}>
              <Sparkles size={14} color={Colors.darkForest} />
              <Text style={styles.welcomePillText}>Next-Gen Digital Banking</Text>
            </View>

            <Text style={styles.mainHeading}>Welcome to PAYBACK</Text>
            <Text style={styles.subheading}>Your money. Your payments. Your world.</Text>
            <Text style={styles.description}>
              Experience smarter payments, easy money transfers and convenient financial services in one application.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            {/* 1. Get Started Button (Primary Lime) */}
            <TouchableOpacity
              style={styles.getStartedBtn}
              activeOpacity={0.88}
              onPress={onGetStarted}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <View style={styles.btnArrowCircle}>
                <ArrowRight size={18} color={Colors.darkForest} strokeWidth={2.8} />
              </View>
            </TouchableOpacity>

            {/* 2. Login Button (Forest Green with Lime Border) */}
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={onLogin}
            >
              <Lock size={18} color={Colors.primaryLime} />
              <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>

          {/* Footer: Terms & Privacy */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={() => onOpenTerms ? onOpenTerms() : Linking.openURL('https://its-mohsin-ahmad.github.io/payback/terms.html')}
            >
              <Text style={styles.footerLink}>Terms and Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity
              onPress={() => onOpenPrivacy ? onOpenPrivacy() : Linking.openURL('https://its-mohsin-ahmad.github.io/payback/privacy.html')}
            >
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkForest,
  },
  heroSection: {
    height: height * 0.46,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHalo: {
    padding: 24,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.darkForest,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  floatingBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 27, 5, 0.92)',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.3)',
    shadowColor: Colors.darkForest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  floatLeft: {
    top: 55,
    left: 20,
  },
  floatRight: {
    top: 75,
    right: 20,
  },
  floatBottomLeft: {
    bottom: 30,
    left: 24,
  },
  floatingIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(213, 245, 74, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.darkForest,
    paddingHorizontal: 26,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  headingBlock: {
    alignItems: 'center',
  },
  welcomePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLime,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    marginBottom: 16,
  },
  welcomePillText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.darkForest,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryLime,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.mutedGreen,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 28,
  },
  buttonGroup: {
    gap: 14,
    marginBottom: 20,
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
    height: 56,
    borderRadius: 28,
    gap: 10,
    shadowColor: Colors.primaryLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  btnArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 27, 5, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardGreen,
    height: 52,
    borderRadius: 26,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: Colors.mutedGreen,
    textDecorationLine: 'underline',
  },
  footerDot: {
    color: Colors.mutedGreen,
    fontSize: 12,
  },
});
