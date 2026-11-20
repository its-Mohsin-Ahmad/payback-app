import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { Transaction } from '../../types';
import {
  ArrowLeft,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  FileDown,
  CheckCircle,
  X,
  Filter,
} from 'lucide-react-native';

interface TransactionsScreenProps {
  onGoBack: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onGoBack }) => {
  const { transactions } = useBankStore();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Received' | 'Sent' | 'Bills' | 'Recharge'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Compute total summary
  const totalIncome = transactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  // Filtered transactions
  const filteredList = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Received') return t.type === 'credit';
    if (selectedFilter === 'Sent') return t.type === 'debit' && t.category === 'transfer';
    if (selectedFilter === 'Bills') return t.category === 'bill';
    if (selectedFilter === 'Recharge') return t.category === 'recharge' || t.category === 'bundle';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => Alert.alert('Export Statement', 'Monthly statement PDF generated and saved to your device downloads.')}
        >
          <FileDown size={20} color={Colors.primaryLime} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Activity Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Activity Overview (PKR)</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <View style={styles.summaryIconBadge}>
                <ArrowDownLeft size={16} color={Colors.primaryLime} />
              </View>
              <Text style={styles.summaryLabel}>Total Received</Text>
              <Text style={styles.summaryIncome}>
                +PKR {totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCol}>
              <View style={[styles.summaryIconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <ArrowUpRight size={16} color="#FF6B6B" />
              </View>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryExpense}>
                -PKR {totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.mutedGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ref, or biller..."
            placeholderTextColor={Colors.mutedGreen}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={Colors.mutedGreen} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {(['All', 'Received', 'Sent', 'Bills', 'Recharge'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, selectedFilter === tab && styles.filterPillActive]}
              onPress={() => setSelectedFilter(tab)}
            >
              <Text style={[styles.filterPillText, selectedFilter === tab && styles.filterPillTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions List */}
        <View style={styles.listCard}>
          {filteredList.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions found for this filter.</Text>
            </View>
          ) : (
            filteredList.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.txRow}
                activeOpacity={0.8}
                onPress={() => setSelectedTx(tx)}
              >
                <View style={styles.txIconBox}>
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft size={18} color={Colors.primaryLime} strokeWidth={2.5} />
                  ) : (
                    <ArrowUpRight size={18} color="#FF6B6B" strokeWidth={2.5} />
                  )}
                </View>

                <View style={styles.txDetails}>
                  <Text style={styles.txTitle} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={styles.txSub}>
                    Ref: {tx.referenceId} • {tx.date}
                  </Text>
                </View>

                <View style={styles.txAmountCol}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'credit' ? Colors.primaryLime : '#FF6B6B' },
                    ]}
                  >
                    {tx.type === 'credit' ? '+' : '-'}PKR {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.txStatus}>{tx.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Transaction Detail Modal */}
      <Modal visible={!!selectedTx} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.detailCard}>
            <View style={styles.detailCardTop}>
              <View style={styles.checkIconBadge}>
                <CheckCircle size={32} color={Colors.primaryLime} />
              </View>
              <TouchableOpacity onPress={() => setSelectedTx(null)} style={styles.closeBtn}>
                <X size={20} color={Colors.mutedGreen} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{selectedTx?.title}</Text>
            <Text
              style={[
                styles.modalAmount,
                { color: selectedTx?.type === 'credit' ? Colors.primaryLime : '#FF6B6B' },
              ]}
            >
              {selectedTx?.type === 'credit' ? '+' : '-'}PKR {selectedTx?.amount.toLocaleString()}
            </Text>

            <View style={styles.modalMetaList}>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Counterparty</Text>
                <Text style={styles.metaVal}>{selectedTx?.counterparty}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Reference ID</Text>
                <Text style={styles.metaVal}>{selectedTx?.referenceId}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Date & Time</Text>
                <Text style={styles.metaVal}>{selectedTx?.date}, {selectedTx?.time}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Channel</Text>
                <Text style={styles.metaVal}>{selectedTx?.paymentMethod || 'PAYBACK Direct'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Service Fee</Text>
                <Text style={[styles.metaVal, { color: Colors.primaryLime }]}>PKR 0.00</Text>
              </View>
              {selectedTx?.note && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Note</Text>
                  <Text style={styles.metaVal}>{selectedTx.note}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => {
                Alert.alert('Share Receipt', `Receipt for Ref: ${selectedTx?.referenceId} shared successfully.`);
                setSelectedTx(null);
              }}
            >
              <Share2 size={18} color={Colors.darkForest} />
              <Text style={styles.shareBtnText}>Share Official Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  summaryCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCol: {
    flex: 1,
  },
  summaryIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '600',
  },
  summaryIncome: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 2,
  },
  summaryExpense: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF6B6B',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    marginHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
    marginBottom: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardGreen,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  filterPillActive: {
    backgroundColor: Colors.primaryLime,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  filterPillTextActive: {
    color: Colors.darkForest,
    fontWeight: '800',
  },
  listCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  emptyState: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.mutedGreen,
    fontSize: 13,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  txSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  txStatus: {
    fontSize: 10,
    color: Colors.mutedGreen,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  detailCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  detailCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  modalAmount: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 18,
  },
  modalMetaList: {
    backgroundColor: Colors.darkForest,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaKey: {
    fontSize: 12,
    color: Colors.mutedGreen,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  shareBtn: {
    backgroundColor: Colors.primaryLime,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.darkForest,
  },
});
