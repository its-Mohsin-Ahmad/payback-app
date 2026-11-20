import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../theme/colors';
import { ArrowLeft, Bell } from 'lucide-react-native';

interface PaybackHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotification?: boolean;
  onNotification?: () => void;
  rightElement?: React.ReactNode;
  theme?: 'dark' | 'lime';
}

export const PaybackHeader: React.FC<PaybackHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showNotification = true,
  onNotification,
  rightElement,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? Colors.textWhite : Colors.darkForest;
  const iconBg = isDark ? Colors.cardGreen : 'rgba(16, 27, 5, 0.12)';
  const iconColor = isDark ? Colors.primaryLime : Colors.darkForest;

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.circleBtn, { backgroundColor: iconBg }]}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={iconColor} strokeWidth={2.5} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 38 }} />
      )}

      {title ? (
        <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {rightElement ? (
        rightElement
      ) : showNotification ? (
        <TouchableOpacity
          onPress={onNotification}
          style={[styles.circleBtn, { backgroundColor: iconBg }]}
          activeOpacity={0.8}
        >
          <Bell size={20} color={iconColor} strokeWidth={2} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 38 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
