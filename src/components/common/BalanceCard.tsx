import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Eye, EyeOff, MoreHorizontal, ArrowUpRight, ArrowDownLeft, ScanLine, ArrowDownToLine } from 'lucide-react-native';

interface BalanceCardProps {
  balance: number;
  isBalanceHidden: boolean;
  onToggleHide: () => void;
  onOptions?: () => void;
  onSend: () => void;
  onRequest: () => void;
  onPayment: () => void;
  onWithdraw: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  isBalanceHidden,
  onToggleHide,
  onOptions,
  onSend,
  onRequest,
  onPayment,
  onWithdraw,
}) => {
  return (
    <View style={styles.cardAnchor}>
      <LinearGradient
        colors={Colors.gradients.balanceCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, Colors.shadows.limeGlow]}
      >
        {/* Top Row: Label & Eye & More */}
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={onToggleHide} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {isBalanceHidden ? (
                <EyeOff size={16} color={Colors.darkForest} />
              ) : (
                <Eye size={16} color={Colors.darkForest} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onOptions} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MoreHorizontal size={20} color={Colors.darkForest} />
          </TouchableOpacity>
        </View>

        {/* Balance Amount */}
        <Text style={styles.balanceAmount}>
          {isBalanceHidden
            ? '••••••••'
            : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </Text>

        {/* Growth Tag matching reference image */}
        <View style={styles.growthBadge}>
          <Text style={styles.growthBadgeText}>↑ 24%  Last week</Text>
        </View>

        {/* 4 Large Rounded Action Buttons inside Lime Card */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.85} onPress={onSend}>
            <View style={styles.iconCircle}>
              <ArrowUpRight size={22} color={Colors.brightLime} strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.85} onPress={onRequest}>
            <View style={styles.iconCircle}>
              <ArrowDownLeft size={22} color={Colors.brightLime} strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Request</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.85} onPress={onPayment}>
            <View style={styles.iconCircle}>
              <ScanLine size={22} color={Colors.brightLime} strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.85} onPress={onWithdraw}>
            <View style={styles.iconCircle}>
              <ArrowDownToLine size={22} color={Colors.brightLime} strokeWidth={2.4} />
            </View>
            <Text style={styles.actionLabel}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Downward Tab Handle under card (matching reference image) */}
      <View style={styles.tabHandle}>
        <View style={styles.tabHandleBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardAnchor: {
    position: 'relative',
    marginBottom: 20,
  },
  card: {
    borderRadius: 28,
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.darkForest,
    opacity: 0.85,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.darkForest,
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.darkForest,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  growthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brightLime,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  actionItem: {
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.darkForest,
  },
  tabHandle: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 44,
    height: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabHandleBar: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.darkForest,
    opacity: 0.5,
  },
});
