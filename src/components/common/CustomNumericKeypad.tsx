import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Delete, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CustomNumericKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onConfirm?: () => void;
}

export const CustomNumericKeypad: React.FC<CustomNumericKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onConfirm,
}) => {
  return (
    <View style={styles.grid}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <TouchableOpacity
          key={digit}
          style={styles.keyBtn}
          activeOpacity={0.7}
          onPress={() => onKeyPress(digit)}
        >
          <Text style={styles.keyText}>{digit}</Text>
        </TouchableOpacity>
      ))}

      {/* Backspace */}
      <TouchableOpacity
        style={styles.keyBtn}
        activeOpacity={0.7}
        onPress={onBackspace}
      >
        <Delete size={22} color={Colors.textWhite} />
      </TouchableOpacity>

      {/* 0 */}
      <TouchableOpacity
        style={styles.keyBtn}
        activeOpacity={0.7}
        onPress={() => onKeyPress('0')}
      >
        <Text style={styles.keyText}>0</Text>
      </TouchableOpacity>

      {/* Confirm / Check */}
      <TouchableOpacity
        style={[styles.keyBtn, styles.checkKeyBtn]}
        activeOpacity={0.7}
        onPress={onConfirm}
      >
        <Check size={22} color={Colors.primaryLime} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  keyBtn: {
    width: (width - 40 - 24) / 3,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.1)',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  checkKeyBtn: {
    backgroundColor: Colors.cardGreen,
    borderColor: Colors.borderLime,
  },
});
