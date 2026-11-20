import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { X } from 'lucide-react-native';

interface CustomBottomSheetProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  title,
  onClose,
  children,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheetCard}>
          {/* Top handle pill */}
          <View style={styles.handleBar} />

          {title && (
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={18} color={Colors.mutedGreen} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetCard: {
    backgroundColor: Colors.cardGreen,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.mutedGreen,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    width: '100%',
  },
});
