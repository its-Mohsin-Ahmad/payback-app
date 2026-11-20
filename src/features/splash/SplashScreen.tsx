import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { PaybackLogo } from '../../components/brand/PaybackLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.background, Colors.darkForest, '#091301']}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle Glowing Green Ambient Curved Lines */}
      <View style={styles.waveOverlay} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Path
            d={`M-40,${height * 0.35} Q${width * 0.3},${height * 0.22} ${width * 0.75},${height * 0.52} T${width + 40},${height * 0.38}`}
            fill="none"
            stroke="rgba(200, 243, 58, 0.22)"
            strokeWidth="3"
          />
          <Path
            d={`M-40,${height * 0.38} Q${width * 0.35},${height * 0.25} ${width * 0.8},${height * 0.55} T${width + 40},${height * 0.42}`}
            fill="none"
            stroke="rgba(217, 255, 77, 0.15)"
            strokeWidth="2"
          />
          <Path
            d={`M-40,${height * 0.65} Q${width * 0.5},${height * 0.78} ${width + 40},${height * 0.62}`}
            fill="none"
            stroke="rgba(200, 243, 58, 0.12)"
            strokeWidth="3"
          />
        </Svg>
      </View>

      {/* Central Brand Presentation */}
      <View style={styles.content}>
        <PaybackLogo size={88} showText={false} theme="dark" glow />

        <View style={styles.textBlock}>
          <Text style={styles.brandTitle}>PAYBACK</Text>
          <Text style={styles.tagline}>Banking Built Around You.</Text>
        </View>

        {/* Loading Indicator Dots */}
        <View style={styles.loadingContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* SBP Regulatory & Version Stamp */}
      <View style={styles.footer}>
        <Text style={styles.regulatoryText}>Digital Wallet & Financial Services • Pakistan</Text>
        <Text style={styles.versionText}>PAYBACK v1.0.0 (Production Build)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  waveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.primaryLime,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mutedGreen,
    marginTop: 6,
    letterSpacing: 0.8,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(200, 243, 58, 0.25)',
  },
  dotActive: {
    backgroundColor: Colors.primaryLime,
    width: 24,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  regulatoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.mutedGreen,
    opacity: 0.8,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryLime,
    opacity: 0.6,
    marginTop: 4,
  },
});
