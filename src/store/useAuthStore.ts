import { create } from 'zustand';
import { UserProfile } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isFirstTimeUser: boolean;
  hasSeenWelcome: boolean;
  hasCompletedOnboarding: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setFirstTimeUser: (val: boolean) => void;
  setSeenWelcome: (val: boolean) => void;
  setCompletedOnboarding: (val: boolean) => void;
  login: (phoneNumberOrEmail: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  biometricLogin: () => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, phoneNumber: string, email: string, pin: string, cnic: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetDemoToNewUser: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  toggleBiometrics: (enabled: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_janvis_01',
  fullName: 'Janvis David',
  username: 'janvisd',
  email: 'janvis.david@payback.pk',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  phoneNumber: '+92 300 8472910',
  cnicMasked: '35201-•••••••-7',
  accountTier: 'Premium Elite',
  isBiometricEnabled: true,
  memberSince: 'January 2024',
  dailyTransferLimit: 250000,
  monthlyTransferLimit: 1500000,
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Start unauthenticated so Welcome & Onboarding flow is immediately active for new users!
  isFirstTimeUser: true,
  hasSeenWelcome: false,
  hasCompletedOnboarding: false,
  user: DEFAULT_PROFILE,
  isLoading: false,
  error: null,

  setFirstTimeUser: (val: boolean) => {
    set({ isFirstTimeUser: val });
  },

  setSeenWelcome: (val: boolean) => {
    set({ hasSeenWelcome: val });
  },

  setCompletedOnboarding: (val: boolean) => {
    set({ hasCompletedOnboarding: val, isFirstTimeUser: false });
  },

  login: async (identifier, pin) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 600));

    if (!identifier || identifier.trim().length < 4) {
      set({ isLoading: false, error: 'Please enter a valid mobile number or email.' });
      return { success: false, message: 'Invalid identifier.' };
    }
    if (!pin || pin.length < 4) {
      set({ isLoading: false, error: 'MPIN/Password must be at least 4 digits.' });
      return { success: false, message: 'Invalid PIN.' };
    }

    set({
      isAuthenticated: true,
      hasSeenWelcome: true,
      hasCompletedOnboarding: true,
      isFirstTimeUser: false,
      isLoading: false,
      user: DEFAULT_PROFILE,
    });
    return { success: true };
  },

  biometricLogin: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 400));
    set({
      isAuthenticated: true,
      hasSeenWelcome: true,
      hasCompletedOnboarding: true,
      isFirstTimeUser: false,
      isLoading: false,
      user: DEFAULT_PROFILE,
    });
    return { success: true };
  },

  register: async (fullName, phoneNumber, email, pin, cnic) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 800));

    if (!fullName.trim()) {
      set({ isLoading: false, error: 'Full name is required.' });
      return { success: false, message: 'Full name required.' };
    }
    if (!phoneNumber.trim()) {
      set({ isLoading: false, error: 'Mobile number is required.' });
      return { success: false, message: 'Mobile number required.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName,
      username: fullName.toLowerCase().replace(/\s+/g, '_'),
      email: email || 'user@payback.pk',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      phoneNumber,
      cnicMasked: cnic ? `${cnic.slice(0, 5)}-•••••••-${cnic.slice(-1)}` : '35201-•••••••-1',
      accountTier: 'Basic Wallet',
      isBiometricEnabled: true,
      memberSince: 'November 2026',
      dailyTransferLimit: 50000,
      monthlyTransferLimit: 200000,
    };

    set({
      isAuthenticated: true,
      hasSeenWelcome: true,
      hasCompletedOnboarding: true,
      isFirstTimeUser: false,
      isLoading: false,
      user: newUser,
    });
    return { success: true };
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  resetDemoToNewUser: () => {
    set({
      isAuthenticated: false,
      isFirstTimeUser: true,
      hasSeenWelcome: false,
      hasCompletedOnboarding: false,
    });
  },

  updateProfile: (updated) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updated } : null,
    }));
  },

  toggleBiometrics: (enabled) => {
    set((state) => ({
      user: state.user ? { ...state.user, isBiometricEnabled: enabled } : null,
    }));
  },
}));
