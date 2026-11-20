import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './src/theme/colors';
import { useAuthStore } from './src/store/useAuthStore';

// Main Flow Screens
import { SplashScreen } from './src/features/splash/SplashScreen';
import { WelcomeScreen } from './src/features/welcome/WelcomeScreen';
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
import { ServicesHubScreen } from './src/features/services/ServicesHubScreen';
import { AddMoneyScreen } from './src/features/wallet/AddMoneyScreen';
import { WithdrawMoneyScreen } from './src/features/wallet/WithdrawMoneyScreen';
import { QRScannerModal } from './src/features/qr/QRScannerModal';
import { BottomTabBar, TabScreenType } from './src/components/navigation/BottomTabBar';

type AppFlow =
  | 'splash'
  | 'welcome'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'main'
  | 'services'
  | 'add-money'
  | 'withdraw'
  | 'send'
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

  const {
    isAuthenticated,
    isFirstTimeUser,
    hasSeenWelcome,
    hasCompletedOnboarding,
    setSeenWelcome,
    setCompletedOnboarding,
    resetDemoToNewUser,
    logout,
  } = useAuthStore();

  // 1. Navigation State Machine on Splash Completion
  const handleSplashDone = () => {
    if (isAuthenticated) {
      setCurrentFlow('main');
    } else if (isFirstTimeUser && !hasSeenWelcome) {
      setCurrentFlow('welcome');
    } else if (!hasCompletedOnboarding) {
      setCurrentFlow('onboarding');
    } else {
      setCurrentFlow('login');
    }
  };

  // 2. Welcome Screen Handlers
  const handleWelcomeGetStarted = () => {
    setSeenWelcome(true);
    setCurrentFlow('onboarding');
  };

  const handleWelcomeLogin = () => {
    setSeenWelcome(true);
    setCurrentFlow('login');
  };

  // 3. Onboarding Handlers
  const handleOnboardingComplete = () => {
    setCompletedOnboarding(true);
    setCurrentFlow('register');
  };

  // 4. Auth Handlers
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

      {/* 2. First-Time User Welcome Screen */}
      {currentFlow === 'welcome' && (
        <WelcomeScreen
          onGetStarted={handleWelcomeGetStarted}
          onLogin={handleWelcomeLogin}
        />
      )}

      {/* 3. 4-Page Onboarding Screen */}
      {currentFlow === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* 4. Login Screen */}
      {currentFlow === 'login' && (
        <LoginScreen
          onLoginSuccess={handleAuthSuccess}
          onNavigateToRegister={() => setCurrentFlow('register')}
        />
      )}

      {/* 5. Registration Screen */}
      {currentFlow === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setCurrentFlow('login')}
        />
      )}

      {/* 6. Main Authenticated Flow with Persistent Floating Bottom Navigation Bar */}
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
                onNavigateToAddMoney={() => setCurrentFlow('add-money')}
                onNavigateToWithdraw={() => setCurrentFlow('withdraw')}
                onNavigateToServices={() => setCurrentFlow('services')}
                onNavigateToSecurity={() => setCurrentFlow('security')}
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
                onNavigateToServices={() => setCurrentFlow('services')}
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

      {/* 7. Dedicated Services Hub Screen */}
      {currentFlow === 'services' && (
        <ServicesHubScreen
          onGoBack={() => setCurrentFlow('main')}
          onNavigateToSend={() => setCurrentFlow('send')}
          onNavigateToBills={() => setCurrentFlow('bills')}
          onNavigateToMobile={() => setCurrentFlow('recharge')}
          onNavigateToAddMoney={() => setCurrentFlow('add-money')}
          onNavigateToWithdraw={() => setCurrentFlow('withdraw')}
          onNavigateToCards={() => {
            setActiveTab('cards');
            setCurrentFlow('main');
          }}
          onNavigateToQR={() => {
            setCurrentFlow('main');
            setIsScannerOpen(true);
          }}
          onNavigateToRemittance={() => setCurrentFlow('remittance')}
          onNavigateToSavings={() => setCurrentFlow('savings')}
          onNavigateToDonations={() => setCurrentFlow('donations')}
          onNavigateToRewards={() => setCurrentFlow('rewards')}
          onNavigateToStatements={() => setCurrentFlow('statements')}
          onNavigateToSupport={() => setCurrentFlow('support')}
          onNavigateToHistory={() => {
            setActiveTab('history');
            setCurrentFlow('main');
          }}
        />
      )}

      {/* 8. Add Money / Deposit Screen */}
      {currentFlow === 'add-money' && (
        <AddMoneyScreen
          onGoBack={() => setCurrentFlow('main')}
          onNavigateToHistory={() => {
            setActiveTab('history');
            setCurrentFlow('main');
          }}
        />
      )}

      {/* 9. Withdraw Money Screen */}
      {currentFlow === 'withdraw' && (
        <WithdrawMoneyScreen
          onGoBack={() => setCurrentFlow('main')}
          onNavigateToHistory={() => {
            setActiveTab('history');
            setCurrentFlow('main');
          }}
        />
      )}

      {/* 10. Transfers Screen */}
      {currentFlow === 'send' && (
        <TransferScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 11. Bill Payments Screen */}
      {currentFlow === 'bills' && (
        <BillPaymentsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 12. Mobile Recharge Screen */}
      {currentFlow === 'recharge' && (
        <MobileLoadScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 13. Government Payments Screen */}
      {currentFlow === 'government' && (
        <GovernmentPaymentsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 14. Remittance Screen */}
      {currentFlow === 'remittance' && (
        <RemittanceScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 15. Savings Goals Screen */}
      {currentFlow === 'savings' && (
        <SavingsGoalsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 16. Donations Screen */}
      {currentFlow === 'donations' && (
        <DonationsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 17. Rewards Screen */}
      {currentFlow === 'rewards' && (
        <RewardsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 18. Statements Screen */}
      {currentFlow === 'statements' && (
        <StatementsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 19. Notifications Screen */}
      {currentFlow === 'notifications' && (
        <NotificationsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 20. Profile Screen */}
      {currentFlow === 'profile' && (
        <ProfileScreen
          onLogout={handleLogout}
          onResetToWelcome={() => {
            resetDemoToNewUser();
            setCurrentFlow('welcome');
          }}
          onNavigateToSecurity={() => setCurrentFlow('security')}
          onNavigateToSupport={() => setCurrentFlow('support')}
          onNavigateToStatements={() => setCurrentFlow('statements')}
          onNavigateToAbout={() => setCurrentFlow('about')}
        />
      )}

      {/* 21. Security Screen */}
      {currentFlow === 'security' && (
        <SecurityScreen onGoBack={() => setCurrentFlow('profile')} />
      )}

      {/* 22. Support Screen */}
      {currentFlow === 'support' && (
        <SupportScreen onGoBack={() => setCurrentFlow('profile')} />
      )}

      {/* 23. About & Legal Screen */}
      {currentFlow === 'about' && (
        <AboutLegalScreen onGoBack={() => setCurrentFlow('profile')} />
      )}

      {/* 24. Admin Dashboard Screen */}
      {currentFlow === 'admin' && (
        <AdminDashboardScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {/* 25. Prominent Full-Screen QR Scanner Modal */}
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
