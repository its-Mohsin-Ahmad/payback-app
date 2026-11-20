import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface GreenIconContainerProps {
  children: React.ReactNode;
  size?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const GreenIconContainer: React.FC<GreenIconContainerProps> = ({
  children,
  size = 40,
  borderRadius = 14,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.15)',
  },
});
