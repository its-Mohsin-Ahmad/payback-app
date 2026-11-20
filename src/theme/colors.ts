export const Colors = {
  // Exact Color Theme specified by user
  primaryLime: '#D5F54A',
  brightLime: '#E5FF71',
  lightLime: '#EDFFA7',
  darkForest: '#101B05',
  deepGreen: '#182807',
  cardGreen: '#263B0C',
  secondaryGreen: '#344D12',
  mutedGreen: '#A5BB72',
  textWhite: '#FFFFFF',
  textSecondary: '#C0D19B',
  background: '#101B05',

  // Surfaces, Highlights & Borders
  surfaceDark: '#182807',
  surfaceCard: '#263B0C',
  surfaceOverlay: 'rgba(38, 59, 12, 0.88)',
  surfaceHighlight: 'rgba(213, 245, 74, 0.15)',
  borderLime: 'rgba(213, 245, 74, 0.25)',
  borderDark: '#263B0C',
  glowLime: 'rgba(229, 255, 113, 0.45)',
  badgeGreen: '#182807',
  badgeText: '#D5F54A',

  // Feedback Colors
  errorRed: '#FF4D4D',
  successGreen: '#D5F54A',
  warningYellow: '#FCD34D',
  infoLime: '#A5BB72',

  // Gradients matching the reference image atmosphere
  gradients: {
    limeHeader: ['#E5FF71', '#D5F54A'] as const,
    balanceCard: ['#E5FF71', '#D5F54A', '#C3E838'] as const,
    forestBg: ['#101B05', '#182807', '#0C1603'] as const,
    cardDark: ['#263B0C', '#182807'] as const,
    cardGlow: ['#344D12', '#182807'] as const,
    buttonLime: ['#E5FF71', '#D5F54A'] as const,
    navLime: ['#E5FF71', '#D5F54A'] as const,
    cardLime: ['#D5F54A', '#E5FF71', '#B8E52A'] as const,
  },

  // Atmospheric Natural Shadows & Lime Glows
  shadows: {
    limeGlow: {
      shadowColor: '#D5F54A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 18,
      elevation: 8,
    },
    darkSoft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.55,
      shadowRadius: 12,
      elevation: 5,
    },
    navFloating: {
      shadowColor: '#D5F54A',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 22,
      elevation: 16,
    },
  },
};
