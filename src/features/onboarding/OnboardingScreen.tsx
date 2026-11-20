import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { ArrowRight, ShieldCheck, Zap, Wallet } from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Your Money,\nSimplified.',
    subtitle: 'Manage your finances with intelligent digital banking built directly around your life in Pakistan.',
    badge: 'SMART WALLET',
    icon: Wallet,
  },
  {
    id: '2',
    title: 'Send, Pay\nand Manage.',
    subtitle: 'Instant transfers via Raast, 1Link banks, QR merchant payments, and zero-fee utility bills.',
    badge: 'INSTANT RAILS',
    icon: Zap,
  },
  {
    id: '3',
    title: 'Everything in\nOne Wallet.',
    subtitle: 'Virtual & physical debit cards, mobile bundles, government challans, and goal-based savings.',
    badge: 'TOTAL CONTROL',
    icon: ShieldCheck,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header: Badge & Skip */}
      <View style={styles.header}>
        <View style={styles.pillBadge}>
          <Text style={styles.pillBadgeText}>{slide.badge}</Text>
        </View>

        {currentSlide < SLIDES.length - 1 && (
          <TouchableOpacity onPress={onComplete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center Illustration Hero */}
      <View style={styles.illustrationArea}>
        <View style={styles.glowCircle}>
          <View style={styles.iconCircle}>
            <IconComponent size={64} color={Colors.darkForest} strokeWidth={2.2} />
          </View>
        </View>
      </View>

      {/* Bottom Text and Navigation */}
      <View style={styles.bottomSection}>
        <View style={styles.indicatorRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                currentSlide === index && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.88} onPress={handleNext}>
          <Text style={styles.actionBtnText}>
            {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <ArrowRight size={20} color={Colors.darkForest} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  pillBadgeText: {
    color: Colors.primaryLime,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  skipText: {
    color: Colors.mutedGreen,
    fontSize: 14,
    fontWeight: '600',
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  glowCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(200, 243, 58, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.2)',
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 36,
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
    backgroundColor: 'rgba(200, 243, 58, 0.2)',
  },
  indicatorDotActive: {
    width: 28,
    backgroundColor: Colors.primaryLime,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textWhite,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mutedGreen,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 28,
  },
  actionBtn: {
    backgroundColor: Colors.primaryLime,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.darkForest,
  },
});
