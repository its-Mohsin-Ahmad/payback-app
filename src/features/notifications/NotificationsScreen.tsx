import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { ArrowLeft, Bell, Check, ShieldCheck, Tag } from 'lucide-react-native';

interface NotificationsScreenProps {
  onGoBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onGoBack }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useBankStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAllNotifications}>
          <Text style={styles.clearBtnText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.notifList}>
          {notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifCard, !n.isRead && styles.unreadCard]}
              activeOpacity={0.8}
              onPress={() => markNotificationAsRead(n.id)}
            >
              <View style={styles.iconCircle}>
                {n.type === 'transaction' ? (
                  <Bell size={18} color={Colors.primaryLime} />
                ) : n.type === 'security' ? (
                  <ShieldCheck size={18} color={Colors.primaryLime} />
                ) : (
                  <Tag size={18} color={Colors.primaryLime} />
                )}
              </View>

              <View style={styles.infoCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{n.title}</Text>
                  {!n.isRead && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifDesc}>{n.description}</Text>
                <Text style={styles.notifTime}>{n.timestamp}</Text>
              </View>
            </TouchableOpacity>
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
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  notifList: {
    gap: 12,
  },
  notifCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.12)',
  },
  unreadCard: {
    borderColor: Colors.primaryLime,
    backgroundColor: 'rgba(38, 61, 8, 0.95)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLime,
  },
  notifDesc: {
    fontSize: 12,
    color: Colors.mutedGreen,
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 10,
    color: Colors.mutedGreen,
    opacity: 0.8,
  },
});
