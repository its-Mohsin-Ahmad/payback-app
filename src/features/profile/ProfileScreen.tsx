import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useAuthStore } from '../../store/useAuthStore';
import { useBankStore } from '../../store/useBankStore';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  Headphones,
  FileText,
  LogOut,
  ChevronRight,
  Landmark,
  FileCheck,
} from 'lucide-react-native';

interface ProfileScreenProps {
  onLogout: () => void;
  onResetToWelcome?: () => void;
  onNavigateToSecurity: () => void;
  onNavigateToSupport: () => void;
  onNavigateToStatements: () => void;
  onNavigateToAbout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogout,
  onResetToWelcome,
  onNavigateToSecurity,
  onNavigateToSupport,
  onNavigateToStatements,
  onNavigateToAbout,
}) => {
  const { user, resetDemoToNewUser } = useAuthStore();
  const { account } = useBankStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile &amp; Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeroCard}>
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.fullName || 'Janvis David'}</Text>
          <Text style={styles.userHandle}>@{user?.username || 'janvisd'}</Text>

          <View style={styles.tierBadge}>
            <ShieldCheck size={14} color={Colors.darkForest} />
            <Text style={styles.tierText}>{user?.accountTier || 'Premium Elite'} Verified</Text>
          </View>
        </View>

        {/* Account Details Box */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Verified Account Limits (SBP)</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Mobile Number</Text>
            <Text style={styles.metaVal}>{user?.phoneNumber}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Nadra CNIC</Text>
            <Text style={styles.metaVal}>{user?.cnicMasked}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>IBAN</Text>
            <Text style={styles.metaVal}>{account.iban}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Daily Transfer Limit</Text>
            <Text style={styles.metaVal}>PKR {user?.dailyTransferLimit.toLocaleString()}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Monthly Limit</Text>
            <Text style={styles.metaVal}>PKR {user?.monthlyTransferLimit.toLocaleString()}</Text>
          </View>
        </View>

        {/* Settings Navigation Menu */}
        <Text style={styles.sectionTitle}>Account Controls</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={onNavigateToSecurity}>
            <View style={styles.menuIconCircle}>
              <Lock size={18} color={Colors.primaryLime} />
            </View>
            <Text style={styles.menuLabel}>Security Center &amp; MPIN</Text>
            <ChevronRight size={18} color={Colors.mutedGreen} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onNavigateToStatements}>
            <View style={styles.menuIconCircle}>
              <FileText size={18} color={Colors.primaryLime} />
            </View>
            <Text style={styles.menuLabel}>Account Statements &amp; Tax</Text>
            <ChevronRight size={18} color={Colors.mutedGreen} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onNavigateToSupport}>
            <View style={styles.menuIconCircle}>
              <Headphones size={18} color={Colors.primaryLime} />
            </View>
            <Text style={styles.menuLabel}>Help, Complaints &amp; Disputes</Text>
            <ChevronRight size={18} color={Colors.mutedGreen} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onNavigateToAbout}>
            <View style={styles.menuIconCircle}>
              <FileCheck size={18} color={Colors.primaryLime} />
            </View>
            <Text style={styles.menuLabel}>About PAYBACK &amp; Regulatory Disclosures</Text>
            <ChevronRight size={18} color={Colors.mutedGreen} />
          </TouchableOpacity>
        </View>

        {/* Experience Demo Reset */}
        <TouchableOpacity
          style={styles.resetDemoBtn}
          onPress={() => {
            resetDemoToNewUser();
            if (onResetToWelcome) onResetToWelcome();
          }}
        >
          <Text style={styles.resetDemoBtnText}>✨ Replay Welcome &amp; Onboarding Journey</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <LogOut size={18} color="#FF6B6B" />
          <Text style={styles.logoutBtnText}>Log Out from Wallet</Text>
        </TouchableOpacity>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeroCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    marginVertical: 14,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primaryLime,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  userHandle: {
    fontSize: 12,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 12,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  detailsCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 20,
    gap: 12,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    textTransform: 'uppercase',
    marginBottom: 4,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 243, 58, 0.08)',
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  resetDemoBtn: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  resetDemoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.darkForest,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF6B6B',
  },
});
