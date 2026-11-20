import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { ArrowLeft, Gift, Tag, Check, Sparkles } from 'lucide-react-native';

interface RewardsScreenProps {
  onGoBack: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ onGoBack }) => {
  const { rewards, redeemReward } = useBankStore();

  const handleRedeem = (rewardId: string, title: string) => {
    const res = redeemReward(rewardId);
    if (res.success) {
      Alert.alert('Offer Unlocked', `${title} has been applied to your next transaction!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards &amp; Cashback</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Sparkles size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>PAYBACK Exclusive Club</Text>
            <Text style={styles.bannerSub}>
              Earn automatic cashback on your daily bills, recharge, and card purchases across Pakistan.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Promotions</Text>

        <View style={styles.rewardsList}>
          {rewards.map((r) => (
            <View key={r.id} style={styles.rewardCard}>
              <View style={styles.rewardTopRow}>
                <View style={styles.badge}>
                  <Tag size={12} color={Colors.darkForest} />
                  <Text style={styles.badgeText}>{r.category}</Text>
                </View>
                <Text style={styles.expiryText}>Expires: {r.expiryDate}</Text>
              </View>

              <Text style={styles.rewardTitle}>{r.title}</Text>
              <Text style={styles.benefitText}>{r.discountOrCashback}</Text>

              <View style={styles.codeRow}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{r.code}</Text>
                </View>

                {r.isRedeemed ? (
                  <View style={styles.redeemedBadge}>
                    <Check size={14} color={Colors.primaryLime} strokeWidth={3} />
                    <Text style={styles.redeemedText}>ACTIVE</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.redeemBtn}
                    onPress={() => handleRedeem(r.id, r.title)}
                  >
                    <Text style={styles.redeemBtnText}>Redeem Code</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
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
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginVertical: 14,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  bannerSub: {
    fontSize: 11,
    color: Colors.mutedGreen,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
    marginBottom: 12,
  },
  rewardsList: {
    gap: 14,
  },
  rewardCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  rewardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.darkForest,
  },
  expiryText: {
    fontSize: 10,
    color: Colors.mutedGreen,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  benefitText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 4,
    marginBottom: 14,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeBox: {
    backgroundColor: Colors.darkForest,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.2)',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: 1,
  },
  redeemedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(200, 243, 58, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  redeemedText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  redeemBtn: {
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  redeemBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
