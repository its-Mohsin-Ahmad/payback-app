import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import {
  Search,
  Zap,
  Smartphone,
  Landmark,
  PiggyBank,
  Heart,
  Gift,
  Building,
  User,
  ArrowRight,
  TrendingUp,
} from 'lucide-react-native';

interface SearchScreenProps {
  onGoBack: () => void;
  onNavigateToBills: () => void;
  onNavigateToRecharge: () => void;
  onNavigateToSend: () => void;
  onNavigateToGovernment: () => void;
  onNavigateToSavings: () => void;
  onNavigateToDonations: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onNavigateToBills,
  onNavigateToRecharge,
  onNavigateToSend,
  onNavigateToGovernment,
  onNavigateToSavings,
  onNavigateToDonations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    { id: '1', title: 'LESCO Electricity', category: 'Utility Bill', icon: Zap, action: onNavigateToBills },
    { id: '2', title: 'Jazz 4G Packages', category: 'Mobile Bundle', icon: Smartphone, action: onNavigateToRecharge },
    { id: '3', title: 'Raast Instant Transfer', category: 'Money Transfer', icon: Landmark, action: onNavigateToSend },
    { id: '4', title: 'FBR Tax Payment', category: 'Government Service', icon: Building, action: onNavigateToGovernment },
    { id: '5', title: 'Hajj & Umrah Savings', category: 'Savings Vault', icon: PiggyBank, action: onNavigateToSavings },
    { id: '6', title: 'Shaukat Khanum Charity', category: 'Donation', icon: Heart, action: onNavigateToDonations },
    { id: '7', title: 'Zong Super 4G Recharge', category: 'Easyload', icon: Smartphone, action: onNavigateToRecharge },
    { id: '8', title: 'SNGPL Gas Bill', category: 'Utility Bill', icon: Zap, action: onNavigateToBills },
  ];

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header Search Box */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Hub</Text>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.mutedGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search billers, banks, contacts, packages..."
            placeholderTextColor={Colors.mutedGreen}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus={false}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Popular Tags */}
        <View style={styles.sectionHeader}>
          <TrendingUp size={16} color={Colors.primaryLime} />
          <Text style={styles.sectionTitle}>Popular Searches in Pakistan</Text>
        </View>

        <View style={styles.tagsRow}>
          {['LESCO', 'Jazz Bundle', 'Raast ID', 'Traffic Challan', 'Edhi', 'PTCL'].map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.tagPill}
              onPress={() => setSearchTerm(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results / Services */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
          {searchTerm ? 'Search Results' : 'Explore All Financial Services'}
        </Text>

        <View style={styles.servicesList}>
          {filtered.map((item) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.serviceRow}
                activeOpacity={0.8}
                onPress={item.action}
              >
                <View style={styles.serviceIconCircle}>
                  <IconComp size={20} color={Colors.primaryLime} />
                </View>

                <View style={styles.serviceTextCol}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.serviceCat}>{item.category}</Text>
                </View>

                <ArrowRight size={18} color={Colors.mutedGreen} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: Colors.cardGreen,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
  },
  tagText: {
    fontSize: 12,
    color: Colors.mutedGreen,
    fontWeight: '700',
  },
  servicesList: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  serviceIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceTextCol: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  serviceCat: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
});
