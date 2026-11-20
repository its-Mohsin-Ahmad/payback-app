import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { LucideIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
  widthFraction?: number;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  icon: IconComponent,
  onPress,
  widthFraction = 4,
}) => {
  const itemWidth = (width - 40 - (widthFraction - 1) * 8) / widthFraction;

  return (
    <TouchableOpacity
      style={[styles.container, { width: itemWidth }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconCircle}>
        <IconComponent size={20} color={Colors.primaryLime} strokeWidth={2.2} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.12)',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textAlign: 'center',
  },
});
