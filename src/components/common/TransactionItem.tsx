import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Transaction } from '../../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const isCredit = transaction.type === 'credit';

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        {isCredit ? (
          <ArrowDownLeft size={18} color={Colors.primaryLime} strokeWidth={2.5} />
        ) : (
          <ArrowUpRight size={18} color="#FF6B6B" strokeWidth={2.5} />
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.sub}>
          TrxID: {transaction.referenceId}
        </Text>
      </View>

      <View style={styles.amountCol}>
        <Text
          style={[
            styles.amount,
            { color: isCredit ? Colors.primaryLime : '#FF6B6B' },
          ]}
        >
          {isCredit ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.time}>{transaction.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 245, 74, 0.08)',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  sub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
  },
  time: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
});
