import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../theme/colors';

interface PaybackLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  theme?: 'dark' | 'lime' | 'light';
  glow?: boolean;
}

export const PaybackLogo: React.FC<PaybackLogoProps> = ({
  size = 48,
  showText = true,
  showTagline = false,
  theme = 'dark',
  glow = false,
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? Colors.primaryLime : Colors.darkForest;
  const taglineColor = isDark ? Colors.mutedGreen : Colors.secondaryGreen;
  const scale = size / 48;

  const logoWidth = size;
  const logoHeight = size * 1.1;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, glow && styles.glowEffect]}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor, fontSize: 24 * Math.max(0.8, scale) }]}>
            PAYBACK
          </Text>
          {showTagline && (
            <Text style={[styles.tagline, { color: taglineColor, fontSize: 11 * Math.max(0.8, scale) }]}>
              Banking Built Around You.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  tagline: {
    fontFamily: 'System',
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 0.5,
  },
});
