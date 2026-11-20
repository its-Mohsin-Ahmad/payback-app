import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { VirtualCard } from '../../types';
import { Snowflake, Wifi } from 'lucide-react-native';

interface PaybackCardProps {
  card: VirtualCard;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.62;

export const PaybackCard: React.FC<PaybackCardProps> = ({ card, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.cardContainer, Colors.shadows.limeGlow]}
    >
      <LinearGradient
        colors={card.isFrozen ? ['#2A3A1A', '#1C290E'] : ['#D9FF4D', '#C8F33A', '#AEE620']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* Decorative Watermark & Waves */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={CARD_WIDTH} height={CARD_HEIGHT} viewBox="0 0 340 210">
            <Path
              d="M-20,180 C80,120 180,240 360,110 L360,210 L-20,210 Z"
              fill="rgba(16, 32, 0, 0.06)"
            />
            <Path
              d="M-20,90 C120,40 220,160 360,60 L360,0 L-20,0 Z"
              fill="rgba(255, 255, 255, 0.12)"
            />
          </Svg>
          {/* Subtle PAYBACK Watermark */}
          <Text style={styles.watermarkText}>PAYBACK</Text>
        </View>

        {/* Top Header Row: Cardholder Name + Brand Logo */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.cardholderName}>{card.cardholderName}</Text>
          </View>
          <View style={styles.brandRow}>
            {card.isFrozen && (
              <View style={styles.frozenChip}>
                <Snowflake size={12} color="#FFFFFF" />
                <Text style={styles.frozenChipText}>FROZEN</Text>
              </View>
            )}
            <Text style={styles.visaText}>VISA</Text>
          </View>
        </View>

        {/* Mid Row: Contactless wave & Credit type */}
        <View style={styles.midRow}>
          <View style={styles.contactlessBox}>
            <Wifi size={18} color={Colors.darkForest} style={{ transform: [{ rotate: '90deg' }] }} />
            <Text style={styles.cardTypeText}>{card.cardType}</Text>
          </View>
        </View>

        {/* Bottom Row: Expiry + Full Number */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.validThruLabel}>Valid thru</Text>
            <Text style={styles.validThruVal}>{card.expiryDate}</Text>
          </View>
          <Text style={styles.cardNumberText}>{card.cardNumberMasked}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 12,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  watermarkText: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    fontSize: 48,
    fontWeight: '900',
    color: 'rgba(16, 32, 0, 0.05)',
    letterSpacing: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardholderName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkForest,
    letterSpacing: 0.5,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visaText: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    color: Colors.darkForest,
    letterSpacing: 1,
  },
  frozenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  frozenChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  midRow: {
    marginTop: 10,
  },
  contactlessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.darkForest,
    opacity: 0.85,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  validThruLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.darkForest,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  validThruVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.darkForest,
    letterSpacing: 1,
  },
  cardNumberText: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.darkForest,
    letterSpacing: 2,
  },
});
