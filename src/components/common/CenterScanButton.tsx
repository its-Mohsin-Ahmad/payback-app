import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { QrCode } from 'lucide-react-native';

interface CenterScanButtonProps {
  onPress: () => void;
}

export const CenterScanButton: React.FC<CenterScanButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.anchor}>
      <TouchableOpacity
        style={styles.outerCircle}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={styles.innerCircle}>
          <QrCode size={26} color={Colors.brightLime} strokeWidth={2.4} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  anchor: {
    top: -22,
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  outerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.primaryLime,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 12,
  },
  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLime,
  },
});
