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
  TextInput,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { useBankStore } from '../../store/useBankStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  X,
  Flashlight,
  FlashlightOff,
  Image as ImageIcon,
  Check,
  QrCode,
  ShieldCheck,
  Building,
  Share2,
  Copy,
  Download,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.72;

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ visible, onClose }) => {
  const { account, scanAndPayQR } = useBankStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'scan' | 'my_qr'>('scan');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [step, setStep] = useState<'scanning' | 'review' | 'success'>('scanning');

  // Receive QR Custom Amount
  const [customRequestAmount, setCustomRequestAmount] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Simulated scanned merchant
  const [merchantData, setMerchantData] = useState({
    name: 'Al-Fatah Supermarket (Gulberg)',
    id: 'RAAST-MCH-98124',
    amount: 1450.0,
    desc: 'Retail Grocery POS Checkout',
  });

  // Animated laser line
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && step === 'scanning' && activeTab === 'scan') {
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
  }, [visible, step, activeTab]);

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

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: `Pay ${user?.fullName || 'Janvis'} via PAYBACK Raast QR. Account: ${account.iban}${
          customRequestAmount ? ` | Requested Amount: PKR ${customRequestAmount}` : ''
        }`,
      });
    } catch (e) {
      // Ignored
    }
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

          {/* Mode Switcher Pills */}
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modePill, activeTab === 'scan' && styles.modePillActive]}
              onPress={() => {
                setActiveTab('scan');
                setStep('scanning');
              }}
            >
              <Text style={[styles.modePillText, activeTab === 'scan' && styles.modePillTextActive]}>
                Scan QR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modePill, activeTab === 'my_qr' && styles.modePillActive]}
              onPress={() => setActiveTab('my_qr')}
            >
              <Text style={[styles.modePillText, activeTab === 'my_qr' && styles.modePillTextActive]}>
                My QR / Receive
              </Text>
            </TouchableOpacity>
          </View>

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

        {/* TAB 1: SCAN QR FLOW */}
        {activeTab === 'scan' && (
          <>
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
                      <Text style={styles.metaVal}>PAYBACK Wallet ({account.maskedNumber})</Text>
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
          </>
        )}

        {/* TAB 2: MY PERSONAL RECEIVE QR */}
        {activeTab === 'my_qr' && (
          <View style={styles.myQrContainer}>
            <View style={styles.myQrCard}>
              <View style={styles.myQrHeader}>
                <Text style={styles.myQrName}>{user?.fullName || 'Janvis David'}</Text>
                <Text style={styles.myQrPhone}>{user?.phoneNumber || '+92 300 8472910'}</Text>
                <View style={styles.raastTag}>
                  <Text style={styles.raastTagText}>⚡ Raast Instant QR</Text>
                </View>
              </View>

              {/* Graphical Simulated QR Code View */}
              <View style={styles.qrCodeGraphicWrapper}>
                <View style={styles.qrInnerFrame}>
                  <QrCode size={180} color={Colors.darkForest} />
                </View>
              </View>

              <Text style={styles.ibanLabel}>Direct Raast IBAN</Text>
              <Text style={styles.ibanValue}>{account.iban}</Text>

              {/* Optional Amount Request */}
              <View style={styles.requestAmountBox}>
                <Text style={styles.requestAmountLabel}>Requested Amount (Optional)</Text>
                <TextInput
                  style={styles.requestAmountInput}
                  placeholder="e.g. 2500"
                  placeholderTextColor={Colors.mutedGreen}
                  keyboardType="numeric"
                  value={customRequestAmount}
                  onChangeText={setCustomRequestAmount}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.qrActionRow}>
                <TouchableOpacity
                  style={styles.qrShareBtn}
                  activeOpacity={0.85}
                  onPress={handleShareQR}
                >
                  <Share2 size={16} color={Colors.darkForest} strokeWidth={2.5} />
                  <Text style={styles.qrShareText}>Share QR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.qrCopyBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                >
                  {isCopied ? (
                    <Check size={16} color={Colors.primaryLime} />
                  ) : (
                    <Copy size={16} color={Colors.primaryLime} />
                  )}
                  <Text style={styles.qrCopyText}>{isCopied ? 'Copied' : 'Copy IBAN'}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.2)',
  },
  modePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modePillActive: {
    backgroundColor: Colors.primaryLime,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  modePillTextActive: {
    color: Colors.darkForest,
    fontWeight: '900',
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
    position: 'relative',
    marginBottom: 30,
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
    width: '100%',
    height: 3,
    backgroundColor: Colors.brightLime,
    shadowColor: Colors.brightLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.mutedGreen,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  scanningBottomRow: {
    flexDirection: 'row',
    gap: 14,
  },
  bottomToolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardGreen,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  bottomToolText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLime,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 8,
  },
  simulateScanBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  reviewContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  reviewCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  merchantIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.darkForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  merchantNameText: {
    fontSize: 17,
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
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginTop: 4,
  },
  reviewMetaList: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
    width: '100%',
    height: 52,
    borderRadius: 26,
    gap: 8,
    marginBottom: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryLime,
    marginVertical: 4,
  },
  successSub: {
    fontSize: 13,
    color: Colors.mutedGreen,
    marginBottom: 20,
    textAlign: 'center',
  },
  successCard: {
    width: '100%',
    backgroundColor: Colors.cardGreen,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.15)',
  },
  doneBtn: {
    backgroundColor: Colors.primaryLime,
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  myQrContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  myQrCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  myQrHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  myQrName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textWhite,
  },
  myQrPhone: {
    fontSize: 13,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  raastTag: {
    backgroundColor: 'rgba(213, 245, 74, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  raastTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLime,
  },
  qrCodeGraphicWrapper: {
    backgroundColor: Colors.primaryLime,
    borderRadius: 24,
    padding: 16,
    marginVertical: 14,
    shadowColor: Colors.primaryLime,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  qrInnerFrame: {
    backgroundColor: Colors.primaryLime,
    padding: 8,
  },
  ibanLabel: {
    fontSize: 11,
    color: Colors.mutedGreen,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ibanValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textWhite,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  requestAmountBox: {
    width: '100%',
    backgroundColor: Colors.darkForest,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(213, 245, 74, 0.15)',
  },
  requestAmountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedGreen,
  },
  requestAmountInput: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryLime,
    paddingVertical: 2,
  },
  qrActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 18,
  },
  qrShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLime,
    height: 48,
    borderRadius: 24,
    gap: 8,
  },
  qrShareText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.darkForest,
  },
  qrCopyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkForest,
    height: 48,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLime,
  },
  qrCopyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryLime,
  },
});
