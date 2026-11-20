import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import {
  ArrowLeft,
  Headphones,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react-native';

interface SupportScreenProps {
  onGoBack: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onGoBack }) => {
  const [complaintText, setComplaintText] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I send money via Raast Instant?',
      a: 'Go to Send Money > Select Raast Destination. Enter the receiver Raast ID or registered mobile number. SBP Raast transfers are processed 24/7 with zero fees.',
    },
    {
      q: 'What is the daily transaction limit for my account?',
      a: 'As a verified Level-2 wallet holder in Pakistan, your daily transfer limit is PKR 250,000, and your monthly limit is PKR 1,500,000.',
    },
    {
      q: 'How do I pay utility bills with zero fee?',
      a: 'Navigate to Bills Pay, pick your electricity, gas, or water provider (e.g. LESCO, IESCO, SNGPL), enter your consumer reference, and confirm payment instantly.',
    },
    {
      q: 'How does the PAYBACK virtual VISA card work?',
      a: 'Your virtual card is linked directly to your wallet balance. You can freeze/unfreeze it anytime, set custom daily limits, and use it for online e-commerce shopping worldwide.',
    },
  ];

  const handleSubmitTicket = () => {
    if (!complaintText.trim()) {
      Alert.alert('Required', 'Please enter your inquiry or transaction complaint details.');
      return;
    }
    const ticketId = `TKT-PB-${Math.floor(100000 + Math.random() * 900000)}`;
    Alert.alert(
      'Support Ticket Registered',
      `Your support ticket ${ticketId} has been escalated to our Priority Resolution Desk. A response will be dispatched via SMS & Email within 15 minutes.`
    );
    setComplaintText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.circleBtn}>
          <ArrowLeft size={20} color={Colors.primaryLime} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help &amp; Complaints</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Headphones size={28} color={Colors.primaryLime} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>24/7 Priority Support Desk</Text>
            <Text style={styles.bannerSub}>
              Helpline: 042-111-PAYBACK (729222) • Dedicated SBP Banking Ombudsman Desk.
            </Text>
          </View>
        </View>

        {/* Submit Complaint Box */}
        <Text style={styles.sectionTitle}>Submit a Complaint or Inquiry</Text>

        <View style={styles.ticketCard}>
          <Text style={styles.ticketLabel}>Describe your issue / transaction reference</Text>
          <TextInput
            style={styles.ticketInput}
            multiline
            numberOfLines={4}
            placeholder="e.g. Transaction Ref CJ4901TUZ0 delayed, bill payment query, or card authorization help..."
            placeholderTextColor={Colors.mutedGreen}
            value={complaintText}
            onChangeText={setComplaintText}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitTicket}>
            <Send size={16} color={Colors.darkForest} />
            <Text style={styles.submitBtnText}>Submit Priority Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* Frequently Asked Questions */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqList}>
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <TouchableOpacity
                key={i}
                style={styles.faqCard}
                activeOpacity={0.85}
                onPress={() => setOpenFaq(isOpen ? null : i)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{f.q}</Text>
                  {isOpen ? (
                    <ChevronUp size={18} color={Colors.primaryLime} />
                  ) : (
                    <ChevronDown size={18} color={Colors.mutedGreen} />
                  )}
                </View>

                {isOpen && <Text style={styles.faqAnswer}>{f.a}</Text>}
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
  ticketCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 20,
  },
  ticketLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
    marginBottom: 8,
  },
  ticketInput: {
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    padding: 14,
    height: 90,
    color: Colors.textWhite,
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(200, 243, 58, 0.15)',
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  submitBtn: {
    backgroundColor: Colors.primaryLime,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  faqList: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textWhite,
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 12,
    color: Colors.mutedGreen,
    lineHeight: 18,
    marginTop: 10,
  },
});
