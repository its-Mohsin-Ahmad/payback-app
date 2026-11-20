import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../theme/colors';
import { CenterScanButton } from './CenterScanButton';
import { Home, CreditCard, Clock, Search } from 'lucide-react-native';

export type TabType = 'home' | 'cards' | 'history' | 'search';

interface FloatingBottomTabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenScanner: () => void;
}

export const FloatingBottomTabBar: React.FC<FloatingBottomTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
}) => {
  return (
    <View style={styles.floatingContainer}>
      <View style={styles.barSurface}>
        {/* 1. HOME */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.85}
          onPress={() => onSelectTab('home')}
        >
          <View style={[styles.iconBox, currentTab === 'home' && styles.iconBoxActive]}>
            <Home
              size={22}
              color={Colors.darkForest}
              strokeWidth={currentTab === 'home' ? 2.8 : 2}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* 2. CARDS */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.85}
          onPress={() => onSelectTab('cards')}
        >
          <View style={[styles.iconBox, currentTab === 'cards' && styles.iconBoxActive]}>
            <CreditCard
              size={22}
              color={Colors.darkForest}
              strokeWidth={currentTab === 'cards' ? 2.8 : 2}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'cards' && styles.tabLabelActive]}>
            Cards
          </Text>
        </TouchableOpacity>

        {/* 3. CENTER SCAN BUTTON (Elevated above bar) */}
        <CenterScanButton onPress={onOpenScanner} />

        {/* 4. HISTORY */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.85}
          onPress={() => onSelectTab('history')}
        >
          <View style={[styles.iconBox, currentTab === 'history' && styles.iconBoxActive]}>
            <Clock
              size={22}
              color={Colors.darkForest}
              strokeWidth={currentTab === 'history' ? 2.8 : 2}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'history' && styles.tabLabelActive]}>
            History
          </Text>
        </TouchableOpacity>

        {/* 5. SEARCH */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.85}
          onPress={() => onSelectTab('search')}
        >
          <View style={[styles.iconBox, currentTab === 'search' && styles.iconBoxActive]}>
            <Search
              size={22}
              color={Colors.darkForest}
              strokeWidth={currentTab === 'search' ? 2.8 : 2}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'search' && styles.tabLabelActive]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  barSurface: {
    backgroundColor: Colors.primaryLime,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    paddingHorizontal: 8,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: 'rgba(16, 27, 5, 0.12)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.darkForest,
    marginTop: 2,
    opacity: 0.8,
  },
  tabLabelActive: {
    fontWeight: '800',
    opacity: 1,
  },
});
