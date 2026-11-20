import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';

interface LimeGradientButtonProps {
  label: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isHolding?: boolean;
  holdProgressAnim?: Animated.Value;
  disabled?: boolean;
}

export const LimeGradientButton: React.FC<LimeGradientButtonProps> = ({
  label,
  onPress,
  onPressIn,
  onPressOut,
  style,
  textStyle,
  isHolding = false,
  holdProgressAnim,
  disabled = false,
}) => {
  const holdWidth = holdProgressAnim
    ? holdProgressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      })
    : '0%';

  return (
    <TouchableOpacity
      style={[styles.button, Colors.shadows.limeGlow, style]}
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      {holdProgressAnim && (
        <Animated.View style={[styles.progressOverlay, { width: holdWidth }]} />
      )}
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLime,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#B5E820',
  },
  text: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.darkForest,
    letterSpacing: 0.5,
  },
});
