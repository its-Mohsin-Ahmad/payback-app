import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './src/theme/colors';
import { useAuthStore } from './src/store/useAuthStore';

// Main Flow Screens
import { SplashScreen } from './src/features/splash/SplashScreen';
import { OnboardingScreen } from './src/features/onboarding/OnboardingScreen';
import { LoginScreen } from './src/features/auth/LoginScreen';
import { RegisterScreen } from './src/features/auth/RegisterScreen';
import { DashboardScreen } from './src/features/dashboard/DashboardScreen';
import { CardsScreen } from './src/features/cards/CardsScreen';
import { TransactionsScreen } from './src/features/transactions/TransactionsScreen';
import { SearchScreen } from './src/features/search/SearchScreen';
import { ProfileScreen } from './src/features/profile/ProfileScreen';
import { TransferScreen } from './src/features/transfers/TransferScreen';
import { BillPaymentsScreen } from './src/features/payments/BillPaymentsScreen';
import { MobileLoadScreen } from './src/features/mobile/MobileLoadScreen';
import { GovernmentPaymentsScreen } from './src/features/government/GovernmentPaymentsScreen';
import { RemittanceScreen } from './src/features/remittance/RemittanceScreen';
import { SavingsGoalsScreen } from './src/features/savings/SavingsGoalsScreen';
import { DonationsScreen } from './src/features/donations/DonationsScreen';
import { RewardsScreen } from './src/features/rewards/RewardsScreen';
import { StatementsScreen } from './src/features/statements/StatementsScreen';
import { NotificationsScreen } from './src/features/notifications/NotificationsScreen';
import { SecurityScreen } from './src/features/security/SecurityScreen';
import { SupportScreen } from './src/features/support/SupportScreen';
import { AboutLegalScreen } from './src/features/about/AboutLegalScreen';
import { AdminDashboardScreen } from './src/features/admin/AdminDashboardScreen';
import { QRScannerModal } from './src/features/qr/QRScannerModal';
import { BottomTabBar, TabScreenType } from './src/components/navigation/BottomTabBar';

type AppFlow =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'main'
  | 'send'
  | 'request'
  | 'bills'
  | 'recharge'
  | 'government'
  | 'remittance'
  | 'savings'
  | 'donations'
  | 'rewards'
  | 'statements'
  | 'notifications'
  | 'profile'
  | 'security'
  | 'support'
  | 'about'
  | 'admin';

export default function App() {
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('splash');
  const [activeTab, setActiveTab] = useState<TabScreenType>('home');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const handleSplashDone = () => {
    if (isAuthenticated) {
      setCurrentFlow('main');
    } else {
      setCurrentFlow('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentFlow('login');
  };

  const handleAuthSuccess = () => {
    setCurrentFlow('main');
  };

  const handleLogout = () => {
    logout();
    setCurrentFlow('login');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Splash Screen */}
      {currentFlow === 'splash' && <SplashScreen onFinish={handleSplashDone} />}

      {/* 2. Onboarding Screen */}
      {currentFlow === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* 3. Login Screen */}
      {currentFlow === 'login' && (
        <LoginScreen
          onLoginSuccess={handleAuthSuccess}
          onNavigateToRegister={() => setCurrentFlow('register')}
        />
      )}

      {/* 4. Registration Screen */}
      {currentFlow === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setCurrentFlow('login')}
        />
      )}

      {/* 5. Main Authenticated Flow with Persistent Bottom Navigation Bar */}
      {currentFlow === 'main' && (
        <View style={styles.mainLayout}>
          <View style={styles.screenContent}>
            {activeTab === 'home' && (
              <DashboardScreen
                onNavigateToSend={() => setCurrentFlow('send')}
                onNavigateToRequest={() => setCurrentFlow('send')}
                onNavigateToBills={() => setCurrentFlow('bills')}
                onNavigateToRecharge={() => setCurrentFlow('recharge')}
                onNavigateToGovernment={() => setCurrentFlow('government')}
                onNavigateToRemittance={() => setCurrentFlow('remittance')}
                onNavigateToSavings={() => setCurrentFlow('savings')}
                onNavigateToDonations={() => setCurrentFlow('donations')}
                onNavigateToRewards={() => setCurrentFlow('rewards')}
                onNavigateToNotifications={() => setCurrentFlow('notifications')}
                onNavigateToProfile={() => setCurrentFlow('profile')}
                onNavigateToHistory={() => setActiveTab('history')}
                onOpenScanner={() => setIsScannerOpen(true)}
                onOpenAdmin={() => setCurrentFlow('admin')}
              />
            )}

            {activeTab === 'cards' && (
              <CardsScreen
                onGoBack={() => setActiveTab('home')}
                onNavigateToSend={() => setCurrentFlow('send')}
                onNavigateToBills={() => setCurrentFlow('bills')}
                onNavigateToStatements={() => setCurrentFlow('statements')}
                onNavigateToSavings={() => setCurrentFlow('savings')}
              />
            )}

            {activeTab === 'history' && (
              <TransactionsScreen onGoBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'search' && (
              <SearchScreen
                onGoBack={() => setActiveTab('home')}
                onNavigateToBills={() => setCurrentFlow('bills')}
                onNavigateToRecharge={() => setCurrentFlow('recharge')}
                onNavigateToSend={() => setCurrentFlow('send')}
                onNavigateToGovernment={() => setCurrentFlow('government')}
                onNavigateToSavings={() => setCurrentFlow('savings')}
                onNavigateToDonations={() => setCurrentFlow('donations')}
              />
            )}
          </View>

          {/* Persistent Floating Lime Bottom Navigation Bar */}
          <BottomTabBar
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        </View>
      )}

      {/* Full-Screen Feature Modals */}
      {currentFlow === 'send' && (
        <TransferScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'bills' && (
        <BillPaymentsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'recharge' && (
        <MobileLoadScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'government' && (
        <GovernmentPaymentsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'remittance' && (
        <RemittanceScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'savings' && (
        <SavingsGoalsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'donations' && (
        <DonationsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'rewards' && (
        <RewardsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'statements' && (
        <StatementsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'notifications' && (
        <NotificationsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'profile' && (
        <ProfileScreen
          onLogout={handleLogout}
          onNavigateToSecurity={() => setCurrentFlow('security')}
          onNavigateToSupport={() => setCurrentFlow('support')}
          onNavigateToStatements={() => setCurrentFlow('statements')}
          onNavigateToAbout={() => setCurrentFlow('about')}
        />
      )}

      {currentFlow === 'security' && (
        <SecurityScreen onGoBack={() => setCurrentFlow('profile')} />
      )}

      {currentFlow === 'support' && (
        <SupportScreen onGoBack={() => setCurrentFlow('profile')} />
      )}

      {currentFlow === 'about' && (
        <AboutLegalScreen onGoBack={() => setCurrentFlow('profile')} />
      )}

      {currentFlow === 'admin' && (
        <AdminDashboardScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* Prominent Full-Screen QR Scanner Modal */}
      <QRScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainLayout: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
});
