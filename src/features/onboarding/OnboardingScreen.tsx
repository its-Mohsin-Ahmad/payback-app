import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Wallet,
  Gift,
  Send,
  Receipt,
  PiggyBank,
} from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    badge: 'SMART DIGITAL WALLET',
    title: 'Your Money,\nSimplified.',
    description:
      'Manage your digital wallet with intelligent financial tools built specifically for your lifestyle in Pakistan. Track balances, organize funds, and experience total banking freedom.',
    icon: Wallet,
    accentIcon: ShieldCheck,
    tag: 'Safe & Secure',
    highlight: 'Zero Monthly Account Fees',
  },
  {
    id: '2',
    badge: 'INSTANT TRANSFERS',
    title: 'Send Money\nInstantly.',
    description:
      'Experience lightning-fast money transfers across Pakistan. Send directly to any PAYBACK wallet, 1Link bank account, or nationwide Raast ID with zero waiting time.',
    icon: Zap,
    accentIcon: Send,
    tag: 'Raast & 1Link Ready',
    highlight: 'Instant 24/7 Settlements',
  },
  {
    id: '3',
    badge: 'ALL-IN-ONE UTILITIES',
    title: 'Pay Everything\nin One Place.',
    description:
      'Recharge Jazz, Zong, Ufone, and Telenor numbers, pay electricity, gas, water, and internet bills, and tap to pay at thousands of merchants using contactless QR payments.',
    icon: Receipt,
    accentIcon: Zap,
    tag: 'Bills & Easyload',
    highlight: '100+ Supported Billers',
  },
  {
    id: '4',
    badge: 'EXCLUSIVE PERKS',
    title: 'Rewards and\nMore.',
    description:
      'Unlock exclusive cashback on bill payments, earn referral rewards, set personalized savings goals, and manage your budget with automated spending insights.',
    icon: Gift,
    accentIcon: PiggyBank,
    tag: 'Cashback & Goals',
    highlight: 'Earn Rewards On Every Transfer',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlide];
  const IconComponent = slide.icon;
  const AccentIcon = slide.accentIcon;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header: Badge & Skip */}
      <View style={styles.header}>
        <View style={styles.pillBadge}>
          <Text style={styles.pillBadgeText}>{slide.badge}</Text>
        </View>

        {currentSlide < SLIDES.length - 1 ? (
          <TouchableOpacity
            onPress={onComplete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Center Illustration Hero */}
      <View style={styles.illustrationArea}>
        <View style={styles.glowOuterCircle}>
          <View style={styles.glowCircle}>
            <View style={styles.iconCircle}>
              <IconComponent size={64} color={Colors.darkForest} strokeWidth={2.4} />
            </View>
          </View>
        </View>

        {/* Feature Pill Floating Below Illustration */}
        <View style={styles.featurePill}>
          <AccentIcon size={14} color={Colors.primaryLime} />
          <Text style={styles.featurePillText}>{slide.highlight}</Text>
        </View>
      </View>

      {/* Bottom Text and Navigation */}
      <View style={styles.bottomSection}>
        {/* Animated Progress Indicators */}
        <View style={styles.indicatorRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                currentSlide === index && styles.indicatorDotActive,
                index < currentSlide && styles.indicatorDotCompleted,
              ]}
            />
          ))}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.description}</Text>

        {/* Navigation Action Buttons */}
        <View style={styles.actionRow}>
          {currentSlide > 0 && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setCurrentSlide(currentSlide - 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionBtn, currentSlide === 0 && { flex: 1 }]}
            activeOpacity={0.88}
            onPress={handleNext}
          >
            <Text style={styles.actionBtnText}>
              {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={20} color={Colors.darkForest} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkForest,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  pillBadge: {
    backgroundColor: Colors.cardGreen,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillBadgeText: {
    color: Colors.primaryLime,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: Colors.mutedGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  glowOuterCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(213, 245, 74, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(213, 245, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.25)',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryLime,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  bottomSection: {
    backgroundColor: Colors.cardGreen,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 26,
    paddingTop: 32,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.15)',
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(165, 187, 114, 0.3)',
  },
  indicatorDotActive: {
    width: 28,
    backgroundColor: Colors.primaryLime,
  },
  indicatorDotCompleted: {
    backgroundColor: Colors.mutedGreen,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textWhite,
    lineHeight: 34,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mutedGreen,
    lineHeight: 22,
    marginBottom: 28,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkForest,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  backBtnText: {
    color: Colors.mutedGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
    height: 54,
    borderRadius: 27,
    gap: 10,
    shadowColor: Colors.primaryLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
