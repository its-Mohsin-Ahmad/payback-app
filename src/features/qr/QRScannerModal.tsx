import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import {
  X,
  Flashlight,
  FlashlightOff,
  Image as ImageIcon,
  Check,
  QrCode,
  ShieldCheck,
  Building,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.72;

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ visible, onClose }) => {
  const { account, scanAndPayQR } = useBankStore();
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [step, setStep] = useState<'scanning' | 'review' | 'success'>('scanning');

  // Simulated scanned merchant
  const [merchantData, setMerchantData] = useState({
    name: 'Al-Fatah Supermarket (Gulberg)',
    id: 'RAAST-MCH-98124',
    amount: 1450.00,
    desc: 'Retail Grocery POS Checkout',
  });

  // Animated laser line
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && step === 'scanning') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: SCAN_FRAME_SIZE - 4,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [visible, step]);

  const handleSimulateScan = () => {
    setStep('review');
  };

  const handleAuthorizePayment = () => {
    if (merchantData.amount > account.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to complete this QR payment.');
      return;
    }

    const res = scanAndPayQR({
      merchantName: merchantData.name,
      merchantId: merchantData.id,
      amount: merchantData.amount,
      description: merchantData.desc,
    });

    if (res.success) {
      setStep('success');
    } else {
      Alert.alert('Payment Failed', res.message);
    }
  };

  const handleResetAndClose = () => {
    setStep('scanning');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {/* Top Floating Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleResetAndClose} style={styles.topIconBtn}>
            <X size={22} color={Colors.textWhite} />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>
            {step === 'scanning' ? 'Scan & Pay QR' : step === 'review' ? 'Authorize Payment' : 'Payment Cleared'}
          </Text>

          <TouchableOpacity
            onPress={() => setFlashlightOn(!flashlightOn)}
            style={styles.topIconBtn}
          >
            {flashlightOn ? (
              <Flashlight size={22} color={Colors.primaryLime} />
            ) : (
              <FlashlightOff size={22} color={Colors.textWhite} />
            )}
          </TouchableOpacity>
        </View>

        {/* Step 1: Scanning Viewfinder */}
        {step === 'scanning' && (
          <View style={styles.scanningBody}>
            {/* Viewfinder Frame */}
            <View style={styles.frameContainer}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Animated Lime Laser */}
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    transform: [{ translateY: laserAnim }],
                  },
                ]}
              />
            </View>

            <Text style={styles.instructionsText}>
              Align any Raast, 1Link, or PAYBACK Merchant QR code within the frame to pay instantly
            </Text>

            {/* Bottom Actions */}
            <View style={styles.scanningBottomRow}>
              <TouchableOpacity
                style={styles.bottomToolBtn}
                onPress={() => {
                  Alert.alert('Gallery Import', 'Selected QR voucher from gallery. Proceeding to review...');
                  handleSimulateScan();
                }}
              >
                <ImageIcon size={20} color={Colors.primaryLime} />
                <Text style={styles.bottomToolText}>Import QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={handleSimulateScan}
              >
                <QrCode size={20} color={Colors.darkForest} />
                <Text style={styles.simulateScanBtnText}>Test Merchant Scan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 2: Payment Review Screen */}
        {step === 'review' && (
          <View style={styles.reviewContainer}>
            <View style={styles.reviewCard}>
              <View style={styles.merchantIconCircle}>
                <Building size={32} color={Colors.primaryLime} />
              </View>

              <Text style={styles.merchantNameText}>{merchantData.name}</Text>
              <Text style={styles.merchantIdText}>Merchant ID: {merchantData.id}</Text>

              <View style={styles.reviewAmountBox}>
                <Text style={styles.reviewAmountLabel}>Total Bill Amount</Text>
                <Text style={styles.reviewAmountValue}>
                  PKR {merchantData.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>

              <View style={styles.reviewMetaList}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Payment Type</Text>
                  <Text style={styles.metaVal}>EMVCo Raast Dynamic QR</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Debit Source</Text>
                  <Text style={styles.metaVal}>PAYBACK Wallet (******5890)</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Transaction Fee</Text>
                  <Text style={[styles.metaVal, { color: Colors.primaryLime }]}>PKR 0.00 (Zero Fee)</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.confirmPayBtn}
                activeOpacity={0.88}
                onPress={handleAuthorizePayment}
              >
                <ShieldCheck size={20} color={Colors.darkForest} strokeWidth={2.5} />
                <Text style={styles.confirmPayText}>Authorize &amp; Pay PKR {merchantData.amount.toLocaleString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelPayBtn}
                onPress={() => setStep('scanning')}
              >
                <Text style={styles.cancelPayText}>Rescan Another QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Payment Success Confirmation */}
        {step === 'success' && (
          <View style={styles.successContainer}>
            <View style={styles.successCircle}>
              <Check size={48} color={Colors.darkForest} strokeWidth={3} />
            </View>

            <Text style={styles.successHeading}>Payment Approved!</Text>
            <Text style={styles.successAmount}>
              PKR {merchantData.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.successSub}>
              Transferred to {merchantData.name}
            </Text>

            <View style={styles.successCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Merchant</Text>
                <Text style={styles.metaVal}>{merchantData.name}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Terminal Reference</Text>
                <Text style={styles.metaVal}>QR-POS-991280</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Timestamp</Text>
                <Text style={styles.metaVal}>Just now</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={handleResetAndClose}>
              <Text style={styles.doneBtnText}>Return to Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  scanningBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  frameContainer: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    borderRadius: 20,
    backgroundColor: 'rgba(200, 243, 58, 0.04)',
    position: 'relative',
    marginBottom: 28,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Colors.primaryLime,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  laserLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: Colors.brightLime,
    borderRadius: 2,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.mutedGreen,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 36,
  },
  scanningBottomRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  bottomToolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.cardGreen,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  bottomToolText: {
    color: Colors.primaryLime,
    fontSize: 13,
    fontWeight: '700',
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  simulateScanBtnText: {
    color: Colors.darkForest,
    fontSize: 13,
    fontWeight: '800',
  },
  reviewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  reviewCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    alignItems: 'center',
  },
  merchantIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLime,
    marginBottom: 12,
  },
  merchantNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  merchantIdText: {
    fontSize: 12,
    color: Colors.mutedGreen,
    marginTop: 4,
    marginBottom: 16,
  },
  reviewAmountBox: {
    width: '100%',
    backgroundColor: Colors.darkForest,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewAmountLabel: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reviewAmountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 4,
  },
  reviewMetaList: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
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
  confirmPayBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryLime,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  confirmPayText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  cancelPayBtn: {
    paddingVertical: 8,
  },
  cancelPayText: {
    fontSize: 13,
    color: Colors.mutedGreen,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successHeading: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  successAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginVertical: 8,
  },
  successSub: {
    fontSize: 14,
    color: Colors.mutedGreen,
    marginBottom: 24,
  },
  successCard: {
    width: '100%',
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLime,
    marginBottom: 28,
  },
  doneBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.darkForest,
  },
});
